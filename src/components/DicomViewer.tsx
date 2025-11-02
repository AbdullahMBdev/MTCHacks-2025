import { useEffect, useRef, useState } from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";
import { Loader2 } from "lucide-react";

// Configure cornerstone WADO Image Loader
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

interface DicomViewerProps {
  imageId?: string;
  className?: string;
  onImageLoaded?: () => void;
}

export const DicomViewer = ({ imageId, className = "", onImageLoaded }: DicomViewerProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      cornerstone
        .loadImage(imageId)
        .then((image) => {
          cornerstone.displayImage(element, image);
          setLoading(false);
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

  return (
    <div className={`relative ${className}`}>
      <div
        ref={elementRef}
        className="w-full h-full bg-black rounded-lg overflow-hidden"
        style={{ minHeight: "400px" }}
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="text-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Loading DICOM image...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 rounded-lg">
          <div className="text-center space-y-2 p-4">
            <p className="text-sm text-destructive font-medium">{error}</p>
            <p className="text-xs text-muted-foreground">Please check the image path and try again</p>
          </div>
        </div>
      )}
    </div>
  );
};
