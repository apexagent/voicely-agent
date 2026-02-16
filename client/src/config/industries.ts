import { 
  Building2, 
  Heart, 
  Home, 
  Sparkles, 
  Scale, 
  Car, 
  Shield, 
  UtensilsCrossed,
  Wrench,
  Users,
  TrendingUp,
  Dumbbell,
  ShoppingCart,
  Stethoscope,
  Hotel,
  Dog,
  GraduationCap,
  HardHat,
  Plane,
  Briefcase,
  Store,
  Camera,
  Music,
  Palette,
  Scissors,
  Coffee,
  Laptop,
  Truck,
  Baby,
  Church,
  type LucideIcon
} from "lucide-react";

export interface IndustryConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
  keywords: string[];
}

export const industries: IndustryConfig[] = [
  { id: "healthcare", name: "Healthcare", icon: Heart, color: "#ef4444", description: "Patient scheduling & support", keywords: ["medical", "health", "clinic", "hospital", "doctor", "physician", "nurse", "therapy", "mental health", "wellness"] },
  { id: "real-estate", name: "Real Estate", icon: Home, color: "#3b82f6", description: "Lead capture & showings", keywords: ["real estate", "property", "homes", "houses", "realtor", "realty", "broker", "listings", "apartments"] },
  { id: "spa-wellness", name: "Spa & Wellness", icon: Sparkles, color: "#ec4899", description: "Luxury booking experiences", keywords: ["spa", "wellness", "massage", "beauty", "skincare", "relaxation", "meditation", "yoga"] },
  { id: "legal", name: "Legal", icon: Scale, color: "#f59e0b", description: "Client intake & scheduling", keywords: ["law", "legal", "attorney", "lawyer", "firm", "court", "litigation", "counsel"] },
  { id: "automotive", name: "Automotive", icon: Car, color: "#f97316", description: "Service & sales appointments", keywords: ["auto", "car", "vehicle", "dealership", "mechanic", "repair", "tire", "oil", "automotive"] },
  { id: "insurance", name: "Insurance", icon: Shield, color: "#22c55e", description: "Quote requests & claims", keywords: ["insurance", "policy", "coverage", "claims", "life insurance", "auto insurance", "home insurance"] },
  { id: "restaurants", name: "Restaurants", icon: UtensilsCrossed, color: "#f43f5e", description: "Reservations & orders", keywords: ["restaurant", "food", "dining", "menu", "cafe", "bistro", "eatery", "cuisine", "catering"] },
  { id: "home-services", name: "Home Services", icon: Wrench, color: "#64748b", description: "Service booking & dispatch", keywords: ["plumbing", "electrical", "hvac", "repair", "handyman", "contractor", "renovation", "remodeling", "cleaning"] },
  { id: "hr-recruiting", name: "HR & Recruiting", icon: Users, color: "#6366f1", description: "Candidate screening", keywords: ["hr", "human resources", "recruiting", "staffing", "jobs", "careers", "hiring", "employment"] },
  { id: "financial", name: "Financial", icon: TrendingUp, color: "#10b981", description: "Account inquiries & support", keywords: ["finance", "financial", "bank", "investment", "accounting", "tax", "wealth", "advisory", "mortgage", "loans"] },
  { id: "fitness", name: "Fitness", icon: Dumbbell, color: "#a855f7", description: "Membership & class booking", keywords: ["gym", "fitness", "training", "workout", "exercise", "crossfit", "personal trainer", "sports"] },
  { id: "ecommerce", name: "E-commerce", icon: ShoppingCart, color: "#06b6d4", description: "Order support & tracking", keywords: ["shop", "store", "ecommerce", "online", "retail", "products", "buy", "sell", "marketplace"] },
  { id: "dental", name: "Dental", icon: Stethoscope, color: "#14b8a6", description: "Appointment scheduling", keywords: ["dental", "dentist", "teeth", "orthodontist", "oral", "smile"] },
  { id: "luxury-hotels", name: "Luxury Hotels", icon: Hotel, color: "#a855f7", description: "Concierge & reservations", keywords: ["hotel", "resort", "hospitality", "lodging", "accommodation", "vacation", "travel", "booking"] },
  { id: "veterinary", name: "Veterinary", icon: Dog, color: "#84cc16", description: "Pet care scheduling", keywords: ["vet", "veterinary", "pet", "animal", "dog", "cat", "clinic", "grooming"] },
  { id: "education", name: "Education", icon: GraduationCap, color: "#0ea5e9", description: "Enrollment & inquiries", keywords: ["school", "education", "university", "college", "learning", "tutoring", "academy", "courses", "training"] },
  { id: "construction", name: "Construction", icon: HardHat, color: "#eab308", description: "Project coordination", keywords: ["construction", "building", "contractor", "architect", "engineering", "development"] },
  { id: "property-management", name: "Property Mgmt", icon: Building2, color: "#8b5cf6", description: "Tenant services", keywords: ["property management", "landlord", "tenant", "rental", "lease", "apartment", "complex"] },
  { id: "travel", name: "Travel", icon: Plane, color: "#f472b6", description: "Booking & support", keywords: ["travel", "vacation", "tour", "trip", "flight", "cruise", "adventure"] },
  { id: "salon", name: "Salon & Beauty", icon: Scissors, color: "#db2777", description: "Appointment booking", keywords: ["salon", "hair", "beauty", "barber", "nails", "makeup", "stylist"] },
  { id: "photography", name: "Photography", icon: Camera, color: "#7c3aed", description: "Session booking", keywords: ["photo", "photography", "photographer", "wedding", "portrait", "studio"] },
  { id: "tech", name: "Technology", icon: Laptop, color: "#3b82f6", description: "IT support & sales", keywords: ["tech", "software", "IT", "computer", "digital", "app", "saas", "startup"] },
  { id: "logistics", name: "Logistics", icon: Truck, color: "#78716c", description: "Shipping & tracking", keywords: ["shipping", "delivery", "logistics", "freight", "warehouse", "distribution", "supply chain"] },
  { id: "childcare", name: "Childcare", icon: Baby, color: "#fbbf24", description: "Enrollment & scheduling", keywords: ["daycare", "childcare", "preschool", "nursery", "kids", "children", "babysitter"] },
  { id: "religious", name: "Religious", icon: Church, color: "#a78bfa", description: "Community services", keywords: ["church", "temple", "mosque", "religious", "faith", "worship", "ministry"] },
  { id: "coffee", name: "Coffee & Cafe", icon: Coffee, color: "#92400e", description: "Orders & catering", keywords: ["coffee", "cafe", "espresso", "bakery", "tea"] },
  { id: "arts", name: "Arts & Creative", icon: Palette, color: "#e11d48", description: "Commission & booking", keywords: ["art", "gallery", "creative", "design", "artist", "museum"] },
  { id: "entertainment", name: "Entertainment", icon: Music, color: "#c026d3", description: "Event booking", keywords: ["entertainment", "music", "concert", "event", "venue", "theater", "show"] },
  { id: "retail", name: "Retail", icon: Store, color: "#059669", description: "Customer support", keywords: ["store", "retail", "boutique", "shop", "merchandise"] },
  { id: "professional", name: "Professional", icon: Briefcase, color: "#475569", description: "Business services", keywords: ["consulting", "professional", "business", "corporate", "agency", "services"] },
];

export function findIndustryByName(industryName: string): IndustryConfig {
  const lowerName = industryName.toLowerCase();
  
  // Exact match on name or id
  const exactMatch = industries.find(ind => 
    ind.name.toLowerCase() === lowerName || 
    ind.id === lowerName.replace(/\s+/g, '-')
  );
  if (exactMatch) return exactMatch;
  
  // Word boundary matching to avoid "care" matching "car"
  // Split industry name into words and check if any keyword matches a whole word
  const words = lowerName.split(/\s+/);
  
  const keywordMatch = industries.find(ind =>
    ind.keywords.some(keyword => {
      // Check if keyword is a whole word in the industry name
      const keywordWords = keyword.split(/\s+/);
      // For multi-word keywords, check if the phrase exists
      if (keywordWords.length > 1) {
        return lowerName.includes(keyword);
      }
      // For single-word keywords, check exact word match
      return words.some(word => word === keyword || word.startsWith(keyword + 's') || word.startsWith(keyword + 'ing'));
    })
  );
  if (keywordMatch) return keywordMatch;
  
  // Check if industry name contains the category name
  const partialMatch = industries.find(ind => {
    const indName = ind.name.toLowerCase();
    // Use word boundary check
    return words.some(word => word === indName || indName.includes(word) && word.length > 3);
  });
  if (partialMatch) return partialMatch;
  
  return { 
    id: "professional", 
    name: industryName || "Professional Services", 
    icon: Briefcase, 
    color: "#8b5cf6", 
    description: "Business services",
    keywords: []
  };
}
