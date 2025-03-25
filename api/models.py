### Handle table creation and ORM models for the SQLite database
### api/models.py

from sqlalchemy import create_engine, Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker

# Initialize database connection
DATABASE_URL = "sqlite+pysqlite:///tracker.db"  
engine = create_engine(DATABASE_URL, echo=True)

# Define the base class for models
Base = declarative_base()

# Define Log model which represents an entry in the mood tracker
class Log(Base):
    __tablename__ = "log"
    
    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    mood_id = Column(Integer, ForeignKey('mood.id'), nullable=False)
    note = Column(String(100), nullable=True)

# Define Mood model which represents a type of mood
class Mood(Base):
    __tablename__ = "mood"
    
    id = Column(Integer, primary_key=True)
    title = Column(String(50), nullable=False)
    hex_code = Column(String(8), nullable=False) # Expected format "#RRGGBB"

# Function to create tables
def init_db():
    Base.metadata.create_all(engine)

# Create a session factory
SessionLocal = sessionmaker(bind=engine)
