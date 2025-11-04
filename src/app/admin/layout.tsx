"use client";
import { useState } from "react";
import { AppSideBar } from "@/components/custom-ui/app-sidebar"
import { ToastContainer, toast } from 'react-toastify';

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
      <div>
        <ToastContainer />
        <AppSideBar>
            <main>
              {children}
            </main>
        </AppSideBar>

      </div>
  );
} 