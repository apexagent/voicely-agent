import { 
  type User, type UpsertUser, type WaitlistEntry, type InsertWaitlist, type CallStats,
  type Agent, type InsertAgent, type Call, type InsertCall, 
  type UserStats, type InsertUserStats, type Activity, type InsertActivity,
  type Lead, type InsertLead, type Campaign, type InsertCampaign,
  type LeadActivity, type InsertLeadActivity,
  type VoiceSession, type InsertVoiceSession,
  users, waitlistEntries, callStats, agents, calls, userStats, activities,
  leads, campaigns, leadActivities, voiceSessions
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and, gte, sql as drizzleSql } from "drizzle-orm";
import { cacheWrapper, CacheKeys, CacheTTL, deleteCache, invalidateUserCache, invalidateAgentCache } from "./utils/cache";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Replit Auth user operations (mandatory)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Waitlist
  createWaitlistEntry(entry: InsertWaitlist): Promise<WaitlistEntry>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  
  // Call Stats
  getCallStats(): Promise<CallStats>;
  updateCallStats(totalCalls: number, activeAgents: number): Promise<CallStats>;
  
  // Agents
  createAgent(agent: InsertAgent): Promise<Agent>;
  getAgents(userId: string): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | undefined>;
  getAgentByCustomUrl(customUrl: string): Promise<Agent | undefined>;
  updateAgent(id: string, updates: Partial<Agent>): Promise<Agent>;
  deleteAgent(id: string): Promise<void>;
  
  // Calls
  createCall(call: InsertCall): Promise<Call>;
  createCallWithUpdates(call: InsertCall): Promise<Call>;
  getCalls(userId: string, limit?: number): Promise<Call[]>;
  getCallsByAgent(agentId: string, limit?: number): Promise<Call[]>;
  
  // User Stats
  getUserStats(userId: string): Promise<UserStats | undefined>;
  upsertUserStats(stats: InsertUserStats): Promise<UserStats>;
  
  // Activities
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivities(userId: string, limit?: number): Promise<Activity[]>;
  
  // Leads
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(userId: string, filters?: { status?: string; campaignId?: string }): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  updateLead(id: string, updates: Partial<Lead>): Promise<Lead>;
  deleteLead(id: string): Promise<void>;
  
  // Campaigns
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getCampaigns(userId: string): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign>;
  deleteCampaign(id: string): Promise<void>;
  
  // Lead Activities
  createLeadActivity(activity: InsertLeadActivity): Promise<LeadActivity>;
  getLeadActivities(leadId: string, limit?: number): Promise<LeadActivity[]>;
  
  // Voice Sessions
  createVoiceSession(session: InsertVoiceSession): Promise<VoiceSession>;
  updateVoiceSession(id: string, updates: Partial<VoiceSession>): Promise<VoiceSession>;
  updateVoiceSessionByData(data: Partial<VoiceSession> & { userId: string; agentId: string }): Promise<void>;
  getVoiceSessions(userId: string, limit?: number): Promise<VoiceSession[]>;
  getVoiceSessionById(id: string): Promise<VoiceSession | undefined>;
}

// Database-backed storage using PostgreSQL via Drizzle ORM
export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth) - WITH CACHING
  async getUser(id: string): Promise<User | undefined> {
    return cacheWrapper(
      CacheKeys.user(id),
      CacheTTL.MEDIUM,
      async () => {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
      }
    );
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        // Ensure Voicely defaults for new users
        voiceTokenBalance: userData.voiceTokenBalance ?? 1000,
        totalCallsHandled: userData.totalCallsHandled ?? 0,
        activeAgentsCount: userData.activeAgentsCount ?? 0,
        subscriptionTier: userData.subscriptionTier ?? "free",
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    // Invalidate user cache
    await deleteCache(CacheKeys.user(user.id));
    
    return user;
  }

  // Waitlist operations
  async createWaitlistEntry(entry: InsertWaitlist): Promise<WaitlistEntry> {
    const [waitlistEntry] = await db
      .insert(waitlistEntries)
      .values(entry)
      .returning();
    return waitlistEntry;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return await db.select().from(waitlistEntries);
  }

  // Call Stats operations
  async getCallStats(): Promise<CallStats> {
    const stats = await db.select().from(callStats).limit(1);
    if (stats.length === 0) {
      // Create initial stats if none exist
      const [newStats] = await db
        .insert(callStats)
        .values({
          totalCalls: 127543,
          activeAgents: 2847,
        })
        .returning();
      return newStats;
    }
    return stats[0];
  }

  async updateCallStats(totalCalls: number, activeAgents: number): Promise<CallStats> {
    const existing = await this.getCallStats();
    const [updated] = await db
      .update(callStats)
      .set({
        totalCalls,
        activeAgents,
        updatedAt: new Date(),
      })
      .where(eq(callStats.id, existing.id))
      .returning();
    return updated;
  }

  // Agent operations - WITH CACHING
  async createAgent(agent: InsertAgent): Promise<Agent> {
    const [newAgent] = await db.insert(agents).values(agent).returning();
    
    // Invalidate user's agents cache
    await deleteCache(CacheKeys.agents(agent.userId));
    
    return newAgent;
  }

  async getAgents(userId: string): Promise<Agent[]> {
    return cacheWrapper(
      CacheKeys.agents(userId),
      CacheTTL.MEDIUM,
      async () => {
        return await db.select().from(agents).where(eq(agents.userId, userId)).orderBy(desc(agents.createdAt));
      }
    );
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    return cacheWrapper(
      CacheKeys.agent(id),
      CacheTTL.MEDIUM,
      async () => {
        const [agent] = await db.select().from(agents).where(eq(agents.id, id));
        return agent;
      }
    );
  }

  async getAgentByCustomUrl(customUrl: string): Promise<Agent | undefined> {
    return cacheWrapper(
      `agent:customUrl:${customUrl}`,
      CacheTTL.MEDIUM,
      async () => {
        const [agent] = await db.select().from(agents).where(eq(agents.customUrl, customUrl));
        return agent;
      }
    );
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    const [updated] = await db
      .update(agents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(agents.id, id))
      .returning();
    
    // Invalidate agent cache
    await invalidateAgentCache(id, updated.userId);
    
    return updated;
  }

  async deleteAgent(id: string): Promise<void> {
    // Get agent first to get userId
    const agent = await this.getAgent(id);
    
    await db.delete(agents).where(eq(agents.id, id));
    
    // Invalidate caches
    if (agent) {
      await invalidateAgentCache(id, agent.userId);
    }
  }

  // Call operations
  async createCall(call: InsertCall): Promise<Call> {
    const [newCall] = await db.insert(calls).values(call).returning();
    return newCall;
  }

  async createCallWithUpdates(call: InsertCall): Promise<Call> {
    return await db.transaction(async (tx) => {
      // Create the call
      const [newCall] = await tx.insert(calls).values(call).returning();
      
      // Update user totals
      const [user] = await tx.select().from(users).where(eq(users.id, call.userId));
      if (user) {
        await tx
          .update(users)
          .set({
            totalCallsHandled: user.totalCallsHandled + 1,
            voiceTokenBalance: user.voiceTokenBalance + (newCall.tokensEarned || 0),
            updatedAt: new Date(),
          })
          .where(eq(users.id, call.userId));
      }
      
      // Update weekly stats with proper avgResponseTime calculation
      const [existingStats] = await tx.select().from(userStats).where(eq(userStats.userId, call.userId));
      
      if (existingStats) {
        // Calculate new average response time using nullish coalescing to preserve zero values
        const totalCalls = existingStats.callsThisWeek + 1;
        const oldAvg = existingStats.avgResponseTime;
        const newResponseTime = newCall.responseTime ?? oldAvg;
        const newAvg = ((oldAvg * existingStats.callsThisWeek) + newResponseTime) / totalCalls;
        
        await tx
          .update(userStats)
          .set({
            tokensEarnedThisWeek: existingStats.tokensEarnedThisWeek + (newCall.tokensEarned || 0),
            callsThisWeek: totalCalls,
            avgResponseTime: newAvg,
            updatedAt: new Date(),
          })
          .where(eq(userStats.userId, call.userId));
      } else {
        // Create initial stats - use nullish coalescing to preserve zero values
        await tx.insert(userStats).values({
          userId: call.userId,
          tokensEarnedThisWeek: newCall.tokensEarned ?? 0,
          callsThisWeek: 1,
          avgResponseTime: newCall.responseTime ?? 0.3,
          weekStartDate: new Date(),
        });
      }
      
      // Create activity entry
      await tx.insert(activities).values({
        userId: call.userId,
        agentId: newCall.agentId,
        type: "call_completed",
        action: `Call completed - ${newCall.outcome || "success"}`,
        amount: newCall.tokensEarned ? `+${newCall.tokensEarned} tokens` : undefined,
        metadata: {
          duration: newCall.duration,
          sentiment: newCall.sentiment,
        },
      });
      
      return newCall;
    });
  }

  async getCalls(userId: string, limit: number = 50): Promise<any[]> {
    const results = await db
      .select({
        id: calls.id,
        userId: calls.userId,
        agentId: calls.agentId,
        agentName: agents.name,
        duration: calls.duration,
        outcome: calls.outcome,
        sentiment: calls.sentiment,
        tokensEarned: calls.tokensEarned,
        responseTime: calls.responseTime,
        createdAt: calls.createdAt,
      })
      .from(calls)
      .leftJoin(agents, eq(calls.agentId, agents.id))
      .where(eq(calls.userId, userId))
      .orderBy(desc(calls.createdAt))
      .limit(limit);
    return results;
  }

  async getCallsByAgent(agentId: string, limit: number = 50): Promise<Call[]> {
    return await db
      .select()
      .from(calls)
      .where(eq(calls.agentId, agentId))
      .orderBy(desc(calls.createdAt))
      .limit(limit);
  }

  // User stats operations
  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats;
  }

  async upsertUserStats(statsData: InsertUserStats): Promise<UserStats> {
    const existing = await this.getUserStats(statsData.userId);
    
    if (existing) {
      const [updated] = await db
        .update(userStats)
        .set({ ...statsData, updatedAt: new Date() })
        .where(eq(userStats.userId, statsData.userId))
        .returning();
      return updated;
    }
    
    const [created] = await db.insert(userStats).values(statsData).returning();
    return created;
  }

  // Activity operations
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async getActivities(userId: string, limit: number = 20): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }
  
  // Lead operations
  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async getLeads(userId: string, filters?: { status?: string; campaignId?: string }): Promise<Lead[]> {
    const conditions = [eq(leads.userId, userId)];
    
    if (filters?.status) {
      conditions.push(eq(leads.status, filters.status));
    }
    if (filters?.campaignId) {
      conditions.push(eq(leads.campaignId, filters.campaignId));
    }
    
    return await db
      .select()
      .from(leads)
      .where(and(...conditions))
      .orderBy(desc(leads.createdAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const [updated] = await db
      .update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return updated;
  }

  async deleteLead(id: string): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }
  
  // Campaign operations
  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async getCampaigns(userId: string): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.userId, userId))
      .orderBy(desc(campaigns.createdAt));
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    const [updated] = await db
      .update(campaigns)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();
    return updated;
  }

  async deleteCampaign(id: string): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }
  
  // Lead Activity operations
  async createLeadActivity(activity: InsertLeadActivity): Promise<LeadActivity> {
    const [newActivity] = await db.insert(leadActivities).values(activity).returning();
    return newActivity;
  }

  async getLeadActivities(leadId: string, limit: number = 50): Promise<LeadActivity[]> {
    return await db
      .select()
      .from(leadActivities)
      .where(eq(leadActivities.leadId, leadId))
      .orderBy(desc(leadActivities.createdAt))
      .limit(limit);
  }
  
  // Voice Session operations
  async createVoiceSession(session: InsertVoiceSession): Promise<VoiceSession> {
    const [newSession] = await db.insert(voiceSessions).values(session).returning();
    return newSession;
  }

  async updateVoiceSession(id: string, updates: Partial<VoiceSession>): Promise<VoiceSession> {
    const [updated] = await db
      .update(voiceSessions)
      .set({ ...updates, createdAt: undefined })
      .where(eq(voiceSessions.id, id))
      .returning();
    return updated;
  }

  async updateVoiceSessionByData(data: Partial<VoiceSession> & { userId: string; agentId: string }): Promise<void> {
    await db
      .update(voiceSessions)
      .set({ 
        status: data.status,
        transcript: data.transcript,
        duration: data.duration,
        endedAt: data.endedAt,
       })
      .where(
        and(
          eq(voiceSessions.userId, data.userId),
          eq(voiceSessions.agentId, data.agentId)
        )
      );
  }

  async getVoiceSessions(userId: string, limit: number = 50): Promise<VoiceSession[]> {
    return await db
      .select()
      .from(voiceSessions)
      .where(eq(voiceSessions.userId, userId))
      .orderBy(desc(voiceSessions.createdAt))
      .limit(limit);
  }

  async getVoiceSessionById(id: string): Promise<VoiceSession | undefined> {
    const [session] = await db
      .select()
      .from(voiceSessions)
      .where(eq(voiceSessions.id, id));
    return session;
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private waitlist: Map<string, WaitlistEntry>;
  private callStats: CallStats;

  constructor() {
    this.users = new Map();
    this.waitlist = new Map();
    this.callStats = {
      id: randomUUID(),
      totalCalls: 127543,
      activeAgents: 2847,
      updatedAt: new Date(),
    };
    
    // Simulate real-time call stats updates
    setInterval(() => {
      this.callStats = {
        ...this.callStats,
        totalCalls: this.callStats.totalCalls + Math.floor(Math.random() * 10),
        activeAgents: 2800 + Math.floor(Math.random() * 200),
        updatedAt: new Date(),
      };
    }, 5000);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id || "");
    
    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: new Date(),
      };
      this.users.set(updatedUser.id, updatedUser);
      return updatedUser;
    }
    
    // Create new user with Voicely defaults
    const newUser: User = {
      id: userData.id || randomUUID(),
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      role: "user",
      voiceTokenBalance: 1000,
      totalCallsHandled: 0,
      activeAgentsCount: 0,
      subscriptionTier: "free",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async createWaitlistEntry(entry: InsertWaitlist): Promise<WaitlistEntry> {
    const id = randomUUID();
    const waitlistEntry: WaitlistEntry = {
      id,
      email: entry.email,
      fullName: entry.fullName || null,
      company: entry.company || null,
      phoneNumber: entry.phoneNumber || null,
      createdAt: new Date(),
    };
    this.waitlist.set(id, waitlistEntry);
    return waitlistEntry;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlist.values());
  }

  async getCallStats(): Promise<CallStats> {
    return this.callStats;
  }

  async updateCallStats(totalCalls: number, activeAgents: number): Promise<CallStats> {
    this.callStats = {
      ...this.callStats,
      totalCalls,
      activeAgents,
      updatedAt: new Date(),
    };
    return this.callStats;
  }

  // Stub implementations for agents (not used in production)
  async createAgent(agent: InsertAgent): Promise<Agent> {
    throw new Error("MemStorage agent operations not implemented");
  }

  async getAgents(userId: string): Promise<Agent[]> {
    return [];
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    return undefined;
  }

  async getAgentByCustomUrl(customUrl: string): Promise<Agent | undefined> {
    return undefined;
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    throw new Error("MemStorage agent operations not implemented");
  }

  async deleteAgent(id: string): Promise<void> {
    // No-op
  }

  // Stub implementations for calls (not used in production)
  async createCall(call: InsertCall): Promise<Call> {
    throw new Error("MemStorage call operations not implemented");
  }

  async createCallWithUpdates(call: InsertCall): Promise<Call> {
    throw new Error("MemStorage call operations not implemented");
  }

  async getCalls(userId: string, limit?: number): Promise<Call[]> {
    return [];
  }

  async getCallsByAgent(agentId: string, limit?: number): Promise<Call[]> {
    return [];
  }

  // Stub implementations for user stats (not used in production)
  async getUserStats(userId: string): Promise<UserStats | undefined> {
    return undefined;
  }

  async upsertUserStats(stats: InsertUserStats): Promise<UserStats> {
    throw new Error("MemStorage stats operations not implemented");
  }

  // Stub implementations for activities (not used in production)
  async createActivity(activity: InsertActivity): Promise<Activity> {
    throw new Error("MemStorage activity operations not implemented");
  }

  async getActivities(userId: string, limit?: number): Promise<Activity[]> {
    return [];
  }
  
  // Stub implementations for CRM (not used in production)
  async createLead(lead: InsertLead): Promise<Lead> {
    throw new Error("MemStorage CRM operations not implemented");
  }

  async getLeads(userId: string, filters?: { status?: string; campaignId?: string }): Promise<Lead[]> {
    return [];
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return undefined;
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    throw new Error("MemStorage CRM operations not implemented");
  }

  async deleteLead(id: string): Promise<void> {
    // No-op
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    throw new Error("MemStorage CRM operations not implemented");
  }

  async getCampaigns(userId: string): Promise<Campaign[]> {
    return [];
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    return undefined;
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    throw new Error("MemStorage CRM operations not implemented");
  }

  async deleteCampaign(id: string): Promise<void> {
    // No-op
  }

  async createLeadActivity(activity: InsertLeadActivity): Promise<LeadActivity> {
    throw new Error("MemStorage CRM operations not implemented");
  }

  async getLeadActivities(leadId: string, limit?: number): Promise<LeadActivity[]> {
    return [];
  }
  
  // Voice session stubs
  async createVoiceSession(session: InsertVoiceSession): Promise<VoiceSession> {
    throw new Error("MemStorage voice session operations not implemented");
  }

  async updateVoiceSession(id: string, updates: Partial<VoiceSession>): Promise<VoiceSession> {
    throw new Error("MemStorage voice session operations not implemented");
  }

  async updateVoiceSessionByData(data: Partial<VoiceSession> & { userId: string; agentId: string }): Promise<void> {
    // No-op
  }

  async getVoiceSessions(userId: string, limit?: number): Promise<VoiceSession[]> {
    return [];
  }

  async getVoiceSessionById(id: string): Promise<VoiceSession | undefined> {
    return undefined;
  }
}

// Use DatabaseStorage for production persistence
export const storage = new DatabaseStorage();
