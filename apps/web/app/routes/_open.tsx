import { Outlet } from "@remix-run/react";
import { Header } from "../components/Header/header";
import { createSessionStore, SessionContext } from "../store/sessionStore";
import { useRef } from "react";

export default function OpenPage() {
    const store = useRef(createSessionStore({})).current;

    return (
        <SessionContext.Provider value={store}>
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <Header />
                <div style={{ flex: 1 }}>
                    <Outlet />
                </div>
            </div>
        </SessionContext.Provider>
    );
}
