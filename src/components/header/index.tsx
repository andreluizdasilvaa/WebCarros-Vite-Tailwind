import LogoImg from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { FiUser, FiLogIn } from 'react-icons/fi'
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';

export function Header() {
    const { signed, loadingAuth } = useContext(AuthContext);

    return (
        <div className='w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4'>
            <header className='flex w-full max-w-7xl items-center justify-between px-4 mx-auto'>
                <Link to='/'>
                    <img 
                        src={LogoImg}
                        alt="Logo" 
                    />
                </Link>

                {/* Está logado */}
                {!loadingAuth && signed && (
                    <Link to="/dashboard">
                        <div className='border-1 rounded-full p-1 border-gray-900'>
                            <FiUser 
                                size={24}
                                color='#000'
                            />
                        </div>
                    </Link>
                )}

                {/* Não está logado */}
                {!loadingAuth && !signed && (
                    <Link to="/login">
                        <FiLogIn
                            size={24}
                            color='#000'
                        />
                    </Link>
                )}
            </header>
        </div>
    )
}