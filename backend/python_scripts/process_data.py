import sys
import os
import json

def process_file(file_path):
    try:
        # Check if the file exists
        if not os.path.exists(file_path):
            return {"status": "error", "message": f"File not found: {file_path}"}
        
        # Check file format
        if file_path.endswith(".csv"):
            file_type = "CSV"
        elif file_path.endswith(".xlsx") or file_path.endswith(".xls"):
            file_type = "Excel"
        else:
            file_type = "Unsupported"
        
        # Generate a dummy response
        response = {
            "status": "success",
            "file_path": file_path,
            "file_type": file_type,
            "message": "File processed successfully",
        }
        return response
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    # Check if file path is passed
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "message": "No file path provided"}))
        sys.exit(1)

    # Get file path from arguments
    file_path = sys.argv[1]

    # Process the file
    result = process_file(file_path)

    # Print the result as JSON
    print(json.dumps(result))
