import { Modal } from "../../../components/ui/Modal";
import { TaxProfileForm } from "../../taxProfile/components/TaxProfileForm";
import { useTaxProfile } from "../../taxProfile/hooks/useTaxProfile";

interface EditAdvanceRateModalProps {
  clientId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const EditAdvanceRateModal: React.FC<EditAdvanceRateModalProps> = ({
  clientId,
  isOpen,
  onClose,
}) => {
  const { profile, updateProfile, isUpdating } = useTaxProfile(clientId);

  return (
    <Modal open={isOpen} title="עריכת פרטי מס" onClose={onClose} footer={null}>
      <TaxProfileForm
        profile={profile}
        onSave={(data) => {
          updateProfile(data);
          onClose();
        }}
        onCancel={onClose}
        isSaving={isUpdating}
      />
    </Modal>
  );
};

EditAdvanceRateModal.displayName = "EditAdvanceRateModal";
