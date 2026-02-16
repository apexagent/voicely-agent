export default function LogoRow() {
  const logos = [
    "TechCorp",
    "InnovateCo",
    "FutureScale",
    "NextGen",
    "CloudVentures",
    "AIFirst",
    "DataSync",
    "VoiceHub",
  ];

  return (
    <section className="py-16 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by teams scaling conversations globally
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-muted-foreground/50 font-semibold text-sm hover:text-muted-foreground transition-colors"
              data-testid={`logo-${logo.toLowerCase()}`}
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
