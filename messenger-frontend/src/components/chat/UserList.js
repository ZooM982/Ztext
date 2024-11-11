// UserList.js

import React from 'react';
import CloseButton from '../CloseButton';

function UserList({ users, onSelectUser }) {
    return (
        <div className="user-list">
            <div className='flex justify-between'>
            <h3>Utilisateurs</h3>
            <CloseButton />
            </div>
            <ul>
                {users.map(user => (
                    <li key={user.id} onClick={() => onSelectUser(user)}>
                        {user.username || user.phoneNumber}
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default UserList;
