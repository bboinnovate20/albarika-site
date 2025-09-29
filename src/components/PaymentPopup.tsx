"use client";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  studentData: any;
  onPaymentComplete: () => void;
}

export default function PaymentPopup({ 
  isOpen, 
  onClose, 
  studentData, 
  onPaymentComplete 
}: PaymentPopupProps) {
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "Cash",
    serviceType: "Student Registration",
    notes: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const createReceipt = useMutation(api.receipts.createReceipt);
  const generateReceiptNumber = useQuery(api.receipts.generateReceiptNumber);

  const paymentMethods = ["Cash", "Bank Transfer", "Card Payment", "Mobile Money"];
  
  // Program fees
  const programFees: Record<string, number> = {
    "Desktop Publishing (3 months)": 25000,
    "Desktop Publishing (6 months)": 45000,
    "Programming Class": 60000,
    "Computer Maintenance": 35000,
    "Data Entry": 20000,
  };

  const suggestedAmount = programFees[studentData?.program] || 0;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    console.log(studentData);

    try {
      await createReceipt({
        studentID: studentData.studentId,
        studentName: studentData.name,
        studentEmail: studentData.email,
        studentPhone: studentData.phone,
        receiptNumber: generateReceiptNumber || `ALB-RECEIPT-${Date.now()}`,
        amount: parseFloat(paymentData.amount),
        // currency: "NGN",
        paymentMethod: paymentData.paymentMethod,
        serviceType: paymentData.serviceType,
        programName: studentData.program,
        notes: paymentData.notes
      });
      onPaymentComplete();
    } catch (error) {
      console.error("Error creating receipt:", error);
      alert("Error processing payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setPaymentData({
      amount: "",
      paymentMethod: "Cash",
      serviceType: "Student Registration",
      notes: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                <i className="fas fa-credit-card text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold">Payment Required</h3>
                <p className="text-green-100 text-sm">Complete student registration</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white hover:text-green-200 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Student Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <i className="fas fa-user mr-2 text-blue-600"></i>
              Student Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{studentData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Program:</span>
                <span className="font-medium">{studentData?.program}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{studentData?.programDuration}</span>
              </div>
              {generateReceiptNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Receipt No:</span>
                  <span className="font-medium text-blue-600">{generateReceiptNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount paid (₦) *
            </label>
            <div className="relative">
              <input
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                placeholder={`Suggested: ₦${suggestedAmount.toLocaleString()}`}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {suggestedAmount > 0 && (
                <button
                  type="button"
                  onClick={() => setPaymentData({...paymentData, amount: suggestedAmount.toString()})}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                >
                  Use Suggested
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>
            <select
              value={paymentData.paymentMethod}
              onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Notes
            </label>
            <textarea
              value={paymentData.notes}
              onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Additional payment details..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <i className={`fas ${isProcessing ? 'fa-spinner fa-spin' : 'fa-credit-card'} mr-2`}></i>
              {isProcessing ? 'Processing...' : 'Process Payment'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Skip for Now
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              <i className="fas fa-shield-alt mr-1"></i>
              Secure payment processing
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 