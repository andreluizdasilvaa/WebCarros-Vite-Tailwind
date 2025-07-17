import { Header } from "../header";
// Onde vão renderizar as paginas
import { Outlet } from "react-router";

// Em cima o 'Header' e em baixo as paginas

export function Layout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}