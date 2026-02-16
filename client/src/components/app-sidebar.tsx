import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import voicelyLogo from "@assets/Untitled design (11)_1762790672251.png";

export function AppSidebar() {
  return (
    <Sidebar 
      className="border-r bg-sidebar" 
      data-testid="sidebar-main"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3 px-2">
          <img 
            src={voicelyLogo} 
            alt="Voicely" 
            className="h-12 w-auto" 
            data-testid="img-voicely-logo"
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        {/* Sidebar content removed as requested */}
      </SidebarContent>
    </Sidebar>
  );
}
