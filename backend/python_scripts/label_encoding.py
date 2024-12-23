import sys
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from io import StringIO
import json

def main():
    # Read CSV input from stdin
    csv_data = sys.stdin.read()

    # Convert CSV to DataFrame using StringIO to read from the string
    df = pd.read_csv(StringIO(csv_data))

    # Initialize LabelEncoder
    encoder = LabelEncoder()

    # Apply label encoding on each column where it is needed (for categorical columns)
    encoded_df = df.apply(lambda col: encoder.fit_transform(col) if col.dtypes == 'object' else col)

    # Return JSON response
    print(encoded_df.to_json(orient="records"))

if __name__ == "__main__":
    main()
