import { api } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";

export const importExportApi = {
  exportClients: () =>
    api.get(ENDPOINTS.clientsExport, { responseType: "blob" }),

  importClients: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(ENDPOINTS.clientsImport, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  downloadTemplate: () =>
    api.get(ENDPOINTS.clientsTemplate, { responseType: "blob" }),
};
