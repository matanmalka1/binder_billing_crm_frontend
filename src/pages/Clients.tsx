import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { api } from '../api/client';

interface Client {
  id: number;
  full_name: string;
  id_number: string;
  client_type: string;
  status: string;
  phone: string | null;
  email: string | null;
  opened_at: string;
}

interface ClientsListResponse {
  items: Client[];
  page: number;
  page_size: number;
  total: number;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="success">פעיל</Badge>;
    case 'frozen':
      return <Badge variant="warning">מוקפא</Badge>;
    case 'closed':
      return <Badge variant="neutral">סגור</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

const getClientTypeName = (type: string) => {
  const types: Record<string, string> = {
    osek_patur: 'עוסק פטור',
    osek_murshe: 'עוסק מורשה',
    company: 'חברה',
    employee: 'שכיר',
  };
  return types[type] || type;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('he-IL');
};

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<ClientsListResponse>('/clients');
        setClients(response.data.items);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'שגיאה בטעינת רשימת לקוחות');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">לקוחות</h2>
        <p className="text-gray-600">רשימת כל הלקוחות במערכת</p>
      </header>

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {!loading && !error && clients.length === 0 && (
        <Card>
          <p className="text-gray-600 text-center">אין לקוחות להצגה</p>
        </Card>
      )}

      {!loading && !error && clients.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr className="text-right">
                  <th className="pb-3 pr-4 font-semibold text-gray-700">שם</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">ת.ז / ח.פ</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">סוג</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">סטטוס</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">טלפון</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">תאריך פתיחה</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4">
                      <span className="font-medium text-gray-900">
                        {client.full_name}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-600 font-mono text-sm">
                      {client.id_number}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {getClientTypeName(client.client_type)}
                    </td>
                    <td className="py-3 pr-4">{getStatusBadge(client.status)}</td>
                    <td className="py-3 pr-4 text-gray-600 font-mono text-sm">
                      {client.phone || '-'}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {formatDate(client.opened_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
