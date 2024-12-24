import sys
import pandas as pd
import io
import json

# Read the input CSV data from stdin
input_data = sys.stdin.read()

# Check if the input data is empty
if not input_data:
    print(json.dumps({"error": "No data received from stdin"}))
    sys.exit(1)

# Try to read the CSV data into a pandas DataFrame
try:
    data = pd.read_csv(io.StringIO(input_data))
    # Check if the DataFrame is empty
    if data.empty:
        print(json.dumps({"error": "Empty CSV data"}))
        sys.exit(1)
except Exception as e:
    print(json.dumps({"error": f"Failed to parse CSV data: {str(e)}"}))
    sys.exit(1)

# Perform Min-Max Scaling
def min_max_scaling(df):
    df = df.apply(pd.to_numeric, errors='coerce')
    df = df.dropna()  # Drop rows with NaN values
    min_vals = df.min()
    max_vals = df.max()
    scaled_df = (df - min_vals) / (max_vals - min_vals)
    return scaled_df

# Apply scaling
scaled_df = min_max_scaling(data)

# Convert the result to JSON and print it
result = scaled_df.to_json(orient='split')

# Print the result
print(result)
