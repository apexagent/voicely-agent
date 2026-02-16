import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Building2, 
  Sparkles, 
  Scale, 
  Car, 
  Shield, 
  UtensilsCrossed, 
  Wrench, 
  Users, 
  Landmark, 
  Dumbbell, 
  ShoppingBag,
  Phone,
  ArrowRight,
  CheckCircle2,
  Zap,
  Star,
  Globe,
  Cpu,
  Stethoscope,
  Hotel,
  PawPrint,
  GraduationCap,
  HardHat,
  KeyRound,
  Plane,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Industry {
  id: string;
  name: string;
  icon: typeof Heart;
  color: string;
  glowColor: string;
  gradient: string;
  useCases: string[];
  description: string;
  stats: string;
}

const industries: Industry[] = [
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Heart,
    color: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.5)",
    gradient: "from-red-500 via-rose-500 to-pink-500",
    description: "HIPAA-compliant voice agents for medical practices",
    stats: "50K+ appointments/mo",
    useCases: ["Appointment scheduling", "Patient reminders", "Prescription refills", "Insurance verification"],
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: Building2,
    color: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.5)",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    description: "24/7 property inquiry and lead qualification",
    stats: "30K+ leads captured",
    useCases: ["Property inquiries", "Showing scheduling", "Lead qualification", "Follow-up calls"],
  },
  {
    id: "spa-wellness",
    name: "Spa & Wellness",
    icon: Sparkles,
    color: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.5)",
    gradient: "from-pink-500 via-fuchsia-500 to-purple-500",
    description: "Elegant booking experiences for luxury services",
    stats: "98% booking rate",
    useCases: ["Service booking", "Appointment reminders", "Package inquiries", "Membership management"],
  },
  {
    id: "legal",
    name: "Legal Firms",
    icon: Scale,
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.5)",
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    description: "Professional client intake and consultation scheduling",
    stats: "15K+ consultations",
    useCases: ["Client intake", "Consultation booking", "Case updates", "Document requests"],
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: Car,
    color: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.5)",
    gradient: "from-orange-500 via-red-500 to-rose-500",
    description: "Service scheduling and sales inquiry handling",
    stats: "25K+ test drives",
    useCases: ["Service appointments", "Sales inquiries", "Test drive scheduling", "Parts availability"],
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: Shield,
    color: "#22c55e",
    glowColor: "rgba(34, 197, 94, 0.5)",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    description: "Claims support and policy assistance",
    stats: "40K+ claims processed",
    useCases: ["Claims reporting", "Policy questions", "Quote requests", "Renewal reminders"],
  },
  {
    id: "restaurants",
    name: "Restaurants",
    icon: UtensilsCrossed,
    color: "#f43f5e",
    glowColor: "rgba(244, 63, 94, 0.5)",
    gradient: "from-rose-500 via-pink-500 to-red-500",
    description: "Reservation management and order handling",
    stats: "100K+ reservations",
    useCases: ["Table reservations", "Takeout orders", "Event bookings", "Menu inquiries"],
  },
  {
    id: "home-services",
    name: "Home Services",
    icon: Wrench,
    color: "#64748b",
    glowColor: "rgba(100, 116, 139, 0.5)",
    gradient: "from-slate-500 via-gray-500 to-zinc-500",
    description: "HVAC, plumbing, electrical scheduling",
    stats: "20K+ dispatches",
    useCases: ["Service scheduling", "Emergency dispatch", "Quote requests", "Follow-up calls"],
  },
  {
    id: "hr-recruiting",
    name: "HR & Recruiting",
    icon: Users,
    color: "#6366f1",
    glowColor: "rgba(99, 102, 241, 0.5)",
    gradient: "from-indigo-500 via-violet-500 to-purple-500",
    description: "Candidate screening and interview coordination",
    stats: "75K+ interviews",
    useCases: ["Interview scheduling", "Candidate screening", "Onboarding calls", "Reference checks"],
  },
  {
    id: "financial",
    name: "Financial Services",
    icon: Landmark,
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.5)",
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    description: "Account support and loan applications",
    stats: "$2B+ processed",
    useCases: ["Account inquiries", "Loan applications", "Payment reminders", "Fraud alerts"],
  },
  {
    id: "fitness",
    name: "Fitness & Gyms",
    icon: Dumbbell,
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.5)",
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
    description: "Membership management and class booking",
    stats: "60K+ members",
    useCases: ["Membership inquiries", "Class booking", "Personal training", "Billing support"],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: ShoppingBag,
    color: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.5)",
    gradient: "from-cyan-500 via-sky-500 to-blue-500",
    description: "Order support and customer service",
    stats: "500K+ orders",
    useCases: ["Order status", "Returns & exchanges", "Product inquiries", "Shipping updates"],
  },
  {
    id: "dental",
    name: "Dental Practices",
    icon: Stethoscope,
    color: "#14b8a6",
    glowColor: "rgba(20, 184, 166, 0.5)",
    gradient: "from-teal-500 via-cyan-500 to-emerald-500",
    description: "Patient scheduling and treatment coordination",
    stats: "35K+ appointments",
    useCases: ["Appointment scheduling", "Treatment reminders", "Insurance verification", "New patient intake"],
  },
  {
    id: "luxury-hotels",
    name: "Luxury Hotels",
    icon: Hotel,
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.5)",
    gradient: "from-purple-500 via-violet-500 to-fuchsia-500",
    description: "VIP guest services and reservation management",
    stats: "50K+ guests served",
    useCases: ["VIP reservations", "Concierge services", "Special requests", "Guest experience"],
  },
  {
    id: "veterinary",
    name: "Veterinary",
    icon: PawPrint,
    color: "#84cc16",
    glowColor: "rgba(132, 204, 22, 0.5)",
    gradient: "from-lime-500 via-green-500 to-emerald-500",
    description: "Pet appointment scheduling and care coordination",
    stats: "45K+ pets helped",
    useCases: ["Appointment booking", "Vaccination reminders", "Emergency triage", "Prescription refills"],
  },
  {
    id: "education",
    name: "Higher Education",
    icon: GraduationCap,
    color: "#0ea5e9",
    glowColor: "rgba(14, 165, 233, 0.5)",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    description: "Student enrollment and admissions support",
    stats: "100K+ students",
    useCases: ["Admissions inquiries", "Campus tour booking", "Financial aid info", "Application support"],
  },
  {
    id: "construction",
    name: "Construction",
    icon: HardHat,
    color: "#eab308",
    glowColor: "rgba(234, 179, 8, 0.5)",
    gradient: "from-yellow-500 via-amber-500 to-orange-500",
    description: "Project inquiries and estimate scheduling",
    stats: "$50M+ in bids",
    useCases: ["Estimate requests", "Project inquiries", "Subcontractor coordination", "Permit status"],
  },
  {
    id: "property-management",
    name: "Property Management",
    icon: KeyRound,
    color: "#8b5cf6",
    glowColor: "rgba(139, 92, 246, 0.5)",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    description: "Tenant services and maintenance coordination",
    stats: "10K+ units managed",
    useCases: ["Maintenance requests", "Lease inquiries", "Tenant support", "Showing scheduling"],
  },
  {
    id: "travel-agency",
    name: "Travel & Tourism",
    icon: Plane,
    color: "#f472b6",
    glowColor: "rgba(244, 114, 182, 0.5)",
    gradient: "from-pink-400 via-rose-500 to-red-500",
    description: "Booking assistance and travel planning",
    stats: "25K+ trips booked",
    useCases: ["Booking inquiries", "Itinerary changes", "Travel recommendations", "Group travel"],
  },
  {
    id: "wealth-management",
    name: "Wealth Management",
    icon: Briefcase,
    color: "#1e3a5f",
    glowColor: "rgba(30, 58, 95, 0.5)",
    gradient: "from-slate-600 via-blue-800 to-indigo-900",
    description: "Client services for high-net-worth individuals",
    stats: "$5B+ managed",
    useCases: ["Client scheduling", "Account inquiries", "Portfolio updates", "Event invitations"],
  },
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: `rgba(${Math.random() > 0.5 ? '139, 92, 246' : '6, 182, 212'}, ${0.3 + Math.random() * 0.4})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function GlowingOrb({ color, size, position, delay }: { color: string; size: number; position: { x: string; y: string }; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        background: color,
        left: position.x,
        top: position.y,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

function IndustryCard({ industry, index, isActive, onClick }: { 
  industry: Industry; 
  index: number; 
  isActive: boolean;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = industry.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.08,
        type: "spring",
        stiffness: 100,
      }}
      className="perspective-1000"
    >
      <motion.div
        className="relative group cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
        animate={{
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? -5 : 0,
          z: isHovered ? 50 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        data-testid={`card-industry-${industry.id}`}
      >
        {/* Animated Glow Border */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${industry.color}40, transparent, ${industry.color}40)`,
            filter: "blur(2px)",
          }}
          animate={isHovered ? {
            background: [
              `linear-gradient(0deg, ${industry.color}60, transparent, ${industry.color}20)`,
              `linear-gradient(90deg, ${industry.color}20, transparent, ${industry.color}60)`,
              `linear-gradient(180deg, ${industry.color}60, transparent, ${industry.color}20)`,
              `linear-gradient(270deg, ${industry.color}20, transparent, ${industry.color}60)`,
              `linear-gradient(360deg, ${industry.color}60, transparent, ${industry.color}20)`,
            ],
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Card Content */}
        <div className={`relative bg-[#0d0d2b]/80 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-500 ${
          isActive 
            ? 'border-purple-500/50 shadow-[0_0_30px_rgba(139,92,246,0.3)]' 
            : 'border-white/5 hover:border-white/10'
        }`}>
          {/* Floating Icon with Glow */}
          <motion.div
            className="relative mb-5"
            animate={isHovered ? { y: -5 } : { y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl blur-xl"
              style={{ background: industry.glowColor }}
              animate={isHovered ? { opacity: 0.6, scale: 1.2 } : { opacity: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${industry.gradient} p-[1px]`}>
              <div className="w-full h-full rounded-2xl bg-[#0d0d2b] flex items-center justify-center">
                <motion.div
                  animate={isHovered ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <IconComponent className="w-8 h-8" style={{ color: industry.color }} />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h3 
            className="text-xl font-bold text-white mb-2"
            animate={isHovered ? { x: 5 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {industry.name}
          </motion.h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {industry.description}
          </p>

          {/* Stats Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
            style={{ 
              background: `linear-gradient(135deg, ${industry.color}20, ${industry.color}10)`,
              color: industry.color,
              border: `1px solid ${industry.color}30`,
            }}
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          >
            <Star className="w-3 h-3" />
            {industry.stats}
          </motion.div>

          {/* Use Cases Preview */}
          <div className="space-y-2">
            {industry.useCases.slice(0, isActive ? 4 : 2).map((useCase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <motion.div
                  animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: industry.color }} />
                </motion.div>
                <span className="text-gray-300">{useCase}</span>
              </motion.div>
            ))}
          </div>

          {/* Expand Indicator */}
          <AnimatePresence>
            {!isActive && industry.useCases.length > 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-xs font-medium"
                style={{ color: industry.color }}
              >
                +{industry.useCases.length - 2} more capabilities
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded CTA */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 pt-5 border-t border-white/10"
              >
                <Link href={`/mobile/industry/${industry.id}`}>
                  <Button 
                    className={`w-full bg-gradient-to-r ${industry.gradient} text-white font-semibold shadow-lg`}
                    style={{ boxShadow: `0 10px 40px ${industry.glowColor}` }}
                    data-testid={`button-speak-expert-${industry.id}`}
                  >
                    Speak with Expert
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MobileIndustries() {
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050510] relative overflow-hidden">
      {/* Animated Backgrounds */}
      <AuroraBackground />
      <FloatingParticles />
      
      {/* Floating Orbs */}
      <GlowingOrb color="rgba(139, 92, 246, 0.2)" size={400} position={{ x: "-10%", y: "10%" }} delay={0} />
      <GlowingOrb color="rgba(6, 182, 212, 0.15)" size={300} position={{ x: "80%", y: "60%" }} delay={2} />
      <GlowingOrb color="rgba(236, 72, 153, 0.1)" size={350} position={{ x: "50%", y: "30%" }} delay={1} />

      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative pt-16 pb-20 md:pt-24 md:pb-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600 rounded-full blur-lg opacity-50"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative flex items-center gap-2 px-6 py-2.5 bg-black/50 backdrop-blur-xl rounded-full border border-purple-500/30">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Cpu className="w-4 h-4 text-purple-400" />
                </motion.div>
                <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Enterprise Voice Solutions
                </span>
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>

          {/* Main Title - Dramatic Animation */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="overflow-hidden"
            >
              <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
              >
                <span className="text-white">AI Voice for</span>
              </motion.h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="overflow-hidden"
            >
              <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
              >
                <span className="relative">
                  <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    Every Industry
                  </span>
                  <motion.span
                    className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 via-violet-600/20 to-cyan-600/20 blur-2xl -z-10"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </span>
              </motion.h1>
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-gray-400 text-lg md:text-xl text-center max-w-3xl mx-auto mb-12"
          >
            Custom AI voice agents that handle calls 24/7, qualify leads, 
            schedule appointments, and deliver exceptional customer experiences.
          </motion.p>

          {/* Animated CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center"
          >
            <Link href="/mobile/contact">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Button 
                  size="lg" 
                  className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600 text-white font-bold px-8 py-6 text-lg rounded-full shadow-2xl"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Talk to Alice Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Industries Section Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mb-8 rounded-full"
          />
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Industries We{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Transform
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            From healthcare to e-commerce, our AI agents are trained to handle 
            industry-specific conversations with expertise and precision.
          </motion.p>
        </motion.div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <IndustryCard
              key={industry.id}
              industry={industry}
              index={index}
              isActive={activeIndustry === industry.id}
              onClick={() => setActiveIndustry(activeIndustry === industry.id ? null : industry.id)}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="relative">
          {/* Glowing Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-violet-600/5 to-cyan-600/10 rounded-3xl blur-3xl" />
          
          <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden">
            {/* Animated Border */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['200% 0', '-200% 0'],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative grid md:grid-cols-2 gap-12 items-center">
              <div>
                <motion.h3
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold text-white mb-8"
                >
                  Why Leaders Choose{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Voicely
                  </span>
                </motion.h3>
                <div className="space-y-6">
                  {[
                    { icon: Zap, title: "Ultra-Low Latency", desc: "Sub-350ms response for natural conversations", color: "#fbbf24" },
                    { icon: Globe, title: "Industry-Trained AI", desc: "Custom prompts for your specific needs", color: "#3b82f6" },
                    { icon: Shield, title: "Enterprise Security", desc: "SOC 2 compliant with E2E encryption", color: "#22c55e" },
                    { icon: Phone, title: "24/7 Availability", desc: "Never miss a call, even off-hours", color: "#a855f7" },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4 group"
                    >
                      <motion.div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ 
                          background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`,
                          border: `1px solid ${feature.color}30`,
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                      </motion.div>
                      <div>
                        <h4 className="font-semibold text-white text-lg">{feature.title}</h4>
                        <p className="text-gray-400">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div
                  className="relative inline-block"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full blur-3xl opacity-30" />
                  <div className="relative w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/30 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Phone className="w-20 h-20 text-purple-400" />
                    </motion.div>
                  </div>
                </motion.div>
                
                <h4 className="text-2xl font-bold text-white mt-8 mb-3">Ready to Get Started?</h4>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                  Talk to Alice about your industry needs and get a custom AI voice solution today.
                </p>
                
                <Link href="/mobile/contact">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                  >
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold px-8 shadow-[0_10px_40px_rgba(139,92,246,0.4)]"
                      data-testid="button-talk-alice-cta"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Talk to Alice Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.h3
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Don't See Your Industry?
          </motion.h3>
          <motion.p
            className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Our AI voice agents can be customized for any business. 
            Talk to Alice to discuss your specific requirements.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/mobile/contact">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold px-8 shadow-[0_10px_40px_rgba(139,92,246,0.3)]"
                  data-testid="button-custom-solution"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get a Custom Solution
                </Button>
              </motion.div>
            </Link>
            <Link href="/docs">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                  data-testid="button-view-docs"
                >
                  View Documentation
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
