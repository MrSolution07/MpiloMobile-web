import { cn } from "../../lib";

export const Logo = ({ className }) => {
  return (
    <img
      // src="/assets/mpilo.svg"
      src="assets/images/mpiloLogo.png"
      loading="lazy"
      alt="Mpilo Mobile Logo"
      className={cn("inline-block align-middle", className)}
    />
  );
};
