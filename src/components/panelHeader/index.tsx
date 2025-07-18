import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";


export function DashboardHeader() {
    const { logout } = useContext(AuthContext)

    return (
        <div className="w-full items-center flex h-10 bg-red-500 rounded-lg text-white font-medium gap-4 px-4">
            <Link to="/dashboard">
                Dashboard
            </Link>
            <Link to="/dashboard/new">
                Cadastrar carro
            </Link>

            <button
                onClick={logout}
                className="ml-auto cursor-pointer"
            >
                Sair da conta
            </button>
        </div>
    )
}