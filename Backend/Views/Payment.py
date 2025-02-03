from flask import Blueprint, request, jsonify
from models import db, Payment

bp = Blueprint('payment_views', __name__)

# Create Payment
@bp.route('/payments', methods=['POST'])
def create_payment():
    data = request.get_json()
    new_payment = Payment(
        user_id=data['user_id'],
        booking_id=data['booking_id'],
        amount=data['amount'],
        status=data.get('status', 'pending')  # Default status is 'pending'
    )
    db.session.add(new_payment)
    db.session.commit()
    return jsonify({
        'id': new_payment.payment_id,
        'message': 'Payment successful. Waiting for approval from the hotel.'
    }), 201
 # Read Payments  
@bp.route('/payments', methods=['GET'])  
def get_payments():  
 payments = Payment.query.all()  
 return jsonify([{'id': payment.payment_id} for payment in payments])  

 # Update Payment  
 @bp.route('/payments/<int:payment_id>', methods=['PUT'])  
 def update_payment(payment_id):  
  data = request.get_json()  
 payment = Payment.query.get_or_404(payment_id)  
 payment.status = data['status']  
 db.session.commit()  
 return jsonify({'id': payment.payment_id})  

 # Delete Payment  
 @bp.route('/payments/<int:payment_id>', methods=['DELETE'])  
 def delete_payment(payment_id):  
  payment = Payment.query.get_or_404(payment_id)  
 db.session.delete(payment)  
 db.session.commit()  
 return '', 204  

