export interface ErrorStateProps {
  /** Title of the page/section that failed to load */
  title: string;
  /** Secondary title describing the specific error */
  errorTitle: string;
  /** Main error message explaining what went wrong */
  errorMessage: string;
  /** Additional help text or instructions (optional) */
  helpText?: string;
  /** Custom styling container class (optional) */
  containerClassName?: string;
  /** Whether to show the refresh instruction (default: true) */
  showRefreshInstruction?: boolean;
  /** Test ID for the component */
  dataTestId: string;
}

export function ErrorState({
  title,
  errorTitle,
  errorMessage,
  helpText = "If this error persists, please contact support.",
  containerClassName = "w-full max-w-4xl",
  showRefreshInstruction = true,
  dataTestId,
}: ErrorStateProps) {
  const fullErrorMessage = showRefreshInstruction
    ? `${errorMessage} Please refresh the page to try again.`
    : errorMessage;

  return (
    <div className={containerClassName} data-testid={dataTestId} role="alert">
      <div className="mb-8 text-center">
        <h1 className="text-slate-11 text-4xl font-bold">{title}</h1>
        <p className="text-slate-11 text-lg">Unable to Load Data</p>
      </div>
      <div className="text-center">
        <h2 className="text-slate-12 mb-4 text-2xl font-semibold">
          {errorTitle}
        </h2>
        <p className="text-slate-10 mb-4">{fullErrorMessage}</p>
        {helpText && <p className="text-slate-9 text-sm">{helpText}</p>}
      </div>
    </div>
  );
}
