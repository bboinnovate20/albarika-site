"use client";
import Link from "next/link";
import { useState } from "react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexProvider, ConvexReactClient, useConvexAuth } from "convex/react";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSideBar } from "@/components/custom-ui/app-sidebar"
import { ToastContainer, toast } from 'react-toastify';

// const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const address = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = new ConvexReactClient(address as string);

export default function AdminLayout({
  children
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
      <div>
        <ToastContainer />
        <AppSideBar>
            <main>
              {children}
            </main>
        </AppSideBar>

      </div>

    </ConvexProvider> 
  

    
  );
} 