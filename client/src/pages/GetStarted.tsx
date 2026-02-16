import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Mail, User, Building2, Phone, Sparkles, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import voicelyLogo from "@assets/Untitled design (11)_1762790672251.png";

export default function GetStarted() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    phoneNumber: "",
  });
  const { toast } = useToast();

  const joinWaitlistMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to join waitlist");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "🎉 You're on the list!",
        description: "We'll be in touch soon with exclusive early access.",
      });
      setFormData({ fullName: "", email: "", company: "", phoneNumber: "" });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    joinWaitlistMutation.mutate(formData);
  };

  const benefits = [
    "24/7 AI voice agents handling calls",
    "No hiring, training, or management",
    "Scale infinitely with zero limits",
    "Earn $VOICE tokens with usage",
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        {/* Starfield */}
        {[...Array(120)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-200/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Gradient Glows */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-purple-600/20 rounded-full blur-[160px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[140px]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-6xl">
          {/* Back Button */}
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="mb-8 text-gray-300 hover:text-purple-300"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT SIDE - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <img src={voicelyLogo} alt="Voicely" className="h-8 w-auto" />
              </div>

              <h1 className="font-display text-5xl lg:text-6xl font-black text-gray-200 mb-4 leading-tight">
                Start Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                  AI Workforce
                </span>
              </h1>

              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                Join thousands of businesses automating their customer interactions with AI voice agents that never sleep.
              </p>

              {/* Benefits List */}
              <div className="space-y-4 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-base">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                    247+
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Agents Live</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    99.9%
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    24/7
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Available</div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                {/* Card Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600 rounded-2xl blur-xl opacity-30" />

                <div className="relative bg-black/90 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-8">
                  {/* Headline */}
                  <div className="text-center mb-8">
                    <h2 className="font-display text-2xl font-bold text-gray-200 mb-2 flex items-center justify-center gap-2">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                      Join the Waitlist
                    </h2>
                    <p className="text-gray-400 text-sm">Get exclusive early access + bonus $VOICE tokens</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="fullName" className="text-gray-300 text-sm font-semibold mb-2 block">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="pl-10 bg-black/50 border-purple-500/30 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                          data-testid="input-fullname"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-300 text-sm font-semibold mb-2 block">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10 bg-black/50 border-purple-500/30 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                          data-testid="input-email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="company" className="text-gray-300 text-sm font-semibold mb-2 block">
                        Company
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                        <Input
                          id="company"
                          type="text"
                          placeholder="Acme Inc."
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="pl-10 bg-black/50 border-purple-500/30 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                          data-testid="input-company"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-300 text-sm font-semibold mb-2 block">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className="pl-10 bg-black/50 border-purple-500/30 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                          data-testid="input-phone"
                        />
                      </div>
                    </div>

                    {/* Premium Submit Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        disabled={joinWaitlistMutation.isPending}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-500 hover:via-violet-500 hover:to-purple-500 text-gray-100 font-bold py-6 border-0"
                        data-testid="button-submit"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Zap className="w-4 h-4" />
                          {joinWaitlistMutation.isPending ? "Joining..." : "Join Waitlist - It's Free"}
                        </span>
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                          }}
                          animate={{
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      </Button>
                    </motion.div>
                  </form>

                  {/* Privacy Note */}
                  <p className="text-xs text-gray-500 text-center mt-6">
                    By joining, you agree to receive updates. No spam, unsubscribe anytime.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
