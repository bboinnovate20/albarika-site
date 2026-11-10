# Albarika Computer Institute — design detail

Companion to [spec.md](./spec.md). This document is the visual and interaction target. When it disagrees with the current code, this document wins. When it disagrees with spec.md on behaviour, spec.md wins.

Figma: [Albarika hero explorations](https://www.figma.com/design/h6DLwBu49RwO8ghuWy53kE) — frame **"D - Fanned cards"** is the chosen hero direction, updated with the Discord-inspired deep midnight-to-royal-indigo background gradient, wide heavy display typography (`Unbounded` Black), **"Contact us"** button, zero background sticker clutter, and three smooth 3D-illustrated student cards with realistic room backgrounds.

## 1. Visual Direction: "Discord-Inspired Royal Indigo + Smooth 3D Student Showcase"

Inspired by the owner's Discord hero reference and Podia's fanned card composition, tailored to **Albarika Computer Institute**:

- **Deep Midnight-to-Royal-Indigo Hero Atmosphere:**
  - The hero opens on a rich, smooth gradient (`linear-gradient(135deg, #080A24 0%, #171F78 55%, #2B36C9 100%)`) with a subtle radial royal-blue glow — clean, modern, and completely free of noisy floating geometric shapes.
- **Bold Wide Display Typography (Discord-style):**
  - **Headline (`Unbounded` Black, uppercase, tight tracking):**
    **"YOUR GATEWAY TO QUALITY COMPUTING SERVICES"** *(or any of the approved headline options in §5.1)*.
  - **Lead (`Figtree` Medium, `#D7DCFF`):**
    *"Practical IT training for students, and dependable computing services for everyone: design, typesetting, documents, exam registration and computer repair."* Max width `720px`, two lines on desktop.
  - **Hero CTAs (Discord pair):**
    - **Primary:** `"Enrol in a course"` — crisp white fill (`#FFFFFF`), deep navy text (`#080A24`), pill/rounded-xl button (`/enrol`).
    - **Secondary:** `"Contact us"` — Discord Blurple fill (`#5865F2`), white text (`#FFFFFF`), pill/rounded-xl button (`#contact`).
- **Three Fanned Smooth 3D-Illustrated Cards (Realistic Room Backgrounds, No Noisy Shapes):**
  - The three cards show the three sides of the institute: services, training, mentorship.
  - **Left card (rotated +6°):** `/image/illustration-services.jpg` — a young man designing a flyer while a young woman in a maroon hijab checks fresh prints (computing services).
  - **Centre card (front, 0°, 440×380):** `/image/illustration-students.jpg` — a female student in a navy hijab and a male student with glasses coding together (training).
  - **Right card (rotated −6°):** `/image/illustration-mentorship.jpg` — an instructor guiding a hijab-wearing student at a workstation (mentorship).
  - `/image/illustration-lab.jpg` (young adults at rows of desktops) is reserved for the Courses section, not the hero.
  - Each card is a pure rounded frame: `border-radius: 28px`, `2px inset rgba(255,255,255,0.28)` edge, shadow `0 28px 56px -12px rgba(8,10,36,0.55)`, `object-cover`, no text inside.
  - A soft blurred blurple glow (`rgba(110,122,255,0.85)`, ellipse ~1100×380, `blur(140px)`) sits behind the cards so they lift off the gradient.
  - The cards sink slightly into a `paper` (`#F3F6FB`) arc, which is the top edge of the Courses section, not a white bowl. Keep ~95px between the CTAs and the top of the centre card.

## 2. References

| Use | Reference |
| --- | --- |
| Hero background palette, wide heavy uppercase display font, and White + Blurple CTA pair | Discord landing page (owner screenshot reference) + Figma frame `D - Fanned cards` |
| Fanned 3-card hero showcase layout | Podia landing page (owner screenshot reference) |
| Course catalog cards & level chips | [Uxcel](https://mobbin.com/sites/sections/cf3bf3e2-fdbd-440f-b829-85f1e874063d) |
| Student dashboard with course progress | [Uxcel dashboard](https://mobbin.com/screens/de53d532-f4ae-4d3a-a132-c601b845704b) |
| Course modules & progress bar | [Circle](https://mobbin.com/screens/afde5712-b2c0-4fc1-be7b-4ac42446d642) |
| PDF material viewer layout | [Whop course](https://mobbin.com/screens/4d015c93-854e-42b3-a5a0-ac25fb45dc66) |
| Chip-style choices in forms | [Preply](https://mobbin.com/screens/17e64efe-573c-4152-b18c-29c90bb0d47c) |
| Clean multi-step progress bar | [Turo](https://mobbin.com/screens/d8edcc8e-5366-4f29-a9f3-75884562e1d8) |

## 3. Tokens

Put these in `src/app/globals.css` under `@theme` (Tailwind v4).

### Colour

| Token | Hex / Value | Use |
| --- | --- | --- |
| `hero-deep` | `#080A24` | Hero gradient start, dark footer, primary text on light surfaces |
| `hero-mid` | `#171F78` | Hero gradient mid-stop |
| `hero-glow` | `#2B36C9` | Hero gradient end / ambient radial glow |
| `blurple` | `#5865F2` | Secondary hero CTA (`Contact us`), primary interactive accent, active borders |
| `blurple-soft` | `#D7DCFF` | Hero lead copy on dark royal background |
| `ink` | `#14215B` | Headings and primary buttons on light sections |
| `sky` | `#2E9BE6` | Secondary accents, focus rings |
| `red` | `#E5231B` | Locked badges, error states |
| `sun` | `#FFC845` | Partial standing badge, warm highlights |
| `paper` | `#F3F6FB` | Light section background below the fold |
| `white` | `#FFFFFF` | Card surfaces, primary hero CTA fill |
| `muted` | `#4A5578` | Supporting copy on light sections (≥ 7:1 on `paper`) |
| `line` | `#DCE3EF` | Hairline borders and dividers on light sections |
| `success` | `#1F9D6B` | Complete standing badge, unlocked checkmarks |

### Typography

Load via `next/font/google` in `src/app/layout.tsx`; remove `PT_Sans` and the Font Awesome `<link>`.

- **Display (Discord Ginto Nord equivalent on Google Fonts):** `Unbounded` (weights `800`, `900`), uppercase for the hero headline with `letter-spacing: -0.02em` and `line-height: 1.04`, and `700`/`800` sentence-case for section titles below the fold.
- **UI & Body:** `Figtree` (weights `500`, `600`, `700`). Default body weight `500`.
- **Monospace (Student Code & Receipt/Bill numbers):** `JetBrains Mono` (`font-mono`) so student codes like `ALB-2026-0042` are unmistakable.

| Role | Desktop → Mobile |
| --- | --- |
| Hero headline (`Unbounded` 900, uppercase) | `54px / 56px` → `34px / 38px`, tracking `-0.02em` |
| Section title (`Unbounded` 800) | `40px / 44px` → `28px / 32px` |
| Card title (`Figtree` 700) | `22px / 26px` → `20px / 24px` |
| Lead paragraph (`Figtree` 500) | `19px / 28px` → `17px / 26px` |
| Body (`Figtree` 500) | `16px / 24px` |
| Small / meta / badges (`Figtree` 700) | `13px / 18px` |

### Shape, Borders & Spacing

- Radii: `card` `28px`, `inner-image` `16px`, `input` `14px`, buttons & badges `9999px` (pill).
- Hero cards: `border-radius: 28px`, `2px inset rgba(255,255,255,0.28)`, soft shadow `0 28px 56px -12px rgba(8, 10, 36, 0.55)`.

## 4. Core Components

Build with `class-variance-authority` (`cva`) and `clsx`:

- **`Button`**:
  - `heroPrimary`: `bg-white text-[#080A24] hover:bg-[#EEF0FF]` (used on dark royal hero)
  - `heroSecondary`: `bg-[#5865F2] text-white hover:bg-[#4752C4]` (used for `"Contact us"` on dark royal hero)
  - `primary`: `bg-ink text-white hover:bg-[#1E2F7A]` (used on light sections)
  - `secondary`: `bg-white text-ink border-2 border-ink`
  - All buttons use pill radius (`rounded-full`) and `scale(0.97)` on `:active`.
- **`StandingBadge`**:
  - `Partial`: `bg-sun text-ink` — *"Partial Approval • Starter PDFs Open"*
  - `Complete`: `bg-success text-white` — *"Complete Approval • All PDFs Open"*
  - `Closed`: `bg-line text-muted` — *"Closed"*
- **`IdCardPreview`**: Reusable visual card component showing:
  - Header bar in `ink` with `/image/logo.jpeg` and **"Albarika Computer Institute"**
  - Student photo (`aspect-square` rounded-2xl)
  - Full Name, **Student Code** (`ALB-2026-XXXX` in monospace), Course Title
  - **Issued Date** and **Expiry Date** (highlighted clearly)
  - Used in the interactive "How Enrolment Works" section, the `/enrol` live preview, and the `/portal` dashboard.
- **`PdfMaterialRow`**: Shows PDF icon (`FileText` from `lucide-react`), module tag, title, page count/size, required standing pill (`Partial` or `Complete`), and either **"Read / Download PDF"** (when unlocked) or a lock icon + balance needed (when locked).
- **`NumberFlow`**: Wraps all Naira fee, amount paid, and balance figures (`₦25,000`, `₦45,000`, `₦60,000`).

## 5. Screen-by-Screen Layout

### 5.1 Landing Page (`/`)

1. **Navigation (`src/components/Navigation.tsx`)**
   - Over the hero: transparent over the deep royal gradient with crisp white links; after scrolling past 24 px, transitions to a blurred dark navy bar (`bg-[#080A24]/90 backdrop-blur-md border-b border-white/10`).
   - Left: `/image/logo.jpeg` + **Albarika** / *Computer Institute*.
   - Centre links: `Courses`, `How It Works`, `Services`, `Testimonials`, `Contact us`.
   - Right: `Student login` (`/portal/login`) + white pill button `Enrol` (`/enrol`).
2. **Hero (`src/components/HeroSection.tsx`)**
   - Implemented as Figma frame **`D3 - Light with shapes`** (node `22:2`), using the D2 brand tokens (ink, blurple, paper, Unbounded, Figtree). Light canvas `#F5F6FA`, ink headline, ink primary CTA, white outlined secondary CTA. Nine pastel floaters sit in the margins: a coral blob, a sun triangle, a sky pentagon, a lavender half-circle, plus a monitor, file, mouse, `</>` tag and pointer. They drift `translateY(-8px)` over 6–9s, and the drift is off under `prefers-reduced-motion`. The dark D2 gradient is not the landing hero; `hero-deep` remains the footer colour.
   - Background: smooth linear + radial gradient (`#080A24` → `#171F78` → `#2B36C9`), **no floating geometric shapes in the background**.
   - Headline (`Unbounded` Black, uppercase, white): **"YOUR GATEWAY TO QUALITY COMPUTING SERVICES"** *(or approved alternative such as **"LEARN DIGITAL SKILLS. GET QUALITY COMPUTING DONE."**)*.
   - Subheadline (`Figtree` Medium, `#D7DCFF`, max-width 720px): *"Practical IT training for students, and dependable computing services for everyone: design, typesetting, documents, exam registration and computer repair."*
   - Primary CTA: **"Enrol in a course"** (white pill → `/enrol`). Secondary CTA: **"Contact us"** (Blurple `#5865F2` pill → `#contact`).
   - **Three Fanned Smooth 3D-Illustrated Cards** sinking into the `paper` curve (`rounded-[28px]`, `ring-2 ring-inset ring-white/28`, soft shadow, blurple glow behind):
     1. **Left (+6°):** `/image/illustration-services.jpg` (design and print services).
     2. **Centre (0°, front):** `/image/illustration-students.jpg` (hijab-wearing female student and male student coding together).
     3. **Right (−6°):** `/image/illustration-mentorship.jpg` (instructor guiding a hijab-wearing female student at a workstation with printer).
3. **Training Courses (`#courses`)**
   - Displays the 5 live courses with real fees on a clean `paper` (`#F3F6FB`) background:
     - **Desktop Publishing** — interactive segmented pill toggle (`3 months • ₦25,000` ↔ `6 months • ₦45,000` with `NumberFlow`)
     - **Programming Class** (`6 months • ₦60,000`)
     - **Computer Maintenance** (`3 months • ₦35,000`)
     - **Data Entry** (`2 months • ₦20,000`)
   - Each card notes: *"Partial payment opens starter PDF materials • Full payment opens all PDFs + ID card"*, and has an **"Enrol in this course"** button linking to `/enrol?course=<slug>`.
4. **How Enrolment & Approval Works (`#how-it-works`)**
   - Interactive 4-step switcher on the left, live preview on the right:
     1. *Register & choose your course online*
     2. *Pay part or full tuition at the institute*
     3. *Partial Approval: get your Student Code, ID Card & starter PDFs*
     4. *Complete Approval: unlock every course PDF & graduate for Certification*
   - Clicking each step animates the sample Student Portal & ID Card on the right (swapping the standing badge between `Partial` and `Complete`, rolling the balance to `₦0`, and unlocking the PDF rows).
5. **Computing Services (`#services`)**
   - 6-card bento grid covering all company work:
     1. **Document Services & Typesetting** (Typing, scanning, photocopying, laminating, book/project typesetting — *On Demand*)
     2. **JAMB, WAEC & Online Registration** (JAMB/WAEC forms, university & job applications, government portals — *Instant*)
     3. **CBT Exam Preparation** (JAMB CBT training, WAEC prep, mock exams, result checking — *Flexible*)
     4. **Computer Maintenance & Repair** (Hardware repair, OS/software installation, virus removal, networking — *Same Day*)
     5. **Data Entry & Database Management** (Spreadsheets, record keeping, data analysis — *24–48 Hours*)
     6. **Academic & Business Project Creation** (Student projects, proposals, research papers, presentations — *1–7 Days*)
   - Each card has a **"Request this service"** link that scrolls to `#contact` and preselects that service topic in the Contact form.
6. **About & Leadership (`#about`)**
   - Features **Mrs. Kareem Khadijat** (Chief Executive Officer, `/image/ceo.jpeg`) with her quote updated to **Albarika Computer Institute**, plus key trust facts (`500+ Satisfied Clients`, `8+ Years Experience`, `56 Freeman Street, Lagos Island`).
7. **Real Student & Staff Testimonials (`#testimonials`)**
   - Preserves the real testimonials from `TestimonialsSection.tsx` (**Musa Ibrahim** on mobile/software development and mentorship; **Habeeb** on design thinking and UX problem-solving), styled as clean cards with 5-star badges.
8. **Contact Us (`#contact`)**
   - Left: Contact cards (Campus address at 56 Freeman Street with Google Maps link, Phone numbers `08092183810` / `08028638778`, Email `albarikacomputercentre@gmail.com`, and 24/7 WhatsApp chat button).
   - Right: Working **Contact us** form (Full Name, Phone, Email, Service/Program topic chips, Message) wired to `POST /api/messages` with Sonner toast feedback.
9. **Footer**
   - Deep `#080A24` background, logo, quick links, courses, services, address, and copyright for **Albarika Computer Institute**.

### 5.2 Enrolment Request Flow (`/enrol` & `/enrol/sent`)

- Two-column layout on desktop:
  - **Left:** 4-step form (`1. Course` → `2. Personal & Photo` → `3. Guardian` → `4. Review & Submit`) with Turo/Preply-inspired progress bar and chip selectors.
  - **Right:** Sticky live **`IdCardPreview`** that updates as the student picks a course, types their name, and uploads their photo, showing the calculated **Expiry Date** based on course duration.
- Submitting sends `POST /api/enrolment-requests` and transitions to `/enrol/sent` with the animated **success check** (`10-success-check.md`), their application reference number, and instructions to visit or contact the institute for partial or full payment approval.

### 5.3 Student Portal (`/portal/login`, `/portal`, `/portal/materials/[id]`)

- **`/portal/login`**: Clean card with two fields:
  - **Student Code (Username)** — e.g. `ALB-2026-0042` (monospace input, auto-uppercased)
  - **Password** — with show/hide toggle
  - Helper note: *"Your unique Student Code and password are given to you at the institute once your enrolment is approved."*
- **`/portal`**:
  - Top bar: Student name, Student Code pill, `StandingBadge` (`Partial` or `Complete`), Log out.
  - **Enrolment Summary Card:** Course title, start date, **expiry date**, fee progress bar, Amount Paid vs Balance (`NumberFlow`).
  - **Official Student ID Card Panel:** Live preview of their ID card (including photo, Student Code, Course, Start Date, **Expiry Date**) + **"Download ID Card (PDF)"** button.
  - **Course PDF Materials List:** Grouped by module.
    - Each row shows PDF title, module, page count, and a `Partial` or `Complete` tag.
    - If `standing === "partial"`, `Partial` PDFs have **"Read PDF"** + **"Download PDF"** buttons; `Complete` PDFs show a lock badge: *"Unlocks on Complete Approval (Balance: ₦20,000)"*.
    - If `standing === "complete"`, all PDFs are unlocked.

### 5.4 Admin Print Views (Pricing Bill & Student Certification)

- **Pricing Bill (`/admin/enrolments/[id]/bill/print`):** Printable A4 sheet with **Albarika Computer Institute** header, receipt/bill number, student name, **Student Code**, course, total fee, amount paid, **balance remaining**, and clear status stamp (`PARTIALLY PAID` or `PAID IN FULL`). Also prints the student's login `Student Code` on first approval so the front desk can hand the slip directly to the student.
- **Student Certification (`/admin/enrolments/[id]/certification/print`):** Printable route with student name, course completed, duration, completion date, certification number, and signature blocks (visual artwork deferred until the certification design stage).

## 6. Motion & Animation Spec (`transitions-dev`, `transitions-polish`, `improve-animations`)

Copy the motion tokens from `~/.claude/skills/transitions-dev/_root.css` into `src/app/globals.css`.

- **Rules:**
  - Never use `transition: all`. Animate only `transform`, `opacity`, and `filter`.
  - Asymmetric open/close timing: opens use `--duration-fast` (`250ms`), closes use `--duration-quick` (`150ms`), both with `--ease-smooth-out` (`cubic-bezier(0.22, 1, 0.36, 1)`).
  - Wrap the app in `<MotionConfig reducedMotion="user">` and preserve `@media (prefers-reduced-motion: reduce)` blocks on all `t-*` CSS recipes.

| Surface | Recipe / Library | Spec |
| --- | --- | --- |
| Hero headline, lead & CTAs | `18-texts-reveal.md` (`.t-stagger`) | Staggered rise (`12px`) + cross-blur (`3px`), `500ms` `--ease-in-out`, `80ms` stagger |
| Hero 3 fanned illustration cards | `motion/react` spring + `11-avatar-group-hover.md` | Fan out on load (`spring(0.6s, bounce 0.2)`); hovering a card lifts it `translateY(-12px) rotate(0deg) scale(1.02)` and nudges neighbours |
| Desktop Publishing 3m / 6m toggle | `16-tabs-sliding.md` (`.t-tabs`) + `NumberFlow` | Sliding pill (`250ms` `--ease-smooth-out`) while fee rolls `₦25,000` ↔ `₦45,000` |
| "How Enrolment Works" interactive preview | `04-text-states-swap.md` + `09-icon-swap.md` + `NumberFlow` | Clicking steps swaps Standing badge (`Partial` ↔ `Complete`), cross-fades lock → open PDF icons, and rolls balance |
| `/enrol` step transitions | `08-page-side-by-side.md` | `250ms` `--ease-smooth-out`, `8px` travel, `3px` blur |
| `/enrol` photo compression status | `15-shimmer-text.md` (`.t-shimmer`) | Pure CSS shimmer while compressing image |
| Form validation error | `12-error-state-shake.md` | Shake invalid field on submit attempt and focus it |
| Form submission success | `10-success-check.md` (`.t-success-check`) + `sonner` | Stroke-draw checkmark on `/enrol/sent` and toast on Contact us submit |
| Portal Partial → Complete unlock | `09-icon-swap.md` staggered `40ms` per PDF row | First login after Complete approval unlocks PDF rows sequentially |

## 7. Libraries to Install (`pick-ui-library`)

```bash
pnpm add motion @number-flow/react sonner zustand react-hook-form zod @hookform/resolvers
```

- **`motion`** (`motion/react`): Hero card fan-out and spring interactions.
- **`@number-flow/react`**: Course fee toggle and student balance counters.
- **`sonner`**: Toast notifications for Contact us, Enrolment request, ID card download, and Admin actions.
- **`zustand`**: Persisted enrolment request draft (`useEnrolmentDraft`) so students don't lose progress on refresh.
- **`react-hook-form` + `zod`**: Validation for the Contact us form, 4-step Enrolment form, and Student Code + Password login.
- **Already installed & kept:** `@radix-ui/*` primitives, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `pdf-lib` (for server-side ID card PDF generation with expiry date).
