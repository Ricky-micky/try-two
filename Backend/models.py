from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# User Model
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='guest')  # are you a  guest or admin
    bookings = db.relationship('Booking', backref='user', lazy=True)
    ratings = db.relationship('Rating', backref='user', lazy=True)
    payments = db.relationship('Payment', backref='user', lazy=True)

# Hotel Model
class Hotel(db.Model):
    hotel_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    rooms = db.relationship('Room', backref='hotel', lazy=True)
    ratings = db.relationship('Rating', backref='hotel', lazy=True)

# Room Model
class Room(db.Model):
    room_id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotel.hotel_id'), nullable=False)
    room_type = db.Column(db.String(50), nullable=False)  # kuna state kama za  single, double, suite etc....
    price_per_night = db.Column(db.Float, nullable=False)
    available = db.Column(db.Boolean, default=True)
    bookings = db.relationship('Booking', backref='room', lazy=True)

# Booking Model
class Booking(db.Model):
    booking_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('room.room_id'), nullable=False)
    check_in_date = db.Column(db.DateTime, nullable=False)
    check_out_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='booked')  # the meaning of this is that booked ama cancelled
    payment = db.relationship('Payment', backref='booking', uselist=False, lazy=True)

# Payment Model
class Payment(db.Model):
    payment_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.booking_id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')  #on this ni either iwe  pending, completed, failed

# Rating Model
class Rating(db.Model):
    rating_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotel.hotel_id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # e.g., 1 to 5
    review = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)