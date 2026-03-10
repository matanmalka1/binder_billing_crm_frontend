import { Button } from "../../../components/ui/Button";
import { cn } from "../../../utils/utils";

interface Opportunity {
  title: string;
  description: string;
  cta: string;
  variant: "green" | "blue" | "yellow";
  onClick?: () => void;
}

interface Props {
  opportunities?: Opportunity[];
}

const DEFAULT_OPPORTUNITIES: Opportunity[] = [
  {
    title: "קרן השתלמות עצמאי",
    description: "לא ניצלת את מלוא המכסה — ₪3,800 נותרו",
    cta: "בדוק",
    variant: "green",
  },
  {
    title: "ניכוי הוצאות מחשוב",
    description: "ציוד ותוכנות לא נכנסו — חיסכון פוטנציאלי ₪4,200",
    cta: "הוסף",
    variant: "blue",
  },
  {
    title: "הגדלת הפקדות פנסיה",
    description: "ניתן להפקיד עוד ₪8,500 ולחסוך עד ₪2,550 במס",
    cta: "חשב",
    variant: "yellow",
  },
];

const VARIANT_STYLES: Record<string, string> = {
  green: "bg-green-50 border-green-200",
  blue: "bg-blue-50 border-blue-200",
  yellow: "bg-yellow-50 border-yellow-200",
};

const CTA_STYLES: Record<string, string> = {
  green: "text-green-700 border-green-300 hover:bg-green-100",
  blue: "text-blue-700 border-blue-300 hover:bg-blue-100",
  yellow: "text-yellow-700 border-yellow-300 hover:bg-yellow-100",
};

export const TaxSavingsOpportunities: React.FC<Props> = ({
  opportunities = DEFAULT_OPPORTUNITIES,
}) => (
  <div className="rounded-lg border border-gray-200 bg-white">
    <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-900">הזדמנויות לחיסכון במס</h3>
      <span className="text-xs text-gray-400">חיסכון פוטנציאלי נוסף</span>
    </div>
    <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-3">
      {opportunities.map((op) => (
        <div
          key={op.title}
          className={cn("rounded-lg border p-3 flex flex-col gap-2", VARIANT_STYLES[op.variant])}
        >
          <p className="text-sm font-semibold text-gray-800">{op.title}</p>
          <p className="text-xs text-gray-500 flex-1">{op.description}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={op.onClick}
            className={cn("h-7 text-xs self-start", CTA_STYLES[op.variant])}
          >
            {op.cta}
          </Button>
        </div>
      ))}
    </div>
  </div>
);
