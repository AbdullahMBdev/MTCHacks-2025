import { Server, Database, Send, Webhook } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Integrations = () => {
  const integrations = [
    {
      icon: Server,
      title: "Hoppr API",
      description: "Powered by Hoppr for inference orchestration, routing requests to specialized AI models.",
      badges: ["Orchestration", "Model Management"],
    },
    {
      icon: Database,
      title: "PACS/RIS Export",
      description: "Generate DICOM SR, secondary captures, and send directly to your existing PACS or RIS system.",
      badges: ["DICOM SR", "Secondary Capture"],
    },
    {
      icon: Send,
      title: "HL7 & FHIR",
      description: "Export findings via HL7 messages. FHIR support planned for broader interoperability.",
      badges: ["HL7", "FHIR (future)"],
    },
    {
      icon: Webhook,
      title: "Webhooks & REST",
      description: "Simple REST callbacks and webhooks for custom integrations with your existing workflow tools.",
      badges: ["REST API", "Webhooks"],
    },
  ];

  return (
    <section id="integrations" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">Integrations</span>
          <h2 className="text-4xl font-bold text-foreground mt-2 mb-4">Designed to Fit Your Stack</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Minimal IT lift. Works with existing PACS/RIS infrastructure and modern healthcare APIs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {integrations.map((integration, idx) => (
            <div 
              key={idx}
              className="p-8 rounded-xl border border-border bg-card hover:shadow-elegant hover:border-accent/30 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 75}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <integration.icon className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">{integration.title}</h3>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">{integration.description}</p>
              <div className="flex flex-wrap gap-2">
                {integration.badges.map((badge, badgeIdx) => (
                  <Badge key={badgeIdx} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Code Example */}
        <div className="mt-16 max-w-3xl mx-auto animate-fade-in">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
            <div className="bg-muted px-6 py-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Example Webhook</span>
              <Badge variant="outline" className="text-xs">JSON</Badge>
            </div>
            <div className="p-6">
              <pre className="text-sm text-muted-foreground overflow-x-auto">
                <code>{`POST /webhook/report
{
  "studyId": "DEMO-CT-001",
  "export": {
    "pdf": "https://…/report.pdf",
    "dicomSr": "https://…/report.dcm"
  },
  "consensus": [
    { "roiId": "lesion-3", "status": "agreed" }
  ]
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
