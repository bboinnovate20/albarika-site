import React from 'react'

export default function AdminDashboard() {
  return (
    <div>AdminDashboard</div>
  )
}

// 'use client';
// import Link from "next/link";


// export default function AdminDashboard() {
//   // Get real data from Convex

//   const allStudent = [];
//   const receiptsCount = allReceipts?.length || 0;
//   const studentCount = allStudent?.length || 0;

//   const stats = [
//     {
//       title: "Total Students",
//       value: receiptsCount.toString(),
//       change: "+12%",
//       icon: "fas fa-graduation-cap",
//       color: "bg-blue-500"
//     },
//     // {
//     //   title: "Monthly Revenue",
//     //   value: "₦845,000",
//     //   change: "+8%",
//     //   icon: "fas fa-naira-sign",
//     //   color: "bg-green-500"
//     // },
//     // {
//     //   title: "Active Services",
//     //   value: "89",
//     //   change: "+23%",
//     //   icon: "fas fa-tools",
//     //   color: "bg-purple-500"
//     // },
//     {
//       title: "Receipts Generated",
//       value: receiptsCount.toString(),
//       change: "+15%",
//       icon: "fas fa-receipt",
//       color: "bg-orange-500"
//     }
//   ];

//   const recentActivities = [
//     { action: "New student enrollment", student: "Adebayo John", time: "2 minutes ago", icon: "fas fa-user-plus", color: "text-green-600" },
//     { action: "Receipt generated", student: "Sarah Mohammed", time: "15 minutes ago", icon: "fas fa-receipt", color: "text-blue-600" },
//     { action: "Service completed", student: "David Wilson", time: "1 hour ago", icon: "fas fa-check-circle", color: "text-purple-600" },
//     { action: "Payment received", student: "Fatima Hassan", time: "2 hours ago", icon: "fas fa-credit-card", color: "text-green-600" },
//   ];

//   return (
    
//       <div className="space-y-6">
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
//           <p className="text-gray-600 mt-2">Welcome back! Here's what's happening at Albarika Computer Centre today.</p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat, index) => (
//             <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
//                   <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  
//                 </div>
//                 <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
//                   <i className={`${stat.icon} text-white text-xl`}></i>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Quick Actions */}
//         <div className="grid lg:grid-cols-2 gap-6">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <Link
//                 href="/admin/receipts?type=student"
//                 className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
//               >
//                 <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
//                   <i className="fas fa-graduation-cap text-white"></i>
//                 </div>
//                 <span className="text-sm font-medium text-gray-900">Student Receipt</span>
//               </Link>
              
//               <Link
//                 href="/admin/receipts?type=customer"
//                 className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
//               >
//                 <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
//                   <i className="fas fa-receipt text-white"></i>
//                 </div>
//                 <span className="text-sm font-medium text-gray-900">Customer Receipt</span>
//               </Link>
              
//               <Link
//                 href="/admin/students"
//                 className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
//               >
//                 <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
//                   <i className="fas fa-users text-white"></i>
//                 </div>
//                 <span className="text-sm font-medium text-gray-900">Student Data</span>
//               </Link>

//               <Link
//                 href="/admin/receipts"
//                 className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group"
//               >
//                 <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
//                   <i className="fas fa-list text-white"></i>
//                 </div>
//                 <span className="text-sm font-medium text-gray-900">All Receipts</span>
//               </Link>
//             </div>
//           </div>

//           {/* Receipt Statistics */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Receipt Statistics</h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Total Receipts</span>
//                 <span className="text-2xl font-bold text-gray-900">{receiptsCount}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Student Receipts</span>
//                 <span className="text-lg font-semibold text-blue-600">
//                   {allReceipts?.filter(r => r.serviceType === 'training').length || 0}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Customer Receipts</span>
//                 <span className="text-lg font-semibold text-purple-600">
//                   {allReceipts?.filter(r => r.serviceType === 'service').length || 0}
//                 </span>
//               </div>
//               {receiptsCount > 0 && (
//                 <div className="pt-2 border-t">
//                   <div className="text-sm text-gray-500">
//                     Latest Receipt: {allReceipts?.[0]?.receiptNumber || 'N/A'}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
    
//   );
// } 