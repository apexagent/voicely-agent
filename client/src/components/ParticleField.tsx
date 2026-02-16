import { useEffect, useRef } from 'react';

interface ParticleFieldProps {
  isActive?: boolean;
  isSpeaking?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}

export function ParticleField({ 
  isActive = false, 
  isSpeaking = false,
  primaryColor = "#8B5CF6", // Default purple
  secondaryColor = "#06B6D4", // Default cyan
}: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const particlesRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isActiveRef = useRef(isActive);
  const isSpeakingRef = useRef(isSpeaking);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    let cleanup: (() => void) | null = null;

    // Track mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      // Convert to normalized device coordinates (-1 to +1)
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic import to avoid bundling issues
    import('three').then((THREE) => {
      if (!containerRef.current) return;

      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera setup - 2D view
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 300;
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Create dense circular particle ring - matching reference image
      const particleCount = 6000; // More particles for denser ring
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const phases = new Float32Array(particleCount);
      const ringIndices = new Float32Array(particleCount);

      // Use custom colors or defaults
      const color1 = new THREE.Color(secondaryColor); // Secondary color (cyan by default)
      const color2 = new THREE.Color(primaryColor); // Primary color (purple by default)
      // Create gradient variations
      const color3 = new THREE.Color(primaryColor).multiplyScalar(1.2);
      const color4 = new THREE.Color(primaryColor).multiplyScalar(0.8);

      // Create dense circular ring - tight around button
      const baseRadius = 110; // Tight around the button
      const ringThickness = 30; // Compact ring thickness

      for (let i = 0; i < particleCount; i++) {
        // Angle around the circle
        const angle = (i / particleCount) * Math.PI * 2;
        const ringPosition = (i / particleCount);
        
        // Radial position with gaussian distribution for density in middle of ring
        const gaussianRandom = () => {
          const u1 = Math.random();
          const u2 = Math.random();
          return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        };
        
        const radiusOffset = gaussianRandom() * ringThickness * 0.5;
        const radius = baseRadius + radiusOffset;
        
        // Add small random angle variation for organic clustering
        const angleVariation = (Math.random() - 0.5) * 0.02;
        const finalAngle = angle + angleVariation;
        
        positions[i * 3] = Math.cos(finalAngle) * radius;
        positions[i * 3 + 1] = Math.sin(finalAngle) * radius;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15; // Shallow depth

        // Smooth gradient using custom colors
        let color;
        const gradientPos = ringPosition;
        if (gradientPos < 0.25) {
          color = color1.clone().lerp(color2, gradientPos * 4);
        } else if (gradientPos < 0.5) {
          color = color2.clone().lerp(color3, (gradientPos - 0.25) * 4);
        } else if (gradientPos < 0.75) {
          color = color3.clone().lerp(color4, (gradientPos - 0.5) * 4);
        } else {
          color = color4.clone().lerp(color1, (gradientPos - 0.75) * 4);
        }

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Varied particle sizes for depth - INCREASED for better visibility
        sizes[i] = 2.5 + Math.random() * 3.5;
        phases[i] = Math.random() * Math.PI * 2;
        ringIndices[i] = ringPosition;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
      geometry.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1));
      geometry.setAttribute('ringIndex', new THREE.Float32BufferAttribute(ringIndices, 1));

      // Enhanced shader with rotation and mouse interaction
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          isActive: { value: isActive ? 1.0 : 0.0 },
          isSpeaking: { value: isSpeaking ? 1.0 : 0.0 },
          mouse: { value: new THREE.Vector2(0, 0) }
        },
        vertexShader: `
          attribute float size;
          attribute float phase;
          attribute float ringIndex;
          varying vec3 vColor;
          varying float vAlpha;
          uniform float time;
          uniform float isActive;
          uniform float isSpeaking;
          uniform vec2 mouse;
          
          void main() {
            vColor = color;
            vec3 pos = position;
            
            // Continuous smooth rotation around center - CALMER
            float rotationSpeed = 0.2; // Very slow, gentle rotation
            float rotation = time * rotationSpeed;
            float cosR = cos(rotation);
            float sinR = sin(rotation);
            mat2 rotMat = mat2(cosR, -sinR, sinR, cosR);
            pos.xy = rotMat * pos.xy;
            
            // Gentle flowing wave for organic movement - REDUCED
            float waveSpeed = 0.8; // Slower wave
            float waveFrequency = 3.0; // Lower frequency
            float wave = sin(ringIndex * waveFrequency * 6.28318 - time * waveSpeed + phase);
            
            // Breathing effect when speaking - radial pulse - SUBTLE
            float speakPulse = isSpeaking * sin(time * 1.5 + ringIndex * 6.28318) * 0.08;
            float activePulse = isActive * sin(time * 1.2 + phase) * 0.04;
            
            // Apply wave and pulse - GENTLER
            float totalPulse = 1.0 + (wave * 0.04) + speakPulse + activePulse;
            pos.xy *= totalPulse;
            
            // Mouse interaction - particles react to cursor
            vec2 mousePos = mouse * 180.0; // Scale to world space
            vec2 toMouse = pos.xy - mousePos;
            float distToMouse = length(toMouse);
            float mouseInfluence = smoothstep(150.0, 0.0, distToMouse);
            
            // Particles move away and scatter near mouse
            if (mouseInfluence > 0.0) {
              vec2 pushDir = normalize(toMouse);
              float pushStrength = mouseInfluence * 35.0;
              pos.xy += pushDir * pushStrength;
              
              // Add slight outward expansion
              pos.xy *= (1.0 + mouseInfluence * 0.15);
            }
            
            // Size variation - CALMER
            float sizeMultiplier = 1.0;
            sizeMultiplier += isActive * 0.15;
            sizeMultiplier += isSpeaking * wave * 0.2;
            sizeMultiplier += sin(time * 0.8 + phase) * 0.08;
            sizeMultiplier += mouseInfluence * 0.4; // Grow near mouse
            
            // Alpha with depth and effects - INCREASED for better visibility
            vAlpha = 0.95 + wave * 0.15 + isSpeaking * 0.2;
            vAlpha += mouseInfluence * 0.2;
            vAlpha = clamp(vAlpha, 0.7, 1.0);
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * sizeMultiplier * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            // Perfect circular particle with smooth glow
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            // Smooth alpha falloff
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            alpha = pow(alpha, 1.3) * vAlpha; // Softer falloff for more glow
            
            // Bright core glow - ENHANCED for better visibility
            float coreGlow = 1.0 - smoothstep(0.0, 0.3, dist);
            coreGlow = pow(coreGlow, 2.0);
            
            // Enhanced color with stronger bloom
            vec3 finalColor = vColor * (1.3 + coreGlow * 1.2);
            
            // Higher opacity for maximum visibility
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particlesRef.current = particles;

      // Animation loop
      let time = 0;
      const animate = () => {
        time += 0.016; // ~60fps
        
        if (material.uniforms) {
          material.uniforms.time.value = time;
          material.uniforms.isActive.value = isActiveRef.current ? 1.0 : 0.0;
          material.uniforms.isSpeaking.value = isSpeakingRef.current ? 1.0 : 0.0;
          material.uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y);
        }

        renderer.render(scene, camera);
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();

      // Handle window resize
      const handleResize = () => {
        if (!cameraRef.current || !rendererRef.current) return;
        
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup function
      cleanup = () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        if (rendererRef.current && containerRef.current) {
          try {
            containerRef.current.removeChild(rendererRef.current.domElement);
          } catch (e) {
            // Element might already be removed
          }
          rendererRef.current.dispose();
        }
        
        if (particlesRef.current) {
          particlesRef.current.geometry.dispose();
          if (particlesRef.current.material) {
            particlesRef.current.material.dispose();
          }
        }
      };
    }).catch((error) => {
      console.error('Failed to load Three.js:', error);
    });

    // Cleanup on unmount
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // Update refs when props change
  useEffect(() => {
    isActiveRef.current = isActive;
    isSpeakingRef.current = isSpeaking;
  }, [isActive, isSpeaking]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
