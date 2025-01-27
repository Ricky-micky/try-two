from flask import jsonify, request, Blueprint
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity

user_bp = Blueprint('user_bp', __name__)

# Create User 
@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = generate_password_hash(data.get('password'))
    role = data.get('role', 'guest')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(email=email, password=password, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# Read User bt in this state na Fetch All Users
@user_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    user_list = [
        {
            "user_id": user.user_id,
            "email": user.email,
            "role": user.role
        } for user in users
    ]
    return jsonify(user_list), 200

# Read User  ....niku Fetch a Single User bt kutumia  ID
@user_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_details = {
        "user_id": user.user_id,
        "email": user.email,
        "role": user.role
    }
    return jsonify(user_details), 200

# Update User (Modify User Details)
@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update user details
    email = data.get('email', user.email)
    password = data.get('password')
    role = data.get('role', user.role)

    # Check if the new email is already taken by another user
    if email != user.email and User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    # Update email and role
    user.email = email
    user.role = role

    # Update password if provided
    if password:
        user.password = generate_password_hash(password)

    db.session.commit()
    return jsonify({"message": "User updated successfully"}), 200

# Delete User 
@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200