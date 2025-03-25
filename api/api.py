### Flask backend API for a simple mood tracker application

from flask import Flask, request, jsonify
from models import SessionLocal, Log, Mood, init_db
from datetime import datetime

# Initialize database
init_db()

# Create Flask instance which acts as our backend server
app = Flask(__name__)

# Define routes for the API

# Route to get all moods
@app.route("/api/moods", methods=["GET"])
def get_moods():
	session = SessionLocal()

	# Query all moods from the database
	moods = session.query(Mood).all()
	session.close()

	print("moods", moods)

	# Convert moods to a list of dictionaries
	moods_list = [{"id": mood.id, "title": mood.title, "hex_code": mood.hex_code} for mood in moods]
	print("moods_list", moods_list)
	return jsonify(moods_list)

# Route to insert a mood
@app.route("/api/insert-mood", methods=["POST"])
def insert_mood():
	data = request.json
	session = SessionLocal()

	# Create a new Mood object and add it to the session
	new_mood = Mood(title=data["title"], hex_code=data["hex_code"])
	session.add(new_mood)
	session.commit()
	session.close()
	return jsonify({"message": "Mood added successfully"}), 201

# Route to get all logs
@app.route("/api/logs", methods=["GET"])
def get_all_logs():
	session = SessionLocal()

	# Query all logs and moods from the database
	logs = session.query(Log).all()
	moods = session.query(Mood).all()

	print(logs)
	print(moods)

	# Convert the date object to string format
	for log in logs:
		log.date_object = log.date.strftime("%m-%d-%Y")

	# Convert all mood ids to their corresponding mood objects
	for log in logs:
		log.mood = "invalid"
		log.mood_hex_code = "#000000"  # Default hex code if mood is invalid
		
		the_mood = session.query(Mood).filter(Mood.id == log.mood_id).first()
		if the_mood:
			log.mood = the_mood.title
			log.mood_hex_code = the_mood.hex_code

	session.close()
	return jsonify([{
		"id": log.id, "date": log.date_object, 
		"mood_id": log.mood_id, "mood": log.mood,
		"mood_hex_code": log.mood_hex_code, "note": log.note} for log in logs])

# Route to add a new task
@app.route("/api/insert-log", methods=["POST"])
def add_task():
	data = request.json
	session = SessionLocal()

	# Convert date string to datetime object
	date_format = "%m/%d/%Y"
	date_object = datetime.strptime(data["date"], date_format)

	new_log = Log(date=date_object, mood_id=data["mood_id"], note=data["note"])
	session.add(new_log)
	session.commit()
	session.close()
	return jsonify({"message": "Log added successfully"}), 201

# Route to update a task
@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
	data = request.json
	session = SessionLocal()
	task = session.query(Task).filter(Task.id == task_id).first()
	if not task:
		return jsonify({"error": "Task not found"}), 404
	task.title = data.get("title", task.title)
	task.completed = data.get("completed", task.completed)
	session.commit()
	session.close()
	return jsonify({"message": "Task updated successfully"})

# Route to delete a task
@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
	session = SessionLocal()
	task = session.query(Task).filter(Task.id == task_id).first()
	if not task:
		return jsonify({"error": "Task not found"}), 404
	session.delete(task)
	session.commit()
	session.close()
	return jsonify({"message": "Task deleted successfully"})


@app.route("/api/hello_world")
def hello_world():
	return jsonify({"content": "Hello, world!"})

@app.route("/api/db_hello_world")
def db_hello_world():
	result = retrieve_tbl1()
	return jsonify({"content": result})

