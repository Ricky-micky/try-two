from flask import jsonify, request, Blueprint
from models import db, Booking, Room
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

booking_bp = Blueprint('booking_bp', __name__)

@booking_bp.route('/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    """
    Endpoint to create a booking. Requires JWT authentication.
    """
    try:
        # Parse JSON data from the request
        data = request.get_json()
        user_id = get_jwt_identity()  # Get the user ID from the JWT token
        room_id = data.get('room_id')
        check_in_date = data.get('check_in_date')
        check_out_date = data.get('check_out_date')

        # Validate required fields
        if not room_id or not check_in_date or not check_out_date:
            return jsonify({"error": "Room ID, check-in date, and check-out date are required"}), 400

        # Parse dates
        try:
            check_in_date = datetime.strptime(check_in_date, '%Y-%m-%d')
            check_out_date = datetime.strptime(check_out_date, '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

        # Validate check-in and check-out dates
        if check_in_date >= check_out_date:
            return jsonify({"error": "Check-out date must be after check-in date"}), 400

        # Check if the room exists and is available
        room = Room.query.get(room_id)
        if not room:
            return jsonify({"error": "Room not found"}), 404
        if not room.available:
            return jsonify({"error": "Room is not available"}), 400

        # Create the booking
        new_booking = Booking(
            user_id=user_id,
            room_id=room_id,
            check_in_date=check_in_date,
            check_out_date=check_out_date
        )
        db.session.add(new_booking)

        # Update room availability
        room.available = False
        db.session.commit()

        return jsonify({"message": "Booking created successfully"}), 201

    except Exception as e:
        db.session.rollback()  # Rollback the transaction in case of any error
        return jsonify({"error": str(e)}), 500


# Update Booking
@booking_bp.route('/bookings/<int:booking_id>', methods=['PUT'])
@jwt_required()
def update_booking(booking_id):
    data = request.get_json()
    user_id = get_jwt_identity()

    # Fetch the booking
    booking = Booking.query.filter_by(booking_id=booking_id, user_id=user_id).first()
    if not booking:
        return jsonify({"error": "Booking not found or unauthorized"}), 404

    # Update booking details
    room_id = data.get('room_id', booking.room_id)
    check_in_date = data.get('check_in_date', booking.check_in_date)
    check_out_date = data.get('check_out_date', booking.check_out_date)

    # Validate new room availability (if room is changed)
    if room_id != booking.room_id:
        new_room = Room.query.get(room_id)
        if not new_room or not new_room.available:
            return jsonify({"error": "New room not available"}), 400

        # Mark the old room as available
        old_room = Room.query.get(booking.room_id)
        old_room.available = True

        # Mark the new room as unavailable
        new_room.available = False

    # Update booking
    booking.room_id = room_id
    booking.check_in_date = check_in_date
    booking.check_out_date = check_out_date
    db.session.commit()

    return jsonify({"message": "Booking updated successfully"}), 200

# View All Bookings for the Authenticated User
@booking_bp.route('/bookings', methods=['GET'])
@jwt_required()
def get_bookings():
    user_id = get_jwt_identity()

    # Fetch all bookings for the user
    bookings = Booking.query.filter_by(user_id=user_id).all()
    booking_list = [
        {
            "booking_id": booking.booking_id,
            "room_id": booking.room_id,
            "check_in_date": booking.check_in_date,
            "check_out_date": booking.check_out_date,
            "status": booking.status,
            "room": {
                "room_id": booking.room.room_id,
                "room_type": booking.room.room_type,
                "price_per_night": booking.room.price_per_night,
                "hotel_id": booking.room.hotel_id
            }
        } for booking in bookings
    ]

    return jsonify(booking_list), 200

# View a Specific Booking
@booking_bp.route('/bookings/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_booking(booking_id):
    user_id = get_jwt_identity()

    # Fetch the booking
    booking = Booking.query.filter_by(booking_id=booking_id, user_id=user_id).first()
    if not booking:
        return jsonify({"error": "Booking not found or unauthorized"}), 404

    booking_details = {
        "booking_id": booking.booking_id,
        "room_id": booking.room_id,
        "check_in_date": booking.check_in_date,
        "check_out_date": booking.check_out_date,
        "status": booking.status,
        "room": {
            "room_id": booking.room.room_id,
            "room_type": booking.room.room_type,
            "price_per_night": booking.room.price_per_night,
            "hotel_id": booking.room.hotel_id
        }
    }

    return jsonify(booking_details), 200

@booking_bp.route('/bookings/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def cancel_booking(booking_id):
    user_id = get_jwt_identity()
    booking = Booking.query.filter_by(booking_id=booking_id, user_id=user_id).first()

    if not booking:
        return jsonify({"error": "Booking not found or unauthorized"}), 404

    room = Room.query.get(booking.room_id)
    room.available = True
    db.session.delete(booking)
    db.session.commit()

    return jsonify({"message": "Booking cancelled successfully"}), 200