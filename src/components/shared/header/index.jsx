import { NAV_ITEMS } from "@/config";
import { cn } from "@/lib";
import { useEffect, useState } from "react";
import { AuthButtons } from "./AuthButtons";
import { NavigationLinks } from "./NavigationLinks";
import { Logo } from "../Logo";
import { Link } from "react-router-dom";
import {
  Button,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";
import { Menu, X } from "lucide-react";

const SCROLL_TRIGGER_OFFSET = 50;

export const Header = ({ className }) => {
  // const { user } = useAuth();
  // const role: Role = user?.role || "public";

  const [isScrolled, setIsScrolled] = useState(false);

  const navigationLinks = NAV_ITEMS["public"] || [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_TRIGGER_OFFSET);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={className}>
      <nav
        className={cn(
          "fixed z-20 w-full transition-colors duration-150",
          isScrolled && "bg-background/50  backdrop-blur"
        )}
      >
        <div className="mx-auto max-w-5xl px-6 transition-all duration-300">
          <div className="relative flex items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link to="/" className="flex items-center gap-2">
                <Logo className="size-8" />
                <span className="hidden sm:inline-block">Mpilo Mobile</span>
              </Link>

              <div className="hidden lg:block">
                <NavigationLinks items={navigationLinks} />
              </div>
            </div>

            {/* {!user && ( */}
            <div className="hidden lg:block">
              <AuthButtons />
            </div>
            {/* )} */}

            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-title="Open Navigation"
                  >
                    <Menu className="size-6" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-72">
                  <SheetHeader className="flex flex-row justify-between items-center border-b">
                    <SheetTitle className="text-lg">Menu</SheetTitle>
                    <SheetClose>
                      <X />
                    </SheetClose>
                  </SheetHeader>

                  <NavigationLinks
                    items={navigationLinks}
                    className="flex-col gap-3 px-4 text-xl"
                  />
                  {/* {!user && ( */}
                  <>
                    <Separator />
                    <AuthButtons className="px-4" />
                  </>
                  {/* )} */}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
