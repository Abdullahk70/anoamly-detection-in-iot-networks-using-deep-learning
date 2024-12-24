import pandas as pd
import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
import sys
from io import StringIO  # Correct import for StringIO

def preprocess_data(data):
    """Preprocess the data by encoding categorical variables and handling non-numeric data."""
    categorical_columns = data.select_dtypes(include=['object']).columns.tolist()
    
    # Impute missing values for categorical columns with the most frequent value
    imputer = SimpleImputer(strategy='most_frequent')
    data[categorical_columns] = imputer.fit_transform(data[categorical_columns])
    
    # Apply label encoding for categorical columns
    encoder = LabelEncoder()
    for column in categorical_columns:
        data[column] = encoder.fit_transform(data[column])

    # Handle any non-numeric columns that might remain
    for column in data.select_dtypes(include=['object']).columns:
        data[column] = pd.to_numeric(data[column], errors='coerce')
    
    numeric_columns = data.select_dtypes(include=['float64', 'int64']).columns.tolist()
    numeric_imputer = SimpleImputer(strategy='mean')
    data[numeric_columns] = numeric_imputer.fit_transform(data[numeric_columns])

    return data

def main():
    input_data = sys.stdin.read()
    try:
        # Assuming CSV input is read from stdin, convert to DataFrame
        data = pd.read_csv(StringIO(input_data))  # Correct usage of StringIO
    except Exception as e:
        print(json.dumps({"error": f"Error reading input data: {e}"}), file=sys.stderr)
        return
    
    # If no specific target column is provided, default to the last column
    target_column = data.columns[-1]  # Last column as the target by default
    
    # Preprocess the data
    data = preprocess_data(data)

    # Separate features (X) and target (y)
    X = data.drop(columns=[target_column])  # Use the dynamically determined target column
    y = data[target_column]

    # Split into train/test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Random Forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Get feature importances
    importance = model.feature_importances_

    # Prepare features and importance data
    feature_importance = [
        {"feature": X.columns[i], "importance": round(importance[i], 4)}
        for i in range(len(importance))
    ]

    # Return the feature names and importance values
    output_data = {
        "features": list(X.columns),
        "importanceData": feature_importance
    }
    
    print(json.dumps(output_data))

if __name__ == "__main__":
    main()
