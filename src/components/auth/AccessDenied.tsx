import { Card } from "../ui/Card";

interface AccessDeniedProps {
  message?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = "אין לך הרשאה לצפות בתוכן זה",
}) => {
  return (
    <Card className="border-orange-200 bg-orange-50" title="גישה נדחתה">
      <p className="text-sm text-orange-800">{message}</p>
    </Card>
  );
};
