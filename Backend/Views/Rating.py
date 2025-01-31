from flask import Blueprint, request, jsonify
from models import db, Rating

bp = Blueprint('rating_views', __name__)

# Create Rating
@bp.route('/ratings', methods=['POST'])
def create_rating():
   data = request.get_json()
   new_rating = Rating(
       user_id=data['user_id'],
       hotel_id=data['hotel_id'],
       rating=data['rating'],
       review=data.get('review')
   )
   db.session.add(new_rating)
   db.session.commit()
   return jsonify({'id': new_rating.rating_id}), 201

# Read Ratings  
@bp.route('/ratings', methods=['GET'])  
def get_ratings():  
 ratings = Rating.query.all()  
 return jsonify([{'id': rating.rating_id} for rating in ratings])  

 # Update Rating  
 @bp.route('/ratings/<int:rating_id>', methods=['PUT'])  
 def update_rating(rating_id):  
  data = request.get_json()  
 rating = Rating.query.get_or_404(rating_id)  
 rating.rating= data['rating']   
 rating.review= data.get('review')   
 db.session.commit()   
 return jsonify({'id': rating.rating})  

 # Delete Rating  
 @bp.route('/ratings/<int:rating_id>', methods=['DELETE'])  
 def delete_rating(rating_id):  
  rating= Rating.query.get_or_404(rating)   
 db.session.delete(rating)   
 db.session.commit()   
 return '', 204  

