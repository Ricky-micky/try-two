from flask import jsonify, request, Blueprint
from models import db, Payment, Booking
from flask_jwt_extended import jwt_required, get_jwt_identity

payment_bp = Blueprint('payment_bp', __name__)

# Create ama posting hio payment 
@payment_bp.route('/payments', methods=['POST'])
@jwt_required()
def create_payment():
    data = request.get_json()
    user_id = get_jwt_identity()
    booking_id = data.get('booking_id')
    amount = data.get('amount')

    booking = Booking.query.get(booking_id)
    if not booking or booking.user_id != user_id:
        return jsonify({"error": "Invalid booking"}), 400

    new_payment = Payment(
        user_id=user_id,
        booking_id=booking_id,
        amount=amount,
        status='completed'
    )
    db.session.add(new_payment)
    db.session.commit()

    return jsonify({"message": "Payment successful"}), 201

# Updateing Payment
@payment_bp.route('/payments/<int:payment_id>', methods=['PUT'])
@jwt_required()
def update_payment(payment_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    status = data.get('status')  # status mpya ya payment

    # Fetch the payment
    payment = Payment.query.filter_by(payment_id=payment_id, user_id=user_id).first()
    if not payment:
        return jsonify({"error": "Payment not found or unauthorized"}), 404

    # Validate the new status of thepayments kama ni complit,pending  ama failed...
    valid_statuses = ['pending', 'completed', 'failed']
    if status not in valid_statuses:
        return jsonify({"error": f"Invalid status. Must be one of: {valid_statuses}"}), 400

    # Update the payment status
    payment.status = status
    db.session.commit()

    return jsonify({"message": "Payment updated successfully"}), 200

# Deleted Payments
@payment_bp.route('/payments/<int:payment_id>', methods=['DELETE'])
@jwt_required()
def delete_payment(payment_id):
    user_id = get_jwt_identity()

    # Fetch the payment
    payment = Payment.query.filter_by(payment_id=payment_id, user_id=user_id).first()
    if not payment:
        return jsonify({"error": "Payment not found or unauthorized"}), 404

    # Delete the payment
    db.session.delete(payment)
    db.session.commit()

    return jsonify({"message": "Payment deleted successfully"}), 200