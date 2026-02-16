import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronRight, Edit2, FileText, FolderOpen, Receipt } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { DescriptionList } from "../components/ui/DescriptionList";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PageLoading } from "../components/ui/PageLoading";
import { AccessBanner } from "../components/ui/AccessBanner";
import { ClientEditForm } from "../features/clients/components/ClientEditForm";
import { useAuthStore } from "../store/auth.store";
import { getClientStatusLabel, getClientTypeLabel } from "../utils/enums";
import { formatDate } from "../utils/utils";
import { useClientDetails } from "../features/clients/hooks/useClientDetails";

const statusBadge = (status: string) => (
  <Badge variant={status === "active" ? "success" : status === "frozen" ? "warning" : "neutral"}>
    {getClientStatusLabel(status)}
  </Badge>
);

export const ClientDetails: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdvisor = user?.role === "advisor";
  const [isEditing, setIsEditing] = useState(false);

  const {
    client,
    isValidId,
    isLoading,
    error,
    binders,
    bindersTotal,
    charges,
    chargesTotal,
    updateClient,
    isUpdating,
  } = useClientDetails({ clientId: clientId ? Number(clientId) : null, isAdvisor });

  if (!isValidId) return (<div className="space-y-6"><PageHeader title="פרטי לקוח" /><ErrorCard message="מזהה לקוח לא תקין" /></div>);
  if (isLoading) return (<div className="space-y-6"><PageHeader title="טוען..." /><PageLoading /></div>);
  if (error || !client) return (<div className="space-y-6"><PageHeader title="פרטי לקוח" /><ErrorCard message={error || "שגיאה בטעינת פרטי לקוח"} /></div>);

  const infoItems = [
    { label: "מזהה לקוח", value: `#${client.id}` },
    { label: "שם מלא", value: client.full_name },
    { label: "מספר זהות / ח.פ", value: client.id_number },
    { label: "סוג לקוח", value: getClientTypeLabel(client.client_type) },
    { label: "סטטוס", value: statusBadge(client.status) },
    { label: "טלפון", value: client.phone || "—" },
    { label: "אימייל", value: client.email || "—" },
    { label: "תאריך פתיחה", value: formatDate(client.opened_at) },
    { label: "תאריך סגירה", value: client.closed_at ? formatDate(client.closed_at) : "—" },
  ];

  const stats = [
    { show: true, icon: <FolderOpen className="h-6 w-6 text-blue-600" />, value: bindersTotal, label: "קלסרים", bg: "bg-blue-100" },
    { show: isAdvisor, icon: <Receipt className="h-6 w-6 text-green-600" />, value: chargesTotal, label: "חיובים", bg: "bg-green-100" },
    { show: isAdvisor, icon: <FileText className="h-6 w-6 text-purple-600" />, value: "—", label: "מסמכים", bg: "bg-purple-100" },
  ];

  const renderListCard = (
    title: string,
    items: { id: number; title: string; subtitle: string; link: string }[],
    total: number,
    link: string,
    linkLabel: string,
  ) => (
    <Card title={title} footer={total > 5 ? (<Link to={link} className="text-sm text-blue-600 hover:text-blue-700">{linkLabel} ({total})</Link>) : undefined}>
      <div className="space-y-3">
        {items.slice(0, 5).map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
            <div>
              <div className="font-medium text-gray-900">{item.title}</div>
              <div className="text-sm text-gray-600">{item.subtitle}</div>
            </div>
            <Link to={item.link}><Button variant="ghost" size="sm"><ChevronRight className="h-4 w-4" /></Button></Link>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={client.full_name}
        breadcrumbs={[{ label: "לקוחות", to: "/clients" }, { label: client.full_name, to: `/clients/${clientId}` }]}
        actions={<div className="flex gap-2">{!isEditing && isAdvisor && (<Button variant="primary" onClick={() => setIsEditing(true)} className="gap-2"><Edit2 className="h-4 w-4" /> ערוך פרטים</Button>)}<Button variant="outline" className="gap-2" onClick={() => navigate(`/clients/${clientId}/timeline`)}><FileText className="h-4 w-4" /> ציר זמן</Button></div>}
      />

      {!isAdvisor && <AccessBanner variant="info" message="צפייה בלבד. עריכת פרטי לקוח זמינה ליועצים בלבד." />}

      {isEditing && isAdvisor ? (
        <Card title="עריכת פרטי לקוח">
          <ClientEditForm client={client} onSave={async (data) => { await updateClient(data); }} onCancel={() => setIsEditing(false)} isLoading={isUpdating} />
        </Card>
      ) : (
        <>
          <Card title="פרטי לקוח"><DescriptionList columns={2} items={infoItems} /></Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.filter((s) => s.show).map((s, idx) => (
              <Card key={idx}>
                <div className="flex items-center gap-3">
                  <div className={`${s.bg} rounded-lg p-3`}>{s.icon}</div>
                  <div><div className="text-2xl font-bold text-gray-900">{s.value}</div><div className="text-sm text-gray-600">{s.label}</div></div>
                </div>
              </Card>
            ))}
          </div>

          {binders.length ? renderListCard(
          "קלסרים אחרונים",
            binders.map((b) => ({ id: b.id, title: b.binder_number, subtitle: `נקלט: ${formatDate(b.received_at)}`, link: `/binders/${b.id}` })),
            bindersTotal,
            `/binders?client_id=${clientId}`,
            "צפה בכל הקלסרים",
          ) : null}

          {isAdvisor && charges.length ? renderListCard(
            "חיובים אחרונים",
            charges.map((c) => ({ id: c.id, title: `חיוב #${c.id}`, subtitle: `${c.charge_type} • ${c.status}`, link: `/charges/${c.id}` })),
            chargesTotal,
            `/charges?client_id=${clientId}`,
            "צפה בכל החיובים",
          ) : null}
        </>
      )}
    </div>
  );
};
