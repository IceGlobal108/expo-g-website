import { NavLink } from "react-router-dom";
import { adminNavLinks } from "@/data/admin";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

type AdminNavItem = { name: string; href: string };

interface AdminNavbarProps {
  items?: AdminNavItem[];
}

/**
 * Dedicated admin top navigation bar (full-width, solid background) to keep the CMS
 * separate from the marketing floating navbar.
 */
const AdminNavbar = ({ items = adminNavLinks }: AdminNavbarProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16">
        <NavLink to="/admin" className="flex items-center gap-2 font-display text-xl font-semibold">
          <span className="rounded-md bg-primary/15 px-2 py-1 text-primary text-sm uppercase tracking-[0.18em]">
            Admin
          </span>
          <span>Control Center</span>
        </NavLink>
        <nav className="hidden md:flex items-center gap-2">
          {items.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-lg text-sm transition-colors border border-transparent",
                  isActive
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "text-muted-foreground hover:text-primary hover:border-primary/20"
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
