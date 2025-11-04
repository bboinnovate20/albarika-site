import React from 'react'

export default function StudentDetailsPopup() {
  return (
    <div>StudentDetailsPopup</div>
  )
}


// 'use client';
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// interface StudentDetailsPopupProps {
//   isOpen: boolean;
//   onClose: () => void;
//   student: any;
// }

// export default function StudentDetailsPopup({
//   isOpen,
//   onClose,
//   student
// }: StudentDetailsPopupProps) {
//   const [activeTab, setActiveTab] = useState("info");
//   const router = useRouter();

//   // Fetch receipts for this student
//   const receipts = [];
//   const formatDate = (timestamp: number | undefined) => {
//     if (!timestamp) return "N/A";
//     return new Date(timestamp).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric"
//     });
//   };

//   const formatDateTime = (timestamp: number | undefined) => {
//     if (!timestamp) return "N/A";
//     return new Date(timestamp).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit"
//     });
//   };

//   const calculateProgress = (enrollmentDate: number | undefined, endDate: number | undefined) => {
//     if (!enrollmentDate || !endDate) return 0;
    
//     const now = Date.now();
//     const totalDuration = endDate - enrollmentDate;
//     const elapsed = now - enrollmentDate;
    
//     if (elapsed <= 0) return 0;
//     if (elapsed >= totalDuration) return 100;
    
//     return Math.round((elapsed / totalDuration) * 100);
//   };

//   const totalPaid = receipts.reduce((sum: number, receipt: any) => sum + (receipt.amount || 0), 0);
//   const progress = student ? calculateProgress(student.enrollmentDate, student.endDate) : 0;

//   const handleAddPayment = () => {
//     if (student && student.studentId) {
//       // Navigate to receipts page with student ID and type
//       router.push(`/admin/receipts?type=student&studentId=${student.studentId}`);
//       onClose(); // Close the popup
//     }
//   };

//   const handleDownloadForm = () => {
//     // Create a downloadable student form
//     const formData = {
//       studentId: student.studentId,
//       name: student.name,
//       email: student.email || "Not provided",
//       phone: student.phone || "Not provided",
//       program: student.program,
//       programDuration: student.programDuration,
//       enrollmentDate: formatDate(student.enrollmentDate),
//       endDate: formatDate(student.endDate),
//       status: student.status,
//       guardianName: student.guardianName || "Not provided",
//       guardianPhone: student.guardianPhoneNumber || "Not provided",
//       address: student.address || "Not provided",
//       dateOfBirth: formatDate(student.dateOfBirth),
//       gender: student.gender || "Not specified"
//     };

//     const formContent = `
// ALBARIKA COMPUTER CENTRE
// STUDENT REGISTRATION FORM
// ========================================

// Student Information:
// - Student ID: ${formData.studentId}
// - Full Name: ${formData.name}
// - Email: ${formData.email}
// - Phone: ${formData.phone}
// - Date of Birth: ${formData.dateOfBirth}
// - Gender: ${formData.gender}
// - Address: ${formData.address}

// Program Information:
// - Program: ${formData.program}
// - Duration: ${formData.programDuration}
// - Enrollment Date: ${formData.enrollmentDate}
// - Expected End Date: ${formData.endDate}
// - Current Status: ${formData.status}

// Guardian/Emergency Contact:
// - Guardian Name: ${formData.guardianName}
// - Guardian Phone: ${formData.guardianPhone}

// Generated on: ${new Date().toLocaleString()}
//     `.trim();

//     const blob = new Blob([formContent], { type: 'text/plain' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${student.studentId}_registration_form.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   };

//   const handleDownloadId = () => {
//     // Create a downloadable student ID card content
//     const idContent = `
// ALBARIKA COMPUTER CENTRE
// STUDENT IDENTIFICATION CARD
// ========================================

// ${student.name}
// Student ID: ${student.studentId}
// Program: ${student.program}
// Status: ${student.status}

// Enrolled: ${formatDate(student.enrollmentDate)}
// Valid Until: ${formatDate(student.endDate)}

// Phone: ${student.phone || "Not provided"}
// Email: ${student.email || "Not provided"}

// ========================================
// This serves as official identification for
// ${student.name} as a registered student
// at Albarika Computer Centre.

// Issued: ${new Date().toLocaleString()}
//     `.trim();

//     const blob = new Blob([idContent], { type: 'text/plain' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${student.studentId}_student_id.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   };

//   if (!isOpen || !student) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
//                 <i className="fas fa-user-graduate text-2xl"></i>
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold">{student.name}</h2>
//                 <p className="text-blue-100">Student ID: {student.studentId}</p>
//                 <p className="text-blue-100 text-sm">{student.program}</p>
//               </div>
//             </div>
//             <button 
//               onClick={onClose}
//               className="text-white hover:text-blue-200 transition-colors p-2"
//             >
//               <i className="fas fa-times text-xl"></i>
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="border-b border-gray-200">
//           <nav className="flex">
//             <button
//               onClick={() => setActiveTab("info")}
//               className={`px-6 py-3 text-sm font-medium ${
//                 activeTab === "info"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               <i className="fas fa-user mr-2"></i>
//               Student Information
//             </button>
//             <button
//               onClick={() => setActiveTab("receipts")}
//               className={`px-6 py-3 text-sm font-medium ${
//                 activeTab === "receipts"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               <i className="fas fa-receipt mr-2"></i>
//               Payment History ({receipts.length})
//             </button>
//             <button
//               onClick={() => setActiveTab("progress")}
//               className={`px-6 py-3 text-sm font-medium ${
//                 activeTab === "progress"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               <i className="fas fa-chart-line mr-2"></i>
//               Progress & Status
//             </button>
//           </nav>
//         </div>

//         {/* Content */}
//         <div className="p-6 max-h-[60vh] overflow-y-auto">
//           {activeTab === "info" && (
//             <div className="space-y-6">
//               {/* Personal Information */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                   <i className="fas fa-user mr-2 text-blue-600"></i>
//                   Personal Information
//                 </h3>
//                 <div className="grid md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
//                   <div>
//                     <span className="text-sm text-gray-600">Full Name:</span>
//                     <p className="font-medium">{student.name}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-gray-600">Gender:</span>
//                     <p className="font-medium">{student.gender || "Not specified"}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-gray-600">Email:</span>
//                     <p className="font-medium">{student.email || "Not provided"}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-gray-600">Phone:</span>
//                     <p className="font-medium">{student.phone || "Not provided"}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-gray-600">Date of Birth:</span>
//                     <p className="font-medium">{formatDate(student.dateOfBirth)}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-gray-600">Status:</span>
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       student.status === "Active" ? "bg-green-100 text-green-800" :
//                       student.status === "Completed" ? "bg-blue-100 text-blue-800" :
//                       student.status === "Suspended" ? "bg-red-100 text-red-800" :
//                       "bg-gray-100 text-gray-800"
//                     }`}>
//                       {student.status}
//                     </span>
//                   </div>
//                   <div className="md:col-span-2">
//                     <span className="text-sm text-gray-600">Address:</span>
//                     <p className="font-medium">{student.address || "Not provided"}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Guardian Information */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                   <i className="fas fa-users mr-2 text-purple-600"></i>
//                   Guardian/Emergency Contact
//                 </h3>
//                 <div className="grid md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
//                   <div>
//                     <span className="text-sm text-gray-600">Guardian Name:</span>
//                     <p className="font-medium">{student.guardianName || "Not provided"}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-gray-600">Guardian Phone:</span>
//                     <p className="font-medium">{student.guardianPhoneNumber || "Not provided"}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-gray-600">Relationship:</span>
//                     <p className="font-medium">{student.guardianRelationship || "Not specified"}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-gray-600">Guardian Email:</span>
//                     <p className="font-medium">{student.guardianEmail || "Not provided"}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Academic Information */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                   <i className="fas fa-graduation-cap mr-2 text-green-600"></i>
//                   Academic Information
//                 </h3>
//                 <div className="bg-gray-50 rounded-lg p-4 space-y-3">
//                   <div>
//                     <span className="text-sm text-gray-600">Previous Education:</span>
//                     <p className="font-medium">{student.previousEducation || "Not specified"}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-gray-600">Notes:</span>
//                     <p className="font-medium">{student.notes || "No additional notes"}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "receipts" && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                   <i className="fas fa-receipt mr-2 text-green-600"></i>
//                   Payment History
//                 </h3>
//                 <div className="text-right">
//                   <p className="text-sm text-gray-600">Total Paid</p>
//                   <p className="text-2xl font-bold text-green-600">₦{totalPaid.toLocaleString()}</p>
//                 </div>
//               </div>

//               {receipts.length === 0 ? (
//                 <div className="text-center py-8">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <i className="fas fa-receipt text-gray-400 text-xl"></i>
//                   </div>
//                   <p className="text-gray-500">No payment records found</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {receipts.map((receipt: any, index: number) => (
//                     <div key={receipt._id || index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
//                             <i className="fas fa-check text-green-600"></i>
//                           </div>
//                           <div>
//                             <p className="font-semibold text-gray-900">₦{receipt.amount?.toLocaleString()}</p>
//                             <p className="text-sm text-gray-600">{receipt.serviceType}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-sm font-medium text-gray-900">{receipt.receiptNumber}</p>
//                           <p className="text-xs text-gray-500">{formatDateTime(receipt.createdAt)}</p>
//                           <p className="text-xs text-blue-600">{receipt.paymentMethod}</p>
//                         </div>
//                       </div>
//                       {receipt.notes && (
//                         <p className="text-sm text-gray-600 mt-2 pl-13">{receipt.notes}</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === "progress" && (
//             <div className="space-y-6">
//               {/* Program Progress */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                   <i className="fas fa-chart-line mr-2 text-orange-600"></i>
//                   Program Progress
//                 </h3>
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium text-gray-700">Overall Progress</span>
//                     <span className="text-sm font-bold text-gray-900">{progress}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-3">
//                     <div
//                       className={`h-3 rounded-full transition-all duration-300 ${
//                         progress >= 80 ? 'bg-green-500' : 
//                         progress >= 60 ? 'bg-yellow-500' : 
//                         progress >= 40 ? 'bg-orange-500' : 'bg-red-500'
//                       }`}
//                       style={{ width: `${Math.min(progress, 100)}%` }}
//                     ></div>
//                   </div>
//                   <div className="grid md:grid-cols-2 gap-4 mt-4">
//                     <div>
//                       <span className="text-sm text-gray-600">Program:</span>
//                       <p className="font-medium">{student.program}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-600">Duration:</span>
//                       <p className="font-medium">{student.programDuration}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-600">Start Date:</span>
//                       <p className="font-medium">{formatDate(student.enrollmentDate)}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-600">Expected End:</span>
//                       <p className="font-medium">{formatDate(student.endDate)}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Registration Details */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                   <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
//                   Registration Details
//                 </h3>
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <span className="text-sm text-gray-600">Registered On:</span>
//                       <p className="font-medium">{formatDateTime(student.createdAt)}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-600">Last Updated:</span>
//                       <p className="font-medium">{formatDateTime(student.updatedAt)}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="bg-gray-50 px-6 py-4">
//           <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3">
//             {/* Left side - Close button */}
//             <button
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors order-last sm:order-first"
//             >
//               <i className="fas fa-times mr-2"></i>
//               Close
//             </button>
            
//             {/* Right side - Action buttons */}
//             <div className="flex flex-wrap justify-center sm:justify-end gap-2">
//               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                 <i className="fas fa-edit mr-2"></i>
//                 Edit Student
//               </button>
//               <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={handleAddPayment}>
//                 <i className="fas fa-credit-card mr-2"></i>
//                 Add Payment
//               </button>
//               <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors" onClick={handleDownloadForm}>
//                 <i className="fas fa-file-download mr-2"></i>
//                 Download Form
//               </button>
//               <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors" onClick={handleDownloadId}>
//                 <i className="fas fa-id-card mr-2"></i>
//                 Download ID
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// } 