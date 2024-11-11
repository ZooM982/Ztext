import React from 'react';
import { socket } from '../../api';
import { useNavigate } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";

function LogoutButton({ onLogout }) {
    const navigate = useNavigate();

    const handleClick = () => {
        // Déconnecter le socket
        socket.disconnect();
        // Retirer le token du localStorage
        localStorage.removeItem('token');
        // Exécuter la fonction onLogout si elle est fournie pour réinitialiser l'état
        if (onLogout) {
            onLogout();
        }
        // Naviguer vers la page de connexion
        navigate('/login');
    };

    return (
        <button onClick={handleClick} className="mx-[20px] my-1">
            <span className='text-[20px]'>
                <CiLogout />
            </span>
        </button>
    );
}

export default LogoutButton;
