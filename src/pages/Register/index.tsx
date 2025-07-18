import { Link, useNavigate } from 'react-router-dom';
import LogoImg from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
// O zodResolver serve para integrar a validação do Zod com o react-hook-form
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../services/firebaseConnection';
import { showErrorToast, showSuccessToast } from '../../ui/showToast';

const scheme = z.object({
    email: z.string()
        .email('Insira um email valido')
        .nonempty("O campo email é obrigatório"),
    password: z.string()
        .nonempty('O campo senha é obrigatório')
        .min(8, 'A senha deve ter no minimo 8 caracteres'),
    name: z.string()
        .min(3, 'Minimo de 3 caracteres para nome')
        .max(190, 'Maximo de 190 caracteres para nome')
        .nonempty('O campo nome é obrigatório')
})

type FormDate = z.infer<typeof scheme>

export function Register() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }} = useForm<FormDate>({
        resolver: zodResolver(scheme),
        mode: 'onSubmit'
    });

    async function onSubmit(data: FormDate) {
        setLoading(true);
        await createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (user) => {
            await updateProfile(user.user, {
                displayName: data.name
            })
            showSuccessToast('Cadastrado com sucesso!', { position: 'top-center' });
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                showErrorToast("E-mail já cadastrado!");
            } else if (error.code === 'auth/invalid-email') {
                showErrorToast("E-mail inválido!");
            } else {
                showErrorToast("Erro ao cadastrar, tente novamente mais tarde!");
            }
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
                            type="name"
                            placeholder="Digite seu nome completo..."
                            name="name"
                            error={errors.name?.message}
                            register={register}
                        />
                    </div>

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
                    
                    <button type='submit' className='bg-zinc-900 w-full rounded-md text-white h-10 font-bold cursor-pointer'>
                        {loading ? 'Carregando...' : 'Cadastrar'}
                    </button>
                </form>
                <Link to='/login'>
                    Já possui uma conta? Faça login
                </Link>
            </div>
        </Container>
    )
}

