import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

# Root route renders index.html
@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

# API route for chat response
@app.route("/chatgpt", methods=["POST"])
def get_response():
    user_input = request.json.get("message")

    if not user_input:
        return jsonify({"reply": "No message provided."}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful internal chatbot."},
                {"role": "user", "content": user_input}
            ]
        )
        reply = response.choices[0].message.content.strip()
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"reply": f"OpenAI error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
