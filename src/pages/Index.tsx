import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ProblemSolution } from "@/components/ProblemSolution";
import { Workflow } from "@/components/Workflow";
import { Features } from "@/components/Features";
import { Safety } from "@/components/Safety";
import { Integrations } from "@/components/Integrations";
import { Demo } from "@/components/Demo";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Set default theme to light mode
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ProblemSolution />
      <Workflow />
      <Features />
      <Safety />
      <Integrations />
      <Demo />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
