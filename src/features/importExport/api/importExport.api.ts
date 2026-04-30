import { api } from '../../../api/client'
import { CLIENT_ENDPOINTS } from '@/features/clients'

export const importExportApi = {
  exportClients: () => api.get(CLIENT_ENDPOINTS.clientsExport, { responseType: 'blob' }),

  importClients: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(CLIENT_ENDPOINTS.clientsImport, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  downloadTemplate: () => api.get(CLIENT_ENDPOINTS.clientsTemplate, { responseType: 'blob' }),
}
