# Codex Task: Fix `authority_contact` Domain — 5 Architecture Violations

## Context

This is a FastAPI + React 19 + TypeScript CRM project.
- Backend: `app/authority_contact/` — FastAPI, SQLAlchemy ORM, Pydantic v2
- Frontend: `src/features/authorityContacts/` — React 19, TanStack Query, axios
- **Non-negotiable rules**: strict `API → Service → Repository → ORM` layering; no cross-domain
  imports at Repository or Model level; no business logic in API routers; max 150 lines per Python
  file; no barrel `index.ts` files — all imports use direct file paths.

---

## Fix 1 — Remove `ClientRepository` from `AuthorityContactService` (High)

**File:** `app/authority_contact/services/authority_contact_service.py`

**Problem:** The service directly instantiates `ClientRepository` from the `clients` domain,
violating the "no cross-domain imports at Repository level" rule. The existing shared function
`get_client_or_raise` from `app.clients.services.client_lookup` already encapsulates what is
needed, but it is being called with a locally-instantiated `ClientRepository`.

**Required change:**

1. Remove `from app.clients.repositories.client_repository import ClientRepository` from imports.
2. Change the signature of `get_client_or_raise` in `app/clients/services/client_lookup.py` to
   accept `(db: Session, client_id: int) -> None` — i.e., it should instantiate its own
   `ClientRepository` internally so callers don't need to pass a repo instance.
3. In `AuthorityContactService.__init__`, remove `self.client_repo = ClientRepository(db)`.
4. In `AuthorityContactService.add_contact`, call `get_client_or_raise(self.db, client_id)`
   (no repo argument).
5. Verify no other callers of `get_client_or_raise` break; update them to the new signature if
   needed (pass `db` instead of a repo instance).

**Acceptance:** `app/authority_contact/services/authority_contact_service.py` has zero imports
from `app.clients.repositories.*`. `client_lookup.py` owns the `ClientRepository` instantiation.

---

## Fix 2 — Move `ContactType` casting from router to service (Medium)

**Files:**
- `app/authority_contact/api/authority_contact.py`
- `app/authority_contact/services/authority_contact_service.py`

**Problem:** The router performs `ContactType(contact_type)` enum coercion in both
`list_authority_contacts` and `update_authority_contact`. This is business/validation logic
that belongs in the service layer per project rules ("no business logic in API routers").

**Required changes in `authority_contact.py` (router):**

1. `list_authority_contacts`: remove the `type_enum` casting block. Pass `contact_type`
   (raw `Optional[str]`) directly to `service.list_client_contacts(...)`.
2. `update_authority_contact`: remove the `if "contact_type" in update_data: update_data["contact_type"] = ContactType(...)` block. Pass `update_data` as-is to `service.update_contact(...)`.
3. Remove `from app.authority_contact.models.authority_contact import ContactType` from router
   imports (it will no longer be needed there).

**Required changes in `authority_contact_service.py` (service):**

1. `list_client_contacts`: change `contact_type` parameter type from
   `Optional[ContactType]` to `Optional[str]`. At the top of the method body, add:
   ```python
   contact_type_enum: Optional[ContactType] = ContactType(contact_type) if contact_type else None
   ```
   Then use `contact_type_enum` for all downstream calls.
2. `update_contact`: at the top of the method body, add:
   ```python
   if "contact_type" in fields:
       fields["contact_type"] = ContactType(fields["contact_type"])
   ```

**Acceptance:** `ContactType` is imported and used only in the service and model layers;
the router contains no enum instantiation logic. A `ValueError` for an invalid `contact_type`
string propagates up as a 400 (FastAPI handles this automatically from `ValueError`).

---

## Fix 3 — Add `getAuthorityContact` to frontend API client and hook (Medium)

**Files:**
- `src/api/authorityContacts.api.ts`
- `src/api/endpoints.ts`
- `src/features/authorityContacts/hooks/useAuthorityContact.ts` (create new)

**Problem:** The backend exposes `GET /api/v1/authority-contacts/{id}` but the frontend has
no corresponding API function or hook, leaving the endpoint dead.

**Required changes:**

1. In `src/api/endpoints.ts`, add under the authority contacts section:
   ```ts
   AUTHORITY_CONTACT_DETAIL: (id: number) => `/authority-contacts/${id}`,
   ```
2. In `src/api/authorityContacts.api.ts`, add:
   ```ts
   getAuthorityContact: (contactId: number): Promise<AuthorityContactResponse> =>
     apiClient.get(ENDPOINTS.AUTHORITY_CONTACT_DETAIL(contactId)).then(r => r.data),
   ```
3. Create `src/features/authorityContacts/hooks/useAuthorityContact.ts`:
   ```ts
   import { useQuery } from '@tanstack/react-query';
   import { authorityContactsApi } from '../../../api/authorityContacts.api';
   import { QK } from '../../../lib/queryKeys';

   export const useAuthorityContact = (contactId: number) =>
     useQuery({
       queryKey: [QK.authorityContacts, contactId],
       queryFn: () => authorityContactsApi.getAuthorityContact(contactId),
       enabled: !!contactId,
     });
   ```

**Acceptance:** `authorityContactsApi.getAuthorityContact(id)` exists and is typed.
`useAuthorityContact` is importable via its direct file path
`src/features/authorityContacts/hooks/useAuthorityContact.ts`.

---

## Fix 4 — Fix cross-feature import path in `ClientDetailsOverviewTab` (Medium)

**File:** `src/features/clients/components/ClientDetailsOverviewTab.tsx`

**Problem:** `ClientDetailsOverviewTab` currently imports `AuthorityContactsCard` via a deep
path into `src/features/authorityContacts/components/`. No barrels exist in this project, so
the correct pattern is a direct path import to the component file. Verify the existing import
resolves to the exact file and is not broken or pointing to a non-existent barrel.

**Required changes:**

Ensure the import reads:
```ts
import { AuthorityContactsCard } from '../../authorityContacts/components/AuthorityContactsCard';
```

This is the correct and only legal form. If the file currently imports from
`'../../authorityContacts'` (a barrel path), replace it with the direct path above.
Do not create any `index.ts` file.

**Acceptance:**
- The import in `ClientDetailsOverviewTab.tsx` resolves directly to
  `src/features/authorityContacts/components/AuthorityContactsCard.tsx`.
- No `src/features/authorityContacts/index.ts` exists.
- `tsc --noEmit` passes.

---

## Fix 5 — Replace `string` with enum-typed `contact_type` in Pydantic schemas and TS types (Low)

**Files:**
- `app/authority_contact/schemas/authority_contact.py`
- `src/api/authorityContacts.api.ts`

**Problem:** The backend `ContactType` enum has four constrained values but both the
Pydantic schemas and the frontend TypeScript type use plain `str`/`string`, losing
compile-time and runtime safety.

**Required changes — backend (`app/authority_contact/schemas/authority_contact.py`):**

1. Import `ContactType` from the model:
   ```python
   from app.authority_contact.models.authority_contact import ContactType
   ```
2. Change `contact_type` fields in all three schema classes:
   - `AuthorityContactCreateRequest`: `contact_type: ContactType`
   - `AuthorityContactUpdateRequest`: `contact_type: Optional[ContactType] = None`
   - `AuthorityContactResponse`: `contact_type: ContactType`
3. Because Pydantic v2 handles `str`-subclassed enums natively, no `model_validator` is needed.
   Pydantic will accept the raw string value `"vat_branch"` and coerce it to `ContactType.VAT_BRANCH`
   automatically. Invalid values will now return a 422 from Pydantic before reaching the service.
4. Since the router was previously doing the `ContactType(...)` cast itself (now moved to the
   service in Fix 2), confirm the router no longer needs to cast — Pydantic handles it on
   request parsing, and the service handles it on service-layer calls.

**Required changes — frontend (`src/api/authorityContacts.api.ts`):**

1. Add a TypeScript union type:
   ```ts
   export type ContactType =
     | 'assessing_officer'
     | 'vat_branch'
     | 'national_insurance'
     | 'other';
   ```
2. Replace `contact_type: string` with `contact_type: ContactType` in:
   - `AuthorityContactResponse`
   - `AuthorityContactCreatePayload` (or equivalent create request type)
   - `AuthorityContactUpdatePayload` (or equivalent update request type, as
     `contact_type?: ContactType`)

**Acceptance:** Passing an invalid `contact_type` value to the backend returns 422 (caught by
Pydantic before reaching any service code). TypeScript will error at compile time if an
unknown string is passed as `contact_type` anywhere in the frontend.

---

## Execution Order

Apply fixes in this order to avoid cascading compile/lint errors:

1. Fix 5 (schema types — no logic changes, safe foundation)
2. Fix 2 (move casting to service — now schemas already typed, router is clean)
3. Fix 1 (remove `ClientRepository` from service — isolated change)
4. Fix 3 (add frontend API function + hook)
5. Fix 4 (verify/correct direct import path in `ClientDetailsOverviewTab`)

---

## Verification Checklist

### Backend
- [ ] `app/authority_contact/services/authority_contact_service.py` — no import from
      `app.clients.repositories.*`
- [ ] `app/authority_contact/api/authority_contact.py` — no `ContactType(...)` instantiation,
      no `ClientRepository` usage
- [ ] `app/authority_contact/schemas/authority_contact.py` — all three `contact_type` fields
      typed as `ContactType` (not `str`)
- [ ] `pytest -q` passes

### Frontend
- [ ] `src/api/authorityContacts.api.ts` — `getAuthorityContact(id)` exists and typed;
      `ContactType` union type exported; all `contact_type` fields typed
- [ ] `src/features/authorityContacts/hooks/useAuthorityContact.ts` — hook created, arrow
      function, importable via direct path
- [ ] `src/features/clients/components/ClientDetailsOverviewTab.tsx` — imports
      `AuthorityContactsCard` from
      `'../../authorityContacts/components/AuthorityContactsCard'` (direct path)
- [ ] No `src/features/authorityContacts/index.ts` file exists
- [ ] `tsc --noEmit` passes