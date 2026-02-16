import { TrendingUp, Phone, Headphones, UserPlus, Clock } from "lucide-react";
import sarahPortrait from "@assets/c0001dae-d4fe-4559-964d-817e77c4df0f_1762597948605.png";
import emmaPortrait from "@assets/6d2e3129-7027-46ab-a628-de3766dedf07_1763287429962.png";
import alicePortrait from "@assets/b47fb970-cdb6-40cc-937b-3c9239ba0648_1763286130384.png";
import mayaPortrait from "@assets/77912688-291a-4713-b923-54cec485ff01_1762607585723.png";
import salesDesktopImg from "@assets/c0001dae-d4fe-4559-964d-817e77c4df0f_1762597948605.png";
import receptionistDesktopImg from "@assets/aa1480ea-8053-463a-8f86-76ea178856f8_min_1762598373068.webp";
import appointmentDesktopImg from "@assets/77912688-291a-4713-b923-54cec485ff01_1762597948605.png";
import followupDesktopImg from "@assets/c6a83411-9447-410d-bda5-46daa0aa23f9_1762597948605.png";
import sarahVideo from "@assets/media (3)_1763217316569.mp4";
import emmaVideo from "@assets/98e47d38-5d04-4b20-b6af-b04ad653be40_1763287410229.mp4";
import mayaVideo from "@assets/media (5)_1763282840689.mp4";
import aliceVideo from "@assets/5d034abd-46cd-4a72-96b1-8ea39d46c2d2_1763287049942.mp4";

export interface AgentDemoConfig {
  id: string;
  name: string;
  role: string;
  description: string;
  agentId: string;
  voiceId: string;
  portrait: string;
  desktopImage?: string;
  video?: string;
  scenario: string;
  icon: any;
  color: string;
  gradient: string;
  glowColor?: string;
}

export const AGENT_DEMO_CONFIGS: AgentDemoConfig[] = [
  {
    id: "support",
    name: "Alice",
    role: "Support Agent",
    description: "Expert troubleshooting",
    agentId: "demo-support-agent",
    voiceId: "cgSgspJ2msm6clMCkdW9", // Jessica voice
    portrait: alicePortrait,
    desktopImage: alicePortrait,
    video: aliceVideo,
    scenario: "Technical support",
    icon: Headphones,
    color: "from-blue-600 to-cyan-600",
    gradient: "from-blue-500 to-cyan-500",
    glowColor: "rgba(6,182,212,0.6)",
  },
  {
    id: "sales",
    name: "Sarah",
    role: "Sales Agent",
    description: "Closes deals automatically",
    agentId: "demo-sales-agent",
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah
    portrait: sarahPortrait,
    desktopImage: salesDesktopImg,
    video: sarahVideo,
    scenario: "Qualifying inbound lead",
    icon: TrendingUp,
    color: "from-purple-600 to-violet-600",
    gradient: "from-cyan-500 to-blue-500",
    glowColor: "rgba(6,182,212,0.6)",
  },
  {
    id: "receptionist",
    name: "Emma",
    role: "Receptionist",
    description: "Professional call routing",
    agentId: "demo-receptionist-agent",
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Bella
    portrait: emmaPortrait,
    desktopImage: receptionistDesktopImg,
    video: emmaVideo,
    scenario: "Routing customer inquiry",
    icon: Phone,
    color: "from-cyan-600 to-blue-600",
    gradient: "from-purple-500 to-violet-500",
    glowColor: "rgba(139,92,246,0.6)",
  },
  {
    id: "appointment",
    name: "Maya",
    role: "Appointment Agent",
    description: "Books & manages schedules",
    agentId: "demo-followup-agent",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    portrait: mayaPortrait,
    desktopImage: appointmentDesktopImg,
    video: mayaVideo,
    scenario: "Booking consultation",
    icon: Clock,
    color: "from-violet-600 to-purple-600",
    gradient: "from-violet-500 to-purple-500",
    glowColor: "rgba(167,139,250,0.6)",
  },
];
