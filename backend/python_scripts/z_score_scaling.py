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

# Select only numeric columns for Z-score scaling
numeric_columns = data.select_dtypes(include=['number'])

# Check if there are any numeric columns
if numeric_columns.empty:
    print(json.dumps({"error": "No numeric columns to scale"}))
    sys.exit(1)

# Perform Z-score scaling
def z_score_scaling(df):
    means = df.mean()
    stds = df.std()
    scaled_df = (df - means) / stds
    return scaled_df

# Apply scaling to numeric columns
scaled_df = z_score_scaling(numeric_columns)

# Replace the original numeric columns with the scaled values
data[numeric_columns.columns] = scaled_df

# Convert the result to JSON and print it
result = data.to_json(orient='split')

# Print the result
print(result)
