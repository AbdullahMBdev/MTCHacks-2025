import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "Is this approved for clinical diagnosis?",
      answer: "No. This is a research prototype for evaluation purposes only. It is not a medical device and should not be used for primary diagnosis. All clinical decisions remain with licensed clinicians.",
    },
    {
      question: "What image types are supported?",
      answer: "The demo supports de-identified X-ray, CT, and MRI studies. Production versions would support broader DICOM modalities and integrate directly with PACS systems.",
    },
    {
      question: "How are annotations handled?",
      answer: "Clinician annotations are stored on a separate layer from AI findings. You can view them side-by-side, merge them via Combined Overlay, or keep them separate. All annotations are versioned and auditable.",
    },
    {
      question: "What is Consensus Highlighting?",
      answer: "Regions where both clinician and AI identify the same finding are subtly emphasized with a green glow. Mismatches or unique findings from either side are outlined separately for your review.",
    },
    {
      question: "How do exports work?",
      answer: "You can generate a PDF summary, DICOM Structured Report (SR), and secondary capture images. Choose to Download locally or Send directly to a configured PACS/RIS endpoint or secure email.",
    },
    {
      question: "What about privacy and PHI?",
      answer: "Demo data is fully de-identified. Production design includes end-to-end encryption in transit, optional on-device masking, and minimal data retention policies aligned with HIPAA requirements.",
    },
    {
      question: "How does the AI work?",
      answer: "The system uses Hoppr API to orchestrate multiple specialized AI models. Each model provides confidence scores and rationale snippets. The platform does not train on your data without explicit consent.",
    },
    {
      question: "Can I customize the AI models?",
      answer: "In production deployments, you can configure which models are used for different study types, adjust confidence thresholds, and even integrate your own validated models through Hoppr's API.",
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
          <h2 className="text-4xl font-bold text-foreground mt-2 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Common questions about Co-Read's capabilities and usage.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4 animate-fade-in-up">
          {faqs.map((faq, idx) => (
            <AccordionItem 
              key={idx} 
              value={`item-${idx}`}
              className="bg-card border border-border rounded-lg px-6 data-[state=open]:shadow-card transition-shadow"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold text-foreground pr-4">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
