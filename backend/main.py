from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
from collections import Counter
import pprint

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Load the Spanish spaCy model. This happens once when the server starts.
print("Loading spaCy model for Spanish...")
nlp = spacy.load("es_core_news_md")
print("Model loaded successfully.")

@app.route("/api/analyze", methods=["POST"])
def analyze_text():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    text_content = data["text"]
    
    # Process the entire text with spaCy
    print("\n--- Processing text with spaCy... ---")
    doc = nlp(text_content)
    print("--- Text processing complete. Lemmatizing... ---")
    
    # 1. Lemmatize words and filter out stop words and punctuation
    lemmas = []
    for token in doc:
        if not token.is_stop and not token.is_punct and not token.is_space:
            # Print the conversion for the first 20 words to see it in action
            if len(lemmas) < 50:
                print(f"'{token.text}' -> '{token.lemma_}'")
            lemmas.append(token.lemma_)
    
    # 2. Count the frequency of each lemma
    total_valid_words = len(lemmas)
    word_counts = Counter(lemmas)
    
    # 3. Sort words by frequency, from most common to least common
    sorted_words = sorted(word_counts.items(), key=lambda item: item[1], reverse=True)
    
    # 4. Calculate comprehension percentages
    results = []
    cumulative_count = 0
    for word, count in sorted_words:
        cumulative_count += count
        # Calculate what percentage of the total text this single word represents
        word_percentage = (count / total_valid_words) * 100 if total_valid_words > 0 else 0
        # Calculate the cumulative percentage if you knew all words up to this point
        comprehension_at_this_point = (cumulative_count / total_valid_words) * 100 if total_valid_words > 0 else 0
        
        results.append({
            "word": word,
            "frequency": count,
            "percentage": round(word_percentage, 2),
            "cumulative_comprehension": round(comprehension_at_this_point, 2),
        })
        
    # --- Print final results to the backend console for verification ---
    print("\n--- Top 10 Results ---")
    pprint.pprint(results[:10])
    print("----------------------\n")
    
    # Return the full list as a JSON object to the frontend
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True, port=5001)

