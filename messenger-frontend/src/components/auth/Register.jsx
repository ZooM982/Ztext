// components/Register.js
import React, { useState } from 'react';
import { api } from '../../api';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import registerWeb from '../images/register_web_pic.png'
import registerMobile from '../images/register_mobile_pic.png'

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate(); 

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', { username, password, phoneNumber });
            setSuccess('Inscription réussie, vous pouvez vous connecter maintenant.');
            setError(null);
            navigate('/login');
        } catch (error) {
            setError('Échec de l inscription. Vérifiez vos données.');
            setSuccess(null);
        }
    };

    return (
        <div className="register-container text-center">
            <NavBar />
            <h2>Inscription</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <div className='md:flex'>
            <div className='md:w-[47%] '>
                <img src={registerWeb} alt="" className='hidden md:block ' />
                <img src={registerMobile} alt="" className='md:hidden size-[80%] mx-auto my-2 ' />
            </div>
                <div className='md:w-[47%] content-center '>
                <form onSubmit={handleRegister} className='border-2 w-[80%] md:w-[100%] text-start mx-auto rounded-[20px] p-3 my-2 focus:border-blue-500'>
                <div className='grid py-2'>
                    <label className='my-2' htmlFor="username">Votre Username</label>
                <input
                className='h-[40px] border rounded-[10px] p-2 border-2 focus:border-blue-500 focus:outline-none'
                id='username'
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                </div>
                <div className='grid py-2'>
                    <label className='my-2' htmlFor="password">Votre Mot de passe</label>
                <input
                className='h-[40px] border rounded-[10px] p-2 border-2 focus:border-blue-500 focus:outline-none'
                id='password'
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <div className='grid py-2'>
                    <label className='my-2' htmlFor="tel">Votre Numéro de téléphone</label>
                <input
                className='h-[40px] border rounded-[10px] p-2 border-2 focus:border-blue-500 focus:outline-none'
                id='tel'
                    type="text"
                    placeholder="Numéro de téléphone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
                </div>
                <button type="submit"  className='h-[40px] w-[50%] bg-blue-500 text-white mx-[25%] my-3 border rounded-[10px] p-1 hover:bg-white hover:border-blue-500 hover:border-2 hover:text-blue-500'>S'inscrire</button>

                <p className='text-center'>Vous avez deja compte ? Cliquez <Link className='text-blue-500' to='/login' >ici</Link> pour vous connecter</p>

            </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
