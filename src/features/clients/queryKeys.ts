import type { ListClientsParams } from "../../api/clients.api";
import { createListDetailKeys } from "../../utils/queryKeys";

export const clientsKeys = createListDetailKeys<ListClientsParams>("clients");
