from sqlalchemy import create_engine, text

# Connect to sqlite3 database

engine = create_engine("sqlite+pysqlite:///foo", echo=True)

# Return contents of tbl1 as text

def retrieve_tbl1():
	out = ""

	with engine.connect() as conn:
		result = conn.execute(text("select * from tbl1"))

		for row in result:
			out += row[0] + ", " + str(row[1]) + ", "
		
	return out
