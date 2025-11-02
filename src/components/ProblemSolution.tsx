import { Clock, Repeat, FileQuestion, FileOutput } from "lucide-react";

export const ProblemSolution = () => {
  const problems = [
    { icon: Clock, title: "Time Pressure", description: "High volume caseloads leave little time for detailed analysis" },
    { icon: Repeat, title: "Repetitive Measurements", description: "Manual measurements and annotations are tedious and time-consuming" },
    { icon: FileQuestion, title: "Discordant Findings", description: "Difficult to track where AI and clinical judgment differ" },
    { icon: FileOutput, title: "Reporting Friction", description: "Exporting findings to PACS/RIS is often cumbersome" },
  ];

  const solutions = [
    { title: "Assisted Triage", description: "AI pre-analyzes studies, letting you focus on critical cases" },
    { title: "Auto-Measurements", description: "Automatic region detection and measurement reduces manual work" },
    { title: "Consensus Highlighting", description: "See at a glance where AI and clinician agree" },
    { title: "One-Click Export", description: "Generate DICOM SR, PDF reports, and send to your PACS instantly" },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Problems */}
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">The Challenge</span>
              <h2 className="text-3xl font-bold text-foreground mt-2">Common Pain Points in Radiology</h2>
            </div>
            <div className="space-y-6">
              {problems.map((problem, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <problem.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{problem.title}</h3>
                    <p className="text-sm text-muted-foreground">{problem.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <span className="text-sm font-semibold text-success uppercase tracking-wider">Our Approach</span>
              <h2 className="text-3xl font-bold text-foreground mt-2">How Co-Read Helps</h2>
            </div>
            <div className="space-y-6">
              {solutions.map((solution, idx) => (
                <div key={idx} className="p-5 rounded-lg border border-border bg-card hover:shadow-card transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-highlight flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{solution.title}</h3>
                      <p className="text-sm text-muted-foreground">{solution.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
