import jsPDF from "jspdf";

interface WAECCard {
  serialNumber: string;
  pin: string;
}

export function generateWAECCardsPDF(cards: WAECCard[]) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const cardsPerPage = 3;
  const startX = 15;
  const startY = 10;
  const cardHeight = 90;
  const cardSpacing = 5;

  cards.forEach((card, index) => {
    const cardIndexOnPage = index % cardsPerPage;

    // Add new page if needed (but not for the first card)
     if (index > 0 && index % cardsPerPage === 0) {
      pdf.addPage();
    }

    // Calculate Y position for this card (stacked vertically)
    const yPosition = startY + (cardIndexOnPage * (cardHeight + cardSpacing));

    drawCard(pdf, card, startX, yPosition);
  });
  const filename = 'waec-cards.pdf';
  //  pdf.save("waec-cards.pdf", { returnPromise: true });
  const blob = pdf.output('blob');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}


function drawCard(pdf: jsPDF, card: WAECCard, x: number, y: number) {
  const cardWidth = 130;
  const cardHeight = 80;
  
  // Card background and border
  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, "FD");
  pdf.setDrawColor(209, 213, 219);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, "S");

  // Header background
  pdf.setFillColor(3, 101, 3);
  pdf.roundedRect(x, y, cardWidth, 15, 2, 3, "F");
  pdf.rect(x, y + 12, cardWidth, 3, "F"); // Fill bottom corners

  // Header text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("WAEC Card Checker", x + 5, y + 10);
  
  pdf.setFontSize(10);
  pdf.text("AL-BARIKA COMPUTER SCIENCE", x + cardWidth - 5, y + 10, { align: "right" });

  // Reset text color for content
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  
  let contentY = y + 22;

  // Instructions title
  pdf.setFont("helvetica", "bold");
  pdf.text("Instructions:", x + 5, contentY);
  contentY += 5;

  // Instructions list
  pdf.setFont("helvetica", "normal");
  const instructions = [
    "• Obtain your serial PIN (a 12 digit number)",
    "• Visit the website WAEC DIRECT https://www.waecdirect.org/",
    "• Fill in the information required on the Home Page",
    "• Click Submit",
  ];

  instructions.forEach((instruction) => {
    const lines = pdf.splitTextToSize(instruction, cardWidth - 15);
    pdf.text(lines, x + 5, contentY);
    contentY += lines.length * 4.5;
  });

  pdf.setFont("helvetica", "bold");
  pdf.text("Short Messaging Service (SMS) Access:", x + 5, contentY);
  contentY += 5;
    const sms = [
    "• Send SMS in the format: WAEC*ExamNo*PIN*ExamYear",
    "• To short-code 32327"
  ];

  pdf.setFont("helvetica", "normal");
   sms.forEach((instruction) => {
    const lines = pdf.splitTextToSize(instruction, cardWidth - 15);
    pdf.text(lines, x + 5, contentY);
    contentY += lines.length * 4.5;
  });

  // contentY += 2;

  // Info boxes
  const boxWidth = (cardWidth - 15) / 2;
  const boxHeight = 18;
  const boxY = contentY;

  // Serial Number Box
  pdf.setFillColor(243, 244, 246);
  pdf.setDrawColor(107, 114, 128);
  pdf.setLineWidth(0.2);
  pdf.roundedRect(x + 5, boxY, boxWidth, boxHeight, 2, 2, "FD");
  
  pdf.setFontSize(8);
  pdf.setTextColor(75, 85, 99);
  pdf.text("Serial Number", x + 8, boxY + 5);
  
  pdf.setFontSize(15);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text(card.serialNumber, x + 8, boxY + 12);

  // PIN Box
  pdf.setFillColor(243, 244, 246);
  pdf.roundedRect(x + 10 + boxWidth, boxY, boxWidth, boxHeight, 2, 2, "FD");
  
  pdf.setFontSize(8);
  pdf.setTextColor(75, 85, 99);
  pdf.text("PIN", x + 13 + boxWidth, boxY + 5);
  
  pdf.setFontSize(15);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text(card.pin, x + 13 + boxWidth, boxY + 12);
}

// Example usage:
// generateWAECCardsPDF([
//   { serialNumber: "WRN1234567890455", pin: "555123456789456" },
//   { serialNumber: "WRN9876543210123", pin: "999876543210987" }
// ]);