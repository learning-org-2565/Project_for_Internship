from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable CORS for all routes and allow requests from the React frontend
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# MongoDB configuration
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["myDatabase"]  # Use your database name
collection = db["users"]   # Collection name for storing user data

@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        # Get user data from the request
        user_data = request.json

        # Insert data into MongoDB
        collection.insert_one(user_data)

        return jsonify({"message": "User data saved successfully!"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
    
    
@app.route('/api/test-mongodb', methods=['GET'])
def test_mongodb_connection():
    try:
        # Test if the database connection works
        db_names = client.list_database_names()
        if "myDatabase" in db_names:
            return jsonify({"message": "Successfully connected to MongoDB and found the database!"}), 200
        else:
            return jsonify({"message": "Successfully connected to MongoDB, but the database does not exist."}), 404
    except Exception as e:
        return jsonify({"message": "Failed to connect to MongoDB", "error": str(e)}), 500

