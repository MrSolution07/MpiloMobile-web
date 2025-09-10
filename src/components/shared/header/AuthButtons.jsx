import { cn } from "@/lib";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui";

export const AuthButtons = ({ className }) => (
  <div
    className={cn(
      "flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit",
      className
    )}
  >
    <Button variant="outline" size="lg" asChild>
      <Link to="/contact">Contact Us</Link>
    </Button>
    <Button size="lg" asChild>
      <Link to="/register">Get Started</Link>
    </Button>
  </div>
);
