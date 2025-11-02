# Co-Read Assist - AI-Powered Radiology Collaboration Platform

A collaborative radiology platform that integrates Hoppr AI for medical imaging analysis, allowing radiologists to annotate DICOM images and receive AI-powered insights.

## Project Overview

This project combines:
- **Frontend**: React + TypeScript + Vite web application for DICOM viewing and annotation
- **AI Backend**: Hoppr AI integration for chest radiography analysis
- **Features**: Real-time annotation, AI insights, and collaborative review

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- shadcn-ui components
- Tailwind CSS
- React Router
- TanStack Query

### Backend/AI
- Python 3
- Hoppr AI SDK (`hopprai`)
- DICOM image processing

## Getting Started

### Prerequisites
- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Python 3.x
- Hoppr AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd MTCHacks-2025
   ```

2. **Set up the frontend**
   ```bash
   # Install Node dependencies
   npm install
   ```

3. **Set up the Python backend**
   ```bash
   # Create and activate virtual environment
   python3 -m venv venv
   source venv/bin/activate  # On macOS/Linux
   # or: venv\Scripts\activate  # On Windows

   # Install Python dependencies
   pip install hopprai python-dotenv
   ```

4. **Configure environment variables**

   Create a `.env` file in the project root:
   ```env
   HOPPR_API_KEY=your_api_key_here
   ```

### Running the Application

**Start the frontend development server:**
```bash
npm run dev
```

**Test the Hoppr AI integration:**
```bash
source venv/bin/activate
python test_hoppr.py
```

## Project Structure

```
MTCHacks-2025/
├── src/                    # React frontend source
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions
├── public/                # Static assets
├── hoppr_model.py         # Hoppr AI integration module
├── test_hoppr.py          # AI model test script
├── main.py               # Example Hoppr usage
├── venv/                 # Python virtual environment
└── .env                  # Environment variables (not in git)
```

## Key Features

- **DICOM Image Viewing**: Display and interact with medical imaging files
- **Annotation Tools**: Highlight and comment on specific regions
- **AI Insights**: Get Hoppr AI analysis for chest radiography
- **Collaborative Review**: Share findings and AI insights with team

## Hoppr AI Integration

The `hoppr_model.py` module provides a simple interface:

```python
from hoppr_model import HopprModelInterface

# Initialize the model
model = HopprModelInterface()

# Analyze a DICOM image
results = model.analyze_dicom_image("path/to/scan.dcm")

# Access AI insights
if results["success"]:
    insights = results["results"]
    print(insights)
```

## Development

**Frontend:**
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linter
```

**Python/AI:**
```bash
# Always activate venv first
source venv/bin/activate

# Test AI integration
python test_hoppr.py

# Run example
python main.py
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HOPPR_API_KEY` | Your Hoppr AI API key | Yes |

## Contributing

This project was built for MTCHacks 2025.

## License

See LICENSE file for details.
