# TODO — Client Details Page Fixes

## Address for Shipment

- [x] In **ClientDetails → Edit Info Drawer**
  - Replace the single `Address for Shipment` input with structured fields:
    - Street
    - Building Number
    - Apartment
    - City
    - ZIP Code

---

# Data Synchronization Issues

## Occupation Sync

- [x] In **ClientDetails → Edit Info Drawer**
  - There is an `occupation` input.

- [x] In **ClientDetails → Tax Details**
  - There is also an `occupation` input.

- [x] Ensure both inputs are **synchronized** and refer to the **same underlying field in the database**.
  - **N/A** — `occupation` field does not exist in either frontend or backend. Tax Details uses `business_type`. No sync issue exists.

---

# Bugs

## Communication Diary With Authorities

- [x] Fix **Internal Server Error**
  - Occurs in:
    - `ClientDetails → Communication Diary with Authorities`
  - Fixed in backend: `created_at` made `Optional[datetime]` in `CorrespondenceResponse` to handle legacy seeded rows with null values.

---

## Advanced Payments Percentage Not Displayed

- [x] In **ClientDetails → Tax Details**
  - `advanced payments percentage` can be edited.

- [x] After saving, the value **is not displayed in the details view**.
  - Fixed: `TaxProfileCard` displays `advance_rate`, `useTaxProfile` calls `setQueryData` on success.

- [x] Fix UI state refresh or data binding after update.

---

## Authorities Contacts Edit Modal

- [x] In **ClientDetails → Contacts in the Authorities**
  - When opening the **Edit Modal**, the existing content **is not pre-filled**.

- [x] Fix modal state initialization so current values appear.
  - Frontend: `useAuthorityContactForm` resets form with existing values via `useEffect`.
  - Backend: Added `GET /authority-contacts/{contact_id}` endpoint.

---

## Signature Request Issues

### Default Signer Info

- [x] In **ClientDetails → New Signature Request**
  - `Signer Name`
  - `Signer Email`

- [x] These should be **pre-filled using the client's default contact information**.
  - Fixed: `CreateSignatureRequestModal` initializes from `client.full_name` / `client.email`.

### Signature Request URL

- [x] In **ClientDetails → Signature Requests**
  - The generated **URL leads to a `Not Found` page**.

- [x] Fix routing or backend endpoint.
  - Fixed: `/sign/:token` route exists in `AppRoutes.tsx`; backend `/sign/{token}` public endpoint confirmed working.

---

# Reminder System Improvements

## Custom Reminder Type

- [x] In **ClientDetails → New Customer Reminder Modal**

- When `Reminder Type = Custom`:
  - [x] Show an additional **text input field**
  - [x] Advisor can type the custom reminder name.
  - Fixed: `CreateReminderModal` conditionally renders input when `reminderType === "custom"`.

---

## Client Selector

- [x] In **ClientDetails → New Customer Reminder Modal**
  - Client field currently shows only **Client ID**.

- [x] Update display format to:
  - `Client Name + Client ID`
  - Fixed: displays `"Name (#ID)"` format.

---

## Reminder Not Appearing in UI

- [x] After submitting a reminder:
  - The reminder **is saved in the database**
  - But **does not appear in the UI**.

- [x] Fix UI refresh or query invalidation.
  - Fixed: `useReminders` invalidates `reminders.all` and `reminders.list(clientId)` on success.

---

# Documents Page

## Upload Option Missing

- [x] In **ClientDetails → Documents Page**
  - There is **no option to upload a document**.

- [x] Add:
  - Upload button
  - File input
  - Upload API integration.
  - Fixed: `DocumentsUploadCard` fully implemented with type selector, file input, and multipart API integration.

---

# Timeline

## Timeline Empty

- [x] In **ClientDetails → Timeline Page**
  - Timeline currently shows **no events**.

- [x] Add events for:
  - Client created
  - Reminder created
  - Client info updates
  - Tax details updates
  - Document uploads
  - Signature requests
  - Fixed: backend `TimelineService` now aggregates all 6 new event types via `timeline_client_aggregator`. `updated_at` added to `Client` model (migration 0005).

---

# UI/UX Improvements

- [ ] Ensure **all edit modals preload existing data**.
- [ ] Ensure **UI state updates after mutations**.
- [ ] Add **loading states and error handling** where missing.
