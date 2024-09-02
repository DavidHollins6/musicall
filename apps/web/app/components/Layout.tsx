import React from "react";
import { Header } from "./Header/header";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />
            <div style={{ flex: 1 }}>{children}</div>
        </div>
    );
};
