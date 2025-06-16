from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)

# Allow requests from your frontend's origin (http://localhost:3000)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Define the API endpoint
@app.route("/api/analyze", methods=["POST"])
def analyze_text():
    # Get the JSON data sent from the frontend
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    text_content = data["text"]
    
    # --- This is where the Python function is "called" ---
    
    # Calculate the number of words received
    word_count = len(text_content.split())
    
    # Print the confirmation message to the Python terminal
    print(f"PYTHON FUNCTION CALLED WITH {word_count} words.")
    
    # For verification, print the first 200 characters of the received text
    print("--- Start of Received Text ---")
    print(text_content[:200])
    print("----------------------------")
    
    # Send a success message back to the frontend
    return jsonify({
        "message": f"Successfully received {word_count} words from the frontend.",
        "status": "success"
    })

# Run the server when the script is executed
if __name__ == "__main__":
    # The server will run on http://localhost:5001
    app.run(debug=True, port=5001)
