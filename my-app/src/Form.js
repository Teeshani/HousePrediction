import { useState } from "react";
import "./Form.css";

export default function App() {
  const [features, setFeatures] = useState({
    MedInc: "",
    HouseAge: "",
    AveRooms: "",
    AveBedrms: "",
    Population: "",
    AveOccup: "",
    Latitude: "",
    Longitude: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFeatures({ ...features, [e.target.name]: e.target.value });
  };

  // Validation before sending data
  const validateForm = () => {
    const requiredFields = [
      "MedInc", "HouseAge", "AveRooms", "AveBedrms",
      "Population", "AveOccup", "Latitude", "Longitude"
    ];

    for (let field of requiredFields) {
      if (features[field] === "") {
        return `Please fill in the ${field} field.`;
      }
      if (isNaN(features[field])) {
        return `${field} must be a number.`;
      }
    }
    return null; // No validation errors
  };

  const handlePredict = async () => {
    setError(null);
    setPrediction(null);

    // Validate form before submitting
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return; // Stop the function if validation fails
    }

    console.log("Sending Data:", features); // Debugging

    try {
      const response = await fetch("http://127.0.0.1:5000/prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(features),
      });

      const data = await response.json();
      console.log("Response:", data); // Debugging

      if (data.error) setError(data.error);
      else setPrediction(data.prediction);
    } catch (err) {
      setError("Failed to connect to server");
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-heading">Housing Price Prediction</h1>
      
      <div className="form-group">
        {Object.keys(features).map((key) => (
          <div key={key} className="input-container">
            <label className="input-label">{key}</label>
            <input
              type="text"
              name={key}
              className="input-field"
              placeholder={`Enter ${key}`}
              value={features[key]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      <button className="predict-button" onClick={handlePredict}>
        Predict
      </button>

      {prediction !== null && (
        <p className="prediction-result">Predicted Price: ${prediction.toFixed(2)}</p>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
