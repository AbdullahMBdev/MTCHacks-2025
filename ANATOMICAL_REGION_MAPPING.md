# Anatomical Region Mapping for AI Findings

## Overview

Since Hoppr AI chest radiography models perform **image-level classification** (detecting presence/absence of pathologies) rather than **object detection** (locating specific regions), the system uses **anatomically accurate region mapping** to display findings in medically appropriate locations on chest X-rays.

## Problem

Hoppr AI models return:
- **Confidence score** (0-1): How confident the AI is about the pathology
- **Model ID**: Which pathology was detected

Hoppr AI models **do NOT return**:
- Bounding box coordinates
- Pixel-level segmentation masks
- Exact anatomical locations

## Solution

The system uses a pre-defined mapping of pathologies to their typical anatomical locations on chest X-rays. These regions are based on standard radiological knowledge of where each pathology commonly appears.

## Coordinate System

All coordinates use **normalized values (0-1)**:
- `x: 0` = Left edge of image
- `x: 1` = Right edge of image
- `y: 0` = Top edge of image
- `y: 1` = Bottom edge of image
- `radius`: Proportional to image size (e.g., 0.2 = 20% of image width/height)

**Chest X-ray orientation** (standard PA view):
- Left lung appears on RIGHT side of image (patient's left)
- Right lung appears on LEFT side of image (patient's right)

## Pathology Region Mapping

### Atelectasis (Lung Collapse)
**Typical Locations**: Upper and mid lung zones

```typescript
{
  x: 0.30, y: 0.35, radius: 0.18,  // Left upper/mid zone
  x: 0.70, y: 0.35, radius: 0.18   // Right upper/mid zone
}
```

**Rationale**: Atelectasis commonly affects upper and middle lobes.

### Pneumothorax (Collapsed Lung)
**Typical Locations**: Lung apices (tops)

```typescript
{
  x: 0.25, y: 0.25, radius: 0.15,  // Left apical region
  x: 0.75, y: 0.25, radius: 0.15   // Right apical region
}
```

**Rationale**: Air rises, so pneumothorax is best detected at lung apices on upright X-rays.

### Cardiomegaly (Enlarged Heart)
**Typical Location**: Central lower chest

```typescript
{
  x: 0.50, y: 0.60, radius: 0.28   // Cardiac silhouette
}
```

**Rationale**: Heart is centrally located in lower chest. Larger radius reflects cardiac size.

### Lung Opacity
**Typical Locations**: Bilateral lung fields

```typescript
{
  x: 0.35, y: 0.45, radius: 0.20,  // Left lung field
  x: 0.65, y: 0.45, radius: 0.20   // Right lung field
}
```

**Rationale**: Opacities can occur anywhere in lungs; mid-zones are most common.

### Pleural Effusion (Fluid in Pleural Space)
**Typical Locations**: Costophrenic angles (lowest points)

```typescript
{
  x: 0.30, y: 0.72, radius: 0.18,  // Left costophrenic angle
  x: 0.70, y: 0.72, radius: 0.18   // Right costophrenic angle
}
```

**Rationale**: Fluid collects at lowest points due to gravity. Blunting of costophrenic angles is classic sign.

### Consolidation (Airspace Filling)
**Typical Locations**: Lower lobes

```typescript
{
  x: 0.35, y: 0.52, radius: 0.18,  // Left lower lobe
  x: 0.65, y: 0.52, radius: 0.18   // Right lower lobe
}
```

**Rationale**: Consolidation (pneumonia) commonly affects lower lobes.

### Infiltration
**Typical Locations**: Perihilar/central regions

```typescript
{
  x: 0.35, y: 0.42, radius: 0.22,  // Left perihilar region
  x: 0.65, y: 0.42, radius: 0.22   // Right perihilar region
}
```

**Rationale**: Infiltrates often appear in central/perihilar areas.

### Pleural Thickening
**Typical Locations**: Lateral pleural margins

```typescript
{
  x: 0.18, y: 0.50, radius: 0.12,  // Left lateral margin
  x: 0.82, y: 0.50, radius: 0.12   // Right lateral margin
}
```

**Rationale**: Pleural thickening is best seen along lateral chest wall. Smaller radius reflects localized finding.

### Aortic Enlargement
**Typical Location**: Upper mediastinum

```typescript
{
  x: 0.45, y: 0.28, radius: 0.16   // Aortic arch/knob
}
```

**Rationale**: Aortic arch appears in upper left mediastinum.

### Calcification
**Typical Location**: Cardiac/vascular region

```typescript
{
  x: 0.50, y: 0.55, radius: 0.18   // Central chest
}
```

**Rationale**: Common sites include cardiac valves, coronary arteries, and great vessels.

### Pulmonary Fibrosis
**Typical Locations**: Lower zones (bilateral)

```typescript
{
  x: 0.35, y: 0.58, radius: 0.20,  // Left lower zone
  x: 0.65, y: 0.58, radius: 0.20   // Right lower zone
}
```

**Rationale**: Fibrosis typically has lower zone predominance. Reticular pattern is characteristic.

### ILD (Interstitial Lung Disease)
**Typical Locations**: Mid and lower zones

```typescript
{
  x: 0.35, y: 0.48, radius: 0.22,  // Left mid/lower zone
  x: 0.65, y: 0.48, radius: 0.22   // Right mid/lower zone
}
```

**Rationale**: ILD shows diffuse interstitial pattern, often mid-to-lower predominant.

### Normal
**Regions**: None

```typescript
[]
```

**Rationale**: No pathology detected, no regions to highlight.

## Implementation Logic

### Primary Finding
Always displayed for scores ≥ 0.3:
- Uses **first region** from anatomical mapping
- Shows full pathology name as label
- Displays detailed clinical description

```typescript
regions.push({
  x: primaryRegion.x,
  y: primaryRegion.y,
  radius: primaryRegion.radius,
  intensity: score,
  label: pathologyInfo.fullName,
  explanation: pathologyInfo.description
});
```

### Secondary Finding
Displayed only for high confidence (score > 0.6) AND pathology has multiple typical regions:
- Uses **second region** from anatomical mapping
- Intensity reduced to 85% of primary
- Shows either secondary clinical finding or anatomical description

```typescript
if (score > 0.6 && anatomicalRegions.length > 1) {
  regions.push({
    x: secondaryRegion.x,
    y: secondaryRegion.y,
    radius: secondaryRegion.radius,
    intensity: score * 0.85,
    label: secondaryLabel,
    explanation: secondaryExplanation
  });
}
```

## Limitations

### Not Pixel-Perfect
These regions represent **typical anatomical locations** based on radiological knowledge, not the exact pixels where the AI "saw" the pathology.

### Fixed Positions
Regions are fixed for each pathology type. The actual pathology in a specific patient's X-ray may be:
- Slightly offset from standard location
- More extensive than shown
- Unilateral rather than bilateral

### Classification vs Detection
Hoppr AI models are **classifiers** (yes/no for pathology), not **detectors** (where is the pathology). This mapping bridges that gap using medical knowledge.

## Future Enhancements

### 1. Gradient-weighted Class Activation Mapping (Grad-CAM)
If Hoppr adds support for activation maps:
```typescript
interface HopprResponse {
  score: number;
  activation_map?: number[][];  // Heatmap of AI attention
}
```

### 2. Bounding Box Models
If Hoppr provides object detection models:
```typescript
interface BoundingBox {
  x1: number; y1: number;
  x2: number; y2: number;
  confidence: number;
}
```

### 3. Segmentation Masks
For pixel-level pathology delineation:
```typescript
interface SegmentationMask {
  width: number;
  height: number;
  mask: number[][];  // 0-255 pixel values
}
```

### 4. User Adjustment
Allow clinicians to move/resize regions:
```typescript
<CombinedDicomViewer
  allowRegionEditing={true}
  onRegionMove={(regionId, newX, newY) => { ... }}
/>
```

## Usage Example

### Code Location
[Demo.tsx:116-227](src/components/Demo.tsx#L116-L227)

### How It Works
1. AI returns: `{ score: 0.87, model_id: "mc_chestradiography_pneumothorax:v1..." }`
2. System extracts: `pathologyKey = "pneumothorax"`
3. System looks up: `PATHOLOGY_REGIONS["pneumothorax"]`
4. System creates regions at apical locations (x: 0.25, y: 0.25) and (x: 0.75, y: 0.25)
5. Frontend renders orange/yellow heatmap circles at those coordinates

### Visual Result
- Primary finding: Left apex with orange gradient
- Secondary finding (if score > 0.6): Right apex with slightly lighter gradient
- Both regions show "Pneumothorax" label with clinical explanation on hover

## Medical Accuracy

These anatomical mappings were created based on:
- Standard chest radiography anatomy
- Common disease distribution patterns
- Radiological textbooks and guidelines
- Clinical experience with chest X-ray interpretation

**Disclaimer**: This is a **demonstration system** for research purposes. Always verify AI findings with actual radiological interpretation and clinical correlation.

---

**Last Updated**: November 2, 2025
**Version**: 2.3 (Anatomically Accurate Region Mapping)
