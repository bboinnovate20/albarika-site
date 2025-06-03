"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../layout";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ReceiptDownload from "../../../components/ReceiptDownload";

// Define types for better TypeScript support
interface ConvexReceipt {
  _id: string;
  receiptNumber: string;
  serviceType: string;
  studentName: string;
  programName: string;
  amount: number;
  receiptDate: number;
  paymentMethod?: string;
  studentEmail?: string;
  studentPhone?: string;
  notes?: string;
}

interface DisplayReceipt {
  id: string;
  type: string;
  customerName: string;
  service: string;
  amount: string;
  date: string;
  time: string;
  paymentMethod: string;
  status: string;
}

export default function ReceiptsPage() {
  const searchParams = useSearchParams();
  const receiptType = searchParams?.get('type') || 'student';
  
  const [activeTab, setActiveTab] = useState("generate");
  const [currentReceiptType, setCurrentReceiptType] = useState(receiptType);
  const [isLoading, setIsLoading] = useState(false);
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

  // Convex hooks
  const createReceipt = useMutation(api.receipts.createReceipt);
  const generateReceiptNumber = useQuery(api.receipts.generateReceiptNumber);
  const allReceipts = useQuery(api.receipts.getAllReceipts);

  useEffect(() => {
    setCurrentReceiptType(receiptType);
  }, [receiptType]);

  // Convert Convex receipts to display format
  const receipts: DisplayReceipt[] = allReceipts?.map((receipt: ConvexReceipt) => ({
    id: receipt.receiptNumber,
    type: receipt.serviceType === 'training' ? 'Student' : 'Customer',
    customerName: receipt.studentName,
    service: receipt.programName,
    amount: `₦${receipt.amount.toLocaleString()}`,
    date: new Date(receipt.receiptDate).toLocaleDateString(),
    time: new Date(receipt.receiptDate).toLocaleTimeString(),
    paymentMethod: receipt.paymentMethod || 'Cash',
    status: "Paid"
  })) || [];

  // Convert to ReceiptDownload format
  const convertToReceiptData = (receipt: ConvexReceipt) => ({
    _id: receipt._id,
    studentName: receipt.studentName,
    studentEmail: receipt.studentEmail,
    studentPhone: receipt.studentPhone,
    receiptNumber: receipt.receiptNumber,
    amount: receipt.amount,
    currency: "NGN",
    paymentMethod: receipt.paymentMethod || "cash",
    serviceType: receipt.serviceType,
    programName: receipt.programName,
    notes: receipt.notes,
    _creationTime: receipt.receiptDate
  });

  const studentServices = [
    { value: "programming-class", label: "Programming Class - ₦100,000", amount: 100000 },
    { value: "desktop-publishing-3m", label: "Desktop Publishing (3 months) - ₦30,000", amount: 30000 },
    { value: "desktop-publishing-6m", label: "Desktop Publishing (6 months) - ₦60,000", amount: 60000 }
  ];

  const customerServices = [
    { value: "document-typing", label: "Document Typing - Custom Price", amount: 0 },
    { value: "scanning", label: "Scanning Services - Custom Price", amount: 0 },
    { value: "photocopying", label: "Photocopying - Custom Price", amount: 0 },
    { value: "laminating", label: "Laminating Services - Custom Price", amount: 0 },
    { value: "jamb-registration", label: "JAMB Registration - ₦7,000", amount: 7000 },
    { value: "waec-registration", label: "WAEC Registration - Custom Price", amount: 0 },
    { value: "computer-maintenance", label: "Computer Maintenance - Custom Price", amount: 0 },
    { value: "data-entry", label: "Data Entry Services - Custom Price", amount: 0 },
    { value: "project-creation", label: "Project Creation - Custom Price", amount: 0 }
  ];

  const services = currentReceiptType === 'student' ? studentServices : customerServices;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Auto-fill amount for predefined services
    if (name === 'service') {
      const selectedService = services.find(s => s.value === value);
      if (selectedService && selectedService.amount > 0) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          amount: selectedService.amount.toString()
        }));
      }
    }
  };

  const handleGenerateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!generateReceiptNumber) {
        throw new Error("Unable to generate receipt number");
      }

      const selectedService = services.find(s => s.value === formData.service);
      const serviceType = currentReceiptType === 'student' ? 'training' : 'service';
      
      await createReceipt({
        studentName: formData.customerName,
        studentEmail: formData.email || undefined,
        studentPhone: formData.phone || undefined,
        receiptNumber: generateReceiptNumber,
        amount: parseFloat(formData.amount),
        currency: "NGN",
        paymentMethod: formData.paymentMethod,
        serviceType,
        programName: selectedService?.label || formData.service,
        notes: formData.description || undefined,
      });

      alert("Receipt generated and saved successfully!");
      
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
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Error generating receipt. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              All Receipt Transactions ({receipts.length})
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
              {generateReceiptNumber && (
                <p className="text-sm text-blue-600 mt-2">
                  Next Receipt Number: {generateReceiptNumber}
                </p>
              )}
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
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-receipt'} mr-2`}></i>
                  {isLoading ? 'Generating...' : 'Generate Receipt'}
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
              {receipts.length === 0 ? (
                <div className="p-8 text-center">
                  <i className="fas fa-receipt text-gray-300 text-4xl mb-4"></i>
                  <p className="text-gray-600">No receipts found. Generate your first receipt to get started.</p>
                </div>
              ) : (
                <>
                  {/* Mobile view - Card layout */}
                  <div className="block md:hidden space-y-4 p-4">
                    {receipts.map((receipt: DisplayReceipt) => (
                      <div key={receipt.id} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium text-gray-900">{receipt.id}</div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                              receipt.type === 'Student' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {receipt.type}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">{receipt.amount}</div>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mt-1">
                              {receipt.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Customer: </span>
                            <span className="text-gray-900">{receipt.customerName}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Service: </span>
                            <span className="text-gray-900">{receipt.service}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Payment: </span>
                            <span className="text-gray-900">{receipt.paymentMethod}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Date: </span>
                            <span className="text-gray-900">{receipt.date}</span>
                            <span className="text-gray-500 ml-2">{receipt.time}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-4 pt-3 border-t">
                          <button className="text-blue-600 hover:text-blue-900 p-2">
                            <i className="fas fa-eye"></i>
                          </button>
                          <ReceiptDownload 
                            receipt={convertToReceiptData(allReceipts?.find(r => r.receiptNumber === receipt.id)!)}
                          />
                          <button className="text-purple-600 hover:text-purple-900 p-2">
                            <i className="fas fa-print"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop view - Table layout */}
                  <div className="hidden md:block">
                    <table className="w-full min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Receipt ID
                          </th>
                          <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer/Student
                          </th>
                          <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service/Program
                          </th>
                          <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Method
                          </th>
                          <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {receipts.map((receipt: DisplayReceipt) => (
                          <tr key={receipt.id} className="hover:bg-gray-50">
                            <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                              <div className="text-xs lg:text-sm font-medium text-gray-900">{receipt.id}</div>
                            </td>
                            <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                receipt.type === 'Student' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {receipt.type}
                              </span>
                            </td>
                            <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                              <div className="text-xs lg:text-sm text-gray-900 truncate max-w-[100px] lg:max-w-none">
                                {receipt.customerName}
                              </div>
                            </td>
                            <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 truncate max-w-[150px]">{receipt.service}</div>
                            </td>
                            <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                              <div className="text-xs lg:text-sm font-semibold text-gray-900">{receipt.amount}</div>
                            </td>
                            <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{receipt.date}</div>
                              <div className="text-xs text-gray-500">{receipt.time}</div>
                            </td>
                            <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{receipt.paymentMethod}</div>
                            </td>
                            <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {receipt.status}
                              </span>
                            </td>
                            <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-1 lg:space-x-2">
                                <button className="text-blue-600 hover:text-blue-900 p-1">
                                  <i className="fas fa-eye text-xs lg:text-sm"></i>
                                </button>
                                <ReceiptDownload 
                                  receipt={convertToReceiptData(allReceipts?.find(r => r.receiptNumber === receipt.id)!)}
                                />
                                <button className="text-purple-600 hover:text-purple-900 p-1">
                                  <i className="fas fa-print text-xs lg:text-sm"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    
  );
} 