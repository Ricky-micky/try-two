from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
import datetime
import jwt

bp = Blueprint('user_views', __name__)
SECRET_KEY = "0743545012Ricky." 
# Create User
@bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(email=data['email'], password=hashed_password,role = data['role'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'id': new_user.user_id}), 201

# Read Users
@bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])


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
    print("Login route was accessed!")  # Debugging print
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password, data['password']):
        token_payload = {
            'user_id': user.user_id,
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=30)
        }
        token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

        return jsonify({'message': 'Login successful', 'token': token}), 200
    
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
