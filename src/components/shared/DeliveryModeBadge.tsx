import type { DeliveryMode } from "@/lib/types";

const modeStyles: Record<DeliveryMode, string> = {
  Classroom: "bg-violet-100 text-violet-800",
  Workplace: "bg-teal-100 text-teal-800",
};

interface DeliveryModeBadgeProps {
  mode: DeliveryMode;
}

export default function DeliveryModeBadge({ mode }: DeliveryModeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${modeStyles[mode]}`}
    >
      {mode}
    </span>
  );
}
