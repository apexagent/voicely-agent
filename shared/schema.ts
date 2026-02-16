import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, index, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User table updated for Dynamic.xyz Auth with additional fields for Voicely
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Dynamic.xyz Auth fields
  dynamicUserId: varchar("dynamic_user_id").unique(),
  walletAddress: varchar("wallet_address"),
  authProvider: varchar("auth_provider"), // "email", "google", "twitter", etc.
  // Voicely-specific fields
  role: varchar("role").notNull().default("user"), // "user" | "admin"
  voiceTokenBalance: integer("voice_token_balance").notNull().default(1000),
  totalCallsHandled: integer("total_calls_handled").notNull().default(0),
  activeAgentsCount: integer("active_agents_count").notNull().default(0),
  subscriptionTier: varchar("subscription_tier").notNull().default("free"),
  // Notification preferences
  pushNotifications: boolean("push_notifications").notNull().default(true),
  emailAlerts: boolean("email_alerts").notNull().default(true),
  smsAlerts: boolean("sms_alerts").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const waitlistEntries = pgTable("waitlist_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  fullName: text("full_name"),
  company: text("company"),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWaitlistSchema = createInsertSchema(waitlistEntries).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("Invalid email address"),
  fullName: z.string().optional(),
  company: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;

export const callStats = pgTable("call_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalCalls: integer("total_calls").notNull().default(0),
  activeAgents: integer("active_agents").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type CallStats = typeof callStats.$inferSelect;

// AI Agents table - Optimized for Business Customization
export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // "sales", "support", "scheduling", "outbound"
  status: varchar("status").notNull().default("idle"), // "active", "idle", "training", "offline"
  // BUSINESS CONTEXT - NEW FIELDS
  businessName: varchar("business_name"), // Customer's business name
  businessUrl: varchar("business_url"), // Customer's website URL
  phoneNumber: varchar("phone_number"), // Business phone number for agent to reference
  customUrl: varchar("custom_url").unique(), // Vanity URL slug (e.g., "my-sales-agent" for voicelyagent.ai/my-sales-agent)
  // VOICE & AI CONFIGURATION
  language: varchar("language").notNull().default("English"),
  voice: varchar("voice").notNull().default("Professional Female"),
  voiceId: varchar("voice_id").default("default"), // ElevenLabs voice ID
  personality: text("personality"), // Agent personality description
  systemPrompt: text("system_prompt"), // Core AI instructions
  firstMessage: text("first_message"), // Opening message agent speaks
  vapiAssistantId: varchar("vapi_assistant_id"), // Vapi assistant ID for managed AI
  tools: jsonb("tools"), // Vapi tools/integrations configuration (calendar, SMS, APIs, etc.)
  // PERFORMANCE METRICS (simplified)
  callsHandled: integer("calls_handled").notNull().default(0),
  successRate: real("success_rate"), // Success rate percentage
  // VISUAL CUSTOMIZATION
  avatar: varchar("avatar").notNull().default("AI"),
  color: varchar("color").notNull().default("from-purple-500 to-violet-500"),
  avatarUrl: varchar("avatar_url"), // Path to agent portrait image
  avatarStyle: varchar("avatar_style").default("cyber"), // "cyber", "holographic", "minimal"
  primaryColor: varchar("primary_color").default("#8B5CF6"), // Main theme color (purple)
  secondaryColor: varchar("secondary_color").default("#06B6D4"), // Accent color (cyan)
  backgroundImage: varchar("background_image"), // Custom background image URL
  backgroundVideo: varchar("background_video"), // Custom background video URL
  voicePreviewUrl: varchar("voice_preview_url"), // Sample TTS audio clip URL
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

// Call records table for analytics
export const calls = pgTable("calls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentId: varchar("agent_id").references(() => agents.id),
  duration: integer("duration").notNull(), // in seconds
  outcome: varchar("outcome"), // "success", "failed", "missed"
  sentiment: varchar("sentiment"), // "positive", "neutral", "negative"
  tokensEarned: integer("tokens_earned").notNull().default(0),
  responseTime: real("response_time"), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCallSchema = createInsertSchema(calls).omit({
  id: true,
  createdAt: true,
});

export type InsertCall = z.infer<typeof insertCallSchema>;
export type Call = typeof calls.$inferSelect;

// User stats for tracking weekly/monthly changes
export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  tokensEarnedThisWeek: integer("tokens_earned_this_week").notNull().default(0),
  callsThisWeek: integer("calls_this_week").notNull().default(0),
  avgResponseTime: real("avg_response_time").notNull().default(0.3), // in seconds
  weekStartDate: timestamp("week_start_date").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  updatedAt: true,
});

export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type UserStats = typeof userStats.$inferSelect;

// Activity feed for real-time updates
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentId: varchar("agent_id").references(() => agents.id),
  type: varchar("type").notNull(), // "call_completed", "tokens_earned", "agent_deployed", etc.
  action: varchar("action").notNull(),
  amount: varchar("amount"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Conversations table for storing transcripts and call intelligence
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentId: varchar("agent_id").references(() => agents.id),
  callId: varchar("call_id").references(() => calls.id),
  transcript: text("transcript"), // Full conversation transcript
  summary: text("summary"), // AI-generated summary
  actionItems: jsonb("action_items"), // Extracted action items
  sentiment: varchar("sentiment"), // Overall sentiment analysis
  sentimentScore: real("sentiment_score"), // -1 to 1
  duration: integer("duration"), // in seconds
  audioUrl: varchar("audio_url"), // URL to stored audio file
  metadata: jsonb("metadata"), // Additional data (language, custom fields, etc.)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// Transcript segments for real-time streaming
export const transcriptSegments = pgTable("transcript_segments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
  speaker: varchar("speaker").notNull(), // "agent" or "user"
  text: text("text").notNull(),
  confidence: real("confidence"), // 0 to 1
  sentiment: varchar("sentiment"), // "positive", "neutral", "negative"
  timestamp: real("timestamp"), // seconds from start
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTranscriptSegmentSchema = createInsertSchema(transcriptSegments).omit({
  id: true,
  createdAt: true,
});

export type InsertTranscriptSegment = z.infer<typeof insertTranscriptSegmentSchema>;
export type TranscriptSegment = typeof transcriptSegments.$inferSelect;

// Campaigns table for marketing automation
export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentId: varchar("agent_id").references(() => agents.id), // Agent handling campaign calls
  name: varchar("name").notNull(),
  description: text("description"),
  type: varchar("type").notNull().default("outbound"), // "outbound", "inbound", "nurture", "follow-up"
  status: varchar("status").notNull().default("draft"), // "draft", "scheduled", "active", "paused", "completed"
  targetAudience: text("target_audience"),
  script: text("script"), // Call script or email template
  automationRules: jsonb("automation_rules"), // Automation triggers and actions
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  totalLeads: integer("total_leads").notNull().default(0),
  contactedLeads: integer("contacted_leads").notNull().default(0),
  convertedLeads: integer("converted_leads").notNull().default(0),
  totalCalls: integer("total_calls").notNull().default(0),
  successfulCalls: integer("successful_calls").notNull().default(0),
  totalRevenue: integer("total_revenue").notNull().default(0), // in cents
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().optional(),
  type: z.enum(["outbound", "inbound", "nurture", "follow-up"]).optional(),
  status: z.enum(["draft", "scheduled", "active", "paused", "completed"]).optional(),
  targetAudience: z.string().optional(),
  script: z.string().optional(),
});

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

// Leads table for CRM functionality
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentId: varchar("agent_id").references(() => agents.id), // Assigned agent
  campaignId: varchar("campaign_id").references(() => campaigns.id), // Source campaign
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  company: varchar("company"),
  title: varchar("title"),
  status: varchar("status").notNull().default("new"), // "new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"
  score: integer("score").notNull().default(0), // Lead score 0-100
  source: varchar("source").notNull().default("manual"), // "manual", "campaign", "referral", "website", "api"
  value: integer("value").notNull().default(0), // Potential deal value in cents
  notes: text("notes"),
  lastContactedAt: timestamp("last_contacted_at"),
  nextFollowUpAt: timestamp("next_follow_up_at"),
  metadata: jsonb("metadata"), // Custom fields
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  status: z.enum(["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"]).optional(),
  score: z.number().min(0).max(100).optional(),
  source: z.enum(["manual", "campaign", "referral", "website", "api"]).optional(),
  value: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Lead activities table for tracking all lead interactions
export const leadActivities = pgTable("lead_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  leadId: varchar("lead_id").notNull().references(() => leads.id),
  agentId: varchar("agent_id").references(() => agents.id),
  callId: varchar("call_id").references(() => calls.id),
  campaignId: varchar("campaign_id").references(() => campaigns.id),
  type: varchar("type").notNull(), // "call", "email", "sms", "note", "status_change", "score_change"
  action: varchar("action").notNull(), // Human-readable action
  outcome: varchar("outcome"), // "success", "failed", "no_answer", "callback", etc.
  duration: integer("duration"), // Duration in seconds (for calls)
  notes: text("notes"),
  metadata: jsonb("metadata"), // Additional data
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadActivitySchema = createInsertSchema(leadActivities).omit({
  id: true,
  createdAt: true,
});

export type InsertLeadActivity = z.infer<typeof insertLeadActivitySchema>;
export type LeadActivity = typeof leadActivities.$inferSelect;

// Voice Sessions table for real-time voice interactions
export const voiceSessions = pgTable("voice_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentId: varchar("agent_id").notNull().references(() => agents.id),
  status: varchar("status").notNull().default("connecting"), // "connecting", "active", "ended", "failed"
  audioUrl: varchar("audio_url"), // URL to recorded conversation audio
  transcript: text("transcript"), // Full conversation transcript
  duration: integer("duration").default(0), // Duration in seconds
  waveformData: jsonb("waveform_data"), // Audio waveform visualization data
  sentimentScore: real("sentiment_score"), // Average sentiment (-1 to 1)
  tokensUsed: integer("tokens_used").default(0), // LLM tokens consumed
  metadata: jsonb("metadata"), // Additional session data
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVoiceSessionSchema = createInsertSchema(voiceSessions).omit({
  id: true,
  createdAt: true,
  startedAt: true,
});

export type InsertVoiceSession = z.infer<typeof insertVoiceSessionSchema>;
export type VoiceSession = typeof voiceSessions.$inferSelect;

// Agent Avatars table for managing multiple visual representations per agent
export const agentAvatars = pgTable("agent_avatars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull().references(() => agents.id),
  imageUrl: varchar("image_url").notNull(), // Path to avatar image
  imageType: varchar("image_type").notNull().default("portrait"), // "portrait", "full-body", "icon", "thumbnail"
  style: varchar("style").default("cyber"), // "cyber", "realistic", "holographic", "minimalist"
  isPrimary: boolean("is_primary").default(false), // Primary avatar shown by default
  width: integer("width"), // Image width in pixels
  height: integer("height"), // Image height in pixels
  metadata: jsonb("metadata"), // Additional image metadata
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAgentAvatarSchema = createInsertSchema(agentAvatars).omit({
  id: true,
  createdAt: true,
});

export type InsertAgentAvatar = z.infer<typeof insertAgentAvatarSchema>;
export type AgentAvatar = typeof agentAvatars.$inferSelect;

// Demo Agents table for permanent shareable demo URLs
export const demoAgents = pgTable("demo_agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug").notNull().unique(), // URL slug (e.g., "mydentalday" from mydentalday.com)
  websiteUrl: varchar("website_url").notNull(), // Original website URL analyzed
  businessName: varchar("business_name").notNull(),
  industry: varchar("industry").notNull(),
  businessInfo: jsonb("business_info").notNull(), // Full BusinessInfo object
  systemPrompt: text("system_prompt").notNull(),
  greeting: text("greeting").notNull(),
  workflows: jsonb("workflows"), // AgenticWorkflow[] for email
  coldEmail: text("cold_email"), // Generated cold email HTML
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDemoAgentSchema = createInsertSchema(demoAgents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDemoAgent = z.infer<typeof insertDemoAgentSchema>;
export type DemoAgent = typeof demoAgents.$inferSelect;
