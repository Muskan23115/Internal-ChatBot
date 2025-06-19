import os
from flask import Flask, render_template, request, jsonify
from google.cloud import dialogflow_v2 as dialogflow
from google.api_core.exceptions import InvalidArgument
import json

app = Flask(__name__)

# Set path to your downloaded Dialogflow key
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "dialogflow-key.json"

# Dialogflow setup
DIALOGFLOW_PROJECT_ID = "internal-chatbot-i9hq"  # 🔁 Replace with your project ID
DIALOGFLOW_LANGUAGE_CODE = "en"
SESSION_ID = "current-user-id"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json["message"]

    session_client = dialogflow.SessionsClient()
    session = session_client.session_path(DIALOGFLOW_PROJECT_ID, SESSION_ID)

    text_input = dialogflow.types.TextInput(text=user_input, language_code=DIALOGFLOW_LANGUAGE_CODE)
    query_input = dialogflow.types.QueryInput(text=text_input)

    try:
        response = session_client.detect_intent(session=session, query_input=query_input)
        bot_response = response.query_result.fulfillment_text
        return jsonify({"response": bot_response})
    except InvalidArgument as e:
        return jsonify({"response": f"Dialogflow error: {e}"})


if __name__ == "__main__":
    app.run(debug=True)
