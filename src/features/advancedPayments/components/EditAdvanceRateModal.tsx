import { Modal } from "../../../components/ui/Modal";
import { TaxProfileForm } from "../../taxProfile/components/TaxProfileForm";
import { useTaxProfile } from "@/features/taxProfile";

interface EditAdvanceRateModalProps {
  businessId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const EditAdvanceRateModal: React.FC<EditAdvanceRateModalProps> = ({
  businessId,
  isOpen,
  onClose,
}) => {
  const { profile, updateProfile, isUpdating } = useTaxProfile(businessId);

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
