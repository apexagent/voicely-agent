import { GoogleGenAI, Type } from "@google/genai";
import { logger } from "./utils/logger";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "",
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
  },
});

export interface BusinessInfo {
  businessName: string;
  industry: string;
  services: string[];
  hours: string;
  location: string;
  phone: string;
  email: string;
  description: string;
  uniqueSellingPoints: string[];
  commonQuestions: string[];
  bookingInfo: string;
  pricing: string;
}

export interface ExtendedBusinessInfo extends BusinessInfo {
  customerTerminology: string;
}

export interface WorkflowStep {
  step: string;
}

export interface AgenticWorkflow {
  title: string;
  steps: string[];
  color: string;
}

export interface GeneratedContent {
  businessInfo: ExtendedBusinessInfo;
  systemPrompt: string;
  greeting: string;
  coldEmail: string;
  workflows: AgenticWorkflow[];
  emailWorkflowsText: string;
  teamAmplificationPoints: string[];
  // Validation flags for frontend fallback logic
  hasValidWorkflows: boolean;
  hasValidColdEmail: boolean;
  hasValidSystemPrompt: boolean;
}

export async function analyzeWebsite(websiteContent: string, url: string): Promise<BusinessInfo> {
  const prompt = `Analyze this website content and extract business information for creating a customer service voice agent. Be thorough and extract as much useful information as possible.

Website URL: ${url}

Website Content:
${websiteContent.substring(0, 50000)}

Extract the following information in JSON format. If information is not available, make reasonable assumptions based on the business type:

{
  "businessName": "The name of the business",
  "industry": "The industry/type of business (e.g., Dental Practice, Restaurant, Spa, etc.)",
  "services": ["Array of services offered"],
  "hours": "Business hours (e.g., Mon-Fri 9am-5pm)",
  "location": "Business address or location",
  "phone": "Phone number",
  "email": "Email address",
  "description": "A brief description of the business and what they do",
  "uniqueSellingPoints": ["What makes this business special or different"],
  "commonQuestions": ["Common questions customers might ask"],
  "bookingInfo": "How customers can book appointments/services",
  "pricing": "Any pricing information available"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessName: { type: Type.STRING },
            industry: { type: Type.STRING },
            services: { type: Type.ARRAY, items: { type: Type.STRING } },
            hours: { type: Type.STRING },
            location: { type: Type.STRING },
            phone: { type: Type.STRING },
            email: { type: Type.STRING },
            description: { type: Type.STRING },
            uniqueSellingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            commonQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            bookingInfo: { type: Type.STRING },
            pricing: { type: Type.STRING },
          },
          required: ["businessName", "industry", "services", "description"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}") as BusinessInfo;
    logger.info("Website analysis complete", { businessName: result.businessName, industry: result.industry });
    return result;
  } catch (error) {
    logger.error("Gemini analysis failed", error);
    throw new Error("Failed to analyze website content");
  }
}

export async function generateFullPersonalizedContent(websiteContent: string, url: string): Promise<GeneratedContent> {
  const prompt = `Analyze this website and generate content for an AI voice agent. Generate a professional cold email following this EXACT format:

Website URL: ${url}

Website Content:
${websiteContent.substring(0, 55000)}

Generate JSON matching this structure. The coldEmail MUST follow this exact format:

---EMAIL FORMAT TO FOLLOW---

Subject: Custom AI Voice Agent Demo for [BUSINESS NAME]

Dear [Contact Name/Owner],

[PERSONALIZED OPENING - Use one of these based on what you find on their website:
- If you find recent news/awards: "Congratulations on [specific achievement/award/news]! I was impressed to see [BUSINESS NAME]..."
- If you find years in business: "With [X] years serving [LOCATION], [BUSINESS NAME] has clearly built something special..."
- If you find notable clients/projects: "I noticed [BUSINESS NAME]'s work with [notable client/project] - impressive..."
- If you find community involvement: "I saw [BUSINESS NAME]'s involvement in [community event/cause] - it's clear you care about..."
- If you find expansion/growth: "Congratulations on [new location/expansion/growth milestone]..."
- Default fallback: "I recently came across [BUSINESS NAME] while researching top [INDUSTRY] providers in [LOCATION]..."]

My name is Jay and I'm the Founder of VoicelyAgent.ai. I specialize in AI voice solutions for [INDUSTRY] businesses, and I have an idea that might interest you.


WHY I'M REACHING OUT TO [BUSINESS NAME]:

Consider: Every [INDUSTRY] call answered instantly, every [PRIMARY SERVICE] inquiry handled professionally, every appointment booked automatically - 24/7/365.

Studies show 85% of callers who can't reach a business won't call back - they call your competitor. For a [INDUSTRY] practice like yours, each missed call about [PRIMARY SERVICE] could mean significant lost revenue.


WHAT I'VE BUILT FOR [BUSINESS NAME]:

I created a custom AI voice agent trained specifically on your services:
- [Service 1], [Service 2], [Service 3], [Service 4]
- [Industry] industry knowledge and terminology
- Your specific business hours, location, and policies
- Natural conversation flow that matches your brand voice


COMPLEX AGENTIC WORKFLOWS BUILT FOR [BUSINESS NAME]:

WORKFLOW 1: New [Customer Type] Intake & Consultation Booking

When a prospective [customer type] calls about [Primary Service]:

→ AI verifies insurance/eligibility in real-time via API integration
→ Checks provider availability against service duration requirements
→ Books consultation with the appropriate specialist based on needs
→ Sends digital intake forms via secure portal link
→ Creates record in your CRM/practice management system
→ Triggers automated reminder sequence (48hr, 24hr, 2hr before appointment)
→ Notifies team via Slack/Teams with summary

WORKFLOW 2: Service Follow-Up & Care Coordination

When a [customer type] calls with post-service concerns:

→ AI pulls their recent service history from your system
→ Assesses concern severity using decision protocols
→ For minor concerns: Provides specific aftercare instructions
→ For urgent concerns: Immediately pages on-call staff with context
→ Schedules follow-up appointment if appropriate
→ Documents the entire interaction for compliance
→ Triggers satisfaction survey 48 hours later

WORKFLOW 3: Service Package Upsell & Revenue Optimization

When an existing [customer type] inquires about additional services:

→ AI reviews their complete service history and outcomes
→ Recommends complementary services based on their profile
→ Explains package pricing and available financing options
→ Collects deposit via secure PCI-compliant payment processing
→ Applies loyalty rewards and referral credits automatically
→ Schedules multi-session appointments
→ Sends personalized preparation instructions
→ Updates revenue forecast in your dashboard


WHY BUSINESSES LIKE [BUSINESS NAME] CHOOSE AI:

- Answer every call instantly, 24/7/365 - no more missed [Primary Service] opportunities
- Handle [Industry]-specific questions with expert knowledge
- Book appointments directly into your calendar system
- Free your team to focus on delivering exceptional [Service]

This isn't about replacing your team - it's about giving them superpowers. Your receptionist becomes a customer success manager. Your [Industry] experts focus on what they do best.


YOUR NEXT STEP:

I'm confident this will make a real difference for [BUSINESS NAME]. Would you be open to a brief call this week?

If you like what you see, we can have your custom AI agent live within 24-48 hours.

Looking forward to connecting,


P.S. - I genuinely believe this will transform how [BUSINESS NAME] handles customer communication. The demo I built is waiting for you.

---END EMAIL FORMAT---

JSON Structure:
{
  "businessInfo": {
    "businessName": "Business name",
    "industry": "Industry",
    "services": ["Services offered"],
    "hours": "Hours",
    "location": "Location",
    "phone": "Phone",
    "email": "Email",
    "description": "Description",
    "uniqueSellingPoints": ["USPs"],
    "commonQuestions": ["Questions"],
    "bookingInfo": "Booking info",
    "pricing": "Pricing",
    "customerTerminology": "patients/clients/customers/guests"
  },
  "systemPrompt": "HYPER-DETAILED system prompt following this EXACT structure:

You are [Agent Name], the AI voice receptionist for [BUSINESS NAME], a [INDUSTRY] business located in [LOCATION].

## BUSINESS IDENTITY
- **Business Name:** [Full business name]
- **Industry:** [Industry type]
- **Location:** [Full address]
- **Business Hours:** [Exact hours by day]
- **Phone:** [Phone number]
- **Email:** [Email address]

## OUR SERVICES
[List EVERY service mentioned on their website with brief descriptions]
- [Service 1]: [What it includes, typical duration, who it's for]
- [Service 2]: [What it includes, typical duration, who it's for]
- [Continue for ALL services...]

## PRICING & PACKAGES
[Include any pricing found, or say 'I can provide general information, but for exact pricing I recommend speaking with our team']
- [Pricing tier/package details if available]

## BOOKING & APPOINTMENTS
[Exact booking process, online booking options, cancellation policy]
- How to book: [Details]
- Cancellation policy: [Details]
- What to expect: [Pre-appointment preparation]

## UNIQUE VALUE PROPOSITION
Why choose [BUSINESS NAME]:
- [USP 1 with specific details]
- [USP 2 with specific details]
- [USP 3 with specific details]

## FREQUENTLY ASKED QUESTIONS
[Answer the top questions callers typically ask]
Q: [Question 1]
A: [Detailed answer with specific business info]
Q: [Question 2]
A: [Detailed answer with specific business info]
[Continue for 5-10 FAQs...]

## CONVERSATION GUIDELINES
1. Always be warm, professional, and helpful
2. Use [CUSTOMER TERMINOLOGY] when referring to people (patients/clients/customers/guests)
3. When asked about services, provide specific details from the business
4. For complex medical/legal/technical questions, recommend speaking with a specialist
5. Always offer to book an appointment or take a message
6. If unsure, say 'Let me connect you with our team for the most accurate information'

## CALL HANDLING PROTOCOLS
- New [customer] inquiries: Gather needs, explain relevant services, offer booking
- Existing [customer] calls: Verify identity, assist with their request
- Urgent matters: Take detailed message, ensure follow-up
- After-hours: Explain hours, offer voicemail or callback scheduling

Remember: You represent [BUSINESS NAME]. Be knowledgeable, helpful, and make every caller feel valued.",
  "greeting": "Greeting mentioning business name - keep it warm and professional, 1-2 sentences max",
  "coldEmail": "The FULL email following the format above with all placeholders filled in. CRITICAL: Include actual newline characters (\\n) between sections and paragraphs to preserve formatting. Each section header should be on its own line with blank lines before and after.",
  "workflows": [
    {"title": "Workflow 1 title", "steps": ["step1", "step2", ...], "color": "cyan"},
    {"title": "Workflow 2 title", "steps": ["step1", "step2", ...], "color": "purple"},
    {"title": "Workflow 3 title", "steps": ["step1", "step2", ...], "color": "green"}
  ],
  "emailWorkflowsText": "The 3 workflows formatted with → arrows as shown in email format. Include newline characters (\\n) to preserve formatting - each step should be on its own line.",
  "teamAmplificationPoints": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"]
}

Use appropriate terminology: patients (medical), clients (legal/professional), customers (retail), guests (hospitality).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessInfo: {
              type: Type.OBJECT,
              properties: {
                businessName: { type: Type.STRING },
                industry: { type: Type.STRING },
                services: { type: Type.ARRAY, items: { type: Type.STRING } },
                hours: { type: Type.STRING },
                location: { type: Type.STRING },
                phone: { type: Type.STRING },
                email: { type: Type.STRING },
                description: { type: Type.STRING },
                uniqueSellingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                commonQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                bookingInfo: { type: Type.STRING },
                pricing: { type: Type.STRING },
                customerTerminology: { type: Type.STRING },
              },
              required: ["businessName", "industry", "services", "description"],
            },
            systemPrompt: { type: Type.STRING },
            greeting: { type: Type.STRING },
            coldEmail: { type: Type.STRING },
            workflows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  color: { type: Type.STRING },
                },
                required: ["title", "steps", "color"],
              },
            },
            emailWorkflowsText: { type: Type.STRING },
            teamAmplificationPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["businessInfo", "systemPrompt", "greeting", "coldEmail", "workflows", "emailWorkflowsText", "teamAmplificationPoints"],
        },
      },
    });

    // Defensive parsing - handle potential JSON issues
    let rawText = response.text || "{}";
    
    // Strip markdown code fences if present
    rawText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    
    let result: GeneratedContent;
    try {
      result = JSON.parse(rawText) as GeneratedContent;
    } catch (parseError) {
      logger.error("Failed to parse Gemini JSON response", { error: parseError, rawText: rawText.substring(0, 500) });
      throw new Error("Failed to parse AI response");
    }
    
    // Validate required fields
    if (!result.businessInfo?.businessName || !result.businessInfo?.industry) {
      logger.error("Gemini response missing required businessInfo fields", { result });
      throw new Error("AI response missing required business information");
    }
    
    // Ensure arrays exist
    result.businessInfo.services = result.businessInfo.services || [];
    result.businessInfo.uniqueSellingPoints = result.businessInfo.uniqueSellingPoints || [];
    result.businessInfo.commonQuestions = result.businessInfo.commonQuestions || [];
    
    // Ensure string defaults
    result.businessInfo.hours = result.businessInfo.hours || "";
    result.businessInfo.location = result.businessInfo.location || "";
    result.businessInfo.phone = result.businessInfo.phone || "";
    result.businessInfo.email = result.businessInfo.email || "";
    result.businessInfo.description = result.businessInfo.description || "";
    result.businessInfo.bookingInfo = result.businessInfo.bookingInfo || "";
    result.businessInfo.pricing = result.businessInfo.pricing || "";
    result.businessInfo.customerTerminology = result.businessInfo.customerTerminology || "customer";
    
    // Ensure workflows is a valid array
    result.workflows = Array.isArray(result.workflows) ? result.workflows.filter(w => 
      w && typeof w.title === 'string' && Array.isArray(w.steps) && w.steps.length > 0
    ) : [];
    
    // Ensure content types are correct
    result.systemPrompt = (typeof result.systemPrompt === 'string') ? result.systemPrompt.trim() : "";
    result.greeting = (typeof result.greeting === 'string' && result.greeting.trim()) 
      ? result.greeting.trim() 
      : `Thank you for calling ${result.businessInfo.businessName}! How can I help you today?`;
    
    // Process cold email - ensure proper line breaks
    if (typeof result.coldEmail === 'string') {
      result.coldEmail = result.coldEmail
        .replace(/\\n/g, '\n')  // Convert escaped newlines to actual newlines
        .replace(/\n{3,}/g, '\n\n')  // Normalize multiple newlines
        .trim();
    } else {
      result.coldEmail = "";
    }
    
    // Process emailWorkflowsText - ensure proper line breaks
    if (typeof result.emailWorkflowsText === 'string') {
      result.emailWorkflowsText = result.emailWorkflowsText
        .replace(/\\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    } else {
      result.emailWorkflowsText = "";
    }
    
    // Validate teamAmplificationPoints
    if (Array.isArray(result.teamAmplificationPoints)) {
      result.teamAmplificationPoints = result.teamAmplificationPoints
        .filter(p => typeof p === 'string' && p.trim().length > 0)
        .map(p => p.trim());
    } else {
      result.teamAmplificationPoints = [];
    }
    
    // Validation flags for complex agentic workflows
    result.hasValidWorkflows = result.workflows.length >= 2 && 
      result.workflows.every(w => w.steps.length >= 5) && 
      result.emailWorkflowsText.length > 100;
    
    result.hasValidColdEmail = typeof result.coldEmail === 'string' && 
      result.coldEmail.length > 300;
    
    result.hasValidSystemPrompt = typeof result.systemPrompt === 'string' && 
      result.systemPrompt.length > 50;
    
    logger.info("Full personalized content generated", { 
      businessName: result.businessInfo.businessName, 
      workflowCount: result.workflows.length,
      emailLength: result.coldEmail.length,
      hasValidWorkflows: result.hasValidWorkflows,
      hasValidColdEmail: result.hasValidColdEmail,
      hasValidSystemPrompt: result.hasValidSystemPrompt,
    });
    
    return result;
  } catch (error) {
    logger.error("Gemini full content generation failed", error);
    throw new Error("Failed to generate personalized content");
  }
}

export function generateAgentSystemPrompt(businessInfo: BusinessInfo): string {
  const services = businessInfo.services || [];
  const uniqueSellingPoints = businessInfo.uniqueSellingPoints || [];
  const commonQuestions = businessInfo.commonQuestions || [];
  
  const servicesText = services.length > 0 
    ? services.join(", ") 
    : "various services";
  
  const uspText = uniqueSellingPoints.length > 0
    ? uniqueSellingPoints.join(". ")
    : "quality service and customer satisfaction";

  const faqText = commonQuestions.length > 0
    ? commonQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")
    : "General inquiries about services and booking";

  return `You are the AI voice receptionist for ${businessInfo.businessName}, a ${businessInfo.industry} business.

ABOUT THE BUSINESS:
${businessInfo.description}

SERVICES OFFERED:
${servicesText}

WHAT MAKES US SPECIAL:
${uspText}

BUSINESS INFORMATION:
- Hours: ${businessInfo.hours || "Please ask for current hours"}
- Location: ${businessInfo.location || "Please ask for location details"}
- Phone: ${businessInfo.phone || "Available upon request"}
- Email: ${businessInfo.email || "Available upon request"}
- Booking: ${businessInfo.bookingInfo || "We'd be happy to help you schedule an appointment"}
- Pricing: ${businessInfo.pricing || "Pricing varies by service - we can provide details"}

COMMON QUESTIONS CUSTOMERS ASK:
${faqText}

YOUR ROLE:
- Answer calls professionally and warmly as a representative of ${businessInfo.businessName}
- Help callers with questions about services, hours, location, and booking
- Take appointment requests and collect caller information (name, phone, email)
- Be helpful, friendly, and knowledgeable about the business
- If you don't know specific details, offer to have someone call them back

CONVERSATION STYLE:
- Be warm, professional, and conversational
- Keep responses concise (2-3 sentences max)
- Ask clarifying questions when needed
- Never say "I'm an AI" - just be a helpful receptionist
- Sound natural and friendly, not robotic

TOPIC CHANGES: When the caller switches topics, acknowledge naturally and address their new question immediately.

CONTACT COLLECTION:
Before ending any call, collect the caller's:
1. Full name
2. Phone number  
3. Email address
Then confirm: "Thank you! Someone from ${businessInfo.businessName} will follow up with you shortly."`;
}
