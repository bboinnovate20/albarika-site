import jsPDF from "jspdf";

export async function handleGeneratePdf(html: string) {
  // Create a temporary element to render the HTML
  const element = document.createElement("div");
  element.innerHTML = html;
  element.style.position = "fixed";
  element.style.top = "-9999px";
  element.style.background = "white";
//   element.style.width = "400px"; // Match your card width
  document.body.appendChild(element);

  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Use jsPDF's html method for proper text rendering
    await pdf.html(element, {
      callback: function (doc) {
        doc.save("waec-card.pdf");
      },
      x: 10, // Left margin
      y: 10, // Top margin
      width: 190, // Content width (A4 width - margins)
    //   windowWidth: 400, // Match your HTML element width for proper scaling
      html2canvas: {
        scale: 0.5, // Adjust scale to fit properly on A4
      },
    });
  } finally {
    document.body.removeChild(element);
  }
}