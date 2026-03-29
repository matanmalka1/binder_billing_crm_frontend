import type { SignatureRequestResponse } from "../api";
import { SignatureRequestRowActions } from "./SignatureRequestRowActions";

interface SignatureRequestsPageRowActionsProps {
  req: SignatureRequestResponse;
  signingUrl?: string;
  isSending: boolean;
  isCanceling: boolean;
  onSend: (id: number) => void;
  onCancel: (id: number) => void;
  onAudit: (id: number) => void;
}

export const SignatureRequestsPageRowActions: React.FC<SignatureRequestsPageRowActionsProps> = ({
  req,
  signingUrl,
  isSending,
  isCanceling,
  onSend,
  onCancel,
  onAudit,
}) => (
  <SignatureRequestRowActions
    request={req}
    signingUrl={signingUrl}
    isSending={isSending}
    isCanceling={isCanceling}
    canManage
    onSend={async (id) => onSend(id)}
    onCancel={async (id) => onCancel(id)}
    onAudit={onAudit}
    showOpenLink
    separateHistory
    copySuccessMessage={null}
  />
);

SignatureRequestsPageRowActions.displayName = "SignatureRequestsPageRowActions";
