// Public surface of the correspondence feature
export { correspondenceApi, correspondenceQK } from "./api";
export { CorrespondenceCard } from "./components/CorrespondenceCard";
export type {
  CorrespondenceEntry,
  CreateCorrespondencePayload,
  UpdateCorrespondencePayload,
} from "./api";
export type {
  CorrespondenceCardProps,
  CorrespondenceCreatePayload,
  CorrespondenceEntryItemProps,
  CorrespondenceHookResult,
  CorrespondenceListParams,
  CorrespondenceModalProps,
  CorrespondenceQueryParams,
  CorrespondenceResponse,
  CorrespondenceUpdatePayload,
} from "./types";
