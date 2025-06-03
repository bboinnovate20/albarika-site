"use client";
import React from 'react';

interface ReceiptData {
  id: string;
  receiptNumber: string;
  customerName: string;
  service: string;
  amount: string;
  date: string;
  time: string;
  paymentMethod: string;
  type: string;
  email?: string;
  phone?: string;
  description?: string;
}

interface ReceiptPrintProps {
  receipt: ReceiptData;
  onPrint?: () => void;
}

export default function ReceiptPrint({ receipt, onPrint }: ReceiptPrintProps) {
  
  const generateReceiptHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Receipt - ${receipt.receiptNumber}</title>
        <style>
          @media print {
            body { 
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: white !important;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 20px;
            }
            .receipt-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #f59e0b;
              padding-bottom: 20px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 5px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .company-tagline {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 15px;
            }
            .company-details {
              font-size: 12px;
              color: #6b7280;
              line-height: 1.4;
            }
            .receipt-title {
              font-size: 20px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
              color: #1f2937;
            }
            .receipt-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .info-section {
              width: 45%;
            }
            .info-section h4 {
              font-size: 14px;
              font-weight: bold;
              color: #374151;
              margin-bottom: 10px;
              text-transform: uppercase;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
            }
            .info-section p {
              font-size: 12px;
              color: #6b7280;
              margin: 3px 0;
              line-height: 1.4;
            }
            .service-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .service-table th {
              background: #f3f4f6;
              padding: 12px;
              text-align: left;
              font-weight: bold;
              font-size: 12px;
              color: #374151;
              border: 1px solid #d1d5db;
            }
            .service-table td {
              padding: 12px;
              border: 1px solid #d1d5db;
              font-size: 12px;
              color: #1f2937;
            }
            .total-section {
              text-align: right;
              margin-top: 20px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
              font-size: 12px;
            }
            .total-final {
              font-weight: bold;
              font-size: 16px;
              border-top: 2px solid #374151;
              padding-top: 10px;
              margin-top: 10px;
            }
            .payment-status {
              background: #f0f9ff;
              border: 1px solid #0ea5e9;
              padding: 15px;
              margin: 20px 0;
              text-align: center;
              border-radius: 5px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 10px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            .thank-you {
              text-align: center;
              margin: 30px 0;
              padding: 15px;
              background: #f9fafb;
              border-radius: 5px;
            }
          }
          
          body { 
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
          }
          .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="receipt-header">
            <div class="company-name">Albarika Computer Centre</div>
            <div class="company-tagline">Your Gateway to Quality Computing Services</div>
            <div class="company-details">
              📞 08028638778 | 📧 albarikacomputercentre@gmail.com | 🌐 albarika.vercel.app
            </div>
          </div>
          
          <div class="receipt-title">${receipt.type.toUpperCase()} RECEIPT</div>
          
          <div class="receipt-info">
            <div class="info-section">
              <h4>Receipt Information</h4>
              <p><strong>Receipt Number:</strong> ${receipt.receiptNumber}</p>
              <p><strong>Date:</strong> ${receipt.date}</p>
              <p><strong>Time:</strong> ${receipt.time}</p>
              <p><strong>Type:</strong> ${receipt.type}</p>
            </div>
            
            <div class="info-section">
              <h4>Customer Information</h4>
              <p><strong>Name:</strong> ${receipt.customerName}</p>
              ${receipt.email ? `<p><strong>Email:</strong> ${receipt.email}</p>` : ''}
              ${receipt.phone ? `<p><strong>Phone:</strong> ${receipt.phone}</p>` : ''}
            </div>
          </div>
          
          <table class="service-table">
            <thead>
              <tr>
                <th>Service Description</th>
                <th style="width: 150px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${receipt.service}</strong>
                  ${receipt.description ? `<br><small>${receipt.description}</small>` : ''}
                </td>
                <td style="text-align: right; font-weight: bold;">${receipt.amount}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${receipt.amount}</span>
            </div>
            <div class="total-row">
              <span>Tax:</span>
              <span>₦0.00</span>
            </div>
            <div class="total-row total-final">
              <span>Total Amount:</span>
              <span>${receipt.amount}</span>
            </div>
          </div>
          
          <div class="payment-status">
            <h4 style="margin: 0 0 5px 0; color: #0369a1;">✓ Payment Received</h4>
            <p style="margin: 0; font-size: 12px;"><strong>Method:</strong> ${receipt.paymentMethod} | <strong>Status:</strong> Paid in Full</p>
          </div>
          
          <div class="thank-you">
            <h4 style="margin: 0 0 10px 0;">Thank You!</h4>
            <p style="margin: 0; font-size: 12px;">We appreciate your business. For inquiries, contact us at 08028638778</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Albarika Computer Centre. All rights reserved.</p>
            <p>This is an official receipt for services rendered.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const printReceipt = () => {
    const htmlContent = generateReceiptHTML();
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      printWindow.onload = () => {
        printWindow.print();
        
        // Close window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    }
    
    // Call the optional onPrint callback
    if (onPrint) {
      onPrint();
    }
  };

  return (
    <button
      onClick={printReceipt}
      className="text-purple-600 hover:text-purple-900 p-2 transition-colors"
      title="Print Receipt"
    >
      <i className="fas fa-print text-xs lg:text-sm"></i>
    </button>
  );
} 