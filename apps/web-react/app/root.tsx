import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./styles/global.css";
import "./styles/colors.css";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <Theme accentColor="indigo">
            <Outlet />
        </Theme>
    );
}
