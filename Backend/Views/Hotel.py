from flask import jsonify, request, Blueprint
from models import db, Hotel

hotel_bp = Blueprint('hotel_bp', __name__)

@hotel_bp.route('/hotels', methods=['POST'])
def add_hotel():
    try:
        data = request.get_json()  # Parse JSON data from the request body

        # Extract hotel details from the request data
        name = data.get('name')
        location = data.get('location')
        description = data.get('description', '')
        image_url = data.get('image_url', '')

        # Validate required fields
        if not name or not location:
            return jsonify({'error': 'Name and location are required'}), 400

        # Create and save the new hotel to the database
        new_hotel = Hotel(
            name=name,
            location=location,
            description=description,
            image_url=image_url
        )
        db.session.add(new_hotel)
        db.session.commit()

        return jsonify({'message': 'Hotel added successfully!'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@hotel_bp.route('/hotels', methods=['GET'])
def get_hotels():
    try:
        hotels = Hotel.query.all()  # Fetch all hotels from the database
        hotel_list = [
            {
                "hotel_id": hotel.hotel_id,
                "name": hotel.name,
                "location": hotel.location,
                "description": hotel.description,
                "image_url": hotel.image_url
            } for hotel in hotels
        ]
        return jsonify(hotel_list), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@hotel_bp.route('/hotels/<int:hotel_id>', methods=['GET'])
def get_hotel(hotel_id):
    try:
        hotel = Hotel.query.get(hotel_id)  # Fetch a single hotel by ID
        if not hotel:
            return jsonify({"error": "Hotel not found"}), 404
        
        return jsonify({
            "hotel_id": hotel.hotel_id,
            "name": hotel.name,
            "location": hotel.location,
            "description": hotel.description,
            "image_url": hotel.image_url
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
