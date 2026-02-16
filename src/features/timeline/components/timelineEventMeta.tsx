import { AlertCircle, Bell, DollarSign, FileText } from "lucide-react";
import React from "react";

export const getEventTypeLabel = (eventType: string) => {
  const labels: Record<string, string> = {
    binder_received: "קליטת קלסר",
    binder_returned: "החזרת קלסר",
    invoice_created: "יצירת חשבונית",
    charge_created: "יצירת חיוב",
    notification: "התראה",
    notification_sent: "התראה",
  };
  return labels[eventType] ?? "אירוע";
};

export const getEventIcon = (eventType: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    binder_received: <FileText  className="h-4 w-4" />,
    binder_returned: <FileText className="h-4 w-4" />,
    invoice_created: <DollarSign className="h-4 w-4" />,
    charge_created: <DollarSign className="h-4 w-4" />,
    notification: <Bell className="h-4 w-4" />,
    notification_sent: <Bell className="h-4 w-4" />,
  };
  return icons[eventType] ?? <AlertCircle className="h-4 w-4" />;
};

export const getEventColor = (eventType: string) => {
  const colors: Record<string, { bg: string; border: string; icon: string }> = {
    binder_received: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
    },
    binder_returned: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
    },
    invoice_created: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "text-purple-600",
    },
    charge_created: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
    },
    notification: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: "text-orange-600",
    },
    notification_sent: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: "text-orange-600",
    },
  };
  return (
    colors[eventType] ?? {
      bg: "bg-gray-50",
      border: "border-gray-200",
      icon: "text-gray-600",
    }
  );
};

export const formatTimestamp = (timestamp: string) =>
  new Date(timestamp).toLocaleString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
