from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

bp = Blueprint('user_views', __name__)

# Create User
@bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'id': new_user.user_id}), 201

# Read Users
@bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': user.user_id, 'email': user.email} for user in users])

# Update User
@bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    user.email = data['email']
    user.password = generate_password_hash(data['password'], method='sha256')  # Hash password again on update
    db.session.commit()
    return jsonify({'id': user.user_id})

# Delete User
@bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204

# Login User
@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password, data['password']):
        session['user_id'] = user.user_id  # Store user ID in session
        return jsonify({'message': 'Login successful'}), 200
    
    return jsonify({'message': 'Invalid email or password'}), 401

# Logout User
@bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)  # Remove user ID from session
    return jsonify({'message': 'Logout successful'}), 200

# Check if logged in (optional utility route)
@bp.route('/loggedin', methods=['GET'])
def logged_in():
    if 'user_id' in session:
        return jsonify({'logged_in': True}), 200
    return jsonify({'logged_in': False}), 200
