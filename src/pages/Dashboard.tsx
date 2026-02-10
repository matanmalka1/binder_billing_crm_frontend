import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { api } from '../api/client';
import { useAuthStore } from '../stores/auth.store';

interface DashboardSummary {
  binders_in_office: number;
  binders_ready_for_pickup: number;
  binders_overdue: number;
}

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<DashboardSummary>('/dashboard/summary');
        setSummary(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'שגיאה בטעינת נתונים');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">לוח בקרה</h2>
          {user && (
            <p className="text-gray-600">
              שלום, {user.full_name} ({user.role === 'advisor' ? 'יועץ' : 'מזכירה'})
            </p>
          )}
        </div>
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

      {!loading && !error && summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="תיקים במשרד">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-600">
                {summary.binders_in_office}
              </span>
              <Badge variant="info">במשרד</Badge>
            </div>
          </Card>

          <Card title="מוכנים לאיסוף">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-600">
                {summary.binders_ready_for_pickup}
              </span>
              <Badge variant="success">מוכן</Badge>
            </div>
          </Card>

          <Card title="באיחור">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-red-600">
                {summary.binders_overdue}
              </span>
              <Badge variant="error">איחור</Badge>
            </div>
          </Card>
        </div>
      )}

      {!loading && !error && !summary && (
        <Card>
          <p className="text-gray-600 text-center">אין נתונים להצגה</p>
        </Card>
      )}
    </div>
  );
};
