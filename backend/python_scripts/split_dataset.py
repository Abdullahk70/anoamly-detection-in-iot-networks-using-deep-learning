import sys
import json
import pandas as pd
from io import BytesIO

def process_file(file_data, file_type):
    try:
        print(f"Processing file of type: {file_type}")
        
        # Use BytesIO to treat file_data as a file-like object
        file_content = BytesIO(file_data)

        # Check the file type and process accordingly
        if file_type == "CSV":
            # Read CSV file
            df = pd.read_csv(file_content)
            print(f"CSV file loaded successfully. Data preview:\n{df.head()}")
        elif file_type == "Excel":
            # Read Excel file
            df = pd.read_excel(file_content)
            print(f"Excel file loaded successfully. Data preview:\n{df.head()}")
        else:
            raise ValueError(f"Unsupported file type: {file_type}")

        # Process the dataframe (split it, etc.)
        response = {
            "status": "success",
            "file_type": file_type,
            "message": "File processed successfully"
        }
        return response
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    try:
        # Ensure file type argument is passed
        if len(sys.argv) < 2:
            print(json.dumps({"status": "error", "message": "No file type provided"}))
            sys.exit(1)

        # Get file type from command line argument
        file_type = sys.argv[1]

        # Read the binary file data from stdin
        encoded_data = sys.stdin.buffer.read()

        # Process the file (e.g., save or parse)
        result = process_file(encoded_data, file_type)

        # Output the result as JSON
        print(json.dumps(result))
    except Exception as main_e:
        print(f"Main error: {str(main_e)}")
        sys.exit(1)
