import { Button } from "@/components/ui";
import { cn } from "@/lib";
import { Link } from "react-router-dom";

export const NavigationLinks = ({ items, className, withIcons = false }) => (
  <ul className={cn("flex gap-2 text-sm", className)}>
    {items.map(({ title, url, icon: Icon }) => (
      <li key={title}>
        <Button variant="link" asChild>
          <Link to={url} className="flex items-center gap-2">
            {withIcons && <Icon className="size-5" />}
            {title}
          </Link>
        </Button>
      </li>
    ))}
  </ul>
);
