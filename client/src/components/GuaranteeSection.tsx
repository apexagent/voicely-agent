import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Headphones } from "lucide-react";

export default function GuaranteeSection() {
  const guarantees = [
    {
      icon: Shield,
      title: "14-Day Money-Back Guarantee",
      description: "Not satisfied? Get a full refund, no questions asked",
    },
    {
      icon: Clock,
      title: "24/7 Customer Support",
      description: "Our team is always here to help you succeed",
    },
    {
      icon: Headphones,
      title: "Lightning-Fast Responses",
      description: "Average response time under 2 minutes",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-transparent to-primary/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4">
            An Employee That <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-2">Never</span> Gets Sick
          </h2>
          <p className="text-xl text-muted-foreground">
            24/7 reliability backed by our guarantees
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {guarantees.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-card-border backdrop-blur-sm bg-card hover-elevate h-full" data-testid={`card-guarantee-${index + 1}`}>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-chart-2 shadow-glow-violet">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-xl">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
