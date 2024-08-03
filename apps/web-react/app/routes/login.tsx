import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useNavigation, useSearchParams } from "@remix-run/react";
import { parseFormAny, useZorm } from "react-zorm";
import { z } from "zod";

import { createAuthSession, getAuthSession } from "../modules/auth/session.server";
import { signInWithEmail } from "../modules/auth/service.server";
import { isFormProcessing } from "../utils/form";
import { assertIsPost } from "../utils/http.server";
import { Blockquote, Button, Card, Divider, Flex, Group, Image, Input, Stack, Text } from "@mantine/core";

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

    return (
        <Form ref={zo.ref} method="post" replace>
            <Flex w="100vw" h="100vh" justify="center" align="center">
                <Card w="30%" withBorder shadow="sm" padding="lg">
                    <h1>Login</h1>
                    <Stack>
                        <Input.Wrapper label="Email" error={zo.errors.email()?.message}>
                            <Input name={zo.fields.email()} />
                        </Input.Wrapper>
                        <Input.Wrapper label="Password" error={zo.errors.password()?.message}>
                            <Input type="password" name={zo.fields.password()} />
                        </Input.Wrapper>
                        <Button disabled={disabled} type="submit">
                            Login
                        </Button>
                        <Group justify="space-between">
                            <Link to="/join">Create account</Link>
                            <Link to="/forgot-password">Forgot password?</Link>
                        </Group>
                        <Card.Section>
                            <Divider />
                        </Card.Section>
                        <Blockquote color="blue" cite="–Happy user">
                            This is a great application
                        </Blockquote>
                    </Stack>
                </Card>
            </Flex>
        </Form>
    );
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
