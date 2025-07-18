import { useContext } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

interface PublicProps {
    children: ReactNode
}

export function PublicRoute({ children }: PublicProps) {
    const { signed, loadingAuth } = useContext(AuthContext);

    if (loadingAuth) return <div></div>;

    return signed ? <Navigate to="/" /> : children;
}