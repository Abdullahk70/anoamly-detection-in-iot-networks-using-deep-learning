import sys
import pandas as pd
import json
import io

def main():
    # Read CSV input from stdin
    csv_data = sys.stdin.read()

    # Convert CSV to DataFrame using StringIO
    df = pd.read_csv(io.StringIO(csv_data))

    # Perform One-Hot Encoding
    encoded_df = pd.get_dummies(df)

    # Return JSON response
    print(encoded_df.to_json(orient="records"))

if __name__ == "__main__":
    main()
