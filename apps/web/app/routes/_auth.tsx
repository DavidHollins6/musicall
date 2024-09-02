import { Outlet, useLoaderData } from "@remix-run/react";
import { Header } from "../components/Header/header";
import { getUser } from "@musicall/api/user";
import { requireAuthSession } from "../modules/auth/session.server";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createSessionStore, SessionContext } from "../store/sessionStore";
import { useRef } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await requireAuthSession(request);

    const user = await getUser(session.userId);

    if (!user) {
        return redirect("/");
    }

    return json({ user, session });
}

export default function AuthPage() {
    const { session, user } = useLoaderData<typeof loader>();
    const store = useRef(createSessionStore({ user, session })).current;

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
