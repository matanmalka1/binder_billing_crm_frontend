import { Card } from "./Card";

interface EmptyStateCardProps {
  message: string;
  className?: string;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  message,
  className,
}) => (
  <Card className={className}>
    <p className="text-center text-gray-600">{message}</p>
  </Card>
);
