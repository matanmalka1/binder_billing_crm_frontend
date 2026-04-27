// Public surface of the taxProfile feature
export { taxProfileApi, taxProfileQK } from "./api";
export type { TaxProfileData } from "./api";
export type {
  TaxProfileCardProps,
  TaxProfileFormProps,
  TaxProfileUpdatePayload,
} from "./types";
export { TaxProfileCard } from "./components/TaxProfileCard";
export { useTaxProfile } from "./hooks/useTaxProfile";
