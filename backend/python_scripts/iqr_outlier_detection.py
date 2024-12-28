import sys
import json
import pandas as pd
import io

def detect_outliers_iqr(data, threshold=1.5):
    # Ensure the data is numeric
    data = pd.to_numeric(data, errors="coerce").dropna()
    
    # Check if data is empty after coercion
    if data.empty:
        return [], []

    Q1 = data.quantile(0.25)
    Q3 = data.quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - (IQR * threshold)
    upper_bound = Q3 + (IQR * threshold)

    outliers = data[(data < lower_bound) | (data > upper_bound)]
    normal_data = data[(data >= lower_bound) & (data <= upper_bound)]

    return normal_data.tolist(), outliers.tolist()

def main():
    # Read dataset from stdin
    dataset = sys.stdin.read()

    if not dataset:
        print("No dataset received")
        sys.exit(1)

    try:
        df = pd.read_csv(io.StringIO(dataset))
    except Exception as e:
        print(f"Error reading dataset: {str(e)}")
        sys.exit(1)

    results = {}

    # Process each column
    for col in df.columns:
        try:
            normal_data, outliers = detect_outliers_iqr(df[col])
            results[col] = {"normalData": normal_data, "outliers": outliers}
        except Exception as e:
            results[col] = {"error": f"Could not process column {col}: {str(e)}"}

    output = {
        "columns": list(df.columns),
        "normalData": [results[col]["normalData"] for col in df.columns],
        "outliers": [results[col]["outliers"] for col in df.columns]
    }

    # Output valid JSON to stdout
    print(json.dumps(output, indent=4))

if __name__ == "__main__":
    main()
