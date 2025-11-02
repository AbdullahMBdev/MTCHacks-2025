import { Columns2, Layers, CheckCircle2 } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Columns2,
      title: "Side-by-Side Compare",
      description: "View your annotations next to AI findings to rapidly triage and focus your read.",
    },
    {
      icon: Layers,
      title: "Combined Overlay",
      description: "See both layers at once. Areas of mutual agreement glow subtly to reinforce confidence.",
    },
    {
      icon: CheckCircle2,
      title: "Consensus Highlighting",
      description: "Automatically mark where AI and clinician align; disagreements are clearly outlined for review.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Features</span>
          <h2 className="text-4xl font-bold text-foreground mt-2 mb-4">Built for Radiology Workflow</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature designed with clinician feedback to integrate seamlessly into your daily practice.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group p-8 rounded-xl border border-border bg-card hover:shadow-card hover:border-primary/20 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="w-14 h-14 rounded-lg bg-gradient-primary flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow">
                <feature.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
