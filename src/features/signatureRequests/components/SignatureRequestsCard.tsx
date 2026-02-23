import { useState } from "react";
import { FileSignature, Plus } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorCard } from "../../../components/ui/ErrorCard";
import { SignatureRequestRow } from "./SignatureRequestRow";
import { CreateSignatureRequestModal } from "./CreateSignatureRequestModal";
import { useClientSignatureRequests } from "../hooks/useClientSignatureRequests";
import { useSignatureRequestActions } from "../hooks/useSignatureRequestActions";
import type { ClientResponse } from "../../../api/clients.api";
import type { SendSignatureRequestResponse } from "../../../api/signatureRequests.api";

interface Props {
  client: ClientResponse;
  canManage: boolean;
}

const buildSigningUrl = (hint: string): string => {
  const base = window.location.origin;
  const path = hint.startsWith("/") ? hint : `/${hint}`;
  return `${base}${path}`;
};

export const SignatureRequestsCard: React.FC<Props> = ({ client, canManage }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [signingUrls, setSigningUrls] = useState<Record<number, string>>({});

  const { items, total, isLoading, error } = useClientSignatureRequests({
    clientId: client.id,
    pageSize: 10,
  });

  const { create, isCreating, send, isSending, cancel, isCanceling } =
    useSignatureRequestActions(client.id);

  const handleSend = async (id: number) => {
    const result = (await send(id)) as SendSignatureRequestResponse;
    if (result?.signing_url_hint) {
      setSigningUrls((prev) => ({ ...prev, [id]: buildSigningUrl(result.signing_url_hint) }));
    }
  };

  return (
    <>
      <Card
        title={`בקשות חתימה${total > 0 ? ` (${total})` : ""}`}
        actions={
          canManage ? (
            <Button variant="outline" size="sm" onClick={() => setShowCreate(true)}>
              <Plus className="h-3.5 w-3.5" />
              בקשה חדשה
            </Button>
          ) : undefined
        }
      >
        <div className="space-y-2">
          {error && <ErrorCard message={error} />}

          {isLoading && (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          )}

          {!isLoading && !error && items.length === 0 && (
            <EmptyState
              icon={FileSignature}
              message="אין בקשות חתימה עבור לקוח זה"
              action={
                canManage
                  ? { label: "יצירת בקשה ראשונה", onClick: () => setShowCreate(true) }
                  : undefined
              }
            />
          )}

          {!isLoading && items.length > 0 && (
            <div className="space-y-2">
              {items.map((req) => (
                <SignatureRequestRow
                  key={req.id}
                  request={req}
                  signingUrl={signingUrls[req.id]}
                  isSending={isSending}
                  isCanceling={isCanceling}
                  canManage={canManage}
                  onSend={handleSend}
                  onCancel={(id) => cancel(id)}
                />
              ))}
            </div>
          )}
        </div>
      </Card>

      <CreateSignatureRequestModal
        open={showCreate}
        clientId={client.id}
        signerName={client.full_name}
        signerEmail={client.email ?? undefined}
        signerPhone={client.phone ?? undefined}
        isLoading={isCreating}
        onClose={() => setShowCreate(false)}
        onCreate={create}
      />
    </>
  );
};
