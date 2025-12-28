export const ContentSection = ({
  title,
  description,
  label,
  children,
}: {
  title?: string;
  description?: React.ReactNode;
  label?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="md:bg-card items space-y-2 md:rounded-xl md:border md:p-5">
    <div>
      {title || label ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {label}
        </div>
      ) : null}
      {description ? <div className="text-muted-foreground text-sm">{description}</div> : null}
    </div>
    {children}
  </section>
);
