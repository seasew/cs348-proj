from flask import Flask, jsonify

from db import retrieve_tbl1

# Create Flask instance which acts as our backend server

app = Flask(__name__)

@app.route("/api/hello_world")
def hello_world():
	return jsonify({"content": "Hello, world!"})

@app.route("/api/db_hello_world")
def db_hello_world():
	result = retrieve_tbl1()
	return jsonify({"content": result})

