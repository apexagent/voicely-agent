import { motion } from "framer-motion";
import { 
  SiSlack, 
  SiZapier, 
  SiNotion, 
  SiAirtable, 
  SiDiscord, 
  SiGooglecalendar,
  SiSalesforce,
  SiHubspot,
  SiShopify,
  SiZoom,
  SiTwilio,
  SiStripe,
  SiGithub,
  SiLinear,
  SiAsana,
  SiTrello,
  SiMailchimp,
  SiIntercom,
  SiJira,
  SiConfluence,
  SiDropbox,
  SiGooglesheets,
  SiFigma,
  SiClickup,
  SiQuickbooks,
  SiXero,
  SiWebflow,
  SiWordpress,
  SiWix,
  SiSquarespace,
  SiCalendly,
  SiTypeform,
  SiSurveymonkey,
  SiZendesk,
  SiGmail,
} from "react-icons/si";

export default function IntegrationsSection() {
  const integrations = [
    { icon: SiSlack, name: "Slack", color: "#E01E5A" },
    { icon: SiZapier, name: "Zapier", color: "#FF4A00" },
    { icon: SiNotion, name: "Notion", color: "#FFFFFF" },
    { icon: SiAirtable, name: "Airtable", color: "#18BFFF" },
    { icon: SiDiscord, name: "Discord", color: "#5865F2" },
    { icon: SiGooglecalendar, name: "Google Calendar", color: "#4285F4" },
    { icon: SiSalesforce, name: "Salesforce", color: "#00A1E0" },
    { icon: SiHubspot, name: "HubSpot", color: "#FF7A59" },
    { icon: SiShopify, name: "Shopify", color: "#96BF48" },
    { icon: SiZoom, name: "Zoom", color: "#2D8CFF" },
    { icon: SiTwilio, name: "Twilio", color: "#F22F46" },
    { icon: SiStripe, name: "Stripe", color: "#635BFF" },
    { icon: SiGithub, name: "GitHub", color: "#E5E5E5" },
    { icon: SiLinear, name: "Linear", color: "#5E6AD2" },
    { icon: SiAsana, name: "Asana", color: "#F06A6A" },
    { icon: SiTrello, name: "Trello", color: "#0052CC" },
  ];

  // Colorful dot grid for visualization
  const colorPalette = [
    "#E01E5A", // Pink/Red
    "#FF4A00", // Orange
    "#FFE01B", // Yellow
    "#96BF48", // Green
    "#18BFFF", // Cyan
    "#5865F2", // Blue
    "#8B5CF6", // Purple
    "#EC4899", // Magenta
  ];

  const dots = Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    x: (i % 8) * 50 + 25,
    y: Math.floor(i / 8) * 50 + 25,
    color: colorPalette[i % colorPalette.length],
    delay: i * 0.02,
  }));

  return (
    <section className="relative py-32 md:py-40 overflow-hidden bg-gradient-to-b from-[#0A0B1E] via-[#0f1128] to-[#0A0B1E]">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT - Animated Dot Grid Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[500px] flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 450 550">
                {/* Connection Lines */}
                {dots.slice(0, 30).map((dot, i) => {
                  const targetDot = dots[(i * 7 + 13) % dots.length];
                  return (
                    <motion.line
                      key={`line-${i}`}
                      x1={dot.x}
                      y1={dot.y}
                      x2={targetDot.x}
                      y2={targetDot.y}
                      stroke={dot.color}
                      strokeWidth="1"
                      strokeOpacity="0.2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.3 }}
                      transition={{
                        duration: 2,
                        delay: dot.delay,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}
                
                {/* Animated Dots */}
                {dots.map((dot) => (
                  <motion.g key={dot.id}>
                    {/* Outer glow */}
                    <motion.circle
                      cx={dot.x}
                      cy={dot.y}
                      r="8"
                      fill={dot.color}
                      opacity="0.2"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        delay: dot.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    {/* Inner dot */}
                    <motion.circle
                      cx={dot.x}
                      cy={dot.y}
                      r="4"
                      fill={dot.color}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0.8, 1.1, 0.8],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 2.5,
                        delay: dot.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        filter: `drop-shadow(0 0 8px ${dot.color})`,
                      }}
                    />
                  </motion.g>
                ))}
              </svg>
            </div>
          </motion.div>

          {/* RIGHT - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              <span className="text-sm font-mono font-bold text-purple-400 tracking-[0.3em] uppercase">
                INTEGRATIONS
              </span>
            </motion.div>

            {/* Headline - LARGE and BOLD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                <span className="text-white block mb-2">Integrate with</span>
                <span className="text-white block mb-2">more than </span>
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 inline-block"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                >
                  40+ apps
                </motion.span>
                <span className="text-white"> in a snap.</span>
              </h2>
            </motion.div>

            {/* Integration Icons - Clean Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-8 gap-3 pt-8"
            >
              {integrations.map((integration, i) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: 0.3 + (i * 0.05),
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="relative w-16 h-16 rounded-2xl bg-[#1a1b2e] backdrop-blur-xl border border-white/5 flex items-center justify-center group cursor-pointer overflow-visible"
                  data-testid={`integration-icon-${integration.name.toLowerCase()}`}
                >
                  {/* Subtle background glow */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                    style={{ 
                      background: `radial-gradient(circle, ${integration.color}40 0%, transparent 70%)`
                    }}
                  />

                  {/* Icon */}
                  <integration.icon 
                    className="w-8 h-8 relative z-10 transition-transform group-hover:scale-110" 
                    style={{ color: integration.color }}
                  />
                  
                  {/* Hover glow effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl -z-10"
                    style={{ 
                      background: `radial-gradient(circle, ${integration.color}60 0%, transparent 70%)`
                    }}
                  />

                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 invisible group-hover:visible whitespace-nowrap bg-black/95 backdrop-blur-xl text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none z-50">
                    {integration.name}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/95 rotate-45 border-r border-b border-white/10" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-lg leading-relaxed max-w-xl"
            >
              Connect your favorite tools and automate workflows with our powerful API and native integrations.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
