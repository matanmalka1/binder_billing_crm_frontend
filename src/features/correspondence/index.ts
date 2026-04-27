// Public surface of the correspondence feature
export { correspondenceApi, correspondenceQK } from "./api";
export { CorrespondenceCard } from "./components/CorrespondenceCard";
export { CORRESPONDENCE_TYPE_OPTIONS, CORRESPONDENCE_TYPES } from "./constants";
export type {
  CorrespondenceEntry,
  CreateCorrespondencePayload,
  UpdateCorrespondencePayload,
} from "./api";
export type { CorrespondenceType } from "./constants";
