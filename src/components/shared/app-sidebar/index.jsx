import {
  Button,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui";
import { HelpCircle, PanelLeft, Search, Settings } from "lucide-react";
import { NavUser } from "./NavUser";
import { Logo } from "../Logo";
import { useState } from "react";
import { NAV_ITEMS } from "@/config";
import { NavGroup } from "./NavGroup";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircle,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
};

export const AppSidebar = () => {
  // const { user } = useAuth();
  // const role: Role = user?.role || "";
  const role = "patient";

  const { open, toggleSidebar } = useSidebar();
  const [isHovered, setIsHovered] = useState(false);

  const navigationLinks = NAV_ITEMS[role] || [];

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                if (!open) {
                  toggleSidebar();
                }
              }}
            >
              {!open && isHovered ? (
                <PanelLeft className="size-5" />
              ) : (
                <Logo className="size-7" />
              )}
            </Button>

            {open && (
              <Button size="icon" variant="ghost" onClick={toggleSidebar}>
                <PanelLeft className="size-5" />
              </Button>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup items={navigationLinks} />
        <NavGroup items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};
