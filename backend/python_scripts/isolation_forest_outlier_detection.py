import sys
import json
import pandas as pd
import io
from sklearn.ensemble import IsolationForest

def detect_outliers_isolation_forest(data, contamination=0.1):
    # Ensure the data is numeric
    data = pd.to_numeric(data, errors="coerce").dropna()
    if len(data) == 0:
        return [], []  # Return empty lists if no valid numeric data

    model = IsolationForest(contamination=contamination)
    outliers = model.fit_predict(data.values.reshape(-1, 1))
    
    normal_data = data[outliers == 1].tolist()
    outlier_data = data[outliers == -1].tolist()

    return normal_data, outlier_data

def main():
    # Read dataset from stdin
    dataset = sys.stdin.read()
    df = pd.read_csv(io.StringIO(dataset))

    results = {}
    for col in df.columns:
        try:
            normal_data, outliers = detect_outliers_isolation_forest(df[col])
            # Ensure that results always contain normalData and outliers
            results[col] = {
                "normalData": normal_data if normal_data else [],
                "outliers": outliers if outliers else []
            }
        except Exception as e:
            results[col] = {"error": f"Could not process column {col}: {str(e)}"}

    # Check if results have the expected structure before returning
    output = {
        "columns": list(df.columns),
        "normalData": [results.get(col, {}).get("normalData", []) for col in df.columns],
        "outliers": [results.get(col, {}).get("outliers", []) for col in df.columns]
    }
    
    print(json.dumps(output))

if __name__ == "__main__":
    main()
