import { BookOpen, Home, Inbox, LogOut, Menu, Settings2, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const sideBarList = [
  { name: "Home", link: "", icon: Home },
  { name: "Students", link: "/students", icon: Users },
  { name: "Courses", link: "/courses", icon: BookOpen },
  { name: "Messages", link: "/messages", icon: Inbox },
  { name: "Internal services", link: "/services", icon: Settings2 },
];

export function AppSideBar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        router.push("/auth/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F6F3] text-ink">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed left-4 top-4 z-50 grid size-10 place-items-center rounded-full bg-white text-ink shadow-sm lg:hidden"
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {isSidebarOpen && <div className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={closeSidebar} />}

      <nav
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-black/5 bg-[#F3F1EC] transition-transform duration-300 ease-out lg:static ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-4 pb-2 pt-16 lg:pt-5">
          <p className="font-admin text-lg leading-none text-ink">Albarika</p>
          <p className="mt-1 text-xs font-medium text-copy">Computer Institute</p>
        </div>
        <ul className="mt-4 flex-1 space-y-1 overflow-y-auto px-3">
          {sideBarList.map((item) => {
            const href = `/admin${item.link}`;
            const isActive = item.link === "" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                    isActive ? "bg-white text-ink shadow-sm" : "text-copy hover:bg-white/70"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <form onSubmit={handleLogout} className="border-t border-black/5 p-3">
          <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-copy hover:bg-white/70">
            <span className="grid size-8 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">AC</span>
            <span className="flex-1 text-left text-ink">Desk</span>
            <LogOut className="size-4" />
          </button>
        </form>
      </nav>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="overflow-y-auto px-4 py-16 sm:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
