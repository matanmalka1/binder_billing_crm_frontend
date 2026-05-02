# Frontend Redesign — Task Board

## אפיון

- [x] **0.1** צור אפיון מסכים וסידור ניווט: `SCREEN_SPEC.md`
- [x] **0.2** עדכן routes ו-sidebar לפי האפיון
- [x] **0.3** צור redirects זמניים לנתיבים ששונו
- [x] **0.4** הסר כפילויות מה-sidebar והשאר רק מסכי עבודה או דוחות ניהול מובהקים
- [x] **0.5** הסר routes עצמאיים למסכים כפולים
- [x] **0.6** העבר דוחות ניהול ל-sidebar תחת `דוחות` והסר אותם כטאבים ממסכי עבודה

## שלב 1 — תשתית משותפת

- [x] **1.1** צור `<FilterPanel fields={[...]} />` והחלף את כל 9 filter bars
  - `ClientsFiltersBar`, `ChargesFiltersCard`, `AdvancePaymentsFiltersBar`, `RemindersFiltersBar`, `UsersFiltersBar`, `TaxDeadlinesFilters`, `AnnualReportsFiltersBar`, `VatWorkItemsFiltersCard`, `BindersFiltersBar`
  - `SearchFiltersBar` — נשמרה כ-custom (collapsible UI שונה מהותית)
- [ ] **1.2** בחר `Select` כ-canonical, מחק `SelectDropdown`, עדכן את כל המשתמשים
- [ ] **1.3** מזג `ClientPickerField` + `ClientFilterControl` לקומפוננטה אחת
- [ ] **1.4** צור `src/lib/validationMessages.ts` — כל string validation בעברית במקום אחד

## שלב 2 — עקביות בין מסכים

- [ ] **2.1** צור `<FormModal>` wrapper (isDirty guard + react-hook-form + footer) והחלף 15+ modals
- [ ] **2.2** תבנן `DetailDrawer` אחידה והחלף 8+ drawers
- [ ] **2.3** קבע סטנדרט Row Actions: dropdown ב-list, inline ב-drawer — מגר את כל הסטיות
- [ ] **2.4** החלף כל empty states בשימוש עקבי ב-`<StateCard>`
- [ ] **2.5** צור מפה מרכזית לכל Status Badge per enum (charges, clients, users, binders...)

## שלב 3 — מסכים חסרים

- [ ] **3.1** החלט: `tasks` — page or הסר מה-sidebar
- [ ] **3.2** החלט: `taxProfile` — embed or standalone page
- [ ] **3.3** החלט: `notifications` — list page or embed-only
- [ ] **3.4** החלט: `taxDashboard` — מוצג זמנית כ-page תחת `/tax/dashboard`; להחליט אם להשאיר או לשלב בלוח הבקרה הראשי

## שלב 4 — תיקונים נקודתיים

- [ ] **4.1** תקן `disabled` attribute יתום ב-`BinderPeriodFields.tsx`
- [ ] **4.2** הוסף export/bulk actions לדוחות VAT, Advance Payment, Annual Report
- [ ] **4.3** תקן footer ב-Reminder drawer לעמוד בסטנדרט `ModalFormActions`
