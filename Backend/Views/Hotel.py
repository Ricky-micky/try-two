from flask import jsonify, request, Blueprint
from models import db, Hotel

hotel_bp = Blueprint('hotel_bp', __name__)



@hotel_bp.route('/hotels', methods=['POST'])
def add_hotel():
    data = request.get_json()  # Parse JSON data from the request body
    name = data.get('name')
    location = data.get('location')
    description = data.get('description', '')
    image_url = data.get('image_url', '')

    # Validate required fields
    if not name or not location:
        return jsonify({'error': 'Name and location are required'}), 400

    # Create and save the new hotel
    new_hotel = Hotel(
        name=name,
        location=location,
        description=description,
        image_url=image_url
    )
    db.session.add(new_hotel)
    db.session.commit()

    return jsonify({'message': 'Hotel added successfully!'}), 201


# @hotel_bp.route('/hotels', methods=['GET'])
# def get_hotels():
#     hotels = Hotel.query.all()
#     return jsonify([{
#         'hotel_id': hotel.hotel_id,
#         'name': hotel.name,
#         'location': hotel.location,
#         'description': hotel.description,
#         'image_url': hotel.image_url
#     } for hotel in hotels])


@hotel_bp.route('/hotels', methods=['GET'])
def get_hotels():
    hotels = Hotel.query.all()
    hotel_list = [{"hotel_id": hotel.hotel_id, "name": hotel.name, "location": hotel.location,'description': hotel.description,
        'image_url': hotel.image_url} for hotel in hotels]
    return jsonify(hotel_list), 200

@hotel_bp.route('/hotels/<int:hotel_id>', methods=['GET'])
def get_hotel(hotel_id):
    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        return jsonify({"error": "Hotel not found"}), 404
    return jsonify({
        "hotel_id": hotel.hotel_id,
        "name": hotel.name,
        "location": hotel.location,
        "description": hotel.description
    }), 200