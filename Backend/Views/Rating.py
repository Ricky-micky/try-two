from flask import jsonify, request, Blueprint
from models import db, Rating, Hotel
from flask_jwt_extended import jwt_required, get_jwt_identity

rating_bp = Blueprint('rating_bp', __name__)

@rating_bp.route('/ratings', methods=['POST'])
@jwt_required()
def create_rating():
    data = request.get_json()
    user_id = get_jwt_identity()
    hotel_id = data.get('hotel_id')
    rating = data.get('rating')
    review = data.get('review')

    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        return jsonify({"error": "Hotel not found"}), 404

    new_rating = Rating(
        user_id=user_id,
        hotel_id=hotel_id,
        rating=rating,
        review=review
    )
    db.session.add(new_rating)
    db.session.commit()

    return jsonify({"message": "Rating added successfully"}), 201