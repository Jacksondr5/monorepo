export type UrgentProps = {
  className?: string;
  isUrgent?: boolean;
};

const urgentColor = "#e5484d";
const notUrgentColor = "#0090ff";

export const Urgent = ({ className, isUrgent }: UrgentProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={isUrgent ? urgentColor : notUrgentColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label={isUrgent ? "Urgent task" : "Not urgent task"}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
};
