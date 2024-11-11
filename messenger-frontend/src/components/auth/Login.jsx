import React, { useState } from 'react';
import { api } from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import loginWeb from '../images/login_web_pic.png'
import loginMobile from '../images/login_mobile_pic.png'

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/login', { username, password });
            localStorage.setItem('token', response.data.token);
            onLogin(response.data.token);
            navigate('/chat');
        } catch (error) {
            console.error('Erreur de connexion: ', error.response ? error.response.data.message : error.message);
            setError(error.response ? error.response.data.message : "Une erreur s'est produite. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <NavBar />
            <div className='md:flex'>
                <div className='md:w-[47%] md:mt-[150px]'>
                    <img src={loginWeb} alt="" className='hidden md:block ' />
                    <img src={loginMobile} alt="" className='md:hidden size-[80%] mx-auto my-2 ' />
                </div>
                <div className='md:w-[47%] content-center md:mt-[150px] '>
                    <form onSubmit={handleSubmit} className='w-[80%] md:w[100%] border-2 mx-auto rounded-[20px] p-3 my-2 '>
                        <div className='grid my-2'>
                            <label htmlFor="username">Nom d'utilisateur</label>
                            <input
                                className='h-[40px] border rounded-[10px] p-2 border-2 focus:border-blue-500 focus:outline-none'
                                type="text"
                                id="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className='grid my-2'>
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                className='h-[40px] border rounded-[10px] p-2 border-2 focus:border-blue-500 focus:outline-none'
                                type="password"
                                id="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className='h-[40px] w-[50%] bg-blue-500 text-white mx-[25%] my-3 rounded-[10px] hover:bg-white hover:text-blue-500 hover:border-2 hover:border-blue-500'>
                            {loading ? 'Chargement...' : 'Connexion'}
                        </button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <p className='text-center'>Pas de compte ? Cliquez <Link className='text-blue-500 hover:text-blue-300 ' to='/register'>ici</Link> pour vous inscrire</p>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Login;
