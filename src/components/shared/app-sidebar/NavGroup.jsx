import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui";
import { Link } from "react-router-dom";

export const NavGroup = ({ items, ...props }) => {
  return (
    <SidebarGroup {...props}>
      <SidebarMenu>
        {items.map(({ title, url, icon: Icon }) => (
          <SidebarMenuItem key={title}>
            <SidebarMenuButton tooltip={title} asChild>
              <Link to={url}>
                <Icon className="size-5" />
                <span>{title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
