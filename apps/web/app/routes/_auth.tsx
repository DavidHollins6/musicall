import { Outlet, useLoaderData } from "@remix-run/react";
import { Header } from "../components/Header/header";
import { getUser } from "@musicall/api/user";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createSessionStore, SessionContext } from "../store/sessionStore";
import { useRef } from "react";
import { getAuth } from "@clerk/remix/ssr.server";

export async function loader(args: LoaderFunctionArgs) {
    const { isAuthenticated, userId } = await getAuth(args);

    if (!isAuthenticated) {
        return redirect("/sign-in");
    }

    const user = await getUser(userId);

    if (!user) {
        return redirect("/");
    }

    return json({ user });
}

export default function AuthPage() {
    const { user } = useLoaderData<typeof loader>();
    const store = useRef(createSessionStore({ user })).current;

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
