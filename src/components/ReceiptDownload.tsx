"use client";
import React from 'react';
import Image from 'next/image';

interface ReceiptData {
  _id: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  receiptNumber: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  serviceType: string;
  programName: string;
  notes?: string;
  _creationTime: number;
}

interface ReceiptDownloadProps {
  receipt: ReceiptData;
  onDownload?: () => void;
}

export default function ReceiptDownload({ receipt, onDownload }: ReceiptDownloadProps) {
  
  const generateReceiptHTML = () => {
    const receiptDate = new Date(receipt._creationTime).toLocaleDateString();
    const receiptTime = new Date(receipt._creationTime).toLocaleTimeString();
    const formattedAmount = `${receipt.currency} ${receipt.amount.toLocaleString()}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Student Receipt - ${receipt.receiptNumber}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .receipt-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .receipt-header {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 30px 40px;
            text-align: center;
            position: relative;
          }
          .receipt-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 20px;
            background: white;
            border-radius: 20px 20px 0 0;
          }
          .logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 10px;
            margin-right: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #f59e0b;
          }
          .company-info h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .company-details {
            margin-top: 15px;
            font-size: 14px;
            opacity: 0.95;
          }
          .receipt-type {
            position: absolute;
            top: 20px;
            right: 30px;
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
          }
          .receipt-body {
            padding: 40px;
          }
          .receipt-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
          }
          .info-section h3 {
            margin: 0 0 15px 0;
            color: #374151;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .info-section p {
            margin: 5px 0;
            color: #6b7280;
            font-size: 14px;
          }
          .receipt-number {
            text-align: center;
            margin-bottom: 30px;
          }
          .receipt-number h2 {
            margin: 0;
            color: #1f2937;
            font-size: 24px;
            font-weight: bold;
          }
          .receipt-number p {
            margin: 5px 0 0 0;
            color: #6b7280;
            font-size: 14px;
          }
          .service-details {
            background: #f9fafb;
            border-radius: 10px;
            padding: 30px;
            margin: 30px 0;
          }
          .service-table {
            width: 100%;
            border-collapse: collapse;
          }
          .service-table th {
            background: #f59e0b;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 14px;
            letter-spacing: 0.5px;
          }
          .service-table th:first-child {
            border-radius: 8px 0 0 8px;
          }
          .service-table th:last-child {
            border-radius: 0 8px 8px 0;
            text-align: right;
          }
          .service-table td {
            padding: 20px 15px;
            border-bottom: 1px solid #e5e7eb;
          }
          .service-table td:last-child {
            text-align: right;
            font-weight: bold;
            color: #1f2937;
          }
          .total-section {
            margin-top: 30px;
            text-align: right;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
          }
          .total-final {
            background: #f59e0b;
            color: white;
            padding: 20px;
            border-radius: 8px;
            font-size: 20px;
            font-weight: bold;
            margin-top: 15px;
          }
          .payment-info {
            background: #ecfdf5;
            border: 2px solid #10b981;
            border-radius: 10px;
            padding: 20px;
            margin-top: 30px;
            text-align: center;
          }
          .payment-info h4 {
            margin: 0 0 10px 0;
            color: #059669;
            font-size: 16px;
            font-weight: bold;
          }
          .payment-info p {
            margin: 5px 0;
            color: #047857;
            font-size: 14px;
          }
          .footer {
            background: #1f2937;
            color: white;
            padding: 30px 40px;
            text-align: center;
          }
          .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
          }
          .footer-section h4 {
            margin: 0 0 10px 0;
            color: #f59e0b;
            font-size: 16px;
            font-weight: bold;
          }
          .footer-section p {
            margin: 5px 0;
            font-size: 14px;
            opacity: 0.8;
          }
          .footer-bottom {
            border-top: 1px solid #374151;
            padding-top: 20px;
            margin-top: 20px;
            font-size: 14px;
            opacity: 0.7;
          }
          .thank-you {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 25px;
            text-align: center;
            margin: 30px 0;
            border-radius: 10px;
          }
          .thank-you h3 {
            margin: 0 0 10px 0;
            font-size: 20px;
            font-weight: bold;
          }
          .thank-you p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
          }
          @media print {
            body { background: white; }
            .receipt-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="receipt-header">
            <div class="receipt-type">STUDENT RECEIPT</div>
            <div class="logo-section">
              <div class="logo">AC</div>
              <div class="company-info">
                <h1>Albarika Computer Centre</h1>
                <div class="company-details">
                  <div>Your Gateway to Quality Computing Services</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="receipt-body">
            <div class="receipt-number">
              <h2>STUDENT RECEIPT</h2>
              <p>Number: <strong>${receipt.receiptNumber}</strong></p>
              <p>Date: <strong>${receiptDate}</strong> | Time: <strong>${receiptTime}</strong></p>
            </div>
            
            <div class="receipt-info">
              <div class="info-section">
                <h3>Student Information</h3>
                <p><strong>Name:</strong> ${receipt.studentName}</p>
                ${receipt.studentEmail ? `<p><strong>Email:</strong> ${receipt.studentEmail}</p>` : ''}
                ${receipt.studentPhone ? `<p><strong>Phone:</strong> ${receipt.studentPhone}</p>` : ''}
                <p><strong>Program:</strong> ${receipt.programName}</p>
              </div>
              
              <div class="info-section">
                <h3>Service Provider</h3>
                <p><strong>Name:</strong> Albarika Computer Centre</p>
                <p><strong>Phone:</strong> 08028638778</p>
                <p><strong>Email:</strong> albarikacomputercentre@gmail.com</p>
                <p><strong>Website:</strong> albarika.vercel.app</p>
              </div>
            </div>
            
            <div class="service-details">
              <table class="service-table">
                <thead>
                  <tr>
                    <th>Service Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>${receipt.serviceType}</strong>
                      <br><small style="color: #6b7280;">Program: ${receipt.programName}</small>
                      ${receipt.notes ? `<br><small style="color: #6b7280;">${receipt.notes}</small>` : ''}
                    </td>
                    <td>${formattedAmount}</td>
                  </tr>
                </tbody>
              </table>
              
              <div class="total-section">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>${formattedAmount}</span>
                </div>
                <div class="total-row">
                  <span>Taxes:</span>
                  <span>${receipt.currency} 0</span>
                </div>
                <div class="total-final">
                  <div class="total-row">
                    <span>Total:</span>
                    <span>${formattedAmount}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="payment-info">
              <h4>✓ Payment Received</h4>
              <p><strong>Payment Method:</strong> ${receipt.paymentMethod.charAt(0).toUpperCase() + receipt.paymentMethod.slice(1)}</p>
              <p><strong>Amount Paid:</strong> ${formattedAmount}</p>
              <p><strong>Status:</strong> Paid in Full</p>
            </div>
            
            <div class="thank-you">
              <h3>Thank You for Choosing Our Training Programs!</h3>
              <p>We're excited to have you in our ${receipt.programName} program. For any questions about this receipt, please contact us.</p>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <div class="footer-section">
                <h4>Contact Information</h4>
                <p>📞 08028638778</p>
                <p>📧 albarikacomputercentre@gmail.com</p>
                <p>🌐 albarika.vercel.app</p>
              </div>
              
              <div class="footer-section">
                <h4>Our Programs</h4>
                <p>• Programming Training</p>
                <p>• Desktop Publishing</p>
                <p>• Computer Literacy</p>
                <p>• Digital Skills</p>
              </div>
              
              <div class="footer-section">
                <h4>Business Hours</h4>
                <p>Monday - Saturday</p>
                <p>9:00 AM - 6:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
            
            <div class="footer-bottom">
              <p>© ${new Date().getFullYear()} Albarika Computer Centre. All rights reserved.</p>
              <p>This is an official receipt for student services.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const downloadReceipt = () => {
    const htmlContent = generateReceiptHTML();
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then trigger download
      printWindow.onload = () => {
        printWindow.print();
        
        // Optional: Close window after printing
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      };
    }
    
    // Call the optional onDownload callback
    if (onDownload) {
      onDownload();
    }
  };

  return (
    <button
      onClick={downloadReceipt}
      className="text-green-600 hover:text-green-900 p-2 transition-colors"
      title="Download Receipt"
    >
      <i className="fas fa-download text-xs lg:text-sm"></i>
    </button>
  );
} 