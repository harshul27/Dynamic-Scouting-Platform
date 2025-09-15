import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

# Database connection string
DATABASE_URL = os.getenv("DATABASE_URL")

Base = declarative_base()

class PlayerData(Base):
    __tablename__ = 'player_data'
    id = Column(Integer, primary_key=True)
    player_name = Column(String)
    season = Column(Integer)
    position = Column(String)
    team = Column(String)
    nationality = Column(String)
    age = Column(Integer)
    minutes_played = Column(Integer)

    # We use a JSONB type for metrics to handle flexible schemas
    metrics = Column(String) # Storing as JSON string for simplicity

    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<PlayerData(player_name='{self.player_name}', season={self.season})>"

def create_database():
    """Creates the database and tables."""
    if not DATABASE_URL:
        print("Error: DATABASE_URL environment variable is not set.")
        return

    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(engine)
    print("Database schema created successfully.")

if __name__ == '__main__':
    create_database()