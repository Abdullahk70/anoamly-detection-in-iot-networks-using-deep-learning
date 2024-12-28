import pandas as pd
import numpy as np
from scipy.stats import zscore
import sys
import json
import io

def detect_outliers_z_score(data):
    """
    Detect outliers using the Z-score method.
    """
    z_scores = zscore(data)
    threshold = 3  # Common threshold for Z-score
    outliers = np.where(np.abs(z_scores) > threshold)[0]  # Indices of outliers
    normal_data = np.delete(data, outliers)  # Remove outliers from the data
    return normal_data.tolist(), data.iloc[outliers].tolist()  # Convert to lists

def process_data(df):
    """
    Process the dataset to detect outliers using Z-score for numeric columns.
    """
    # Extract only numeric columns for outlier detection
    numeric_cols = df.select_dtypes(include=[np.number]).columns

    # Initialize an empty dictionary to store the results
    results = {}

    # Process each numeric column for outliers
    for col in numeric_cols:
        try:
            normal_data, outliers = detect_outliers_z_score(df[col].dropna())
            results[col] = {
                "normalData": normal_data,
                "outliers": outliers
            }
        except Exception as e:
            results[col] = {"error": f"Error processing column {col}: {str(e)}"}

    # Return the results in a dictionary
    return results

def main():
    try:
        # Read the CSV dataset from stdin
        input_data = sys.stdin.read()
        if not input_data.strip():  # Check for empty input
            print("Error: No input received", file=sys.stderr)
            sys.exit(1)

        print(f"Input data received:\n{input_data}", file=sys.stderr)

        # Load the CSV data into a pandas DataFrame
        df = pd.read_csv(io.StringIO(input_data))
        print(f"Parsed DataFrame:\n{df.head()}", file=sys.stderr)

        # Process the dataset
        results = process_data(df)

        # Output the results as JSON
        print(json.dumps(results, indent=4))

    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
