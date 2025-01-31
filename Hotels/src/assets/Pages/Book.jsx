import React, { useContext } from "react";
// import { UserContext } from '../Context/UserContext';
// import {UserContext} from '../Context/UserContext'

const Profile = () => {
  const { current_user, logout } = useContext(UserContext);

  return (
    <div>
      <h1>Profile</h1>
      {current_user ? (
        <div>
          <p>Welcome, {current_user.username}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
