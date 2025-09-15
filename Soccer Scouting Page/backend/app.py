import os
import pandas as pd
import numpy as np
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

# Import database models and scripts
from database.create_db import Base, PlayerData
from scripts.etl_pipeline import process_uploaded_data
from scripts.scraper import scrape_player_data # Assuming this is implemented

import google.generativeai as genai

load_dotenv()

# Configuration
app = Flask(__name__)
CORS(app) # Enables cross-origin requests from your React app

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

def get_session():
    return Session()

# Helper function to find a player by name (latest season)
def find_player_by_name(session, player_name):
    player_records = session.query(PlayerData).filter(PlayerData.player_name == player_name).order_by(PlayerData.season.desc()).all()
    return player_records[0] if player_records else None

# API Endpoints
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    files = request.files.getlist('file')
    if not files:
        return jsonify({'error': 'No selected files'}), 400

    try:
        # Process and store data from files
        cleaned_data = process_uploaded_data(files, get_session())

        if not cleaned_data:
            return jsonify({'error': 'No valid data found in the files.'}), 400

        # Store in DB
        session = get_session()
        for row in cleaned_data:
            metrics_json = json.dumps({k: v for k, v in row.items() if k not in ['player_name', 'position', 'team', 'nationality', 'age', 'minutes_played', 'season']})
            player_data = PlayerData(
                player_name=row['player_name'],
                season=row['season'],
                position=row['position'],
                team=row['team'],
                nationality=row['nationality'],
                age=row['age'],
                minutes_played=row['minutes_played'],
                metrics=metrics_json
            )
            session.add(player_data)
        session.commit()
        return jsonify({'message': f'{len(cleaned_data)} players processed and stored.'}), 200

    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()

@app.route('/api/players', methods=['GET'])
def get_players():
    session = get_session()
    try:
        players = session.query(PlayerData).all()
        player_list = [{
            'player_name': p.player_name,
            'team': p.team,
            'season': p.season,
            'position': p.position,
            'id': p.id
        } for p in players]
        return jsonify(player_list)
    except SQLAlchemyError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    finally:
        session.close()

@app.route('/api/analyze/<int:player_id>', methods=['POST'])
def analyze_player(player_id):
    session = get_session()
    try:
        player_record = session.query(PlayerData).get(player_id)
        if not player_record:
            return jsonify({'error': 'Player not found'}), 404

        filters = request.json.get('filters', {})
        min_age = filters.get('min_age', 15)
        max_age = filters.get('max_age', 45)
        min_minutes = filters.get('min_minutes', 0)

        # Retrieve peer group from DB based on filters
        peer_group = session.query(PlayerData).filter(
            PlayerData.id != player_id,
            PlayerData.age >= min_age,
            PlayerData.age <= max_age,
            PlayerData.minutes_played >= min_minutes
        ).all()

        # The logic to calculate percentile rank and averages from the raw metrics
        # would be implemented here, similar to the original JS code.

        # ... (add your analysis logic here, or refactor it into a separate utility function)

        # Example response structure
        analysis_result = {
            'player_profile': {
                'name': player_record.player_name,
                'position': player_record.position,
                'team': player_record.team,
                'nationality': player_record.nationality,
                'age': player_record.age
            },
            'metrics_analysis': {} # This will contain the percentile data, etc.
        }

        return jsonify(analysis_result)
    finally:
        session.close()

@app.route('/api/ai-report/<int:player_id>', methods=['POST'])
def ai_report(player_id):
    session = get_session()
    try:
        player_record = session.query(PlayerData).get(player_id)
        if not player_record:
            # Fallback to web scraping if player not found in DB
            scraped_data = scrape_player_data(player_id)
            if not scraped_data:
                return jsonify({'error': 'Player not found locally or via web scraping.'}), 404
            player_data = scraped_data
        else:
            player_data = player_record

        # Generate the prompt for the AI model
        # This logic should be similar to your existing JavaScript code, but in Python
        prompt = "Generate a scouting report for player..." # Build the full prompt here

        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)

        return jsonify({'report': response.text})
    except Exception as e:
        return jsonify({'error': f'AI generation failed: {str(e)}'}), 500
    finally:
        session.close()

if __name__ == '__main__':
    app.run(debug=True)