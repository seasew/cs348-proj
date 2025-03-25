### Flask backend API for a simple mood tracker application

from flask import Flask, request, jsonify
from models import SessionLocal, Log, Mood, init_db

# Initialize database
init_db()

# Create Flask instance which acts as our backend server
app = Flask(__name__)

# Define routes for the API

# Route to get all logs
@app.route("/logs", methods=["GET"])
def get_all_logs():
	session = SessionLocal()

	# Query all logs and moods from the database
	logs = session.query(Log).all()
	moods = session.query(Mood).all()

	console.log(logs)
	console.log(moods)

	session.close()
	return jsonify([{"id": log.id, "date": log.date, "mood": "temp", "mood_color": "#343412", "note": log.note} for log in logs])

# Route to add a new task
@app.route("/tasks", methods=["POST"])
def add_task():
	data = request.json
	session = SessionLocal()
	new_task = Task(title=data["title"], completed=data.get("completed", False))
	session.add(new_task)
	session.commit()
	session.close()
	return jsonify({"message": "Task added successfully"}), 201

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

