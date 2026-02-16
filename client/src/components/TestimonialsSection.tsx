import { motion } from "framer-motion";
import { Star, ArrowRight, Quote } from "lucide-react";
import avatar1 from "@assets/generated_images/Testimonial_avatar_woman_executive_bbef7a48.png";
import avatar2 from "@assets/generated_images/Testimonial_avatar_man_executive_b9b3c6a6.png";
import avatar3 from "@assets/generated_images/Testimonial_avatar_tech_founder_75d80ed4.png";
import avatar4 from "@assets/generated_images/Testimonial_avatar_diverse_executive_f89729aa.png";
import agentsWorkingImage from "@assets/generated_images/Three_AI_agents_professional_scene_5244adbc.png";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechCorp",
      content: "Voicely Agent transformed our customer service. We're handling 10x more calls with better quality and our team loves it.",
      avatar: avatar1,
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "COO, InnovateCo",
      content: "The ROI was immediate. We saved $50K in the first month and customers can't tell it's AI. Absolutely game-changing.",
      avatar: avatar2,
      rating: 5,
    },
    {
      name: "Alex Rivera",
      role: "Founder, StartupXYZ",
      content: "As a bootstrapped startup, Voicely Agent gave us enterprise-level capabilities. It's like having a 24/7 sales team.",
      avatar: avatar3,
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "VP Sales, GrowthLabs",
      content: "Our conversion rates doubled. The AI handles qualification perfectly and passes hot leads to our team. It's brilliant.",
      avatar: avatar4,
      rating: 5,
    },
  ];

  return (
    <section className="relative py-40 bg-gradient-to-b from-black via-[#0A0B1E] to-black overflow-hidden">
      {/* Subtle Background - Professional AI Agents */}
      <div className="absolute inset-0 opacity-8">
        <img
          src={agentsWorkingImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      {/* Subtle Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      {/* Animated Diagonal Grid */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(45deg, rgba(139,92,246,0.6) 1px, transparent 1px), linear-gradient(-45deg, rgba(6,182,212,0.6) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Subtle Floating Energy Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-40 left-10 w-96 h-96 bg-purple-600 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute bottom-40 right-10 w-96 h-96 bg-cyan-600 rounded-full blur-[120px]"
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center justify-center mb-8"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center relative">
              <Quote className="w-10 h-10 text-purple-200" />
              <div className="absolute inset-0 rounded-2xl bg-purple-500 blur-2xl opacity-60 animate-pulse" />
            </div>
          </motion.div>

          <h2 className="font-display text-6xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="text-gray-200">Loved by Teams </span>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400">
                Worldwide
              </span>
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-600/60 via-violet-600/60 to-cyan-600/60 blur-3xl -z-10 animate-pulse" />
            </span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of companies scaling with AI voice agents
          </p>
        </motion.div>

        {/* Testimonial Cards - 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative group"
              data-testid={`testimonial-card-${index}`}
            >
              <div className="relative bg-gradient-to-br from-[#0F1020] to-[#0A0B1E] border-2 border-purple-500/30 rounded-3xl p-10 hover:border-purple-500/50 transition-all backdrop-blur-xl h-full">
                {/* Quote Icon */}
                <div className="absolute -top-6 -left-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-2xl">
                  <Quote className="w-8 h-8 text-purple-200" />
                  <div className="absolute inset-0 rounded-2xl bg-purple-500 blur-xl opacity-60" />
                </div>

                {/* 5 Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <Star
                        className="w-6 h-6 fill-purple-400 text-purple-400"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-200 text-lg leading-relaxed mb-8 font-medium">
                  "{testimonial.content}"
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between pt-6 border-t-2 border-purple-500/20">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-500/40"
                      />
                      {/* Avatar Glow */}
                      <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-lg -z-10" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-200 text-lg mb-1">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-purple-300 font-medium">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border-2 border-purple-500/30 group-hover:border-purple-500/60 transition-all"
                  >
                    <ArrowRight className="w-6 h-6 text-purple-400" />
                  </motion.div>
                </div>

                {/* Decorative Corner Accent */}
                <div className="absolute top-4 right-4 w-24 h-24 opacity-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="url(#cornerGrad)" strokeWidth="2" strokeDasharray="8 4" />
                    <defs>
                      <linearGradient id="cornerGrad">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-400 mb-6">
            Join <span className="text-purple-400 font-bold">10,000+</span> companies already using Voicely Agent
          </p>
          <div className="flex items-center justify-center gap-2 text-purple-300">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-purple-400 text-purple-400"
              />
            ))}
            <span className="ml-2 text-lg font-semibold">4.9/5 average rating</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
