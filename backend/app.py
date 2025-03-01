from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

# Load the trained model
with open("best_model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route("/prediction", methods=["POST"])
def predict():
    try:
        data = request.json  # Get JSON data

        # Debugging: Print received data
        print("Received Data:", data)

        required_features = [
            "MedInc", "HouseAge", "AveRooms", "AveBedrms",
            "Population", "AveOccup", "Latitude", "Longitude"
        ]

        # Ensure all features exist
        if not all(f in data for f in required_features):
            return jsonify({"error": "Missing required features", "received": list(data.keys())})

        # Convert to numeric and modify MedInc
        features = np.array([
            float(data["MedInc"]) / 10,  # Divide MedInc by 10
            float(data["HouseAge"]),
            float(data["AveRooms"]),
            float(data["AveBedrms"]),
            float(data["Population"]),
            float(data["AveOccup"]),
            float(data["Latitude"]),
            float(data["Longitude"])
        ]).reshape(1, -1)

        # Predict
        prediction = model.predict(features)[0] * 100000  # Multiply by 100000

        return jsonify({"prediction": float(prediction)})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)


