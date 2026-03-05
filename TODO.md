# TODO — Client Details Page Fixes

## Address for Shipment

- [ ] In **ClientDetails → Edit Info Drawer**
  - Replace the single `Address for Shipment` input with structured fields:
    - Street
    - Building Number
    - Apartment
    - City
    - ZIP Code

---

# Data Synchronization Issues

## Occupation Sync

- [ ] In **ClientDetails → Edit Info Drawer**
  - There is an `occupation` input.

- [ ] In **ClientDetails → Tax Details**
  - There is also an `occupation` input.

- [ ] Ensure both inputs are **synchronized** and refer to the **same underlying field in the database**.

---

# Bugs

## Communication Diary With Authorities

- [ ] Fix **Internal Server Error**
  - Occurs in:
    - `ClientDetails → Communication Diary with Authorities`
  - Investigate backend endpoint and response handling.

---

## Advanced Payments Percentage Not Displayed

- [ ] In **ClientDetails → Tax Details**
  - `advanced payments percentage` can be edited.

- [ ] After saving, the value **is not displayed in the details view**.

- [ ] Fix UI state refresh or data binding after update.

---

## Authorities Contacts Edit Modal

- [ ] In **ClientDetails → Contacts in the Authorities**
  - When opening the **Edit Modal**, the existing content **is not pre-filled**.

- [ ] Fix modal state initialization so current values appear.

---

## Signature Request Issues

### Default Signer Info

- [ ] In **ClientDetails → New Signature Request**
  - `Signer Name`
  - `Signer Email`

- [ ] These should be **pre-filled using the client's default contact information**.

### Signature Request URL

- [ ] In **ClientDetails → Signature Requests**
  - The generated **URL leads to a `Not Found` page**.

- [ ] Fix routing or backend endpoint.

---

# Reminder System Improvements

## Custom Reminder Type

- [ ] In **ClientDetails → New Customer Reminder Modal**

- When `Reminder Type = Custom`:
  - [ ] Show an additional **text input field**
  - [ ] Advisor can type the custom reminder name.

---

## Client Selector

- [ ] In **ClientDetails → New Customer Reminder Modal**
  - Client field currently shows only **Client ID**.

- [ ] Update display format to:
  - `Client Name + Client ID`

---

## Reminder Not Appearing in UI

- [ ] After submitting a reminder:
  - The reminder **is saved in the database**
  - But **does not appear in the UI**.

- [ ] Fix UI refresh or query invalidation.

---

# Documents Page

## Upload Option Missing

- [ ] In **ClientDetails → Documents Page**
  - There is **no option to upload a document**.

- [ ] Add:
  - Upload button
  - File input
  - Upload API integration.

---

# Timeline

## Timeline Empty

- [ ] In **ClientDetails → Timeline Page**
  - Timeline currently shows **no events**.

- [ ] Add events for:
  - Client created
  - Reminder created
  - Client info updates
  - Tax details updates
  - Document uploads
  - Signature requests

---

# UI/UX Improvements

- [ ] Ensure **all edit modals preload existing data**.
- [ ] Ensure **UI state updates after mutations**.
- [ ] Add **loading states and error handling** where missing.
