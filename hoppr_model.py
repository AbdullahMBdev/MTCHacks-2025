"""
Hoppr AI Model Integration for DICOM Image Analysis
This module provides a simple interface to analyze DICOM images using Hoppr AI models.
"""

from hopprai import HOPPR
import os
import json
from typing import Optional, Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class HopprModelInterface:
    """Interface for interacting with Hoppr AI models for radiology analysis."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        """
        Initialize the Hoppr model interface.

        Args:
            api_key: Hoppr API key. If None, will use HOPPR_API_KEY environment variable.
            base_url: Optional base URL for the API (use for staging environment).
        """
        self.api_key = api_key or os.getenv("HOPPR_API_KEY")
        if not self.api_key:
            raise ValueError("API key must be provided or set in HOPPR_API_KEY environment variable")

        if base_url:
            self.hoppr = HOPPR(api_key=self.api_key, base_url=base_url)
        else:
            self.hoppr = HOPPR(api_key=self.api_key)

    def analyze_dicom_image(
        self,
        dicom_file_path: str,
        model_id: str = "mc_chestradiography_atelectasis:v1.20250828",
        study_reference: Optional[str] = None,
        image_reference: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyze a DICOM image using the specified Hoppr AI model.

        Args:
            dicom_file_path: Path to the DICOM file to analyze.
            model_id: The Hoppr model ID to use for inference.
            study_reference: Optional custom study reference ID.
            image_reference: Optional custom image reference ID.

        Returns:
            Dictionary containing the analysis results from the model.
        """
        # Generate default references if not provided
        if not study_reference:
            study_reference = f"study-{os.path.basename(dicom_file_path)}"
        if not image_reference:
            image_reference = f"image-{os.path.basename(dicom_file_path)}"

        try:
            # Create a study
            print(f"Creating study: {study_reference}")
            study = self.hoppr.create_study(study_reference)
            print(f"✓ Created study with ID: {study.id}")

            # Read and add the DICOM image
            print(f"Reading DICOM file: {dicom_file_path}")
            with open(dicom_file_path, "rb") as f:
                image_data = f.read()

            print(f"Adding image to study: {image_reference}")
            image = self.hoppr.add_study_image(study.id, image_reference, image_data)
            print(f"✓ Added image with ID: {image.id}")

            # Run inference
            print(f"Running inference with model: {model_id}")
            response = self.hoppr.prompt_model(
                study.id,
                model_id,
                prompt="",
                organization="hoppr",
                response_format="json"
            )

            if response:
                print(f"✓ Inference successful: {response.success}")

                # Convert response to dictionary
                if hasattr(response, "to_dict"):
                    response_data = response.to_dict()
                elif hasattr(response, "__dict__"):
                    response_data = response.__dict__
                else:
                    response_data = response

                return {
                    "success": True,
                    "study_id": study.id,
                    "image_id": image.id,
                    "model_id": model_id,
                    "results": response_data
                }
            else:
                print("✗ Inference timed out")
                return {
                    "success": False,
                    "error": "Inference timed out",
                    "study_id": study.id,
                    "image_id": image.id
                }

        except FileNotFoundError:
            return {
                "success": False,
                "error": f"DICOM file not found: {dicom_file_path}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def get_available_models(self) -> list:
        """
        Get list of available Hoppr models.
        Note: This is a placeholder - actual implementation depends on Hoppr API.

        Returns:
            List of available model IDs.
        """
        # Common Hoppr chest radiography models
        return [
            "mc_chestradiography_atelectasis:v1.20250828",
            # Add more models as they become available
        ]


def main():
    """Example usage of the Hoppr model interface."""
    # Initialize the model interface
    model = HopprModelInterface()

    # Example: Analyze a DICOM image
    # Replace with your actual DICOM file path
    dicom_path = "./sample.dcm"

    if os.path.exists(dicom_path):
        results = model.analyze_dicom_image(dicom_path)
        print("\n" + "="*50)
        print("ANALYSIS RESULTS")
        print("="*50)
        print(json.dumps(results, indent=2, default=str))
    else:
        print(f"Please provide a valid DICOM file at: {dicom_path}")
        print("Or call analyze_dicom_image() with your DICOM file path")


if __name__ == "__main__":
    main()
