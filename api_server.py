"""
Flask API Server for Hoppr AI Integration
Provides REST endpoints for DICOM analysis using Hoppr AI
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from hoppr_model import HopprModelInterface
import os
import tempfile
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Initialize Hoppr model
hoppr_model = HopprModelInterface()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Hoppr AI API',
        'version': '1.0.0'
    })


@app.route('/api/analyze', methods=['POST'])
def analyze_dicom():
    """
    Analyze a DICOM image using Hoppr AI

    Expects:
        - DICOM file in request.files['dicom']
        - Optional model_id in request.form

    Returns:
        JSON with analysis results
    """
    try:
        # Check if file is present
        if 'dicom' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No DICOM file provided'
            }), 400

        dicom_file = request.files['dicom']

        if dicom_file.filename == '':
            return jsonify({
                'success': False,
                'error': 'Empty filename'
            }), 400

        # Get optional model_id
        model_id = request.form.get('model_id', 'mc_chestradiography_atelectasis:v1.20250828')

        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.dcm') as temp_file:
            dicom_file.save(temp_file.name)
            temp_path = temp_file.name

        try:
            # Analyze with Hoppr AI
            print(f"Analyzing DICOM file: {dicom_file.filename}")
            results = hoppr_model.analyze_dicom_image(
                dicom_file_path=temp_path,
                model_id=model_id
            )

            # Add filename to results
            results['filename'] = dicom_file.filename

            return jsonify(results)

        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.unlink(temp_path)

    except Exception as e:
        print(f"Error analyzing DICOM: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/models', methods=['GET'])
def get_models():
    """Get list of available Hoppr AI models"""
    try:
        models = hoppr_model.get_available_models()
        return jsonify({
            'success': True,
            'models': models
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    print("=" * 50)
    print("Starting Hoppr AI API Server")
    print("=" * 50)
    print(f"API URL: http://localhost:5001")
    print(f"Health Check: http://localhost:5001/api/health")
    print(f"Analyze Endpoint: POST http://localhost:5001/api/analyze")
    print("=" * 50)

    app.run(debug=True, port=5001, host='0.0.0.0')
