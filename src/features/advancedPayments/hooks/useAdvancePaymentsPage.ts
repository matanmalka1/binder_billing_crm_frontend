import { useState } from "react";
import { useAdvancePayments } from "./useAdvancePayments";
import { useAdvancePaymentFilters } from "./useAdvancePaymentFilters";

export const useAdvancePaymentsPage = () => {
  const { filters, setFilter } = useAdvancePaymentFilters();
  const [selectedClientName, setSelectedClientName] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const advancePayments = useAdvancePayments(filters.client_id, filters.year);

  const handleClientSelect = (id: number, name: string) => {
    setSelectedClientName(name);
    setFilter("client_id", id);
  };

  const handleClientClear = () => {
    setSelectedClientName("");
    setFilter("client_id", 0);
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const hasClientSelected = filters.client_id > 0;

  return {
    filters,
    setFilter,
    selectedClientName,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    handleClientSelect,
    handleClientClear,
    hasClientSelected,
    ...advancePayments,
  };
};
