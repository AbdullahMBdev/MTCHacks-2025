import { useEffect, useRef, useState } from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";
import { Loader2 } from "lucide-react";

// Configure cornerstone WADO Image Loader
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

interface DicomViewerWithOverlayProps {
  imageId?: string;
  className?: string;
  onImageLoaded?: () => void;
  showHeatmap?: boolean;
  heatmapIntensity?: number; // 0-1 scale, based on AI confidence
}

export const DicomViewerWithOverlay = ({
  imageId,
  className = "",
  onImageLoaded,
  showHeatmap = false,
  heatmapIntensity = 0,
}: DicomViewerWithOverlayProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Enable the element for Cornerstone
    try {
      cornerstone.enable(element);
    } catch (err) {
      console.error("Failed to enable cornerstone:", err);
      setError("Failed to initialize viewer");
      setLoading(false);
      return;
    }

    // Load and display the image if imageId is provided
    if (imageId) {
      setLoading(true);
      setError(null);
      setImageLoaded(false);

      cornerstone
        .loadImage(imageId)
        .then((image) => {
          cornerstone.displayImage(element, image);
          setLoading(false);
          setImageLoaded(true);
          onImageLoaded?.();
        })
        .catch((err) => {
          console.error("Failed to load image:", err);
          setError("Failed to load DICOM image");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    // Cleanup
    return () => {
      try {
        cornerstone.disable(element);
      } catch (err) {
        console.error("Error disabling cornerstone:", err);
      }
    };
  }, [imageId, onImageLoaded]);

  // Draw heatmap overlay
  useEffect(() => {
    if (!showHeatmap || !imageLoaded || !canvasRef.current || !elementRef.current) {
      return;
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      drawHeatmap();
    }, 100);

    return () => clearTimeout(timer);
  }, [showHeatmap, heatmapIntensity, imageLoaded]);

  const drawHeatmap = () => {
    const canvas = canvasRef.current;
    const element = elementRef.current;
    if (!canvas || !element) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match the viewer
    const rect = element.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    console.log("Drawing heatmap:", {
      width: canvas.width,
      height: canvas.height,
      intensity: heatmapIntensity
    });

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create gradient heatmap based on confidence
    const regions = generateHeatmapRegions(heatmapIntensity);

    regions.forEach((region) => {
      const gradient = ctx.createRadialGradient(
        region.x * canvas.width,
        region.y * canvas.height,
        0,
        region.x * canvas.width,
        region.y * canvas.height,
        region.radius * Math.min(canvas.width, canvas.height)
      );

      // Color based on confidence: red = high, yellow = medium, transparent = low
      const alpha = region.intensity * 0.5; // Max 50% opacity
      gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(255, 165, 0, ${alpha * 0.6})`);
      gradient.addColorStop(1, "rgba(255, 165, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    // Draw highlighting boxes
    regions.forEach((region) => {
      ctx.strokeStyle = `rgba(255, 0, 0, ${region.intensity})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);

      const boxSize = region.radius * Math.min(canvas.width, canvas.height) * 1.5;
      const x = region.x * canvas.width - boxSize / 2;
      const y = region.y * canvas.height - boxSize / 2;

      ctx.strokeRect(x, y, boxSize, boxSize);
    });

    console.log("Heatmap drawn successfully with", regions.length, "regions");
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={elementRef}
        className="w-full h-full bg-black rounded-lg overflow-hidden"
        style={{ minHeight: "400px" }}
      />

      {/* Heatmap overlay canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          display: showHeatmap && imageLoaded ? "block" : "none",
          zIndex: 10
        }}
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg z-20">
          <div className="text-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Loading DICOM image...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 rounded-lg z-20">
          <div className="text-center space-y-2 p-4">
            <p className="text-sm text-destructive font-medium">{error}</p>
            <p className="text-xs text-muted-foreground">Please check the image path and try again</p>
          </div>
        </div>
      )}

      {showHeatmap && imageLoaded && (
        <div className="absolute top-2 right-2 bg-red-600/90 text-white px-3 py-1 rounded-md text-xs font-medium z-30">
          AI Overlay Active
        </div>
      )}
    </div>
  );
};

// Generate simulated heatmap regions based on AI confidence
function generateHeatmapRegions(intensity: number): Array<{
  x: number;
  y: number;
  radius: number;
  intensity: number;
}> {
  if (intensity < 0.3) return []; // Low confidence, no highlights

  // Simulate 1-2 regions of interest based on confidence
  const numRegions = intensity > 0.7 ? 2 : 1;
  const regions = [];

  for (let i = 0; i < numRegions; i++) {
    regions.push({
      x: 0.35 + i * 0.25, // Position (normalized 0-1)
      y: 0.4 + i * 0.2,
      radius: 0.2 + intensity * 0.1, // Size based on confidence
      intensity: intensity,
    });
  }

  return regions;
}
