import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { auth } from '../services/firebaseConnection';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AuthProviderProps {
    children: ReactNode
}

type AuthContextData = {
    signed: boolean;
    loadingAuth: boolean;
    logout: () => void;
    handleInfoUser: ({ name, email, uid}: UserProps) => void;
    user: UserProps | null;
}

interface UserProps {
    uid: string;
    name: string | null;
    email: string | null | undefined;
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps | null>(null);
    const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser({
                    uid: user.uid,
                    email: user?.email,
                    name: user?.displayName
                })
                setLoadingAuth(false);
            } else {
                setUser(null)
                setLoadingAuth(false);
            }
        })

        return () => {
            unsub();
        }
    }, []);

    async function logout():Promise<void> {
        await signOut(auth)
    }

    function handleInfoUser({ name, email, uid}: UserProps) {
        setUser({
            name, 
            email, 
            uid
        })
    }

    return (
        <AuthContext.Provider
            value={{
                signed: !!user,
                user,
                loadingAuth,
                logout,
                handleInfoUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;