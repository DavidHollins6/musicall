import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useNavigation, useSearchParams } from "@remix-run/react";
import { parseFormAny, useZorm } from "react-zorm";
import { z } from "zod";

import { createAuthSession, getAuthSession } from "../modules/auth/session.server";
import { signInWithEmail } from "../modules/auth/service.server";
import { isFormProcessing } from "../utils/form";
import { assertIsPost } from "../utils/http.server";
import { Button } from "@mantine/core";

export async function loader({ request }: LoaderFunctionArgs) {
    const authSession = await getAuthSession(request);

    if (authSession) return redirect("/");

    return json({ title: "Login" });
}

const LoginFormSchema = z.object({
    email: z
        .string()
        .email("Not a valid email")
        .transform((email) => email.toLowerCase()),
    password: z.string().min(8, "password-too-short"),
    redirectTo: z.string().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
    assertIsPost(request);
    const formData = await request.formData();
    const result = await LoginFormSchema.safeParseAsync(parseFormAny(formData));

    if (!result.success) {
        return json(
            {
                errors: result.error,
            },
            { status: 400 },
        );
    }

    const { email, password, redirectTo } = result.data;

    const authSession = await signInWithEmail(email, password);

    if (!authSession) {
        return json({ errors: { email: "invalid-email-password", password: null } }, { status: 400 });
    }

    return createAuthSession({
        request,
        authSession,
        redirectTo: redirectTo || "/",
    });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
    {
        title: data?.title,
    },
];

export default function LoginPage() {
    const zo = useZorm("login", LoginFormSchema);
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") ?? undefined;

    const navigation = useNavigation();
    const disabled = isFormProcessing(navigation.state);

    return <Button>Hello</Button>;
}

{
    /* <label htmlFor={zo.fields.email()}>Email</label>

<Box className="mt-1">
    <input
        data-test-id="email"
        required
        name={zo.fields.email()}
        type="email"
        autoComplete="email"
        disabled={disabled}
    />
    {zo.errors.email()?.message && <div id="email-error">{zo.errors.email()?.message}</div>}
</Box> */
}
