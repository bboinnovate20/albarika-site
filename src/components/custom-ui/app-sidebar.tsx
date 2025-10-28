import { Plus, Menu, X, LogOut } from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export function AppSideBar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const sideBarList = [
    { name: "Home", link: "/home" },
    { name: "WAEC Verification", link: "/exam-cards" },
  ]

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-900 text-white rounded-md"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 lg:w-64 bg-blue-900 text-white
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex-1 overflow-y-auto">
          <span className="bg-blue-900 w-full p-4 lg:p-3 block font-bold text-lg pt-16 lg:pt-3">
            Dashboard
          </span>
          <ul className="mt-6">
            {sideBarList.map((item, index) => {
              const isActive = pathname === `/admin${item.link}`
              return (
                <li key={index}>
                  <Link
                    href={`/admin${item.link}`}
                    onClick={closeSidebar}
                    className={`
                      block p-4 font-semibold transition-all tracking-wide 
                      hover:bg-blue-950 text-white
                      ${isActive ? "bg-blue-950 border-l-4 border-white" : ""}
                    `}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Logout button at bottom */}
               <div className="p-4 border-t border-blue-800">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 p-3 font-semibold 
                       transition-all tracking-wide hover:bg-blue-950 
                       text-white rounded-md bg-blue-800"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </form>
        </div>
      
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto p-6 pt-20 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  )
}