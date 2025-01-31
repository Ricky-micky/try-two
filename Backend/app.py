from flask import Flask, jsonify, request
from flask_migrate import Migrate
from models import db
from flask_jwt_extended import JWTManager, create_access_token
from datetime import timedelta
from flask_mail import Mail
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hotel_booking.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize Flask-Migrate for database migrations
migrate = Migrate(app, db)
db.init_app(app)

# Flask-Mail configuration
app.config["MAIL_SERVER"] = 'smtp.gmail.com'
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_USERNAME"] = "tembo4401@gmail.com"
app.config["MAIL_PASSWORD"] = "ruua rwkk zhjy gwte"  # Replace with actual password
app.config["MAIL_DEFAULT_SENDER"] = "tembo4401@gmail.com"
mail = Mail(app)

# JWT configuration
app.config["JWT_SECRET_KEY"] = "jiyucfvbkaudhudkvfbt"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)
jwt = JWTManager(app)
jwt.init_app(app)

# Import and register blueprints
from Views.auth import auth_bp
from Views.User import user_bp
from Views.Hotel import hotel_bp
from Views.Room import room_bp
from Views.Booking import booking_bp
from Views.Payment import payment_bp
from Views.Rating import rating_bp

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(hotel_bp)
app.register_blueprint(room_bp)
app.register_blueprint(booking_bp)
app.register_blueprint(payment_bp)
app.register_blueprint(rating_bp)

if __name__ == '__main__':
    app.run(debug=True)
