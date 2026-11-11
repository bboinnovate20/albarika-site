"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { useEffect, useState, type ReactNode, type Ref } from "react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export type StudentIdCardData = {
  fullName: string;
  studentCode: string;
  programme: string;
  months: number;
  issued: Date;
};

const terms = [
  "This card is the property of Albarika Computer Institute and must be shown on request while on the premises.",
  "It is valid only for the student and programme named on the front, and is not transferable.",
  "Report a lost or damaged card to the front desk as soon as possible.",
];

function cardDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function verifyUrl(code: string) {
  return `https://albarikacomputer.com.ng/card/${encodeURIComponent(code)}`;
}

export async function downloadStudentIdCard(front: HTMLElement, back: HTMLElement, code: string) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [54, 85.6] });
  for (const [index, node] of [front, back].entries()) {
    const canvas = await html2canvas(node, { scale: 3, backgroundColor: "#ffffff", useCORS: true });
    if (index > 0) pdf.addPage([54, 85.6], "portrait");
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 54, 85.6);
  }
  const safe = code.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "student";
  pdf.save(`${safe}-id-card.pdf`);
}

function InstituteMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-[28px] border-2 border-[#0e2a5c] bg-white">
        <img src="/image/logo.jpeg" alt="" width={56} height={56} className="size-14 object-cover" />
      </div>
      <div className="whitespace-nowrap">
        <p className="text-2xl leading-7 font-extrabold tracking-[0.96px] text-white">ALBARIKA</p>
        <p className="text-xs leading-4 font-semibold tracking-[1.92px] text-[#c9dcff]">COMPUTER INSTITUTE</p>
      </div>
    </div>
  );
}

function CardFace({ background, children }: { background: string; children: ReactNode }) {
  return (
    <div className={`${jakarta.className} relative h-[972px] w-[612px] overflow-hidden rounded-[36px] bg-white text-left shadow-[0_12px_32px_rgba(0,0,0,0.14)]`}>
      <img src={background} alt="" width={612} height={972} className="absolute top-0 left-0" />
      <div className="absolute inset-0 flex flex-col items-center px-11 pt-[60px] pb-11">{children}</div>
    </div>
  );
}

export function StudentIdCardFaces({
  data,
  frontRef,
  backRef,
}: {
  data: StudentIdCardData;
  frontRef?: Ref<HTMLDivElement>;
  backRef?: Ref<HTMLDivElement>;
}) {
  const [qr, setQr] = useState("");
  const expires = addMonths(data.issued, data.months);
  const duration = `${data.months} month${data.months === 1 ? "" : "s"}`;

  useEffect(() => {
    if (!data.studentCode) {
      setQr("");
      return;
    }
    let live = true;
    QRCode.toDataURL(verifyUrl(data.studentCode), {
      margin: 2,
      width: 200,
      errorCorrectionLevel: "M",
      color: { dark: "#0E2A5C", light: "#FFFFFF" },
    })
      .then((url: string) => {
        if (live) setQr(url);
      })
      .catch(() => {
        if (live) setQr("");
      });
    return () => {
      live = false;
    };
  }, [data.studentCode]);

  const rows = [
    ["ID no.", data.studentCode || "—"],
    ["Programme", data.programme || "—"],
    ["Duration", duration],
    ["Valid until", cardDate(expires)],
  ];

  return (
    <div className="flex flex-col items-start gap-6">
      <div ref={frontRef}>
        <CardFace background="/id-card/wave-front.svg">
          <InstituteMark />
          <div className="h-[30px]" />
          <div className="rounded-full border-[5px] border-[#f9b233] bg-white p-3">
            <div className="relative size-[212px] overflow-hidden rounded-full bg-[#e8f1ff]">
              <img src="/id-card/silhouette.svg" alt="" width={165} height={165} className="absolute top-[47px] left-[23.5px]" />
            </div>
          </div>
          <div className="h-[22px]" />
          <p className="w-[524px] text-center text-[36px] leading-[42px] font-extrabold text-[#0e2a5c]">{data.fullName}</p>
          <div className="h-1" />
          <p className="text-sm font-bold tracking-[3.92px] text-[#2563eb]">STUDENT</p>
          <div className="h-[26px]" />
          <div className="flex flex-col gap-3">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-start gap-3">
                <p className="w-[118px] shrink-0 text-xs font-bold tracking-[1.44px] text-[#6b7a99] uppercase">{label}</p>
                <p className="max-w-[340px] text-[17px] leading-6 font-semibold text-[#16223f]">{value}</p>
              </div>
            ))}
          </div>
          <div className="min-h-px flex-1" />
          <div className="flex w-full items-center gap-4">
            <div className="rounded-[10px] border-[1.5px] border-[#dce6f7] bg-white p-2">
              {qr ? <img src={qr} alt={data.studentCode ? `QR code for ${data.studentCode}` : ""} width={100} height={100} /> : <div className="size-[100px]" />}
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#0e2a5c]">Scan to verify</p>
              <p className="text-[15px] font-extrabold tracking-[0.04em] text-[#0e2a5c]">{data.studentCode || "—"}</p>
              <p className="text-[13px] font-medium text-[#6b7a99]">albarikacomputer.com.ng</p>
            </div>
          </div>
        </CardFace>
      </div>
      <div ref={backRef}>
        <CardFace background="/id-card/wave-back.svg">
          <InstituteMark />
          <div className="h-[180px]" />
          <div className="flex w-full flex-col gap-8">
            <p className="text-xl font-extrabold text-[#2563eb]">Terms & conditions</p>
            <div className="flex flex-col gap-3 text-sm leading-[21px]">
              {terms.map((term, index) => (
                <div key={term} className="flex items-start gap-2.5">
                  <p className="font-bold text-[#2563eb]">0{index + 1}</p>
                  <p className="w-[480px] font-normal text-[#16223f]">{term}</p>
                </div>
              ))}
            </div>
            <div className="flex w-full items-end gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold tracking-[1.32px] text-[#6b7a99] uppercase">Issued</p>
                <p className="text-[17px] font-semibold text-[#16223f]">{cardDate(data.issued)}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold tracking-[1.32px] text-[#6b7a99] uppercase">Expires</p>
                <p className="text-[17px] font-semibold text-[#16223f]">{cardDate(expires)}</p>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-end gap-1.5">
                <div className="h-[1.5px] w-full bg-[#16223f]" />
                <p className="text-[11px] font-bold tracking-[1.32px] text-[#6b7a99] uppercase">Director</p>
              </div>
            </div>
            <div className="h-[1.5px] w-full bg-[#dce6f7]" />
            <div>
              <p className="text-[11px] font-bold tracking-[1.32px] text-[#6b7a99] uppercase">If found, please return to</p>
              <p className="text-[15px] leading-[22px] font-semibold text-[#16223f]">56 Freeman Street, Lagos Island, Lagos</p>
              <p className="text-sm leading-[21px] font-medium text-[#16223f]">0809 218 3810 · 0802 863 8778</p>
              <p className="text-sm leading-[21px] font-medium text-[#16223f]">albarikacomputercentre@gmail.com</p>
            </div>
          </div>
          <div className="min-h-px flex-1" />
          <p className="w-full text-base font-bold tracking-[0.48px] text-[#2563eb]">www.albarikacomputer.com.ng</p>
        </CardFace>
      </div>
    </div>
  );
}
