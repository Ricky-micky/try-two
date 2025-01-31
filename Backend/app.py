from flask import Flask, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from Views import user, Hotel, Room, Booking, Payment, Rating

# Initialize Flask app
app = Flask(__name__)

# Configuration (no separate config file)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hotel_booking.db'  # Replace with your database URI if needed
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Set a secret key for session management

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Register Blueprints for modular routes
app.register_blueprint(user.bp)
app.register_blueprint(Hotel.bp)
app.register_blueprint(Room.bp)
app.register_blueprint(Booking.bp)
app.register_blueprint(Payment.bp)
app.register_blueprint(Rating.bp)

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
