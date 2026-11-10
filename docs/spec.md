# Albarika Computer Institute — product spec

Status: approved for implementation. Design detail lives in [design.md](./design.md). Vocabulary lives in [GLOSSARY.md](../GLOSSARY.md); use those words in code, copy, and commits.

## 1. What we are building

Albarika Computer Institute (56 Freeman Street, Lagos Island) is both an IT training academy and a one-stop computing services centre:

1. **IT Academy (Training).** Students enrol in a course, pay part or all of the fee at the institute, receive their unique **student code** (username) and password on approval, read/download their **PDF course materials** on the website according to their **standing** (Partial or Complete), and download their **ID card** (with expiry date) as a PDF.
2. **Computing Services.** Walk-in and business customers come for document typing & typesetting, graphic design, printing/scanning, JAMB & WAEC registration and CBT exam prep, computer maintenance, data entry, and project creation.

The website must:

- open with the refined brand message (**"Your Gateway to Quality Computing Services"**) and three visual fanned showcase cards featuring student/lab imagery, the Student ID + PDF learning experience, and computing services,
- let a visitor send a **message** via the **Contact us** section,
- let a visitor submit an **enrolment request** for a course,
- let an approved student log in with their **student code (username) and password**, open the **PDF materials** their **standing** allows, and download their **ID card** (including expiry date) as a PDF,
- preserve the institute's **real testimonials**,
- let staff approve enrolments, issue/reset student credentials, record payments, upload Partial/Complete course PDFs, and print **pricing bills** and **student certifications**.

## 2. Current state (as of this spec)

- Next.js 15 App Router, React 19, Tailwind v4, shadcn-style Radix components (`dialog`, `tooltip`, `sheet`, `context-menu`, `sidebar`), `clsx`, `class-variance-authority`, `lucide-react`, `react-toastify`, `jspdf`, `pdf-lib`, `html2canvas`.
- `src/app/page.tsx` renders Navigation, HeroSection, ServicesSection, SchoolsSection, AboutSection, TestimonialsSection, ContactSection, Footer. `ProgramsSection` and `StatsSection` exist in `src/components/` but are not rendered.
- The contact form has no submit handler. "Enroll Now" and "Get Service" do nothing.
- Copy says "Albarika Computer Centre" across components. The official name is **Albarika Computer Institute**.
- Admin auth: `src/app/api/auth/login/route.ts` posts to an external API (`apiAdminServer`, base URL from `NEXT_PUBLIC_BASE_URL`) and sets an `auth_token` cookie. `src/middleware.ts` guards `/admin/*`.
- Admin student registration (`src/app/admin/students/register/page.tsx`) is a form whose persistence calls are commented out. `PaymentPopup` records nothing. `ReceiptPrint` always prints "Paid in Full".
- There is no student login, no PDF materials portal, no ID card PDF generator, no certification print view, and no pricing bill print view.
- `src/lib/db.ts` is a `node-localstorage` shim, not a database.
- Font Awesome is loaded from a CDN in `layout.tsx`; `lucide-react` is also installed.

## 3. Decisions locked by the owner

| # | Decision |
| --- | --- |
| D1 | The public name is **Albarika Computer Institute** in all UI, metadata, PDFs, bills, and receipts. |
| D2 | Hero headline and lead keep and refine the core message: **"Your Gateway to Quality Computing Services"** — *"Practical IT training for students, and dependable computing services for everyone: design, typesetting, documents, exam registration and computer repair."* |
| D3 | Hero buttons: **"Enrol in a course"** (primary, links to `/enrol`) and **"Contact us"** (secondary, scrolls to `#contact`). |
| D4 | Hero uses the **Discord-inspired deep midnight-to-royal-indigo gradient** (`#080A24` → `#171F78` → `#2B36C9`), wide heavy uppercase display font (`Unbounded` Black), zero floating background shapes, and **three smooth 3D-illustrated student cards with realistic room backgrounds** (`/image/illustration-services.jpg`, `/image/illustration-students.jpg`, `/image/illustration-mentorship.jpg`, with female students wearing a modest hijab/headscarf). |
| D5 | Standing is **Partial** or **Complete**, set by staff on approval, and follows money received against the course fee. A later payment moves Partial → Complete on the same enrolment. Staff can also set **Closed** if an enrolment is stopped. |
| D6 | Course materials are **PDFs** (`kind: "pdf"`). Every PDF is marked **Partial** or **Complete**. Partial standing opens Partial PDFs. Complete standing opens all PDFs for that course. |
| D7 | **Student login** uses a **username (unique student code, e.g. `ALB-2026-0042`) and password** issued when staff approves or registers the student. |
| D8 | **ID card** is a downloadable **PDF** for approved students (`standing !== "closed"`). It **carries an expiry date** (`endDate` of the course) alongside student photo, full name, student code, course title, and start date. Visual styling of the final PDF can be refined at the portal stage. |
| D9 | **Testimonials in `TestimonialsSection.tsx` are real** (Musa Ibrahim, Habeeb) and must be kept on the landing page, restyled to match the new design system. |
| D10 | **Pricing bill** is a printable admin document per enrolment showing course, total fee, amount received, balance, and payment status (Partially Paid vs Paid in Full). |
| D11 | **Student certification** is a printable admin document for completed students; its visual artwork will be designed when that stage begins. |
| D12 | Live courses with registration and fees: Desktop Publishing (3 months — ₦25,000), Desktop Publishing (6 months — ₦45,000), Programming Class (6 months — ₦60,000), Computer Maintenance (3 months — ₦35,000), Data Entry (2 months — ₦20,000). |

## 4. Domain model

Names follow `GLOSSARY.md`.

```
Course
  id, slug, title, durationMonths, feeNaira, summary, topics[], published

EnrolmentRequest            # created by the public /enrol form
  id, createdAt
  courseId
  fullName, phone, email?, dateOfBirth, gender, address
  photo (image, ≤500 KB after client compression)
  guardianName, guardianPhone, guardianRelationship
  previousEducation?, note?
  status: "new" | "approved" | "declined"

Student
  id
  studentCode               # unique code used as login username, e.g. "ALB-2026-0042"
  passwordHash              # initial password generated/set on approval and shared with student
  fullName, phone, email?, dateOfBirth, gender, address, photo
  guardianName, guardianPhone, guardianRelationship

Enrolment                   # created when staff approves a request, or registers at the desk
  id, studentId, courseId
  startDate                 # ISO date
  expiryDate                # ISO date (startDate + course.durationMonths), printed on ID card
  feeNaira                  # copied from course at approval
  amountReceivedNaira       # sum of payments
  standing: "partial" | "complete" | "closed"
  approvedBy, approvedAt

Payment
  id, enrolmentId, amountNaira
  method: "cash" | "transfer" | "card" | "mobile money"
  receivedAt, receivedBy, note?

Material                    # PDF course material
  id, courseId, title
  kind: "pdf"
  fileUrl, fileSizeBytes?, pageCount?
  module                    # e.g. "Module 1 — Fundamentals"
  order: number
  requires: "partial" | "complete"

Message                     # submitted via "Contact us" form
  id, createdAt
  fullName, phone, email?
  topic: "training" | "document-services" | "exam-prep" | "maintenance" | "general"
  body
  status: "new" | "handled"
```

### Standing & access rules (`src/lib/standing.ts`)

- `canOpenMaterial(material, enrolment)`:
  - `enrolment.standing === "closed"` → `false`
  - `enrolment.standing === "partial"` → `material.requires === "partial"`
  - `enrolment.standing === "complete"` → `true`
- `canDownloadIdCard(enrolment)` → `enrolment.standing === "partial" || enrolment.standing === "complete"`
- `balanceNaira(enrolment)` → `Math.max(0, enrolment.feeNaira - enrolment.amountReceivedNaira)`
- Standing is explicitly approved/updated by staff, with the admin UI suggesting `"complete"` when `amountReceivedNaira >= feeNaira` and `"partial"` when `0 < amountReceivedNaira < feeNaira`.
- Enforce these rules **on the server** before streaming any PDF material or generating the ID card PDF.

## 5. Backend contract

The external API at `NEXT_PUBLIC_BASE_URL` is the system of record (admin login already uses it). Check which endpoints exist before wiring. For local development and until backend endpoints are live, implement Next route handlers in `src/app/api/` backed by a single repository adapter (`src/lib/repo/`) with seed data so the entire flow works end-to-end locally.

Public (no auth):

- `GET  /api/courses` → published courses
- `POST /api/enrolment-requests` (multipart or JSON with compressed base64/blob photo) → `{ id, reference }`
- `POST /api/messages` → `{ id }`

Student (`student_token` HttpOnly cookie):

- `POST /api/student/auth/login` `{ studentCode, password }` → sets `student_token` cookie, returns `{ student, enrolment }`
- `POST /api/student/auth/logout` → clears `student_token`
- `GET  /api/student/me` → student profile + active enrolment (`standing`, `feeNaira`, `amountReceivedNaira`, `balanceNaira`, `startDate`, `expiryDate`)
- `GET  /api/student/enrolments/:id/materials` → list of PDF materials with `open: boolean`; locked rows omit `fileUrl`
- `GET  /api/student/materials/:id/pdf` → streams PDF bytes if `canOpenMaterial`, else `403`
- `GET  /api/student/enrolments/:id/id-card.pdf` → generates/streams student ID card PDF (including `studentCode` and `expiryDate`) if `canDownloadIdCard`, else `403`

Admin (`auth_token` cookie):

- `GET  /api/admin/enrolment-requests`, `POST /api/admin/enrolment-requests/:id/approve` `{ standing, amountReceivedNaira, paymentMethod, initialPassword? }` → returns generated `{ studentCode, initialPassword, enrolmentId }`
- `POST /api/admin/enrolment-requests/:id/decline`
- `GET/POST /api/admin/enrolments`, `PATCH /api/admin/enrolments/:id` `{ standing }`
- `POST /api/admin/enrolments/:id/payments`
- `GET/POST/PATCH/DELETE /api/admin/courses/:id/materials` (PDF upload + `requires: "partial" | "complete"`)
- `GET  /api/admin/enrolments/:id/bill` → pricing bill data
- `GET  /api/admin/enrolments/:id/certification` → certification data
- `GET  /api/admin/messages`, `PATCH /api/admin/messages/:id`

## 6. Phases and acceptance criteria

### Phase 1 — New landing page, Contact us form, Enrolment request flow

Routes: `/`, `/enrol`, `/enrol/sent`.

- [ ] All sections per `design.md` §5: Nav, Hero (with refined "Your Gateway to Quality Computing Services" copy, "Enrol in a course" + "Contact us" buttons, and 3 visual fanned cards with student/lab imagery), Courses, How Enrolment & Standing Works (interactive preview), Computing Services, About (with CEO Mrs. Kareem Khadijat), Testimonials (real testimonials from Musa Ibrahim & Habeeb), Contact us, Footer.
- [ ] All "Albarika Computer Centre" text replaced with **"Albarika Computer Institute"**.
- [ ] Courses section lists the 5 live courses with fees in ₦ and a 3-month / 6-month toggle on Desktop Publishing.
- [ ] `/enrol`: 4-step enrolment request form (Course → About you & Photo → Guardian → Review) with live `IdCardPreview` showing student photo, name, course, and projected expiry date.
- [ ] Client-side photo compression (≤ 500 KB) extracted into `src/lib/compress-image.ts`.
- [ ] Enrolment draft persists across refresh (`zustand` `persist`) and clears on submit.
- [ ] Contact us form submits to `POST /api/messages`, validates with `zod`, shows a Sonner toast on success, and resets.
- [ ] WhatsApp, `tel:`, `mailto:`, and Google Maps directions to 56 Freeman Street work.
- [ ] Keyboard accessible, `prefers-reduced-motion` respected, responsive down to 360 px, Font Awesome CDN removed in favour of `lucide-react`.

### Phase 2 — Student portal (Login with student code, PDF materials, ID card PDF with expiry date)

Routes: `/portal/login`, `/portal`, `/portal/materials/[id]`.

- [ ] `/portal/login`: Student logs in with **Student Code** (username, e.g. `ALB-2026-0042`) and **Password**.
- [ ] `/portal`: Student dashboard showing greeting, course card, Standing badge (`Partial` or `Complete`), fee paid vs balance (`NumberFlow`), course PDF list grouped by module, and the Student ID Card tile.
- [ ] PDF materials marked `Partial` open for both Partial and Complete standing; PDFs marked `Complete` show a clear lock state for Partial students ("Unlocks when your fee is complete — balance ₦20,000") and open for Complete students.
- [ ] Clicking an open PDF material opens `/portal/materials/[id]` with an inline PDF viewer and a "Download PDF" button.
- [ ] "Download ID card (PDF)" generates a PDF with `pdf-lib` containing: **Albarika Computer Institute** header & logo, student photo, full name, **Student Code**, course title, **Start Date**, and **Expiry Date**.
- [ ] Server routes return `403` if a Partial student requests a Complete-only PDF or if a Closed enrolment requests any file.

### Phase 3 — Admin approvals, PDF material uploads, Pricing bills & Certifications

Routes under `/admin`.

- [ ] Approve enrolment request: sets standing (`Partial` or `Complete`), records initial payment, generates unique **Student Code** (`ALB-YYYY-NNNN`) and initial password, and displays them so staff can share them with the student (or print them on the pricing bill).
- [ ] Record additional payment on an existing enrolment and upgrade standing from `Partial` → `Complete`.
- [ ] Upload/manage course PDFs and tag each PDF as `Partial` or `Complete`.
- [ ] Print **Pricing Bill** (`/admin/enrolments/[id]/bill/print`): shows student name, student code, course, total fee, amount received, balance, standing (`PARTIALLY PAID` vs `PAID IN FULL`), and payment history.
- [ ] Print **Student Certification** (`/admin/enrolments/[id]/certification/print`): printable page for completed students (visual artwork to be styled when that stage starts).

## 7. Remaining external dependency note

- Confirm when the external backend at `NEXT_PUBLIC_BASE_URL` is ready to expose the endpoints in §5; until then, keep the local repository adapter in `src/lib/repo/` active so Phase 1–3 can be built and tested without blocking.
