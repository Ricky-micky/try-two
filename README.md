###### Explaining the relationship 
# User:

A user can have many bookings (one-to-many relationship with Booking).

A user can have many ratings (one-to-many relationship with Rating).

A user can have many payments (one-to-many relationship with Payment).

# Hotel:

A hotel can have many rooms (one-to-many relationship with Room).

A hotel can have many ratings (one-to-many relationship with Rating).

# Room:

A room belongs to one hotel (many-to-one relationship with Hotel).

A room can have many bookings (one-to-many relationship with Booking).

# Booking:

A booking belongs to one user (many-to-one relationship with User).

A booking belongs to one room (many-to-one relationship with Room).

A booking can have one payment (one-to-one relationship with Payment).

# Payment:

A payment belongs to one user (many-to-one relationship with User).

A payment belongs to one booking (many-to-one relationship with Booking).

# Rating:

A rating belongs to one user (many-to-one relationship with User).

A rating belongs to one hotel (many-to-one relationship with Hotel).