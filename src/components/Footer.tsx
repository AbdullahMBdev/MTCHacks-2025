import { Github, Mail, FileText, Shield, Lock } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { label: "How it Works", href: "#workflow" },
      { label: "Features", href: "#features" },
      { label: "Safety", href: "#safety" },
      { label: "Integrations", href: "#integrations" },
    ],
    legal: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Security", href: "#security" },
      { label: "Compliance", href: "#compliance" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold">CR</span>
              </div>
              <span className="text-xl font-semibold text-foreground">Co-Read</span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              AI-assisted radiology workflow assistant. Helping clinicians make better decisions with 
              transparent, explainable AI analysis.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:demo@co-read.app"
                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-6">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-foreground">Important Medical Disclaimer</p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Co-Read is a hackathon prototype</strong> intended for research and educational purposes only. 
                  This is <strong>not a medical device</strong> and is <strong>not approved for primary diagnostic use</strong>. 
                  All images shown are de-identified. Clinical decisions must be made by licensed healthcare professionals. 
                  The developers assume no liability for clinical outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground pt-8 border-t border-border">
          <p>© {currentYear} Co-Read. Hackathon project. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <Lock className="h-4 w-4" />
              Security
            </a>
            <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
