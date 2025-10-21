
export function generateWAECCardHTML(serialNumber: string, pin: string) {
  return `
<div class="card">
  <div class="header">
    <h1>WAEC Card Checker</h1>
    <h1>AL-BARIKA COMPUTER SCIENCE</h1>
  </div>
  <div class="content">
    <p><strong>Instructions:</strong></p>
    <ul>
      <li>Obtain your serial PIN (a 12 digit number)</li>
      <li>Visit the website WAEC DIRECT https://www.waecdirect.org/</li>
      <li>Fill in the information required on the Home Page</li>
      <li>Click Submit</li>
    </ul>
    <ul>
      <li>Short Messaging Service (SMS) Access:</li>
      <li>Send SMS in the format: WAEC*ExamNo*PIN*ExamYear</li>
      <li>To short-code 32327</li>
    </ul>
    <div class="info-box">
      <div class="box">
        <h4>Serial Number</h4>
        <h1>${serialNumber}</h1>
      </div>
      <div class="box">
        <h4>PIN</h4>
        <h1>${pin}</h1>
      </div>
    </div>
  </div>
</div>
`;
}

export function generateMultipleWAECCardsHTML(
  cards: Array<{ serialNumber: string; pin: string }>
) {
  const cardsHTML = cards.map((card) => generateWAECCardHTML(card.serialNumber, card.pin)).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    .card {
      background: #f9fafb;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      border-radius: 10px;
      width: 340px;
      height: auto;
      overflow: hidden;
      border: 1px solid #d1d5db;
      page-break-after: always;
    }
    .card:last-child {
      page-break-after: auto;
    }
    .header {
      background: rgb(3, 101, 3);
      color: white;
      padding: 12px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }
    .header h1 {
      font-size: 14px;
      margin: 0;
      font-weight: bolder;
      white-space: nowrap;
    }
    .header h1:last-child {
      font-size: 9px;
      margin: 0;
      font-weight: bold;
      white-space: nowrap;
      text-align: right;
    }
    .content {
      padding: 8px;
      font-size: 10px;
      line-height: 1.4;
    }
    .content p {
      margin: 0 0 4px 0;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li::before {
      content: "• ";
    }
    .info-box {
      display: flex;
      gap: 2px;
      margin-top: 12px;
    }
    .box {
      border: 1px solid #6b7280;
      border-radius: 6px;
      padding: 6px;
      background: #f3f4f6;
      flex: 1;
    }
    .box h4 {
      margin: 0;
      font-size: 11px;
    }
    .box h1 {
      margin: 0;
      font-size: 14px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  ${cardsHTML}
</body>
</html>
`;
}