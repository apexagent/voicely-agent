import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  index: number;
}

export default function TestimonialCard({
  name,
  role,
  company,
  content,
  rating,
  avatar,
  index,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full border-card-border backdrop-blur-sm bg-card hover-elevate" data-testid={`card-testimonial-${index + 1}`}>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>

          <p className="text-foreground leading-relaxed">{content}</p>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-primary/20">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-muted-foreground">
                  {role}, {company}
                </p>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              onClick={() => console.log(`Playing audio for ${name}`)}
              data-testid={`button-play-audio-${index + 1}`}
            >
              <Play className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
