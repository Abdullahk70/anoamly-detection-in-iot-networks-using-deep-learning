import sys
import pandas as pd

def process_file(file_path):
    try:
        # Read the file
        if file_path.endswith(".csv"):
            data = pd.read_csv(file_path)
        elif file_path.endswith(".xlsx") or file_path.endswith(".xls"):
            data = pd.read_excel(file_path)
        else:
            return "Unsupported file format"

        # Perform some processing (e.g., return summary stats)
        summary = {
            "columns": list(data.columns),
            "rows": len(data),
            "preview": data.head(5).to_dict(orient="records"),
        }
        return summary
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    # Get file path from arguments
    file_path = sys.argv[1]
    result = process_file(file_path)
    print(result)
