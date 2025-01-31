from flask import Blueprint, request, jsonify
from models import db, Hotel

bp = Blueprint('hotel_views', __name__)

# Create Hotel
@bp.route('/hotels', methods=['POST'])
def create_hotel():
    data = request.get_json()
    new_hotel = Hotel(name=data['name'], location=data['location'], description=data.get('description'))
    db.session.add(new_hotel)
    db.session.commit()
    return jsonify({'id': new_hotel.hotel_id}), 201

# Read Hotels
@bp.route('/hotels', methods=['GET'])
def get_hotels():
    hotels = Hotel.query.all()
    return jsonify([{'id': hotel.hotel_id, 'name': hotel.name} for hotel in hotels])

# Update Hotel
@bp.route('/hotels/<int:hotel_id>', methods=['PUT'])
def update_hotel(hotel_id):
    data = request.get_json()
    hotel = Hotel.query.get_or_404(hotel_id)
    hotel.name = data['name']
    hotel.location = data['location']
    hotel.description = data.get('description')
    db.session.commit()
    return jsonify({'id': hotel.hotel_id})

# Delete Hotel
@bp.route('/hotels/<int:hotel_id>', methods=['DELETE'])
def delete_hotel(hotel_id):
    hotel = Hotel.query.get_or_404(hotel_id)
    db.session.delete(hotel)
    db.session.commit()
    return '', 204
