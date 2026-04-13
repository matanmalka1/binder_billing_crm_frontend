import { useQuery } from "@tanstack/react-query";
import type { ReminderType } from "../api";
import { bindersApi, bindersQK } from "@/features/binders/api";
import { chargesApi, chargesQK } from "@/features/charges/api";
import { taxDeadlinesApi, taxDeadlinesQK } from "@/features/taxDeadlines/api";
import { annualReportsApi, annualReportsQK } from "@/features/annualReports/api";
import { advancePaymentsApi, advancedPaymentsQK } from "@/features/advancedPayments/api";

/**
 * Lazily fetches the entities needed to populate linked-entity dropdowns in the
 * create-reminder modal. Each query is enabled only when the modal is open, a
 * client is selected, and the current reminder type actually requires that entity.
 */
export const useReminderLinkedEntities = (
  clientId: number | undefined,
  reminderType: ReminderType | string,
  enabled: boolean,
) => {
  const base = enabled && !!clientId;

  const needsTaxDeadlines =
    base &&
    (reminderType === "tax_deadline_approaching" || reminderType === "vat_filing");
  const needsBinders = base && reminderType === "binder_idle";
  const needsCharges = base && reminderType === "unpaid_charge";
  const needsAnnualReports = base && reminderType === "annual_report_deadline";
  const needsAdvancePayments = base && reminderType === "advance_payment_due";

  const bindersQuery = useQuery({
    queryKey: bindersQK.forClient(clientId!),
    queryFn: () => bindersApi.list({ client_id: clientId!, page_size: 100 }),
    enabled: needsBinders,
  });

  const chargesQuery = useQuery({
    queryKey: chargesQK.list({ client_id: clientId!, page_size: 100 }),
    queryFn: () => chargesApi.list({ client_id: clientId!, page_size: 100 }),
    enabled: needsCharges,
  });

  const taxDeadlinesQuery = useQuery({
    queryKey: taxDeadlinesQK.list({ client_id: clientId!, page_size: 100 }),
    queryFn: () => taxDeadlinesApi.listTaxDeadlines({ client_id: clientId!, page_size: 100 }),
    enabled: needsTaxDeadlines,
  });

  const annualReportsQuery = useQuery({
    queryKey: annualReportsQK.forClient(clientId!),
    queryFn: () => annualReportsApi.listClientReports(clientId!),
    enabled: needsAnnualReports,
  });

  const advancePaymentsQuery = useQuery({
    queryKey: advancedPaymentsQK.forClient(clientId!),
    queryFn: () => advancePaymentsApi.listAllForClient(clientId!),
    enabled: needsAdvancePayments,
  });

  return {
    clientBinders: bindersQuery.data?.items,
    clientCharges: chargesQuery.data?.items,
    clientTaxDeadlines: taxDeadlinesQuery.data?.items,
    clientAnnualReports: annualReportsQuery.data,
    clientAdvancePayments: advancePaymentsQuery.data?.items,
  };
};
