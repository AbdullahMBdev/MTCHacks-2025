import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Send, CheckCircle2, Layers } from "lucide-react";
import { toast } from "sonner";
import { DicomViewer } from "@/components/DicomViewer";
import { DicomViewerWithOverlay } from "@/components/DicomViewerWithOverlay";
import { AnnotatableDicomViewer, type Annotation } from "@/components/AnnotatableDicomViewer";
import { DicomUploader } from "@/components/DicomUploader";

export const Demo = () => {
  const [viewMode, setViewMode] = useState<"sideBySide" | "combined">("sideBySide");
  const [showConsensus, setShowConsensus] = useState(false);
  const [dicomFile, setDicomFile] = useState<File | null>(null);
  const [dicomImageId, setDicomImageId] = useState<string | null>(null);
  const [aiResults, setAiResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const handleDownload = () => {
    toast.success("Report downloaded • PDF generated", {
      description: "DEMO-CT-001_report.pdf",
    });
  };

  const handleSend = () => {
    toast.success("Report sent to PACS endpoint", {
      description: "14:03 • DEMO-CT-001",
    });
  };

  const toggleConsensus = () => {
    setShowConsensus(!showConsensus);
    if (!showConsensus) {
      toast.info("Consensus highlighting enabled", {
        description: "Mutual agreement regions are now highlighted",
      });
    }
  };

  const handleFileSelect = (file: File) => {
    setDicomFile(file);
    // Create a wadouri imageId from the file
    const imageId = `wadouri:${URL.createObjectURL(file)}`;
    setDicomImageId(imageId);
    toast.success("DICOM file loaded", {
      description: file.name,
    });
  };

  const handleClearFile = () => {
    if (dicomImageId && dicomImageId.startsWith("wadouri:")) {
      URL.revokeObjectURL(dicomImageId.replace("wadouri:", ""));
    }
    setDicomFile(null);
    setDicomImageId(null);
  };

  const handleLoadSample = async () => {
    try {
      // Fetch the sample DICOM file from public folder
      const response = await fetch('/sample.dcm');
      const blob = await response.blob();
      const file = new File([blob], 'sample-atelectasis.dcm', { type: 'application/dicom' });

      setDicomFile(file);
      const imageId = `wadouri:${URL.createObjectURL(blob)}`;
      setDicomImageId(imageId);

      toast.success("Sample DICOM loaded", {
        description: "Chest X-ray with Atelectasis",
      });
    } catch (error) {
      console.error("Failed to load sample:", error);
      toast.error("Failed to load sample image", {
        description: "Please try uploading your own DICOM file",
      });
    }
  };

  const handleAnalyzeWithAI = async () => {
    if (!dicomFile) {
      toast.error("No image to analyze", {
        description: "Please load a DICOM image first",
      });
      return;
    }

    setIsAnalyzing(true);
    setAiResults(null);

    try {
      // Create FormData to send the DICOM file
      const formData = new FormData();
      formData.append('dicom', dicomFile);

      // Call the API
      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setAiResults(data);
        toast.success("AI Analysis Complete", {
          description: `Confidence: ${(data.results.response.score * 100).toFixed(1)}%`,
        });
      } else {
        toast.error("Analysis failed", {
          description: data.error || "Unknown error",
        });
      }
    } catch (error) {
      console.error("Failed to analyze:", error);
      toast.error("Failed to connect to AI service", {
        description: "Please ensure the API server is running",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="demo" className="py-20 px-4 bg-gradient-subtle">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Interactive Demo</span>
          <h2 className="text-4xl font-bold text-foreground mt-2 mb-4">Try It Yourself</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Toggle between viewing modes and see how consensus highlighting works.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-elegant overflow-hidden animate-scale-in">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            {/* Demo Controls */}
            <div className="bg-muted px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Sample Study: DEMO-CT-001</Badge>
                <span className="text-sm text-muted-foreground">Chest CT • Axial view</span>
              </div>
              
              <TabsList>
                <TabsTrigger value="sideBySide">Side-by-Side</TabsTrigger>
                <TabsTrigger value="combined">Combined Overlay</TabsTrigger>
              </TabsList>
            </div>

            {/* Demo Viewer */}
            <div className="p-8">
              <TabsContent value="sideBySide" className="mt-0">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Clinician View */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">Your Annotations</h3>
                      <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Clinician</Badge>
                    </div>

{!dicomFile ? (
                      <div className="aspect-square bg-muted rounded-lg border-2 border-destructive/30 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-muted to-background" />
                        <div className="relative z-10 text-center space-y-4">
                          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-2 border-destructive" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">No image loaded</p>
                            <Button onClick={handleLoadSample} variant="default" size="sm">
                              Load Sample Image
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium text-foreground">{dicomFile.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFile}
                            className="h-8"
                          >
                            Clear
                          </Button>
                        </div>
                        <AnnotatableDicomViewer
                          imageId={dicomImageId || undefined}
                          onAnnotationsChange={setAnnotations}
                        />
                      </div>
                    )}

                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-destructive mt-0.5" />
                        <span className="text-muted-foreground">
                          {annotations.length > 0
                            ? `${annotations.length} annotation${annotations.length !== 1 ? 's' : ''} added`
                            : "Ready for annotations"}
                        </span>
                      </li>
                      {dicomFile && (
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-destructive mt-0.5" />
                          <span className="text-muted-foreground">Image loaded: {dicomFile.name}</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* AI View */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">AI Findings</h3>
                      <Badge className="bg-accent/10 text-accent hover:bg-accent/20">Hoppr AI</Badge>
                    </div>

{!dicomFile ? (
                      <div className="aspect-square bg-muted rounded-lg border-2 border-accent/30 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-muted to-background" />
                        <div className="relative z-10 text-center space-y-4">
                          <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                            <div className="w-8 h-8 rounded border-2 border-accent" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Load an image to analyze
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : !aiResults ? (
                      <div className="aspect-square bg-muted rounded-lg border-2 border-accent/30 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-muted to-background" />
                        <div className="relative z-10 text-center space-y-4">
                          <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                            <div className="w-8 h-8 rounded border-2 border-accent" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Ready for AI analysis</p>
                            <Button
                              onClick={handleAnalyzeWithAI}
                              variant="default"
                              size="sm"
                              disabled={isAnalyzing}
                            >
                              {isAnalyzing ? "Analyzing..." : "Display AI Insights"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-3 bg-accent/10 rounded-lg border border-accent/30">
                          <div className="flex items-center justify-between">
                            <div className="text-center flex-1">
                              <div className="text-2xl font-bold text-accent">
                                {(aiResults.results.response.score * 100).toFixed(1)}%
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Atelectasis
                              </p>
                            </div>
                            <Button
                              onClick={handleAnalyzeWithAI}
                              variant="ghost"
                              size="sm"
                              disabled={isAnalyzing}
                            >
                              {isAnalyzing ? "..." : "Re-analyze"}
                            </Button>
                          </div>
                        </div>
                        <div className="aspect-square border-2 border-accent/30 rounded-lg overflow-hidden">
                          <DicomViewerWithOverlay
                            imageId={dicomImageId || undefined}
                            className="w-full h-full"
                            showHeatmap={true}
                            heatmapIntensity={aiResults.results.response.score}
                          />
                        </div>
                      </div>
                    )}

                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                        <span className="text-muted-foreground">
                          {aiResults ? "Analysis complete" : "Awaiting analysis"}
                        </span>
                      </li>
                      {aiResults && (
                        <>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                            <span className="text-muted-foreground">
                              Model: {aiResults.results.response.model.split(':')[0]}
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                            <span className="text-muted-foreground">
                              Study ID: {aiResults.study_id.substring(0, 8)}...
                            </span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="combined" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Combined View</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={toggleConsensus}
                      className={showConsensus ? "border-success text-success" : ""}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {showConsensus ? "Consensus Active" : "Show Consensus"}
                    </Button>
                  </div>
                  
                  <div className="aspect-video bg-muted rounded-lg border-2 border-border flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-background" />
                    
                    {/* Consensus Highlights */}
                    {showConsensus && (
                      <>
                        <div className="absolute top-1/4 left-1/3 w-20 h-20 rounded-full bg-success/20 border-2 border-success animate-consensus-pulse" />
                        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-success/20 border-2 border-success animate-consensus-pulse" style={{ animationDelay: "0.3s" }} />
                      </>
                    )}
                    
                    <div className="relative z-10 text-center space-y-3">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                        <Layers className="w-10 h-10 text-primary-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {showConsensus ? "2 regions with mutual agreement" : "Toggle consensus to highlight agreements"}
                      </p>
                    </div>
                  </div>

                  {showConsensus && (
                    <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                      <p className="text-sm text-foreground font-medium mb-2">Consensus Summary</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Upper lobe nodule: Clinician & AI agree (8mm vs 8.2mm)</li>
                        <li>• Lower lobe opacity: Clinician & AI agree (12mm vs 11.8mm)</li>
                        <li>• AI detected additional calcification (3mm) - review recommended</li>
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Export Actions */}
          <div className="bg-muted px-6 py-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>Analysis complete</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="medical" size="sm" onClick={handleSend}>
                <Send className="h-4 w-4 mr-2" />
                Send to PACS
              </Button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-destructive" />
            <span className="text-muted-foreground">Clinician Annotation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-accent" />
            <span className="text-muted-foreground">AI Finding</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-success/30 border-2 border-success" />
            <span className="text-muted-foreground">Consensus Region</span>
          </div>
        </div>
      </div>
    </section>
  );
};
