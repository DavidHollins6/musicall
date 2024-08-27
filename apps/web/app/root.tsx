import "./styles/global.css";
import "@mantine/core/styles.css";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Header } from "./components/Header/header";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
                <ColorSchemeScript />
            </head>
            <body>
                <MantineProvider>
                    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                        <Header />
                        <div style={{ flex: 1 }}>{children}</div>
                    </div>
                </MantineProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}
