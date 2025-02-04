from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
# Initialize Flask app
app = Flask(__name__)

CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hotel_booking.db'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key_here'  

# Initialize extensions
from models import db  # Import db AFTER defining the app
db.init_app(app)  # Bind db to app
migrate = Migrate(app, db)

# Import views after db is initialized
from Views import user, Hotel, Room, Booking, Payment, Rating
app.register_blueprint(user.bp)
app.register_blueprint(Hotel.bp)
app.register_blueprint(Room.bp)
app.register_blueprint(Booking.bp)
app.register_blueprint(Payment.bp)
app.register_blueprint(Rating.bp)

if __name__ == '__main__':
    
    app.run(debug=True)
