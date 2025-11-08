# Ward Watch - Design Guidelines

## Design Approach

**System Selection**: Material Design 3 for admin dashboard with creative freedom for public landing page

**Rationale**: Ward Watch is primarily a utility-focused, information-dense application requiring exceptional data clarity, efficient workflows, and reliable interaction patterns. Material Design 3 provides robust components for complex tables, forms, and notifications while maintaining healthcare-appropriate professionalism.

---

## Typography System

**Font Stack**: 
- **Primary (UI)**: Inter (Google Fonts) - body text, tables, forms, labels
- **Display (Marketing)**: Poppins (Google Fonts) - landing page headlines, hero sections
- **Monospace**: JetBrains Mono - patient IDs, timestamps, medical codes

**Type Scale**:
- Hero Display: text-5xl font-bold (landing page)
- Page Titles: text-3xl font-semibold
- Section Headers: text-xl font-semibold
- Card Titles: text-lg font-medium
- Body Text: text-base font-normal
- Table Headers: text-sm font-semibold uppercase tracking-wide
- Table Cells: text-sm font-normal
- Labels: text-sm font-medium
- Helper Text: text-xs font-normal

---

## Spacing System

**Tailwind Units**: Consistently use units 2, 4, 6, 8, 12, 16 for predictable rhythm

**Application**:
- Component padding: p-4, p-6
- Card spacing: p-6, p-8
- Section margins: mb-8, mb-12, mb-16
- Table cell padding: px-4 py-3
- Form field spacing: space-y-4
- Button padding: px-4 py-2 (standard), px-6 py-3 (large)
- Modal padding: p-8

---

## Layout Architecture

### Public Landing Page

**Hero Section** (h-screen):
- Full-viewport hero with large background image showing modern hospital/healthcare setting
- Centered content overlay with blurred background button (backdrop-blur-md bg-white/10)
- Headline + subheadline + primary CTA
- Subtle down-scroll indicator

**Content Sections** (py-20):
- Features Grid: 3-column grid (grid-cols-1 md:grid-cols-3 gap-8)
- Benefits: 2-column split with image + text alternating
- Social Proof: Testimonial cards in masonry layout
- CTA Section: Centered with strong call-to-action

**Images**: 
- Hero: Large healthcare professional/hospital technology imagery
- Features: Icon-based (no images, use Material Icons)
- Benefits: Real product screenshots or hospital environment photos

### Admin Dashboard

**Layout Structure**:
- Fixed header (h-16) with logo, notifications bell, admin profile
- Tab navigation bar (h-12) below header, sticky positioning
- Main content area with max-w-7xl mx-auto px-8
- No sidebar - tab-based navigation for cleaner focus

**Data Tables**:
- Full-width responsive tables with horizontal scroll on mobile
- Sticky table headers
- Alternating row backgrounds (even rows slightly shaded)
- Action buttons aligned right in each row
- Inline editing cells with subtle border on focus

---

## Component Library

### Navigation
- **Landing Header**: Transparent with backdrop-blur on scroll, logo left, login button right
- **Admin Tabs**: Horizontal pill-style tabs with active indicator, fixed below main header
- **Breadcrumbs**: For patient detail views (Home > Patients > John Doe)

### Cards
- **Treatment Cards**: Elevated surface (shadow-md), rounded-lg, border-l-4 for priority (red=high, yellow=medium, green=low)
- **Patient Cards**: Clean white background, subtle shadow, hover:shadow-lg transition
- **Stat Cards**: Grid layout for dashboard metrics, large number + label format

### Forms
- **Input Fields**: Outlined style, rounded border, focus:ring-2 focus:border-primary
- **Select Dropdowns**: Consistent with inputs, chevron-down icon
- **Checkboxes**: Material Design style with checkmark animation
- **Date/Time Pickers**: Inline calendar widget in modals

### Buttons
- **Primary**: Solid fill, medium roundedness (rounded-md), font-medium
- **Secondary**: Outlined with transparent background
- **Tertiary**: Text-only with hover background
- **Icon Buttons**: Square with icon centered, subtle hover background
- **Floating Action Button**: Bottom-right for quick actions (Add Patient/Treatment)

### Tables
- **Time-Grouped Timeline**: 
  - Time column (w-24, font-semibold)
  - Patient info columns (IPD, Name, Age/Gender, Bed, Ward, Diagnosis)
  - Treatment badges inline (medication=pill icon, procedure=tool icon, investigation=lab icon)
  - Action column (w-32) with icon buttons (Add, Edit, Delete)
  - Completion checkbox in dedicated column (w-16)
  
- **Row Grouping**: Border-t-2 between different time groups, subtle background for grouped rows

### Modals
- **Add/Edit Treatment Modal**: 
  - Centered overlay (max-w-2xl)
  - Header with title + close button
  - Form sections with clear labels
  - Footer with Cancel + Save buttons (right-aligned)
  - Backdrop with dark overlay (bg-black/50)

### Notifications
- **Popup System**: 
  - Fixed position top-right corner
  - Stacked notification cards (max 3 visible)
  - Each card: left border for priority, treatment icon, patient info, time, acknowledge button
  - Auto-dismiss after 10 seconds unless high priority
  - Slide-in animation from right

### Status Indicators
- **Priority Badges**: Rounded-full px-3 py-1 text-xs font-semibold (High=red, Medium=yellow, Low=green)
- **Completion Status**: Checkmark icon in circle for completed, outline circle for pending
- **Patient Status**: Active=green dot, Discharged=gray dot with label

---

## Interaction Patterns

### Inline Editing
- Click cell to enable edit mode
- Input appears with focus
- Save on blur or Enter key
- Cancel on Escape
- Loading spinner during save

### Time-Grouped Actions
- Add button opens modal pre-filled with selected time slot
- Edit enables inline editing for all cells in row
- Delete shows confirmation dialog

### Patient Discharge
- Dedicated "Discharge" button in patient row
- Confirmation modal with discharge date picker
- Success toast notification

### Notification Acknowledgment
- Click anywhere on notification card to acknowledge
- Fade-out animation on acknowledge
- Checkmark icon appears briefly before removal

---

## Accessibility

- All interactive elements keyboard accessible (Tab navigation)
- ARIA labels for icon-only buttons
- Color not sole indicator (use icons + text for status)
- Focus states visible with ring-2 outline
- Minimum touch target 44x44px for mobile
- High contrast text (WCAG AA compliance)

---

## Responsive Behavior

**Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)

- **Landing Page**: Single column on mobile, multi-column on md+
- **Admin Tables**: Horizontal scroll on mobile, full table on lg+
- **Modals**: Full-screen on mobile, centered overlay on md+
- **Navigation**: Hamburger menu on mobile, full tabs on md+

---

This design system balances the clinical precision required for healthcare data management with the approachability needed for a modern SaaS landing page.