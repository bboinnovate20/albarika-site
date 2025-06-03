"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../layout";
import { useSearchParams } from "next/navigation";

export default function ReceiptsPage() {
  const searchParams = useSearchParams();
  const receiptType = searchParams?.get('type') || 'student';
  
  const [activeTab, setActiveTab] = useState("generate");
  const [currentReceiptType, setCurrentReceiptType] = useState(receiptType);
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    service: "",
    amount: "",
    paymentMethod: "cash",
    description: "",
    studentId: "",
    program: ""
  });

  useEffect(() => {
    setCurrentReceiptType(receiptType);
  }, [receiptType]);

  // Sample receipt transactions
  const receipts = [
    {
      id: "RCP-001",
      type: "Student",
      customerName: "Adebayo John",
      service: "Programming Class",
      amount: "₦100,000",
      date: "2024-12-22",
      time: "10:30 AM",
      paymentMethod: "Bank Transfer",
      status: "Paid"
    },
    {
      id: "RCP-002",
      type: "Customer",
      customerName: "Sarah Mohammed",
      service: "Document Typing",
      amount: "₦5,000",
      date: "2024-12-22",
      time: "09:15 AM",
      paymentMethod: "Cash",
      status: "Paid"
    },
    {
      id: "RCP-003",
      type: "Student",
      customerName: "David Wilson",
      service: "Desktop Publishing",
      amount: "₦60,000",
      date: "2024-12-21",
      time: "02:45 PM",
      paymentMethod: "POS",
      status: "Paid"
    },
    {
      id: "RCP-004",
      type: "Customer",
      customerName: "Fatima Hassan",
      service: "Computer Maintenance",
      amount: "₦15,000",
      date: "2024-12-21",
      time: "11:20 AM",
      paymentMethod: "Bank Transfer",
      status: "Paid"
    },
    {
      id: "RCP-005",
      type: "Customer",
      customerName: "Michael Okafor",
      service: "JAMB Registration",
      amount: "₦7,000",
      date: "2024-12-20",
      time: "04:10 PM",
      paymentMethod: "Cash",
      status: "Paid"
    }
  ];

  const studentServices = [
    { value: "programming-class", label: "Programming Class - ₦100,000" },
    { value: "desktop-publishing-3m", label: "Desktop Publishing (3 months) - ₦30,000" },
    { value: "desktop-publishing-6m", label: "Desktop Publishing (6 months) - ₦60,000" }
  ];

  const customerServices = [
    { value: "document-typing", label: "Document Typing - Custom Price" },
    { value: "scanning", label: "Scanning Services - Custom Price" },
    { value: "photocopying", label: "Photocopying - Custom Price" },
    { value: "laminating", label: "Laminating Services - Custom Price" },
    { value: "jamb-registration", label: "JAMB Registration - ₦7,000" },
    { value: "waec-registration", label: "WAEC Registration - Custom Price" },
    { value: "computer-maintenance", label: "Computer Maintenance - Custom Price" },
    { value: "data-entry", label: "Data Entry Services - Custom Price" },
    { value: "project-creation", label: "Project Creation - Custom Price" }
  ];

  const services = currentReceiptType === 'student' ? studentServices : customerServices;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Generating receipt:", formData);
    alert("Receipt generated successfully!");
    
    // Reset form
    setFormData({
      customerName: "",
      email: "",
      phone: "",
      service: "",
      amount: "",
      paymentMethod: "cash",
      description: "",
      studentId: "",
      program: ""
    });
  };

  return (
    
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receipt Management</h1>
          <p className="text-gray-600 mt-2">Generate new receipts and manage transaction records</p>
        </div>

        {/* Receipt Type Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Receipt Type</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentReceiptType('student')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentReceiptType === 'student'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-graduation-cap mr-2"></i>
              Student Receipt
            </button>
            <button
              onClick={() => setCurrentReceiptType('customer')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentReceiptType === 'customer'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-receipt mr-2"></i>
              Customer Receipt
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("generate")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "generate"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className="fas fa-plus mr-2"></i>
              Generate {currentReceiptType === 'student' ? 'Student' : 'Customer'} Receipt
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "transactions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className="fas fa-list mr-2"></i>
              All Receipt Transactions
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "generate" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Generate New {currentReceiptType === 'student' ? 'Student' : 'Customer'} Receipt
              </h2>
              <p className="text-gray-600 mt-1">
                Fill in the details to create a {currentReceiptType} payment receipt
              </p>
            </div>
            
            <form onSubmit={handleGenerateReceipt} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentReceiptType === 'student' ? 'Student Name' : 'Customer Name'} *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter ${currentReceiptType} full name`}
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="customer@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="08012345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentReceiptType === 'student' ? 'Training Program' : 'Service/Product'} *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a {currentReceiptType === 'student' ? 'program' : 'service'}</option>
                    {services.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₦) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="pos">POS</option>
                    <option value="mobile-money">Mobile Money</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description/Notes
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes or service details..."
                ></textarea>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <i className="fas fa-receipt mr-2"></i>
                  Generate Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({
                    customerName: "",
                    email: "",
                    phone: "",
                    service: "",
                    amount: "",
                    paymentMethod: "cash",
                    description: "",
                    studentId: "",
                    program: ""
                  })}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <i className="fas fa-eraser mr-2"></i>
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Receipt Transactions</h2>
                  <p className="text-gray-600 mt-1">List of all generated receipts and payment records</p>
                </div>
                <div className="text-sm text-gray-500">
                  Total: {receipts.length} receipts
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer/Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service/Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {receipts.map((receipt) => (
                    <tr key={receipt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{receipt.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          receipt.type === 'Student' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {receipt.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{receipt.customerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{receipt.service}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{receipt.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{receipt.date}</div>
                        <div className="text-xs text-gray-500">{receipt.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{receipt.paymentMethod}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {receipt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <i className="fas fa-download"></i>
                        </button>
                        <button className="text-purple-600 hover:text-purple-900">
                          <i className="fas fa-print"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    
  );
} 