import { Plus, Sidebar } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AppSideBar({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
  const sideBarList = [
    { name: "Home", link: "/home" },
    { name: "WAEC Verification", link: "/exam-cards" },
  ]

  return (
    <div className="flex h-full gap-0">
      <nav className="w-[18%] bg-blue-900 h-[100vh] text-white">
        <span className="bg-blue-900 w-full p-3 block font-bold">Dashboard</span>
        <ul className="mt-6">
          {sideBarList.map((item, index) => {
            const isActive = pathname === `/admin${item.link}`
            return (
            <li key={index}>
              <Link
                href={`/admin${item.link}`}
                className={`
                    block p-4 font-semibold transition-all tracking-wide hover:bg-blue-950 text-white
                    ${isActive ? "bg-blue-950" : ""}
                    `}
              >
                {item.name}
              </Link>
            </li>
          )}
          
          )}
        </ul>
      </nav>

      <main className="flex-1 max-h-[100vh] flex flex-col">
  
                <div className='overflow-y-scroll p-6 pt-0'>
                    {children}

            </div>
        </main>
    </div>
  )
}
