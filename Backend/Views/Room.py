from flask import Blueprint, request, jsonify
from models import db, Room

bp = Blueprint('room_views', __name__)

# Create Room
@bp.route('/rooms', methods=['POST'])
def create_room():
    data = request.get_json()
    new_room = Room(
        hotel_id=data['hotel_id'],
        room_type=data['room_type'],
        price_per_night=data['price_per_night'],
        available=data.get('available', True),
        image_url=data.get('image_url')
    )
    db.session.add(new_room)
    db.session.commit()
    return jsonify({'id': new_room.room_id}), 201

# Read Rooms
@bp.route('/rooms', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    room_list = [
        {
            'id': room.room_id,
            'type': room.room_type,
            'price_per_night': room.price_per_night,
            'available': room.available,
            'image_url': room.image_url  # Check if this has a valid URL
        } 
        for room in rooms
    ]
    print(room_list)  # Debugging: Check the output in the terminal
    return jsonify(room_list)


#     rooms = Room.query.all()
#     return jsonify([  {
#             'id': room.room_id,
#             'type': room.room_type,
#             'price_per_night': room.price_per_night,
#             'available': room.available,
#             'image_url': room.image_url
#         }  for room in rooms])

# print(room)
# Update Room
@bp.route('/rooms/<int:room_id>', methods=['PUT'])
def update_room(room_id):
    data = request.get_json()
    room = Room.query.get_or_404(room_id)
    room.room_type = data['room_type']
    room.price_per_night = data['price_per_night']
    room.available = data.get('available', room.available)
    
    db.session.commit()
    return jsonify({'id': room.room_id})

# Delete Room
@bp.route('/rooms/<int:room_id>', methods=['DELETE'])
def delete_room(room_id):
   room = Room.query.get_or_404(room_id)
   db.session.delete(room)
   db.session.commit()
   return '', 204

