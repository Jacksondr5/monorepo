export type ImportantProps = {
  className?: string;
  isImportant?: boolean;
};

const importantColor = "#e5484d";
const notImportantColor = "#0090ff";

export const Important = ({ className, isImportant }: ImportantProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={isImportant ? importantColor : notImportantColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
};
