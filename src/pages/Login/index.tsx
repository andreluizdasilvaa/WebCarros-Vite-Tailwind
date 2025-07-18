import { Link, useNavigate } from 'react-router-dom';
import LogoImg from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
// O zodResolver serve para integrar a validação do Zod com o react-hook-form
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConnection';
import { showErrorToast } from '../../ui/showToast';

const scheme = z.object({
    email: z.string().email('Insira um email valido').nonempty("O campo email é obrigatório"),
    password: z.string().nonempty("O campo senha é obrigatório").min(8, 'A senha deve ter no minimo 8 caracteres')
})

// Ao inves de passar a tipagem do typescript manualmente o zod passa a tipagem dos itens que vamos receber do formulario direto com base no scheme
type FormData = z.infer<typeof scheme> 

export function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(scheme),
        mode: 'onSubmit'
    });

    async function onSubmit(data: FormData) {
        setLoading(true);

        await signInWithEmailAndPassword(auth, data.email, data.password)
        .then(() => {
            navigate('/dashboard')
        })
        .catch((error) => {
            if(error.code === 'auth/invalid-credential') {
                showErrorToast("E-mail ou senha inválidos!");
                return;
            }
            showErrorToast("Erro ao fazer login. Tente novamente mais tarde.");
        })
        .finally(() => {
            setLoading(false);
        })
    }

    return (
        <Container>
            <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
                <Link to='/' className='mb-6 max-w-sm w-full'>
                    <img 
                        src={LogoImg} 
                        alt="Logo" 
                        className='w-full'
                    />
                </Link>

                <form
                    className='bg-white max-w-xl w-full rounded-lg p-4'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className='mb-4'>
                        <Input 
                            type="email"
                            placeholder="Digite seu email..."
                            name="email"
                            error={errors.email?.message}
                            register={register}
                        />
                    </div>

                    <div className='mb-4'>
                        <Input 
                            type="password"
                            placeholder="Digite sua senha..."
                            name="password"
                            error={errors.password?.message}
                            register={register}
                        />
                    </div>
                    

                    <button disabled={loading} type='submit' className='bg-zinc-900 w-full rounded-md text-white h-10 font-bold cursor-pointer'>
                        {loading ? 'Carregando...' : 'Acessar'}
                    </button>
                </form>
                <Link to='/register'>
                    Não possui uma conta? Cadastre-se
                </Link>
            </div>
        </Container>
    )
}