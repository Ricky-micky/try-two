from flask import jsonify, request, Blueprint
from models import db, Room, Hotel
from flask_jwt_extended import jwt_required

room_bp = Blueprint('room_bp', __name__)



@room_bp.route('/rooms', methods=['POST'])
def add_room():
    data = request.get_json()  # Parse JSON data from the request body
    hotel_id = data.get('hotel_id')
    room_type = data.get('room_type')
    price_per_night = data.get('price_per_night')
    available = data.get('available', True)
    image_url = data.get('image_url', '')

    # Validate required fields
    if not hotel_id or not room_type or price_per_night is None:
        return jsonify({'error': 'Hotel ID, room type, and price per night are required'}), 400

    # Create and save the new room
    new_room = Room(
        hotel_id=hotel_id,
        room_type=room_type,
        price_per_night=price_per_night,
        available=available,
        image_url=image_url
    )
    db.session.add(new_room)
    db.session.commit()

    return jsonify({'message': 'Room added successfully!'}), 201
# Fetch all rooms for a specific hotel
@room_bp.route('/hotels/<int:hotel_id>/rooms', methods=['GET'])
def get_rooms(hotel_id):
    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        return jsonify({"error": "Hotel not found"}), 404

    rooms = Room.query.filter_by(hotel_id=hotel_id).all()
    room_list = [
        {
            "room_id": room.room_id,
            "room_type": room.room_type,
            "price_per_night": room.price_per_night,
            "available": room.available
        } for room in rooms
    ]
    return jsonify(room_list), 200

# Fetch a specific room by ID
@room_bp.route('/rooms/<int:room_id>', methods=['GET'])
def get_room(room_id):
    room = Room.query.get(room_id)
    if not room:
        return jsonify({"error": "Room not found"}), 404

    return jsonify({
        "room_id": room.room_id,
        "room_type": room.room_type,
        "price_per_night": room.price_per_night,
        "available": room.available,
        "hotel_id": room.hotel_id
    }), 200

# Update room availability this niza  Admin to pekee

@room_bp.route('/rooms/<int:room_id>/availability', methods=['PUT'])
@jwt_required()
def update_room_availability(room_id):
    data = request.get_json()
    available = data.get('available')

    if available is None:
        return jsonify({"error": "Availability status is required"}), 400

    room = Room.query.get(room_id)
    if not room:
        return jsonify({"error": "Room not found"}), 404

    room.available = available
    db.session.commit()

    return jsonify({"message": "Room availability updated successfully"}), 200