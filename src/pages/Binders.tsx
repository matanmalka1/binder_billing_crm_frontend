import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { api } from '../api/client';

interface Binder {
  id: number;
  client_id: number;
  binder_number: string;
  status: string;
  received_at: string;
  expected_return_at: string;
  returned_at: string | null;
  days_in_office: number;
}

interface BindersListResponse {
  items: Binder[];
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'in_office':
      return <Badge variant="info">במשרד</Badge>;
    case 'ready_for_pickup':
      return <Badge variant="success">מוכן לאיסוף</Badge>;
    case 'returned':
      return <Badge variant="neutral">הוחזר</Badge>;
    case 'overdue':
      return <Badge variant="error">באיחור</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('he-IL');
};

export const Binders: React.FC = () => {
  const [binders, setBinders] = useState<Binder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBinders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<BindersListResponse>('/binders');
        setBinders(response.data.items);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'שגיאה בטעינת רשימת תיקים');
      } finally {
        setLoading(false);
      }
    };

    fetchBinders();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">תיקים</h2>
        <p className="text-gray-600">רשימת כל התיקים במערכת</p>
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

      {!loading && !error && binders.length === 0 && (
        <Card>
          <p className="text-gray-600 text-center">אין תיקים להצגה</p>
        </Card>
      )}

      {!loading && !error && binders.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr className="text-right">
                  <th className="pb-3 pr-4 font-semibold text-gray-700">מספר תיק</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">סטטוס</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">תאריך קבלה</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">תאריך החזרה צפוי</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">ימים במשרד</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {binders.map((binder) => (
                  <tr key={binder.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4">
                      <span className="font-medium text-gray-900">
                        {binder.binder_number}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{getStatusBadge(binder.status)}</td>
                    <td className="py-3 pr-4 text-gray-600">
                      {formatDate(binder.received_at)}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {formatDate(binder.expected_return_at)}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-gray-900 font-medium">
                        {binder.days_in_office}
                      </span>
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
