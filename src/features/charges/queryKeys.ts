import type { ChargesListParams } from "../../api/charges.api";
import { createListDetailKeys } from "../../utils/queryKeys";

export const chargesKeys = createListDetailKeys<ChargesListParams>("charges");
