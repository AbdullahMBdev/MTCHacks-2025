from hopprai import HOPPR
import os
import json

# Initialize the SDK
api_key = os.getenv("HOPPR_API_KEY")
#hoppr = HOPPR(api_key=api_key, base_url="https://api-staging.hoppr.ai")
hoppr = HOPPR(api_key=api_key)

# Create a study
study = hoppr.create_study("my-study-reference-123")
print(f"Created study: {study.id}")

# Add an image to the study
with open("./kaggle_data/vindr/classes/Atelectasis/train/0b1b897b1e1e170f1b5fd7aeff553afa.dcm", "rb") as f:
    image_data = f.read()

image = hoppr.add_study_image(study.id, "image-001", image_data)
print(f"Added image: {image.id}")

model_id = "mc_chestradiography_atelectasis:v1.20250828"
response = hoppr.prompt_model(study.id, model_id, prompt="", organization="hoppr", response_format="json")

if response:
    print(f"Inference successful: {response.success}")
    # Pretty-print the response data for better readability
    if hasattr(response, "to_dict"):
        response_data = response.to_dict()
    elif hasattr(response, "__dict__"):
        response_data = response.__dict__
    else:
        response_data = response

    print("Response data:")
    print(json.dumps(response_data, indent=4, sort_keys=True, default=str))
else:
    print("Inference timed out")