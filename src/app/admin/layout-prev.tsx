"use client";
import Link from "next/link";
import { useState } from "react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexProvider, ConvexReactClient, useConvexAuth } from "convex/react";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

// const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const address = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = new ConvexReactClient(address as string);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  


  const navigation = [
    { name: "Dashboard", href: "/admin", icon: "fas fa-home" },
    { name: "Student Receipt", href: "/admin/receipts?type=student", icon: "fas fa-graduation-cap" },
    { name: "Customer Receipt", href: "/admin/receipts?type=customer", icon: "fas fa-receipt" },
    { name: "All Receipts", href: "/admin/receipts", icon: "fas fa-list" },
    { name: "Student Data", href: "/admin/students", icon: "fas fa-users" },
    { name: "Analytics", href: "/admin/analytics", icon: "fas fa-chart-bar" },
    { name: "Settings", href: "/admin/settings", icon: "fas fa-cog" },
  ];

  return (

    <ConvexProvider client={convex}>

      
      <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 hover:text-gray-900 md:hidden"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-computer text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">Albarika Admin</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Welcome, Administrator
            </div>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <i className="fas fa-home mr-2"></i>
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-sm border-r border-gray-200 transition-all duration-300`}>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <i className={`${item.icon} text-lg`}></i>
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          
          {children}
        </main>
      </div>
    </div>
      
    
  </ConvexProvider>
  

    
  );
} 