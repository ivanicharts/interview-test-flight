export const ReportSection = ({
  title,
  label,
  children,
}: {
  title?: string;
  label?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="md:bg-card items space-y-2 md:rounded-xl md:border md:p-5">
    {title || label ? (
      <div className="flex flex-wrap items-center justify-between gap-2">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {label}
      </div>
    ) : null}
    {children}
  </section>
);
