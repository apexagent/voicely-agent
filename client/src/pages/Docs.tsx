import { motion } from "framer-motion";
import { Book, Code, Rocket, FileText, Terminal, Zap, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Docs() {
  const categories = [
    {
      icon: Rocket,
      title: "Getting Started",
      description: "Quick start guide and initial setup",
      color: "purple",
      docs: [
        { title: "Quick Start Guide", time: "5 min" },
        { title: "Create Your First Agent", time: "10 min" },
        { title: "Configure Voice Settings", time: "8 min" },
        { title: "Deploy to Production", time: "15 min" },
      ],
    },
    {
      icon: Code,
      title: "API Reference",
      description: "Complete API documentation and examples",
      color: "cyan",
      docs: [
        { title: "Authentication", time: "5 min" },
        { title: "Agent Management", time: "12 min" },
        { title: "Call Handling", time: "10 min" },
        { title: "Webhooks & Events", time: "8 min" },
      ],
    },
    {
      icon: Terminal,
      title: "Integrations",
      description: "Connect with your existing tools",
      color: "violet",
      docs: [
        { title: "CRM Integration", time: "15 min" },
        { title: "Calendar Sync", time: "10 min" },
        { title: "Payment Gateways", time: "12 min" },
        { title: "Custom Webhooks", time: "8 min" },
      ],
    },
    {
      icon: FileText,
      title: "Best Practices",
      description: "Tips and tricks for optimal performance",
      color: "purple",
      docs: [
        { title: "Voice Script Writing", time: "20 min" },
        { title: "Training Your Agents", time: "15 min" },
        { title: "Optimizing Conversations", time: "12 min" },
        { title: "Analytics & Insights", time: "10 min" },
      ],
    },
  ];

  const quickLinks = [
    { title: "API Keys", href: "/docs/api-keys" },
    { title: "SDKs & Libraries", href: "/docs/sdks" },
    { title: "Changelog", href: "/docs/changelog" },
    { title: "Support", href: "/docs/support" },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 mb-6"
            >
              <Book className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">Documentation</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Developer
              </span>
              <span className="text-gray-200"> Docs</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Everything you need to build, deploy, and scale your AI voice workforce
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className="w-full px-6 py-4 rounded-2xl bg-purple-600/10 border border-purple-500/30 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple-400/50 focus:bg-purple-600/15 transition-all"
                  data-testid="input-docs-search"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <kbd className="px-2 py-1 rounded bg-purple-600/20 border border-purple-500/30 text-xs text-gray-400">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Documentation Categories */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const cardBgClass = category.color === "purple"
                ? "bg-gradient-to-br from-purple-600/10 to-purple-600/5 border border-purple-500/20"
                : category.color === "cyan"
                ? "bg-gradient-to-br from-cyan-600/10 to-cyan-600/5 border border-cyan-500/20"
                : "bg-gradient-to-br from-violet-600/10 to-violet-600/5 border border-violet-500/20";
              
              const iconBgClass = category.color === "purple"
                ? "bg-gradient-to-br from-purple-600/30 to-purple-600/10 border border-purple-500/30"
                : category.color === "cyan"
                ? "bg-gradient-to-br from-cyan-600/30 to-cyan-600/10 border border-cyan-500/30"
                : "bg-gradient-to-br from-violet-600/30 to-violet-600/10 border border-violet-500/30";
              
              const iconColorClass = category.color === "purple"
                ? "text-purple-400"
                : category.color === "cyan"
                ? "text-cyan-400"
                : "text-violet-400";
              
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`p-8 rounded-3xl ${cardBgClass} backdrop-blur-xl hover-elevate active-elevate-2`}
                  style={{
                    boxShadow: "0 0 40px rgba(139,92,246,0.1)",
                  }}
                >
                  <div className={`w-14 h-14 rounded-xl ${iconBgClass} flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${iconColorClass}`} />
                  </div>

                  <h2 className="text-2xl font-black text-gray-200 mb-2">{category.title}</h2>
                  <p className="text-sm text-gray-400 mb-6">{category.description}</p>

                  <div className="space-y-3">
                    {category.docs.map((doc) => (
                      <button
                        key={doc.title}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-black/20 hover:bg-black/40 border border-purple-500/10 hover:border-purple-500/30 transition-all group"
                        data-testid={`link-doc-${doc.title.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <span className="text-sm font-semibold text-gray-300 group-hover:text-gray-200">{doc.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{doc.time}</span>
                          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="p-12 rounded-3xl bg-gradient-to-br from-purple-600/20 to-violet-600/10 border border-purple-500/30 backdrop-blur-xl"
              style={{
                boxShadow: "0 0 80px rgba(139,92,246,0.3)",
              }}
            >
              <h2 className="text-3xl font-black text-gray-200 mb-6 text-center">Quick Links</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {quickLinks.map((link) => (
                  <Link key={link.title} href={link.href}>
                    <button
                      className="p-4 rounded-xl bg-purple-600/10 border border-purple-500/20 hover:border-purple-400/40 hover:bg-purple-600/20 transition-all group flex items-center justify-between w-full"
                      data-testid={`link-quick-${link.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                    >
                      <span className="text-sm font-semibold text-gray-300 group-hover:text-gray-200">{link.title}</span>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                    </button>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <p className="text-gray-400 mb-6">Need help? Our team is here for you.</p>
                <Link href="/get-started">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-500 hover:via-violet-500 hover:to-purple-500 text-gray-200 font-black px-8"
                    data-testid="button-contact-support"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
