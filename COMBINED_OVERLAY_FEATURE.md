# Combined Overlay Feature

## Overview

The Combined Overlay feature allows clinicians to view both their annotations and AI findings on the same DICOM image simultaneously, with intelligent consensus detection that highlights regions where both agree.

## How It Works

### Component: CombinedDicomViewer

**Location**: [src/components/CombinedDicomViewer.tsx](src/components/CombinedDicomViewer.tsx)

This component combines functionality from:
- `AnnotatableDicomViewer`: Clinician annotation capabilities (red dots with comments)
- `DicomViewerWithOverlay`: AI heatmap regions (orange/yellow gradient)

### Visual Layers

The combined view displays three visual layers on the DICOM image:

1. **AI Heatmap Regions** (Orange/Yellow)
   - Rendered as radial gradients
   - Intensity varies based on AI confidence score
   - Border color: `rgba(251, 146, 60, 0.6)` (orange)
   - Shows AI-detected pathology locations

2. **Clinician Annotations** (Red Dots)
   - Point-based markers at locations the clinician flagged
   - Red circular pins with white borders
   - Comment indicator badge if comment exists
   - Color: `rgba(220, 38, 38, 0.9)` (red)

3. **Consensus Highlights** (Green) - Optional
   - Shown when "Show Consensus" button is active
   - Green pulsing highlights where clinician annotations overlap with AI findings
   - Color: `rgba(34, 197, 94, 0.3)` (green)
   - Automatically detected by calculating distance between annotations and AI regions

## Consensus Detection Algorithm

**Function**: `detectConsensus()`

```typescript
const detectConsensus = useCallback(() => {
  const detected: ConsensusRegion[] = [];

  clinicianAnnotations.forEach((annotation) => {
    aiRegions.forEach((region) => {
      // Calculate distance between annotation and region center
      const dx = annotation.x - region.x;
      const dy = annotation.y - region.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If annotation is within the AI region, it's consensus
      if (distance < region.radius) {
        detected.push({
          x: annotation.x,
          y: annotation.y,
          radius: region.radius * 0.8,
          clinicianAnnotation: annotation,
          aiRegion: region,
        });
      }
    });
  });

  setConsensusRegions(detected);
}, [clinicianAnnotations, aiRegions]);
```

**Logic**:
1. For each clinician annotation (red dot)
2. For each AI region (heatmap)
3. Calculate Euclidean distance between annotation point and region center
4. If distance < region radius, they overlap → consensus detected
5. Create consensus region at 80% of AI region size

## User Interface

### Tabs in Demo Component

Users can switch between three views:

1. **Clinician View** (Left tab)
   - Shows DICOM image with annotation tools
   - Users can add red dot markers with comments
   - Interactive annotation list below viewer

2. **AI View** (Right tab)
   - Shows DICOM image with AI heatmap overlay
   - Displays AI-detected pathology regions
   - Interactive findings panel with explanations
   - Hover over regions to see labels

3. **Combined View** (Middle tab) - **NEW**
   - Shows DICOM image with BOTH overlays
   - "Show Consensus" button to toggle green highlights
   - Consensus summary panel when active

### Consensus Summary Panel

**Location**: Below the combined viewer

Shows when consensus is detected:

```typescript
{showConsensus && consensusRegions.length > 0 && (
  <div className="p-4 rounded-lg bg-success/10 border border-success/30">
    <p className="text-sm text-foreground font-medium mb-2">Consensus Summary</p>
    <ul className="space-y-1 text-sm text-muted-foreground">
      {consensusRegions.map((region, index) => (
        <li key={index}>
          • Agreement detected: {region.clinicianAnnotation.comment || "Clinician annotation"}
            matches {region.aiRegion.label || "AI finding"}
        </li>
      ))}
      {/* Additional AI findings not matched by clinician */}
      {/* Clinician annotations not matched by AI */}
    </ul>
  </div>
)}
```

**Information Displayed**:
- Number of consensus regions (where both agree)
- AI findings not matched by clinician (review recommended)
- Clinician annotations not matched by AI (review recommended)

### No Consensus Scenario

If consensus highlighting is enabled but no overlap is detected:

```typescript
{showConsensus && consensusRegions.length === 0 && annotations.length > 0 && heatmapRegions.length > 0 && (
  <div className="p-4 rounded-lg bg-muted border border-border">
    <p className="text-sm text-foreground font-medium mb-2">No Consensus Detected</p>
    <p className="text-sm text-muted-foreground">
      Clinician annotations and AI findings do not overlap. Consider reviewing both independently.
    </p>
  </div>
)}
```

## Coordinate System

All coordinates are **normalized (0-1)** for cross-resolution compatibility:

```typescript
export interface Annotation {
  x: number; // 0-1 (normalized)
  y: number; // 0-1 (normalized)
  // ...
}

export interface HeatmapRegion {
  x: number; // 0-1 (normalized)
  y: number; // 0-1 (normalized)
  radius: number; // 0-1 (normalized)
  // ...
}

export interface ConsensusRegion {
  x: number; // 0-1 (normalized)
  y: number; // 0-1 (normalized)
  radius: number; // 0-1 (normalized)
  // ...
}
```

**Benefits**:
- Works with any image resolution
- Canvas size can change without recalculating coordinates
- Easy to export and import across different displays

## Rendering Pipeline

### Canvas Drawing Order (Bottom to Top)

1. **DICOM Image** (Cornerstone layer)
   - Base layer rendered by Cornerstone.js
   - Black background with grayscale medical image

2. **AI Heatmap Regions** (Canvas overlay)
   - Orange/yellow radial gradients
   - Rendered first so they appear below other annotations

3. **Consensus Highlights** (Canvas overlay)
   - Green pulsing circles
   - Only visible when `showConsensus=true`
   - Rendered between AI regions and clinician annotations

4. **Clinician Annotations** (Canvas overlay)
   - Red dots with white borders
   - Rendered last so they appear on top
   - Comment badges always visible

### Draw Function

```typescript
const drawOverlays = useCallback(() => {
  const canvas = canvasRef.current;
  const element = elementRef.current;
  if (!canvas || !element) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const rect = element.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw AI heatmap regions
  aiRegions.forEach((region) => { /* ... */ });

  // 2. Draw consensus regions (if enabled)
  if (showConsensus) {
    consensusRegions.forEach((consensus) => { /* ... */ });
  }

  // 3. Draw clinician annotations
  clinicianAnnotations.forEach((annotation) => { /* ... */ });
}, [aiRegions, clinicianAnnotations, showConsensus, consensusRegions]);
```

## State Management

**Location**: [src/components/Demo.tsx:179-191](src/components/Demo.tsx#L179-L191)

```typescript
const [viewMode, setViewMode] = useState<"sideBySide" | "combined">("sideBySide");
const [showConsensus, setShowConsensus] = useState(false);
const [annotations, setAnnotations] = useState<Annotation[]>([]); // Clinician annotations
const [heatmapRegions, setHeatmapRegions] = useState<HeatmapRegion[]>([]); // AI findings
const [consensusRegions, setConsensusRegions] = useState<ConsensusRegion[]>([]); // Detected consensus
```

**Data Flow**:
1. User adds annotation in Clinician View → `annotations` state updates
2. User runs AI analysis → `heatmapRegions` state updates
3. User switches to Combined View → both overlays rendered
4. User clicks "Show Consensus" → `detectConsensus()` runs → `consensusRegions` state updates
5. Green highlights appear where annotations overlap with AI regions

**State Clearing** (ensures only current scan data is shown):
- When new file uploaded → clears all previous analysis data
- When sample loaded → clears all previous analysis data
- When file cleared → clears all analysis data
- When new analysis starts → clears old heatmap and consensus regions

**State Persistence**:
- Annotations persist when switching between tabs (Clinician View ↔ Combined View)
- AI findings persist when switching between tabs (AI View ↔ Combined View)
- All data managed at Demo component level, passed down as props

## Example Workflow

1. **Upload DICOM File**
   - User uploads chest X-ray
   - Image displayed in all three tabs

2. **Clinician Review** (Clinician View tab)
   - Click "Add Annotation" button
   - Click on suspicious area
   - Add comment: "Possible opacity in upper left lobe"
   - Red dot appears with comment indicator

3. **AI Analysis** (AI View tab)
   - Click "Display AI Insights"
   - Select model or use auto-detect
   - AI analyzes and returns heatmap regions
   - Orange/yellow gradient overlays appear

4. **Combined Review** (Combined View tab)
   - Switch to Combined View
   - See both red dots and orange regions
   - Click "Show Consensus"
   - Green highlights appear where they overlap

5. **Consensus Summary**
   - Panel shows: "Agreement detected: Possible opacity in upper left lobe matches Primary Finding"
   - Panel shows: "AI detected 1 additional finding(s) - review recommended"

## Integration Points

### Props: CombinedDicomViewer

```typescript
interface CombinedDicomViewerProps {
  imageId?: string; // Cornerstone image ID (wadouri:blob://...)
  className?: string; // Tailwind classes
  clinicianAnnotations?: Annotation[]; // From AnnotatableDicomViewer
  aiRegions?: HeatmapRegion[]; // From DicomViewerWithOverlay
  showConsensus?: boolean; // Toggle green highlights
  onConsensusDetected?: (consensusRegions: ConsensusRegion[]) => void; // Callback
}
```

### Props: AnnotatableDicomViewer (Updated)

```typescript
interface AnnotatableDicomViewerProps {
  imageId?: string; // Cornerstone image ID
  className?: string; // Tailwind classes
  annotations?: Annotation[]; // Controlled annotations from parent (NEW)
  onAnnotationsChange?: (annotations: Annotation[]) => void; // Callback when annotations change
}
```

**Important**: The `AnnotatableDicomViewer` now uses **controlled component pattern**:
- Accepts `annotations` prop from parent (Demo component)
- Calls `onAnnotationsChange` callback when user adds/deletes annotations
- No longer maintains internal annotation state
- This ensures annotations persist when switching tabs

### Usage in Demo.tsx

**Clinician View (Annotatable Viewer)**:
```typescript
<AnnotatableDicomViewer
  imageId={dicomImageId || undefined}
  annotations={annotations}
  onAnnotationsChange={setAnnotations}
/>
```

**Combined View (Both Overlays)**:
```typescript
<CombinedDicomViewer
  imageId={dicomImageId}
  clinicianAnnotations={annotations}
  aiRegions={heatmapRegions}
  showConsensus={showConsensus}
  onConsensusDetected={setConsensusRegions}
  className="aspect-video"
/>
```

**Key Points**:
- Same `annotations` array passed to both components
- Annotations added in Clinician View appear in Combined View
- Switching tabs doesn't lose annotation data
- All state managed in Demo component

## Benefits

### For Clinicians
- **Single View**: See both human and AI findings without switching tabs
- **Consensus Validation**: Quickly identify where AI agrees with clinical assessment
- **Discrepancy Detection**: Immediately spot findings one party missed
- **Confidence Building**: Green consensus highlights provide visual confirmation

### For Quality Assurance
- **Audit Trail**: Visual record of agreement/disagreement
- **Second Opinion**: AI acts as automated second reader
- **Training**: Junior clinicians can compare their annotations with AI

### For Research
- **Data Collection**: Export consensus regions for ML training
- **Performance Metrics**: Calculate agreement rates (sensitivity/specificity)
- **Annotation Quality**: Identify systematic differences between human and AI

## Color Coding Summary

| Element | Color | Purpose |
|---------|-------|---------|
| Clinician Annotation | Red (`rgba(220, 38, 38, 0.9)`) | Human-identified findings |
| AI Heatmap | Orange/Yellow (`rgba(251, 146, 60)`) | AI-detected pathology |
| Consensus Highlight | Green (`rgba(34, 197, 94, 0.3)`) | Areas of agreement |

## Future Enhancements

### Planned Features
1. **Adjustable Sensitivity**: Slider to control consensus detection threshold
2. **Region Linking**: Click consensus highlight to show both annotation and AI explanation
3. **Confidence Comparison**: Display AI score vs clinician confidence side-by-side
4. **Export Consensus**: Save consensus regions to DICOM SR or JSON
5. **Multi-Pathology Consensus**: Detect consensus across multiple pathology types

### Advanced Analytics
1. **Agreement Metrics**: Calculate Dice coefficient, IoU for region overlap
2. **Heatmap**: Show density of consensus across entire image
3. **Trend Analysis**: Track consensus rates over time per clinician
4. **Disagreement Tagging**: Flag regions for further review

## Technical Details

### Performance
- Canvas redraws debounced with 50ms setTimeout
- Consensus detection runs only when annotations or regions change
- No unnecessary re-renders with `useCallback` memoization

### Browser Compatibility
- Requires HTML5 Canvas support
- Requires ES6+ JavaScript features
- Tested on Chrome, Firefox, Safari

### Accessibility
- Color-blind friendly: Uses shape differences (dots vs gradients vs circles)
- Screen reader support: Consensus summary readable as text
- Keyboard navigation: Tab through buttons and panels

---

**Last Updated**: November 2, 2025
**Version**: 2.2 (Combined Overlay Feature)
