"""
Test script for Hoppr AI model integration.
Run this to verify your API key and model are working correctly.
"""

from hoppr_model import HopprModelInterface
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def test_api_connection():
    """Test if we can connect to the Hoppr API."""
    print("Testing Hoppr AI Connection")
    print("="*50)

    # Check if API key is set
    api_key = os.getenv("HOPPR_API_KEY")
    if not api_key:
        print("✗ HOPPR_API_KEY environment variable not set!")
        print("\nPlease set your API key:")
        print("  export HOPPR_API_KEY='your-api-key-here'")
        return False
    else:
        print(f"✓ API key found (length: {len(api_key)} characters)")

    # Initialize model interface
    try:
        model = HopprModelInterface()
        print("✓ Successfully initialized Hoppr model interface")
        return True
    except Exception as e:
        print(f"✗ Failed to initialize: {e}")
        return False


def test_with_dicom(dicom_path: str):
    """Test analysis with a DICOM file."""
    print(f"\nTesting DICOM Analysis")
    print("="*50)

    if not os.path.exists(dicom_path):
        print(f"✗ DICOM file not found: {dicom_path}")
        print("\nPlease provide a valid DICOM file path")
        return

    print(f"Using DICOM file: {dicom_path}")

    # Initialize and run analysis
    model = HopprModelInterface()
    results = model.analyze_dicom_image(dicom_path)

    # Display results
    print("\n" + "="*50)
    print("ANALYSIS RESULTS")
    print("="*50)
    print(json.dumps(results, indent=2, default=str))

    if results.get("success"):
        print("\n✓ Analysis completed successfully!")
    else:
        print(f"\n✗ Analysis failed: {results.get('error')}")


if __name__ == "__main__":
    # First test API connection
    if test_api_connection():
        print("\n✓ API connection test passed!")

        # Test with an Atelectasis DICOM file
        dicom_file = "dicom_images/Hackathon Sample DICOM Images (2)/Atelectasis/train/0b1b897b1e1e170f1b5fd7aeff553afa.dcm"
        test_with_dicom(dicom_file)
    else:
        print("\n✗ API connection test failed. Please check your setup.")
