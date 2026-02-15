const stageLabels: Record<string, string> = {
  material_collection: "איסוף חומרים",
  in_progress: "בטיפול",
  final_review: "סקירה סופית",
  client_signature: "חתימת לקוח",
  transmitted: "הועבר",
};

const statusLabels: Record<string, string> = {
  not_started: "טרם התחיל",
  in_progress: "בתהליך",
  submitted: "הוגש",
  completed: "הושלם",
};

const stageColors: Record<string, string> = {
  material_collection: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  final_review: "bg-purple-100 text-purple-700",
  client_signature: "bg-orange-100 text-orange-700",
  transmitted: "bg-green-100 text-green-700",
};

export const getReportStageLabel = (stage: string): string => {
  return stageLabels[stage] || "—";
};

export const getReportStatusLabel = (status: string): string => {
  return statusLabels[status] || "—";
};

export const getStageColor = (stage: string): string => {
  return stageColors[stage] || stageColors.material_collection;
};
