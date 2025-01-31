from flask import Blueprint, request, jsonify
from models import db, Booking

bp = Blueprint('booking_views', __name__)

# Create Booking 
@bp.route('/bookings', methods=['POST']) 
def create_booking(): 
 data = request.get_json() 
 new_booking = Booking( 
 user_id=data['user_id'], 
 room_id=data['room_id'], 
 check_in_date=data['check_in_date'], 
 check_out_date=data['check_out_date'] 
) 
 db.session.add(new_booking) 
 db.session.commit() 
 return jsonify({'id': new_booking.booking_id}), 201 

# Read Bookings 
@bp.route('/bookings', methods=['GET']) 
def get_bookings(): 
 bookings = Booking.query.all() 
 return jsonify([{'id': booking.booking_id} for booking in bookings]) 

# Update Booking 
@bp.route('/bookings/<int:booking_id>', methods=['PUT']) 
def update_booking(booking_id): 
 data = request.get_json() 
 booking = Booking.query.get_or_404(booking_id) 
 booking.check_in_date = data['check_in_date'] 
 booking.check_out_date = data['check_out_date'] 
 db.session.commit() 
 return jsonify({'id': booking.booking_id}) 

# Delete Booking 
@bp.route('/bookings/<int:booking_id>', methods=['DELETE']) 
def delete_booking(booking_id): 
 booking = Booking.query.get_or_404(booking_id) 
 db.session.delete(booking) 
 db.session.commit() 
 return '', 204 

