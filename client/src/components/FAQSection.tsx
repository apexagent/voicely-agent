import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Search, 
  Sparkles, 
  Volume2, 
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  ChevronRight,
  Mic,
  Brain,
  Activity,
  VolumeX,
  PhoneOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FAQVoiceDialog from "./FAQVoiceDialog";

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);
  const [selectedFAQ, setSelectedFAQ] = useState<{
    question: string;
    answer: string;
    confidence: number;
    avgResponseTime: string;
    category: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Handle FAQ voice playback - opens premium dialog
  const handleFAQVoiceClick = async (faqIndex: number, faq: { question: string; answer: string; confidence: number; avgResponseTime: string; category: string }) => {
    // Open accordion
    setOpenAccordion(`item-${faqIndex}`);
    
    // Open premium voice dialog
    setSelectedFAQ(faq);
    setIsDialogOpen(true);
  };

  const categories = [
    { id: "all", name: "All Questions", icon: HelpCircle, color: "cyan" },
    { id: "features", name: "Features", icon: Sparkles, color: "purple" },
    { id: "pricing", name: "Pricing", icon: TrendingUp, color: "blue" },
    { id: "technical", name: "Technical", icon: Zap, color: "violet" },
  ];

  const faqs = [
    {
      question: "What exactly can the AI voice agents handle?",
      answer: "Our AI agents can handle inbound calls, book appointments, answer FAQs, qualify leads, process orders, send follow-ups, and integrate with your existing tools like CRM and calendar systems. They understand context, remember conversations, and can switch between tasks seamlessly.",
      category: "features",
      confidence: 98,
      avgResponseTime: "0.8s",
    },
    {
      question: "How will I train the AI voice agents?",
      answer: "Training is incredibly simple. You upload your knowledge base, set conversation guidelines, and configure integrations. The AI learns from your documentation and gets smarter with each conversation. No coding or technical expertise required.",
      category: "features",
      confidence: 95,
      avgResponseTime: "1.2s",
    },
    {
      question: "Are they easy to work with?",
      answer: "Absolutely! Our platform is designed for non-technical users. Setup takes less than 5 minutes, and you can customize everything through our intuitive dashboard without writing any code. Just point, click, and configure.",
      category: "features",
      confidence: 97,
      avgResponseTime: "0.9s",
    },
    {
      question: "How many calls can it handle?",
      answer: "Our AI agents can handle unlimited concurrent calls. Whether you get 10 calls or 10,000 calls per day, every customer gets immediate attention without any wait time. Scale infinitely with zero infrastructure worries.",
      category: "technical",
      confidence: 99,
      avgResponseTime: "0.7s",
    },
    {
      question: "What languages are supported?",
      answer: "We support 50+ languages including English, Spanish, French, German, Chinese, Japanese, and many more. The AI can even switch languages mid-conversation if needed, making it perfect for global businesses.",
      category: "features",
      confidence: 96,
      avgResponseTime: "1.0s",
    },
    {
      question: "What are your pricing plans?",
      answer: "Our pricing is transparent and straightforward: $5,000 one-time installation fee for complete business setup, then $250-$1,500 per month based on your usage and call volume. This includes premium voice models, advanced analytics, $VOICE token rewards, custom integrations, and 24/7 priority support. Pricing scales with your business needs.",
      category: "pricing",
      confidence: 98,
      avgResponseTime: "0.9s",
    },
    {
      question: "What's included in the $5,000 installation fee?",
      answer: "The $5,000 installation fee covers complete business setup including: custom agent configuration, voice model training, integration with your existing systems, initial data migration, team training sessions, and personalized onboarding support. This one-time investment ensures your AI voice workforce is perfectly tailored to your business needs.",
      category: "pricing",
      confidence: 96,
      avgResponseTime: "1.0s",
    },
    {
      question: "What's included in the monthly fee?",
      answer: "The monthly fee ($250-$1,500 based on usage) includes unlimited AI voice agents, all calls and interactions, premium voice models, advanced analytics dashboard, $VOICE token rewards, custom integrations, multi-language support, priority 24/7 support, and regular feature updates. Scale your voice workforce without per-call fees or hidden costs.",
      category: "pricing",
      confidence: 97,
      avgResponseTime: "1.1s",
    },
    {
      question: "How does the monthly pricing vary?",
      answer: "Monthly pricing ranges from $250-$1,500 depending on your call volume and usage patterns. Light usage starts at $250/month, while high-volume operations scale up to $1,500/month. For enterprise-level deployments with exceptional volume, we offer custom pricing with unlimited agents, white-label solutions, dedicated account management, and SLA guarantees.",
      category: "pricing",
      confidence: 95,
      avgResponseTime: "1.2s",
    },
    {
      question: "What are $VOICE tokens and how do they work?",
      answer: "$VOICE tokens are our cryptocurrency rewards system included with your subscription. You earn tokens through platform usage which can be used for premium features, additional agents, discounts on services, or traded on supported exchanges. All active subscriptions receive monthly $VOICE token allocations based on usage volume.",
      category: "pricing",
      confidence: 94,
      avgResponseTime: "1.3s",
    },
    {
      question: "Do you offer a free trial or demo?",
      answer: "Yes! We offer a live demo where you can test our AI voice agents in real-time. Experience the full capabilities of our platform before committing. The $5,000 installation fee and monthly service are only charged after you're completely satisfied with the demo and ready to deploy. Contact our team to schedule your personalized demo today.",
      category: "pricing",
      confidence: 99,
      avgResponseTime: "0.7s",
    },
  ];


  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="faq" className="py-16 relative overflow-hidden bg-black">
      {/* Deep Space Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0A0B1E] to-black" />

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 2, 1],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Massive Gradient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[200px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[180px]" />

      <div className="relative max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-600/10 border-2 border-cyan-500/30 backdrop-blur-xl mb-4"
          >
            <Brain className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Neural Knowledge Base
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl lg:text-5xl font-black mb-3"
          >
            <span className="text-gray-200">Ask </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Alice Anything
            </span>
          </motion.h2>
          <p className="text-base text-gray-400 max-w-2xl mx-auto">
            Click any question to hear Alice's voice answer
          </p>
        </div>

        {/* Smart FAQ Knowledge Stack */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Search & Categories - Sticky Header */}
            <div className="mb-4 space-y-3 sticky top-0 z-10 bg-black/80 backdrop-blur-xl pb-3 -mt-2 pt-2">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-black/60 border border-cyan-500/30 text-white placeholder:text-gray-500 rounded-lg backdrop-blur-xl text-sm"
                  data-testid="input-search-faq"
                />
              </div>

              {/* Category Chips */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id || (!selectedCategory && cat.id === "all");
                  return (
                    <motion.button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id === "all" ? null : cat.id)}
                      className={`px-3 py-1.5 rounded-full border backdrop-blur-xl flex items-center gap-1.5 transition-all text-xs ${
                        isActive
                          ? "bg-cyan-600/20 border-cyan-500/70 text-cyan-300"
                          : "bg-black/40 border-gray-700 text-gray-400 hover:border-cyan-500/50"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid={`category-${cat.id}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span className="font-medium">{cat.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable FAQ Container */}
            <ScrollArea className="h-[540px] pr-4">
              {/* FAQ Accordion */}
              <Accordion 
                type="single" 
                collapsible 
                value={openAccordion}
                onValueChange={setOpenAccordion}
                className="space-y-3"
              >
                <AnimatePresence>
                  {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <AccordionItem
                      value={`item-${index}`}
                      className="relative border border-cyan-500/20 rounded-lg bg-black/40 backdrop-blur-xl data-[state=open]:border-cyan-400/60 data-[state=open]:bg-cyan-900/10 transition-all overflow-hidden group mb-2"
                      data-testid={`faq-item-${index + 1}`}
                    >
                      <AccordionTrigger 
                        className="text-left px-4 py-3 hover:no-underline cursor-pointer" 
                        data-testid={`trigger-faq-${index}`}
                        onClick={(e) => {
                          // Trigger voice playback when clicking anywhere on the FAQ
                          e.preventDefault();
                          handleFAQVoiceClick(index, faq);
                        }}
                      >
                        <div className="flex items-center gap-3 flex-1 pointer-events-none">
                          {/* Compact Confidence Badge */}
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center" data-testid={`confidence-badge-${index}`}>
                            <span className="text-xs font-bold text-cyan-300">{faq.confidence}%</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Question Title */}
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-gray-200 group-data-[state=open]:text-cyan-300 transition-colors line-clamp-1">
                                {faq.question}
                              </h3>
                            </div>
                            
                            {/* Metadata Footer Line */}
                            <div className="flex items-center gap-2 text-xs">
                              <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 px-2 py-0 h-5" data-testid={`badge-response-time-${index}`}>
                                <Clock className="w-2.5 h-2.5 mr-1" />
                                {faq.avgResponseTime}
                              </Badge>
                              <span className="text-gray-500">•</span>
                              <span className="text-purple-400/70 capitalize">{faq.category}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-green-400/70 flex items-center gap-1">
                                <Volume2 className="w-3 h-3" />
                                Click to hear
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-4 pb-3 pt-1">
                        <div className="pl-0 text-sm text-gray-300 leading-relaxed">
                          {faq.answer}
                        </div>
                      </AccordionContent>

                      {/* Subtle Hover Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity -z-10 pointer-events-none bg-gradient-to-r from-cyan-500/5 to-purple-500/5" />
                    </AccordionItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Accordion>

              {/* No Results */}
              {filteredFaqs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No results found</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                    }}
                    className="border-cyan-500/50"
                    data-testid="button-clear-filters"
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </ScrollArea>
          </motion.div>
        </div>
      </div>

      {/* Premium Voice Dialog */}
      <FAQVoiceDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        faq={selectedFAQ}
      />
    </section>
  );
}
