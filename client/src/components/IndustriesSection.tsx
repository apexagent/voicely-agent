import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Building2, 
  Heart, 
  Home, 
  Sparkles, 
  Scale, 
  Car, 
  Shield, 
  UtensilsCrossed,
  Wrench,
  Users,
  TrendingUp,
  Dumbbell,
  ShoppingCart,
  Stethoscope,
  Hotel,
  Dog,
  GraduationCap,
  HardHat,
  Plane,
  Briefcase,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const industries = [
  { id: "healthcare", name: "Healthcare", icon: Heart, color: "#ef4444", description: "Patient scheduling & support" },
  { id: "real-estate", name: "Real Estate", icon: Home, color: "#3b82f6", description: "Lead capture & showings" },
  { id: "spa-wellness", name: "Spa & Wellness", icon: Sparkles, color: "#ec4899", description: "Luxury booking experiences" },
  { id: "legal", name: "Legal", icon: Scale, color: "#f59e0b", description: "Client intake & scheduling" },
  { id: "automotive", name: "Automotive", icon: Car, color: "#f97316", description: "Service & sales appointments" },
  { id: "insurance", name: "Insurance", icon: Shield, color: "#22c55e", description: "Quote requests & claims" },
  { id: "restaurants", name: "Restaurants", icon: UtensilsCrossed, color: "#f43f5e", description: "Reservations & orders" },
  { id: "home-services", name: "Home Services", icon: Wrench, color: "#64748b", description: "Service booking & dispatch" },
  { id: "hr-recruiting", name: "HR & Recruiting", icon: Users, color: "#6366f1", description: "Candidate screening" },
  { id: "financial", name: "Financial", icon: TrendingUp, color: "#10b981", description: "Account inquiries & support" },
  { id: "fitness", name: "Fitness", icon: Dumbbell, color: "#a855f7", description: "Membership & class booking" },
  { id: "ecommerce", name: "E-commerce", icon: ShoppingCart, color: "#06b6d4", description: "Order support & tracking" },
  { id: "dental", name: "Dental", icon: Stethoscope, color: "#14b8a6", description: "Appointment scheduling" },
  { id: "luxury-hotels", name: "Luxury Hotels", icon: Hotel, color: "#a855f7", description: "Concierge & reservations" },
  { id: "veterinary", name: "Veterinary", icon: Dog, color: "#84cc16", description: "Pet care scheduling" },
  { id: "education", name: "Education", icon: GraduationCap, color: "#0ea5e9", description: "Enrollment & inquiries" },
  { id: "construction", name: "Construction", icon: HardHat, color: "#eab308", description: "Project coordination" },
  { id: "property-management", name: "Property Mgmt", icon: Building2, color: "#8b5cf6", description: "Tenant services" },
  { id: "travel", name: "Travel", icon: Plane, color: "#f472b6", description: "Booking & support" },
];

export default function IndustriesSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-black via-[#0A0B1E] to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      {/* Gradient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[130px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600/20 border border-purple-500/40 backdrop-blur-xl mb-6"
            style={{
              boxShadow: "0 0 40px rgba(139,92,246,0.3)",
            }}
          >
            <Building2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-purple-300">
              19 Industry Verticals
            </span>
          </motion.div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="text-gray-200">Purpose-Built Agents for</span>
            <br />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                Every Industry
              </span>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-cyan-600/30 blur-3xl -z-10" />
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Pre-trained AI voice agents with deep industry knowledge, ready to deploy in 24-48 hours
          </p>
        </motion.div>

        {/* Industries Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-12">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
              >
                <Link href={`/mobile/industry/${industry.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative p-4 sm:p-5 rounded-xl bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm cursor-pointer group transition-all duration-300 h-full"
                    style={{
                      boxShadow: `0 0 0 1px ${industry.color}10`,
                    }}
                    data-testid={`industry-card-${industry.id}`}
                  >
                    {/* Hover Glow */}
                    <div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at center, ${industry.color}15, transparent 70%)`,
                        boxShadow: `0 0 30px ${industry.color}20`,
                      }}
                    />
                    
                    <div className="relative z-10 flex flex-col items-center text-center gap-2">
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-1"
                        style={{ 
                          background: `${industry.color}20`,
                          border: `1px solid ${industry.color}40`,
                        }}
                      >
                        <Icon 
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          style={{ color: industry.color }}
                        />
                      </div>
                      <h3 className="font-bold text-white text-sm sm:text-base leading-tight">
                        {industry.name}
                      </h3>
                      <p className="text-xs text-gray-400 hidden sm:block">
                        {industry.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/mobile/industries">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-8 py-6 text-lg rounded-xl gap-2"
              data-testid="button-explore-industries"
            >
              Explore All Industries
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <p className="text-gray-400 text-sm mt-4">
            Each agent is customized for your specific business needs
          </p>
        </motion.div>
      </div>

      {/* Key Features Banner */}
      <div className="relative mt-20 py-8 border-y border-purple-500/20 bg-purple-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 lg:gap-16">
            {[
              { label: "24-48hr Setup", icon: "⚡" },
              { label: "Custom Training", icon: "🎯" },
              { label: "CRM Integration", icon: "🔗" },
              { label: "24/7 Availability", icon: "🌐" },
              { label: "Natural Conversations", icon: "💬" },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-gray-300"
              >
                <span className="text-lg">{feature.icon}</span>
                <span className="font-medium text-sm sm:text-base">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
