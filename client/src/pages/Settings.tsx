import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { User as UserIcon, Bell, Zap, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/cyber";

export default function Settings() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !user) {
    return null;
  }

  const handleSaveProfile = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-white p-8" data-testid="page-settings">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          System Configuration
        </h1>
        <p className="text-gray-400">Manage your profile and preferences</p>
      </motion.div>

      {/* Main Content */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassPanel data-testid="card-profile">
            <div className="p-6 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Profile Information
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First Name
                  </label>
                  <Input
                    type="text"
                    value={user.firstName || ""}
                    readOnly
                    className="bg-black/40 border-cyan-500/30 text-white"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    value={user.lastName || ""}
                    readOnly
                    className="bg-black/40 border-cyan-500/30 text-white"
                    data-testid="input-last-name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={user.email || ""}
                    readOnly
                    className="bg-black/40 border-cyan-500/30 text-white"
                    data-testid="input-email"
                  />
                </div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassPanel data-testid="card-notifications">
            <div className="p-6 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  Notifications
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between" data-testid="setting-email-notifications">
                <div>
                  <div className="text-white font-medium">Email Notifications</div>
                  <div className="text-sm text-gray-400">
                    Receive updates about your AI agents via email
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  data-testid="toggle-email-notifications"
                />
              </div>

              <div className="flex items-center justify-between" data-testid="setting-sms-notifications">
                <div>
                  <div className="text-white font-medium">SMS Notifications</div>
                  <div className="text-sm text-gray-400">
                    Get instant alerts for critical agent events
                  </div>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                  data-testid="toggle-sms-notifications"
                />
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <Button
            onClick={handleSaveProfile}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white px-8"
            data-testid="button-save-settings"
          >
            <Shield className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
