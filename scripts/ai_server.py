from transformers import AutoModelForCausalLM, AutoTokenizer
from flask import Flask, request, jsonify
import torch

app = Flask(__name__)

model_name = "distilgpt2"
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Define a pad token if it doesn't exist
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(model_name)

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question", "")

    # Encode with attention mask
    inputs = tokenizer(
        question,
        return_tensors="pt",
        padding=True,
        truncation=True
    )

    outputs = model.generate(
        input_ids=inputs["input_ids"],
        attention_mask=inputs["attention_mask"],
        max_length=150,
        do_sample=True,
        temperature=0.7,
        top_k=50,
        top_p=0.9,
        no_repeat_ngram_size=3,
        pad_token_id=tokenizer.pad_token_id,
        early_stopping=True
    )

    answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(port=5000)
