import jsPDF from "jspdf";

interface WAECCard {
  serialNumber: string;
  pin: string;
}

export async function generateWAECCardsPDF(cards: WAECCard[], transactionId: string) {
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

  // 🔹 Use a for...of loop so we can await inside
  for (let index = 0; index < cards.length; index++) {
    const card = cards[index];
    const cardIndexOnPage = index % cardsPerPage;

    // Add new page if needed
    if (index > 0 && index % cardsPerPage === 0) {
      pdf.addPage();
    }

    const yPosition = startY + cardIndexOnPage * (cardHeight + cardSpacing);
    await drawCard(pdf, card, transactionId, startX, yPosition, );
  }

  // Save PDF
  const filename = "waec-cards.pdf";
  const blob = pdf.output("blob");
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);

  return true;
}

async function drawCard(pdf: jsPDF, card: WAECCard, transactionId: string, x: number, y: number,) {
  const cardWidth = 130;
  const cardHeight = 80;

  // Fetch base64 image (ensure full data:image/png;base64,... prefix is in the txt)
  const res = await fetch("/image/waec.txt");
  const base64 = await res.text();

  // ✅ Draw image background
  pdf.setGState(pdf.GState({ opacity: 0.2 }));
  pdf.addImage(base64.trim(), "PNG", x, y, cardWidth, cardHeight);
  pdf.setGState(pdf.GState({ opacity: 1 }));

  // Card overlay and design
  pdf.setDrawColor(209, 213, 219);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, "S");

  // Header background
  pdf.setFillColor(3, 101, 3);
  pdf.roundedRect(x, y, cardWidth, 15, 2, 3, "F");
  pdf.rect(x, y + 12, cardWidth, 3, "F");

  // Header text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("WAEC Card Checker", x + 5, y + 10);

  pdf.setFontSize(10);
  pdf.text("AL-BARIKA COMPUTER SCIENCE", x + cardWidth - 5, y + 10, { align: "right" });

  // Content
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  let contentY = y + 22;

  pdf.setFont("helvetica", "bold");
  pdf.text("Instructions:", x + 5, contentY);
  contentY += 5;

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

  pdf.setFont("helvetica", "normal");
  const sms = [
    "• Send SMS in the format: WAEC*ExamNo*PIN*ExamYear",
    "• To short-code 32327",
  ];

  sms.forEach((instruction) => {
    const lines = pdf.splitTextToSize(instruction, cardWidth - 15);
    pdf.text(lines, x + 5, contentY);
    contentY += lines.length * 4.5;
  });

  const boxWidth = (cardWidth - 15) / 2;
  const boxHeight = 13;
  const boxY = contentY;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Transaction ID: ${transactionId}`, x+5, boxY);


  pdf.setFont("helvetica", "normal");
  pdf.setFillColor(243, 244, 246);
  pdf.setDrawColor(107, 114, 128);
  pdf.setLineWidth(0.2);
  pdf.roundedRect(x + 5, boxY+5, boxWidth, boxHeight, 2, 2, "FD");

  pdf.setFontSize(8);
  pdf.setTextColor(75, 85, 99);
  pdf.text("Serial Number", x + 8, boxY + 9);

  pdf.setFontSize(15);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text(card.serialNumber, x + 8, boxY + 15);

  pdf.setFillColor(243, 244, 246);
  pdf.roundedRect(x + 10 + boxWidth, boxY + 5, boxWidth, boxHeight, 2, 2, "FD");

  pdf.setFontSize(8);
  pdf.setTextColor(75, 85, 99);
  pdf.text("PIN", x + 13 + boxWidth, boxY + 9);

  pdf.setFontSize(15);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text(card.pin, x + 13 + boxWidth, boxY + 15);
}
