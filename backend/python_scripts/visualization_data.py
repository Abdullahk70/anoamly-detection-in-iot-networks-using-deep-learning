import sys
import pandas as pd
import json
from io import StringIO  # Use the standard library's StringIO

def process_data(data):
    # Convert the CSV string into a pandas DataFrame
    df = pd.read_csv(StringIO(data))

    # Prepare data for visualization
    visualization_data = {
        "columns": list(df.columns),  # List of column names
        "rows": df.to_dict(orient="records"),  # Convert rows to JSON-friendly format
    }

    return visualization_data

if __name__ == "__main__":
    # Read CSV data from stdin
    input_data = sys.stdin.read()

    try:
        result = process_data(input_data)
        print(json.dumps(result))  # Output the JSON
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
