# Co-Read Assist - Codebase Architecture Guide

This document provides a comprehensive overview of the Co-Read Assist project architecture for Claude Code users working on this codebase.

## Project Overview

**Co-Read Assist** is a collaborative radiology platform combining:
- **Frontend**: React + TypeScript web application for DICOM viewing and annotation
- **AI Backend**: Hoppr AI integration for chest radiography analysis
- **Purpose**: Side-by-side display of clinician annotations vs AI findings with consensus highlighting
- **Status**: Hackathon prototype (MTCHacks 2025) for research and evaluation only

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ User Browser                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ React Frontend (SPA)                                 │  │
│  │  - Vite build system                                 │  │
│  │  - TypeScript / TSX                                  │  │
│  │  - shadcn-ui components + Tailwind CSS              │  │
│  │  - React Router (single page navigation)            │  │
│  │  - TanStack Query (data fetching/caching)           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
                    HTTP API Layer
                            ↕
┌─────────────────────────────────────────────────────────────┐
│ Backend Services                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Python Backend                                       │  │
│  │  - hoppr_model.py: Hoppr AI integration module      │  │
│  │  - test_hoppr.py: Testing & validation              │  │
│  │  - main.py: Example usage                           │  │
│  │  - Environment: venv + hopprai + python-dotenv      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Hoppr AI Service (External)                          │  │
│  │  - Chest radiography analysis models                │  │
│  │  - Study/image management                           │  │
│  │  - Inference API                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│ Data Sources                                                │
│  - DICOM images (sample data in /dicom_images)             │
│  - Environment variables (.env)                            │
│  - User annotations (frontend state)                       │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Structure

### Key Entry Points
- **src/main.tsx**: Application bootstrap
  - React root rendering
  - No additional setup beyond React DOM mounting

- **src/App.tsx**: Root component with providers
  - QueryClientProvider (TanStack Query for data management)
  - TooltipProvider (Radix UI)
  - Toast providers (Sonner + shadcn)
  - BrowserRouter (React Router)
  - Routes: "/" → Index page, "*" → NotFound

### Pages (src/pages/)
- **Index.tsx**: Main landing page
  - Composes all marketing/feature sections
  - Single-page layout with scroll navigation
  - Sections: Navigation → Hero → Problem/Solution → Workflow → Features → Safety → Integrations → Demo → FAQ → Contact → Footer

### Component Organization (src/components/)

#### Marketing/UI Components
- **Hero.tsx**: Main hero section with CTA buttons, trust badges
  - Uses react-scroll for smooth navigation
  - Displays hero image + text value prop
  - Shows "Side-by-Side" vs "Combined Overlay" mode toggle preview

- **Workflow.tsx**: Three-step workflow visualization
  - Step 1: Upload/DICOM Pull → accepts X-ray, CT, MRI
  - Step 2: Annotate & Review → AI analysis appears side-by-side
  - Step 3: Combine & Export → consensus highlighting, PACS export

- **Demo.tsx**: Interactive demonstration component
  - Stateful component with viewMode ("sideBySide" | "combined")
  - Shows side-by-side comparison: clinician annotations vs AI findings
  - Consensus highlighting with animated pulses
  - Export actions: Download PDF, Send to PACS
  - Uses Tabs component for view switching

- **Features.tsx**: Six feature cards
  - Side-by-Side Compare
  - Combined Overlay
  - Consensus Highlighting
  - Download & Send
  - Audit Trail & Versioning
  - Privacy by Design

- **Navigation.tsx**: Fixed sticky navbar
  - Responsive mobile/desktop menu
  - Theme toggle (light/dark mode)
  - Smooth scroll navigation to sections (react-scroll)
  - Logo: "CR" in gradient box

- **Safety.tsx**: Safety & compliance section
  - Human-in-the-loop explanation
  - PHI handling details
  - Audit & compliance guarantees
  - Important disclaimer alert (investigational use only)

- **Integrations.tsx**: Integration details section

- **ProblemSolution.tsx**: Problem/solution narrative

- **FAQ.tsx**: Frequently asked questions

- **Contact.tsx**: Pilot request form
  - Form fields: name, email, role, organization, useCase, volume
  - Select dropdowns for role and volume
  - Consent checkbox required before submission
  - Toast notifications for form state

- **Footer.tsx**: Footer navigation and info

#### UI Components Library (src/components/ui/)
Built with shadcn-ui and Radix UI primitives. All components are styled with Tailwind CSS and follow the design system defined in tailwind.config.ts.

**Key UI components used:**
- Button (with variants: hero, medical, outline, ghost)
- Badge (secondary variant for labels)
- Card (for content containers)
- Tabs/TabsContent/TabsList/TabsTrigger (for view switching in Demo)
- Input, Label, Textarea (form elements)
- Select, SelectTrigger, SelectValue, SelectContent, SelectItem (dropdown)
- Checkbox (form validation)
- Alert, AlertDialog (notifications)
- Toaster/Toast from sonner (toast notifications)
- Tooltip, TooltipProvider (hover hints)

### Styling System

**Tailwind Configuration (tailwind.config.ts):**
- CSS variables for theming (colors, shadows, gradients)
- Custom colors: primary, secondary, accent, success, warning, destructive, muted
- Custom box shadows: elegant, glow, card
- Custom animations: fade-in, fade-in-up, scale-in, pulse-glow, consensus-pulse
- Gradient backgrounds: primary, subtle, highlight
- Dark mode support via class-based toggle

**CSS Architecture:**
- src/index.css: Global styles and CSS variable definitions
- Component-level Tailwind classes (no external CSS files for components)
- Design follows light mode by default with dark mode toggle support

**Animation Patterns:**
- Staggered animation delays using inline styles: `animationDelay: ${index * delayMs}ms`
- Reusable Tailwind animation classes
- Consensus pulse animation for interactive elements

### Hooks (src/hooks/)
- **use-mobile.tsx**: Responsive breakpoint detection
- **use-toast.ts**: Toast notification hook

### Utilities (src/lib/)
- **utils.ts**: cn() function for merging Tailwind classes (clsx + tailwind-merge)

### Assets (src/assets/)
- hero-medical-interface.jpg (demo interface screenshot)
- annotation-tools.jpg (annotation workflow image)
- consensus-highlight.jpg (consensus highlighting visual)
- modalities-icon.jpg (modalities support icon)

## Backend Structure

### Hoppr AI Integration Module (hoppr_model.py)

**Class: HopprModelInterface**

```python
class HopprModelInterface:
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None)
    def analyze_dicom_image(
        self,
        dicom_file_path: str,
        model_id: str = "mc_chestradiography_atelectasis:v1.20250828",
        study_reference: Optional[str] = None,
        image_reference: Optional[str] = None
    ) -> Dict[str, Any]
    def get_available_models(self) -> list
```

**Key Features:**
- Initializes Hoppr client using hopprai SDK
- Loads API key from HOPPR_API_KEY environment variable
- DICOM Processing Workflow:
  1. Create study in Hoppr (returns study.id)
  2. Read DICOM file as binary
  3. Add image to study (returns image.id)
  4. Run inference with specified model
  5. Return structured results with success flag

**Response Format:**
```python
{
    "success": True,
    "study_id": str,
    "image_id": str,
    "model_id": str,
    "results": Dict[str, Any]  # AI model response
}
```

**Error Handling:**
- Returns success=False with error message on exceptions
- Handles FileNotFoundError for missing DICOM files
- Timeout detection if inference response is null

**Default Model:**
- "mc_chestradiography_atelectasis:v1.20250828" (chest radiography analysis)

### Testing & Validation (test_hoppr.py)

**Functions:**
- `test_api_connection()`: Verifies API key and client initialization
- `test_with_dicom(dicom_path)`: Tests full analysis workflow with DICOM file

**Sample DICOM Location:**
```
dicom_images/Hackathon Sample DICOM Images (2)/Atelectasis/train/0b1b897b1e1e170f1b5fd7aeff553afa.dcm
```

**Available Test Pathologies:**
- Atelectasis
- Cardiomegaly
- Pneumothorax
- Lung Opacity
- Pleural Thickening
- Normal
- Aortic Enlargement
- Calcification
- Pulmonary Fibrosis
- Infiltration
- Consolidation
- Pleural Effusion

### Main Usage Example (main.py)
Simple script demonstrating HopprModelInterface usage with error handling and JSON output.

## Environment Configuration

### .env File
```
HOPPR_API_KEY=<your-api-key-here>
```

**Important Notes:**
- .env is in .gitignore (not committed to repo)
- API key required for Hoppr AI integration to function
- Must be set before running backend tests

### Virtual Environment
- Path: venv/
- Python 3.x
- Dependencies:
  - hopprai: Official Hoppr AI SDK
  - python-dotenv: Environment variable loading

## DICOM Image Processing Workflow

### Data Location
```
/dicom_images/
└── Hackathon Sample DICOM Images (2)/
    ├── Atelectasis/train/*.dcm
    ├── Cardiomegaly/train/*.dcm
    ├── Pneumothorax/train/*.dcm
    ├── Lung_Opacity/train/*.dcm
    ├── Pleural_thickening/train/*.dcm
    ├── Normal/train/*.dcm
    ├── Aortic_enlargement/train/*.dcm
    ├── Calcification/train/*.dcm
    ├── Pulmonary_fibrosis/train/*.dcm
    ├── Infiltration/train/*.dcm
    ├── Consolidation/train/*.dcm
    └── Pleural_effusion/train/*.dcm
```

### Processing Steps (from test_hoppr.py)
1. **File Selection**: Choose DICOM file from one of the pathology categories
2. **Model Initialization**: Create HopprModelInterface instance
3. **Analysis**: Call analyze_dicom_image() with file path
4. **Results**: Receive structured response with findings and confidence scores
5. **Visualization**: Frontend displays findings alongside clinician annotations

### Image Modalities Supported
- X-ray (chest radiography focus)
- CT (shown in workflow but currently optimized for chest X-ray)
- MRI (planned support)

## API Communication Patterns

### Current State
- **Potential Future API**: Frontend will eventually need endpoint to:
  - Submit DICOM images for analysis
  - Receive AI findings
  - Store annotations
  
### Existing Patterns to Follow
- **TanStack Query**: Used in App.tsx for data fetching/caching
  - Recommended for future API calls
  - Provides stale-while-revalidate patterns
  
- **Toast Notifications**: Used for user feedback
  - Success/error states via sonner toast
  - Example in Demo.tsx: `toast.success()`, `toast.error()`, `toast.info()`

- **State Management**: Currently React local state
  - Demo.tsx uses useState for viewMode and showConsensus
  - Contact.tsx uses useState for form data
  - Can be extended with context or additional state management if needed

## Build & Deployment

### Frontend Build
```bash
npm run dev      # Vite dev server (port 8080)
npm run build    # Production bundle
npm run build:dev # Dev mode build
npm run lint     # ESLint
npm run preview  # Preview production build locally
```

**Vite Configuration (vite.config.ts):**
- React SWC plugin for fast compilation
- Path alias: "@" → "./src"
- Dev server: localhost:8080
- Component tagger plugin in development mode

### Python Backend
```bash
source venv/bin/activate
python test_hoppr.py  # Test Hoppr integration
python main.py        # Run example
```

### Build Artifacts
- Frontend: dist/ directory (created by vite build)
- TypeScript: Compiled to JavaScript for browser
- CSS: Tailwind processed and bundled

## Technology Stack Summary

### Frontend
- **Runtime**: Node.js / Browser (ES6+ JavaScript)
- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite 5
- **UI Library**: shadcn-ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3
- **Routing**: React Router 6
- **State Management**: React hooks + React Context + TanStack Query
- **Notifications**: Sonner (toast), Radix Alert
- **Icons**: Lucide React
- **Form Validation**: React Hook Form + Zod
- **Utilities**: clsx, tailwind-merge

### Backend
- **Runtime**: Python 3
- **AI SDK**: hopprai (Hoppr official SDK)
- **Configuration**: python-dotenv
- **DICOM Handling**: Binary file reading (via hopprai)

### Development
- **Package Manager**: npm (Node.js)
- **Linter**: ESLint 9
- **Code Style**: TypeScript ESLint
- **Build Bundler**: Vite
- **CSS Processing**: PostCSS + Autoprefixer + Tailwind

## Key Design Patterns

### Component Composition
- Stateless presentation components for marketing sections
- Stateful components only where needed (Demo, Contact, Navigation)
- Props passed from parent (Index.tsx) to children
- No prop drilling; minimal prop requirements

### Section-based Layout
- Each major section is a separate component
- Smooth scroll navigation via react-scroll
- ID-based routing: elements with id="section-name" match navigation links
- Z-index hierarchy: navbar z-50 (sticky), rest stacked normally

### Animation Strategy
- CSS keyframes defined in Tailwind config
- Staggered animations using `animationDelay` inline style
- Fade-in-up for upward entrance
- Scale-in for card appearances
- Consensus-pulse for interactive highlights

### Form Handling
- Local useState for form state
- Form validation via required attributes + optional Zod
- Toast notifications for user feedback
- Form reset after successful submission

### Conditional Rendering
- Ternary operators for simple conditions
- Logical && for single condition rendering
- .map() for list rendering with keys
- Tab content switching in Demo.tsx

## Security & Compliance Notes

### Current Status
- Prototype/research demo only
- NOT FDA approved medical device
- NOT for primary diagnostic use
- De-identified sample data only

### Architecture for Future Compliance
- HIPAA-compliant design (transit encryption, on-device masking)
- Audit trail support (component structure ready)
- PHI masking capability (documented in Safety section)
- SOC 2 architecture planned

## Common Development Tasks

### Adding a New Page/Route
1. Create component in src/pages/
2. Import in App.tsx
3. Add Route in App.tsx BrowserRouter
4. Update Navigation.tsx if needed

### Adding a Marketing Section
1. Create component in src/components/
2. Add id="section-name" to section element
3. Add smooth scroll link in Navigation.tsx
4. Import and include in src/pages/Index.tsx

### Adding UI Components
- Use shadcn-ui library (already included)
- Components in src/components/ui/ are pre-built
- Style with Tailwind classes
- Reference tailwind.config.ts for custom colors/animations

### Styling Guidelines
- Use CSS variables via Tailwind (e.g., text-primary, bg-card)
- Animate with tailwind animation classes
- Use cn() utility for conditional class merging
- Follow spacing scale: gap-3, p-6, mt-4, etc.

### Running Hoppr Analysis
```python
from hoppr_model import HopprModelInterface

model = HopprModelInterface()
results = model.analyze_dicom_image("path/to/dicom.dcm")

if results["success"]:
    print(results["results"])
else:
    print(results["error"])
```

## Common Issues & Troubleshooting

### Frontend Build Issues
- **"Cannot find module '@'"**: Path alias not working → check tsconfig.json paths
- **Tailwind styles not applying**: Ensure tailwind.config.ts includes file paths
- **Dark mode not working**: Check document.documentElement class toggle in Navigation.tsx

### Backend Issues
- **"ModuleNotFoundError: No module named 'hopprai'"**: Activate venv and install dependencies
- **"API key must be provided"**: Check .env file has HOPPR_API_KEY set
- **"DICOM file not found"**: Use absolute paths; check file exists

### Port Conflicts
- Frontend default: 8080 (configured in vite.config.ts)
- Change with: `npm run dev -- --port 3000`

## Future Enhancement Areas

### Potential Features
1. **Actual DICOM Viewer**: 
   - Replace mockups with real DICOM rendering
   - Use cornerstone.js or similar library
   - Display actual pixel data and metadata

2. **Full API Backend**:
   - REST/GraphQL API layer
   - Database for studies/annotations
   - User authentication
   - Real-time websocket updates

3. **Annotation Tools**:
   - Drawing tools (rectangle, polygon, freehand)
   - Measurement tools
   - Label creation
   - Measurement storage

4. **Export Functionality**:
   - PDF report generation
   - DICOM SR (Structured Report) creation
   - PACS integration (DICOMweb)
   - Direct send to RIS systems

5. **Production Deployment**:
   - Docker containerization
   - Healthcare compliance auditing
   - HIPAA encryption
   - DICOM securely validated

## File Structure Reference

```
MTCHacks-2025/
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Root component with providers
│   ├── index.css                # Global styles & CSS variables
│   ├── pages/
│   │   ├── Index.tsx            # Main page
│   │   └── NotFound.tsx         # 404 page
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── Demo.tsx
│   │   ├── Workflow.tsx
│   │   ├── Features.tsx
│   │   ├── Safety.tsx
│   │   ├── Navigation.tsx
│   │   ├── Contact.tsx
│   │   ├── [other sections]
│   │   └── ui/                  # shadcn-ui components (pre-built)
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── assets/                  # Image assets
│   └── vite-env.d.ts
├── public/
├── hoppr_model.py               # Hoppr AI integration
├── test_hoppr.py                # Integration tests
├── main.py                      # Example usage
├── dicom_images/                # Sample DICOM files
├── .env                         # Environment variables (not in git)
├── package.json                 # NPM dependencies
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── README.md                    # Project README
└── CLAUDE.md                    # This file
```

---

**Last Updated**: November 1, 2025
**Project Type**: Hackathon Prototype (MTCHacks 2025)
**Status**: Active Development
