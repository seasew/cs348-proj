### Flask backend API for a simple mood tracker application

from flask import Flask, request, jsonify
from models import SessionLocal, Log, Mood, init_db
from datetime import datetime
from sqlalchemy import text
from flask_cors import CORS

# Initialize database
init_db()

# Create index for the log table
# This is a one-time operation to ensure the log table has an index on the date column

session = SessionLocal()
session.execute(text("CREATE INDEX IF NOT EXISTS idx_log_date ON log (date)"))
session.commit()
session.close()

# Create Flask instance which acts as our backend server
app = Flask(__name__)
CORS(app)

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

	console.log("data", data)

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
	logs = session.query(Log).order_by(Log.date.asc()).all()
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

# Route to add a new log (using prepared statements)
@app.route("/api/insert-log", methods=["POST"])
def add_log():
	data = request.json
	session = SessionLocal()

	# Convert date string to datetime object
	date_format = "%m/%d/%Y"
	date_object = datetime.strptime(data["date"], date_format).date() # Keep only the date part

	session.execute(text("INSERT INTO log (date, mood_id, note) VALUES (:date, :mood_id, :note)"), 
			{
				"date": date_object,
				"mood_id": data["mood_id"],
				"note": data["note"],
			})
	session.commit()
	session.close()
	print("Successfully inserted new log using prepared statements")
	return jsonify({"message": "Log added successfully"}), 201

# Route to update a log
@app.route("/api/update-log/<int:log_id>", methods=["PUT"])
def update_log(log_id):
	data = request.json
	session = SessionLocal()

	# Retrieve the log we want to update
	log = session.query(Log).filter(Log.id == log_id).first()
	if not log:
		return jsonify({"error": "Log with given id not found"}), 404
	
	# Convert date string to datetime object
	date_format = "%m-%d-%Y"
	
	# Update the log object with the new values
	log.date = datetime.strptime(data.get("date", log.date), date_format).date() 		# If the key doesn't exist, use a default value instead
	log.mood_id = data.get("mood_id", log.mood_id)
	log.note = data.get("note", log.note)

	session.commit()
	session.close()
	return jsonify({"message": "Log updated successfully"})


# Route to delete a log
@app.route("/api/delete-log/<int:log_id>", methods=["DELETE"])
def delete_log(log_id):
	session = SessionLocal()
	log = session.query(Log).filter(Log.id == log_id).first()
	if not log:
		return jsonify({"error": "Log not found"}), 404
	session.delete(log)
	session.commit()
	session.close()
	return jsonify({"message": "Log deleted successfully"})

# Route to generate a report over a date range (using ORM)
@app.route("/api/report", methods=["POST"])
def filter_logs():
	data = request.json
	session = SessionLocal()

	# Convert date string to datetime object
	date_format = "%m/%d/%Y"
	from_date_object = datetime.strptime(data["from_date"], date_format)
	to_date_object = datetime.strptime(data["to_date"], date_format)
	new_date_format = "%Y-%m-%d"
	from_date_str = from_date_object.strftime(new_date_format)
	to_date_str = to_date_object.strftime(new_date_format)

	# Retrieve the logs within the specified date range (inclusive)
	logs = session.query(Log).filter(Log.date.between(from_date_str, to_date_str)).order_by(Log.date.asc()).all()
	
	session.close()

	# If no logs were found, return an empty response
	if len(logs) == 0:
		return jsonify({"logs": [], "majority_mood": [], "average_color": "#000000"})

	# Convert the date object to string format; add mood title and hex code
	for log in logs:
		log.date_object = log.date.strftime(date_format)
		log.mood = "invalid"
		log.mood_hex_code = "#000000"  # Default hex code if mood is invalid
		
		the_mood = session.query(Mood).filter(Mood.id == log.mood_id).first()
		if the_mood:
			log.mood = the_mood.title
			log.mood_hex_code = the_mood.hex_code
	
	# Generate majority mood report
	mood_counts = {}
	for log in logs:
		if log.mood_id in mood_counts:
			mood_counts[log.mood_id] += 1
		else:
			mood_counts[log.mood_id] = 1
	max_count = max(mood_counts.values())
	
	# Find all mood ids with the maximum count
	most_common_mood_ids = [mood_id for mood_id, count in mood_counts.items() if count == max_count]
	most_common_moods = session.query(Mood).filter(Mood.id.in_(most_common_mood_ids)).all()

	# Compute average mood color
	average_color = [0, 0, 0]
	for mood_id, count in mood_counts.items():
		mood = session.query(Mood).filter(Mood.id == mood_id).first()
		hex_code = mood.hex_code.lstrip('#')
		r, g, b = tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))
		average_color[0] += r * count
		average_color[1] += g * count
		average_color[2] += b * count
	average_color = [int(c / len(logs)) for c in average_color]
	average_color_hex = "#{:02x}{:02x}{:02x}".format(*average_color)

	# Return the result
	return jsonify({
		"logs": [{
			"id": log.id, "date": log.date_object, 
			"mood_id": log.mood_id, "note": log.note,
			"mood": log.mood, "mood_hex_code": log.mood_hex_code} for log in logs],
		"majority_mood": [{"id": mood.id, "title": mood.title, "hex_code": mood.hex_code} for mood in most_common_moods],
		"average_color": average_color_hex,
	})

