// TODO(actions-migration): Remove this compatibility facade after all imports use src/lib/actions/resolver.
export type {
  NormalizedActionInput,
  ResolveContext,
} from "../../lib/actions/resolver";
export { materializeResolvedAction, normalizeBackendAction } from "../../lib/actions/resolver";
