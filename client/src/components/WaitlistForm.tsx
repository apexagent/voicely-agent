import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertWaitlistSchema, type InsertWaitlist } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface WaitlistFormProps {
  variant?: "inline" | "card";
  showFullForm?: boolean;
}

export default function WaitlistForm({ variant = "inline", showFullForm = false }: WaitlistFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertWaitlist>({
    resolver: zodResolver(insertWaitlistSchema),
    defaultValues: {
      email: "",
      fullName: "",
      company: "",
      phoneNumber: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertWaitlist) => apiRequest("POST", "/api/waitlist", data),
    onSuccess: () => {
      setIsSuccess(true);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist"] });
      toast({
        title: "You're on the waitlist!",
        description: "We'll be in touch soon with early access.",
      });
      setTimeout(() => setIsSuccess(false), 5000);
    },
    onError: (error: any) => {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertWaitlist) => {
    mutation.mutate(data);
  };

  if (variant === "inline") {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    className="bg-black/40 border-purple-500/30 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                    data-testid="input-waitlist-email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={mutation.isPending || isSuccess}
            className="bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-gray-100 glow-purple"
            data-testid="button-join-waitlist"
          >
            <AnimatePresence mode="wait">
              {mutation.isPending ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Joining...
                </motion.span>
              ) : isSuccess ? (
                <motion.span
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Joined!
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Join Waitlist
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-lg p-8 max-w-lg mx-auto">
      <h3 className="text-2xl font-bold text-gray-200 mb-6">Get Early Access</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email *"
                    {...field}
                    className="bg-black/40 border-purple-500/30 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                    data-testid="input-waitlist-email-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showFullForm && (
            <>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Full Name"
                        {...field}
                        className="bg-black/40 border-purple-500/30 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                        data-testid="input-waitlist-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Company"
                        {...field}
                        className="bg-black/40 border-purple-500/30 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                        data-testid="input-waitlist-company"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Phone Number"
                        {...field}
                        className="bg-black/40 border-purple-500/30 text-gray-200 placeholder:text-gray-500 focus:border-purple-500"
                        data-testid="input-waitlist-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button
            type="submit"
            disabled={mutation.isPending || isSuccess}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-gray-100 glow-purple"
            size="lg"
            data-testid="button-submit-waitlist"
          >
            <AnimatePresence mode="wait">
              {mutation.isPending ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Joining Waitlist...
                </motion.span>
              ) : isSuccess ? (
                <motion.span
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Successfully Joined!
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Join Waitlist
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </form>
      </Form>
    </div>
  );
}
