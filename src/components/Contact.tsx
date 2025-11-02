import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    organization: "",
    useCase: "",
    volume: "",
    consent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      toast.error("Please accept the terms and privacy policy");
      return;
    }
    toast.success("Request submitted successfully!", {
      description: "We'll be in touch within 1-2 business days.",
    });
    // Reset form
    setFormData({
      name: "",
      email: "",
      role: "",
      organization: "",
      useCase: "",
      volume: "",
      consent: false,
    });
  };

  return (
    <section id="contact" className="py-20 px-4 bg-gradient-subtle">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12 animate-fade-in">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Get Started</span>
          <h2 className="text-4xl font-bold text-foreground mt-2 mb-4">Request a Pilot</h2>
          <p className="text-lg text-muted-foreground">
            Interested in evaluating Co-Read at your institution? Fill out the form below.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-elegant p-8 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dr. Jane Smith"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane.smith@hospital.org"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                  required
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="radiologist">Radiologist</SelectItem>
                    <SelectItem value="fellow">Fellow</SelectItem>
                    <SelectItem value="resident">Resident</SelectItem>
                    <SelectItem value="admin">Imaging Admin</SelectItem>
                    <SelectItem value="pacs">PACS/RIS Manager</SelectItem>
                    <SelectItem value="it">Hospital IT</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization *</Label>
                <Input
                  id="organization"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Hospital or Institution"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="useCase">Primary Use Case *</Label>
              <Textarea
                id="useCase"
                required
                value={formData.useCase}
                onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                placeholder="Describe your intended use case, modalities of interest, and any specific requirements..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume">Expected Study Volume</Label>
              <Select
                value={formData.volume}
                onValueChange={(value) => setFormData({ ...formData, volume: value })}
              >
                <SelectTrigger id="volume">
                  <SelectValue placeholder="Select expected volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{"<100 studies/month"}</SelectItem>
                  <SelectItem value="medium">100-500 studies/month</SelectItem>
                  <SelectItem value="high">500-1000 studies/month</SelectItem>
                  <SelectItem value="enterprise">{">1000 studies/month"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start space-x-3 pt-4">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, consent: checked as boolean })
                }
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="consent" className="text-sm font-normal cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  , and understand this is a research prototype not approved for clinical diagnosis.
                </Label>
              </div>
            </div>

            <Button type="submit" size="lg" variant="hero" className="w-full">
              Submit Request
            </Button>
          </form>
        </div>

        <p className="text-sm text-muted-foreground text-center mt-6 animate-fade-in">
          Questions? Email us at{" "}
          <a href="mailto:demo@co-read.app" className="text-primary hover:underline">
            demo@co-read.app
          </a>
        </p>
      </div>
    </section>
  );
};
