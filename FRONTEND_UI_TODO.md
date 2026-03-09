# Frontend UI TODO — Waves 1–5

> **הערה:** כל ה-API layer הושלם (types, endpoints, query keys, API functions).  
> המשימות הבאות הן **UI בלבד** — קומפוננטות קיימות לעדכן + חדשות לבנות.

---

## Wave 1 — Tax Engine Display

### 1.1 — Tax Bracket Breakdown
**קובץ:** מצא את הקומפוננטה שמציגה `getTaxCalculation` (חפש שימוש ב-`annualReportTaxCalc` query key או `getTaxCalculation`)

**מה לעשות:**
- הוסף טבלה מתחת לסיכום הקיים
- עמודות: מדרגה (%), טווח הכנסה, הכנסה חייבת במדרגה, מס במדרגה
- פורמט סכומים: `₪X.toLocaleString("he-IL")`
- הדגש את השורה האחרונה (המדרגה הגבוהה שהלקוח נמצא בה)
- מקור הנתונים: `data.brackets[]` (כבר קיים ב-type)

---

### 1.2 — National Insurance Section
**קובץ:** אותה קומפוננטה כמו 1.1

**מה לעשות:**
- הוסף סקציה נפרדת "ביטוח לאומי"
- שורה: "עד תקרה (5.97%)" → `data.national_insurance.base_amount`
- שורה: "מעל תקרה (17.83%)" → `data.national_insurance.high_amount`
- שורה bold: "סה"כ ביטוח לאומי" → `data.national_insurance.total`

---

### 1.3 — net_profit + total_liability
**קובץ:** אותה קומפוננטה כמו 1.1

**מה לעשות:**
- הוסף לסיכום הקיים 2 שורות:
  - "רווח נקי" → `data.net_profit`
  - "חבות כוללת" → `data.total_liability`
- `total_liability`: אדום אם חיובי, ירוק אם שלילי (= זכאות להחזר)
- אם `total_liability === null` — אל תציג את השורה

---

## Wave 2 — Fields & Data Model

### 2.1 — Recognition Rate על שורות הוצאה
**קבצים:** מצא את הטופס והשורה של הוצאות ב-`IncomeExpensePanel.tsx` (או קומפוננטת expense נפרדת)

**בטופס הוספת הוצאה (`AddLineForm`):**
- הוסף שדה מספרי "שיעור הכרה (%)" → `recognition_rate`, ברירת מחדל 100, טווח 0–100
- הוסף text input "אסמכתא" → `supporting_document_ref`
- שלח את השדות ב-`addExpenseLine` payload (הtype כבר תומך)

**בשורת הוצאה (`LineRow`):**
- אם `recognition_rate < 100` — הצג badge קטן "X%"
- אם `supporting_document_ref` קיים — הצג אייקון paperclip עם tooltip

---

### 2.2 — Document Download Link על שורות הוצאה
**קובץ:** אותה שורת הוצאה

**מה לעשות:**
- אם `supporting_document_id` קיים על השורה:
  - הצג אייקון paperclip עם שם הקובץ (`supporting_document_filename`)
  - לחיצה → קרא `documentsApi.getDownloadUrl(id)` → פתח URL בטאב חדש

---

### 2.3 — notes על מקדמה
**קבצים:** מצא את הטופס ושורת המקדמה (חפש שימוש ב-`advancePaymentsApi.create/update`)

**בטופס:**
- הוסף textarea "הערות" → `notes` (אופציונלי)

**בשורה:**
- אם `notes` קיים — הצג אייקון עם tooltip

---

### 2.4 — tax_year על מסמכים
**קבצים:** מצא את modal העלאת מסמך ורשימת המסמכים (חפש שימוש ב-`documentsApi`)

**ב-upload modal:**
- הוסף select "שנת מס" (אופציונלי): שנים 2020–2025

**ברשימת מסמכים:**
- הוסף filter "שנת מס" בראש הרשימה
- כאשר נבחר — שלח `?tax_year=` לקריאת `listByClient`
- `queryKey` צריך לכלול את ה-`tax_year` הנבחר

---

## Wave 3 — Advance Payments Analytics

### 3.1 — Delete מקדמה
**קובץ:** מצא את שורת המקדמה (חפש `advancePaymentsApi.update`)

**מה לעשות:**
- הוסף כפתור "מחק" (אייקון trash) עם `window.confirm` או dialog
- `advancePaymentsApi.delete(id)` → `invalidateQueries` על `QK.tax.advancePayments.forClientYear`

---

### 3.2 — עמודת הפרש (Delta)
**קובץ:** מצא את הטבלה/רשימה של מקדמות

**מה לעשות:**
- הוסף עמודה "הפרש"
- ערך: `row.delta` (כבר מגיע מהבקאנד)
- חיובי = אדום, שלילי = ירוק, אפס או null = אפור

---

### 3.3 — Status Filter
**קובץ:** מצא את filters של מקדמות

**מה לעשות:**
- הוסף multi-select "סטטוס": pending / paid / partial / overdue
- העבר כ-`status[]` ל-`advancePaymentsApi.list`

---

### 3.4 — KPI Cards
**קובץ:** צור `src/components/advancePayments/AdvancePaymentsKPICards.tsx`

**Props:** `{ clientId: number; year: number }`

**מה לבנות:**
- `useQuery` על `QK.tax.advancePayments.kpi(clientId, year)` → `advancePaymentsApi.getAnnualKPIs`
- 4 כרטיסים:
  1. סה"כ צפוי → `total_expected`
  2. סה"כ שולם → `total_paid`
  3. שיעור גבייה → `collection_rate`% (progress bar)
  4. פיגורים → `overdue_count`
- הטמע מעל טבלת המקדמות בדף לקוח

---

### 3.5 — Monthly Bar Chart
**קובץ:** צור `src/components/advancePayments/AdvancePaymentsChart.tsx`

**Props:** `{ clientId: number; year: number }`

**מה לבנות:**
- `useQuery` על `QK.tax.advancePayments.chart(clientId, year)` → `advancePaymentsApi.getChartData`
- `recharts BarChart`:
  - ציר X: חודשים (1–12 → "ינו", "פבר", ...)
  - 3 bars לכל חודש: צפוי (אפור), שולם (ירוק), פיגור (אדום)
- הצג רק כשיש `clientId` (לא בoverview הכללי)
- הטמע מתחת ל-KPI cards

---

## Wave 4 — Report Workflows

### 4.1 — כפתור ו-Modal תיקון דוח (Amend)
**קבצים:** מצא את פאנל הפעולות של דוח שנתי (חפש `transitionStatus` או `submitReport`)

**מה לעשות:**
- הוסף כפתור "תיקון דוח" — מוצג **רק** כשסטטוס = `"submitted"`
- לחיצה → פתח modal עם:
  - textarea "סיבת תיקון" (חובה, min 10 תווים)
  - כפתורי "שלח" / "ביטול"
- `annualReportsApi.amend(reportId, reason)` → `invalidateQueries` על `QK.tax.annualReports.detail(reportId)`

**Status badge:**
- מצא את הקומפוננטה שמציגה status badge של דוח
- הוסף מיפוי ל-`"amended"`: label = "תיקון דוח", variant = warning (כבר קיים ב-`annualReports.extended.utils.ts`)

---

### 4.2 — Filing Timeline
**קובץ:** צור `src/components/taxDeadlines/FilingTimeline.tsx`

**Props:** `{ clientId: number }`

**מה לבנות:**
- `useQuery` על `QK.taxDeadlines.timeline(clientId)` → `taxDeadlinesApi.getTimeline`
- רשימה אנכית של milestones ממוינת לפי תאריך:
  - completed ✓ ירוק
  - pending ⏳ אפור
  - overdue ⚠️ אדום
- לכל פריט: `milestone_label` + תאריך + ימים נותרים
  - אם `days_remaining < 0` → "פג תוקף לפני X ימים" (אדום)
  - אם `days_remaining >= 0` → "נותרו X ימים"
- הטמע בדף פרטי לקוח (טאב מועדים או דוחות)

---

### 4.3 — Toast לאחר יצירת דוח
**קובץ:** מצא את modal/form יצירת דוח שנתי (חפש `annualReportsApi.createReport`)

**מה לעשות:**
- לאחר `createReport` מוצלח — אם `response.profit` קיים:
  - הצג toast: `"דוח נוצר | רווח ראשוני: ₪X"`

---

## Wave 5 — Notifications

### 5.1 — `useNotifications` Hook
**קובץ:** צור `src/hooks/useNotifications.ts`

```ts
export function useNotifications(clientId?: number) {
  // useQuery list → QK.notifications.list({ client_id: clientId })
  // useQuery unreadCount → QK.notifications.unreadCount(clientId)
  // markRead mutation → invalidate unreadCount + list
  // markAllRead mutation → invalidate unreadCount + list
  return { notifications, unreadCount, markRead, markAllRead, isLoading }
}
```

---

### 5.2 — SeverityBadge
**קובץ:** צור `src/components/notifications/SeverityBadge.tsx`

**Props:** `{ severity: NotificationSeverity }`

| severity | צבע |
|----------|-----|
| info | כחול |
| warning | צהוב |
| urgent | כתום |
| critical | אדום |

---

### 5.3 — NotificationBell (Header)
**קובץ:** צור `src/components/layout/NotificationBell.tsx`

**מה לבנות:**
- `useQuery` כל 30 שניות (`refetchInterval: 30_000`) → `notificationsApi.getUnreadCount()`
- אייקון Bell
- badge עם מספר — מוסתר אם `unread_count === 0`
- לחיצה → פותח `NotificationDrawer`
- הטמע בקומפוננטת Header/NavBar הקיימת

---

### 5.4 — NotificationDrawer
**קובץ:** צור `src/components/notifications/NotificationDrawer.tsx`

**Props:** `{ open: boolean; onClose: () => void }`

**מה לבנות:**
- Drawer נפתח מהצד (ימין)
- כותרת "התראות" + כפתור "סמן הכל כנקרא" → `markAllRead` (disabled אם `unread_count === 0`)
- רשימת 20 notifications אחרונות (`limit=20`)
- כל פריט:
  - `<SeverityBadge severity={item.severity} />`
  - `item.content_snapshot` כטקסט
  - תאריך יחסי (מספיק `new Date(item.created_at).toLocaleDateString("he-IL")`)
  - רקע `bg-blue-50` אם `!item.is_read`
  - לחיצה → `markRead([item.id])` + סגור drawer

---

### 5.5 — NotificationsTab בפרטי לקוח
**קובץ:** צור `src/components/clientDetails/NotificationsTab.tsx` והוסף טאב "התראות" בדף לקוח

**Props:** `{ clientId: number }`

**מה לבנות:**
- `useNotifications(clientId)` 
- כפתור "סמן הכל כנקרא" → `markAllRead(clientId)`
- רשימה עם `SeverityBadge` + timestamp + `content_snapshot`
- `limit=50`

---

## סדר ביצוע

```
Wave 1 (1.1 → 1.2 → 1.3)     עדכון קומפוננטה קיימת אחת
Wave 2 (2.1 → 2.2 → 2.3 → 2.4) הוספת שדות לטפסים קיימים
Wave 3 (3.1 → 3.2 → 3.3 → 3.4 → 3.5) analytics מקדמות
Wave 4 (4.1 → 4.2 → 4.3)      workflows דוחות
Wave 5 (5.1 → 5.2 → 5.3 → 5.4 → 5.5) notification center
```
