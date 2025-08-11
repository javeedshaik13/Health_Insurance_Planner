# Health Insurance API Backend

Node.js Express API server that bridges the React frontend with the Streamlit ML service.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Endpoints

### Health Check
- **GET** `/health`
- Returns API status

### Prediction
- **POST** `/api/predict`
- Body: JSON with user form data
- Returns: Prediction result

## Example Request

```json
{
  "age": 30,
  "dependants": 2,
  "income": 10,
  "geneticalRisk": 1,
  "insurancePlan": "silver",
  "employmentStatus": "salaried",
  "gender": "male",
  "maritalStatus": "married",
  "bmiCategory": "normal",
  "smokingStatus": "no-smoking",
  "region": "northwest",
  "medicalHistory": "no-disease"
}
```

## Example Response

```json
{
  "success": true,
  "prediction": 15500,
  "data": {
    "Age": 30,
    "Number of Dependants": 2,
    "Income in Lakhs": 10,
    "Genetical Risk": 1,
    "Insurance Plan": "Silver",
    "Employment Status": "Salaried",
    "Gender": "Male",
    "Marital Status": "Married",
    "BMI Category": "Normal",
    "Smoking Status": "No Smoking",
    "Region": "Northwest",
    "Medical History": "No Disease"
  }
}
```
