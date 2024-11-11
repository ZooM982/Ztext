// CloseButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdCloseCircle } from "react-icons/io";

function CloseButton() {
  const navigate = useNavigate(); // Utilisation de React Router pour naviguer

  const handleClose = () => {
    // Redirigez vers la page de la liste des chats (ou toute autre page)
    navigate("/chat"); // Assurez-vous que '/chatlist' est la bonne route pour la liste des chats
  };

  return (
    <button onClick={handleClose} className="close-button">
      <span className="text-[30px] text-red-500 ">
        <IoMdCloseCircle />
      </span>
    </button>
  );
}

export default CloseButton;
