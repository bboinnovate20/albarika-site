import React, { useEffect, useRef } from 'react';
// import './Receipt.css'; // move your CSS into this file or use styled-components
import { Doc } from '@convex-dev/auth/server';
import { usePDF } from 'react-to-pdf';


export interface StudentReceipt {
    // Student information
    studentId: string;
    studentName: string;
    studentEmail?: string;
    studentPhone?: string;
    
    // Receipt details
    receiptNumber: string;
    receiptDate: number; // timestamp
    dueDate?: number; // timestamp
    
    // Payment information
    amount: number; 
    amountPaid?: number; 
    paymentMethod?: string; 
    
    // Service/Program details
    serviceType: string; 
    programName: string; 
    
    // Academic/Session information
    session?: string; // e.g., "2024/2025"
    
    // Administrative
    issuedBy?: string;
    notes?: string;
    isActive: boolean; 
    
    // Timestamps
    createdAt: number;
  }
  // const Receipt = ({ receiptInfo }: { receiptInfo: StudentReceipt }) => {
const Receipt = () => {
  const { toPDF, targetRef } = usePDF({
    filename: `receipt-new.pdf`,
    page: { format: 'a4', orientation: 'portrait' }
  });

  // const { toPDF, targetRef } = usePDF({
  //   filename: `receipt-${receiptInfo.receiptNumber}.pdf`,
  //   page: { format: 'a4', orientation: 'portrait' }
  // });


  function initaite() {
    const formatNaira = (amount: number | string) => {
      const parsed = parseFloat(amount.toString());
      const safeAmount = isNaN(parsed) ? 0 : parsed;
      return '₦' + safeAmount.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    const amountElement = document.getElementById("amount-payment");
    
    if (amountElement) {
      amountElement.innerText = formatNaira(receiptInfo.amount);
    }

    const receiptDate = new Date(receiptInfo.receiptDate);
    const formattedDate = receiptDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });

    const formattedDateTime = receiptDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const currentDateElement = document.getElementById('currentDate');
    const generatedDateElement = document.getElementById('generatedDate');
    
    if (currentDateElement) {
      currentDateElement.textContent = formattedDate;
    }
    if (generatedDateElement) {
      generatedDateElement.textContent = formattedDateTime;
    }

    // Also update the amount paid element
    const amountPaidElement = document.getElementById('amount');
    if (amountPaidElement) {
      amountPaidElement.innerText = formatNaira(receiptInfo.amountPaid || receiptInfo.amount);
    }

  }
  useEffect(() => {
    // initaite();
    // Use requestAnimationFrame to ensure DOM is fully updated before generating PDF
    // const generatePDF = () => {
    //   // Double-check that all elements are populated
    //   const amountPaymentElement = document.getElementById("amount-payment");
    //   const currentDateElement = document.getElementById('currentDate');
    //   const generatedDateElement = document.getElementById('generatedDate');
    //   console.log("amount pa", amountPaymentElement);
    //   // if (amountPaymentElement && currentDateElement && generatedDateElement) {
    //   //   console.log("Generating PDF with populated data");
    //   //   toPDF();
    //   // } else {
    //   //   console.log("Elements not ready, retrying...");
    //   //   setTimeout(generatePDF, 100);
    //   // }
    // };

    // Wait for next frame to ensure DOM updates are complete
    // requestAnimationFrame(() => {
    //   setTimeout(generatePDF, 100);
    // });
    // console.log("funnn");
    // console.log("target", targetRef);

    // toPDF();
  }, []);

  return (
    <div style={{}}  ref={targetRef}>
      
      {/* header */}
      <div style={{backgroundColor: 'white'}}>
        <img src="/image/header.jpg" alt="" />
        <h1 style={{
          fontFamily: 'sans-serif',
          textAlign: 'center',
          fontWeight: 'bold',
          
          
          fontSize: 40,

        }}>PAYMENT RECEIPT </h1>

        <main style={{fontSize: 16}}>

          <div style={{
            display: 'flex',
            gap: '2px',
            
          }}>
            <div style={{flexBasis: '50%'}}>
              <h4 style={{fontWeight: 'bold', margin: 0}}>Student ID</h4>
              <h4 style={{textTransform: 'uppercase'}}>kadfjkladk;ajdlfa;ksdjfa;skdj</h4>
            </div>
            <div>
              <h4 style={{fontWeight: 'bold', margin: 0}}>Full Name</h4>
              <h4 style={{textTransform: 'uppercase'}}>John Bue</h4>
            </div>
          </div>
        </main>

      </div>

    </div>
    // <div id='receipt-new' ref={targetRef} >
    //   <div className="space-y-4">
    //     <div className="a4-container">
    //       <img src="/image/header.jpg" alt="Letterhead" className="letterhead-image" />
    //       <div className="watermark">RECEIPT</div>

    //       <div className="receipt-content">
    //         <div className="receipt-header">
    //           <div className="receipt-title">Payment Receipt</div>
    //           <div className="receipt-number">Receipt No: {receiptInfo.receiptNumber}</div>
    //         </div>

    //         <div className="main-content">
    //           <div className="student-info">
    //             <div className="info-section">
    //               <div className="section-title">Student Information</div>
    //               <div className="info-grid">
    //                 <div className="info-item">
    //                   <div className="info-label">Student ID</div>
    //                   <div className="info-value">{receiptInfo.studentId}</div>
    //                 </div>
    //                 <div className="info-item">
    //                   <div className="info-label">Full Name</div>
    //                   <div className="info-value">{receiptInfo.studentName}</div>
    //                 </div>
    //                 <div className="info-item">
    //                   <div className="info-label">Email Address</div>
    //                   <div className="info-value">{receiptInfo.studentEmail}</div>
    //                 </div>
    //                 <div className="info-item">
    //                   <div className="info-label">Phone Number</div>
    //                   <div className="info-value">{receiptInfo.studentPhone}</div>
    //                 </div>
    //               </div>
    //             </div>

    //             <div className="info-section">
    //               <div className="section-title">Program Details</div>
    //               <div className="info-grid">
    //                 <div className="info-item">
    //                   <div className="info-label">Service Type</div>
    //                   <div className="info-value">{receiptInfo.serviceType}</div>
    //                 </div>
    //                 <div className="info-item">
    //                   <div className="info-label">Program Name</div>
    //                   <div className="info-value">{receiptInfo.programName}</div>
    //                 </div>
    //                 <div className="info-item">
    //                   <div className="info-label">Academic Session</div>
    //                   <div className="info-value">{receiptInfo.session}</div>
    //                 </div>
    //                 <div className="info-item">
    //                   <div className="info-label">Receipt Date</div>
    //                   <div className="info-value" id="currentDate"></div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>

    //           <div className="student-photo">
    //             <div className="photo-frame">
    //               <div style={{ textAlign: 'center', color: '#95a5a6' }}>
    //                 <div style={{ fontSize: 24, marginBottom: 5 }}>📷</div>
    //                 <div>Student Photo</div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="payment-section">
    //           <div className="section-title" style={{ textAlign: 'center', border: 'none', marginBottom: 0 }}>Payment Information</div>

    //           <div className="amount-display">
    //             <div className="currency">NGN</div>
    //             <div className="total-amount" id="amount-payment"></div>
    //           </div>

    //           <div className="payment-details">
    //             <div className="info-item">
    //               <div className="info-label">Payment Method</div>
    //               <div className="info-value">{receiptInfo.paymentMethod}</div>
    //             </div>
    //             <div className="info-item">
    //               <div className="info-label">Amount Paid</div>
    //               <div className="info-value highlight" id="amount"></div>
    //             </div>
    //             <div className="info-item">
    //               <div className="info-label">Balance</div>
    //               <div className="info-value">₦0.00</div>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="status-section">
    //           <div className="status-label">Payment Status:</div>
    //           <div className="status-value">{receiptInfo.amountPaid === receiptInfo.amount ? 'PAID IN FULL' : 'PARTIALLY PAID'}</div>
    //         </div>

    //         <div className="notes-section">
    //           <div className="info-label" style={{ marginBottom: 8 }}>Additional Notes:</div>
    //           <div style={{ fontStyle: 'italic', color: '#666' }}>
    //             {receiptInfo.notes}
    //           </div>
    //         </div>

    //         <div className="footer-section">
    //           <div className="signature-area">
    //             <div className="signature-box">
    //               <div className="signature-line"></div>
    //               <div className="signature-label">Student Signature</div>
    //             </div>
    //             <div className="signature-box">
    //               <div className="signature-line"></div>
    //               <div className="signature-label">Authorized Officer</div>
    //             </div>
    //           </div>

    //           <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#7f8c8d' }}>
    //             <p><strong>This is an official receipt from Excellence Academy</strong></p>
    //             <p>For inquiries, contact info@excellenceacademy.ng or +234-XXX-XXXX</p>
    //             <p style={{ marginTop: 10, fontStyle: 'italic' }}>Generated on <span id="generatedDate"></span></p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     {/* <button 
    //       onClick={() => toPDF()}
    //       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    //     >
    //       Download PDF
    //     </button> */}
    //   </div>

    // </div>
  );
};



export default Receipt;
