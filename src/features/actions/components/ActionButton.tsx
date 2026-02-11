import React from "react";
import { Button } from "../../../components/ui/Button";

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  label: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ label, ...props }) => {
  return <Button {...props}>{label || "—"}</Button>;
};
