import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, Link, useNavigation, useSearchParams } from "@remix-run/react";
import { parseFormAny, useZorm } from "react-zorm";
import { z } from "zod";

import { createAuthSession, getAuthSession } from "../modules/auth/session.server";
import { getUserByEmail } from "@musicall/api/user";
import { createUserAccount } from "../modules/user/service.server";

import { isFormProcessing } from "../utils/form";
import { assertIsPost } from "../utils/http.server";
import { checkPasswordStrength, generateUuid } from "usemods";
import { createRoom } from "@musicall/api/room";
import { Button, Card, Divider, Flex, Input, Stack } from "@mantine/core";

export async function loader({ request }: LoaderFunctionArgs) {
    const authSession = await getAuthSession(request);

    if (authSession) return redirect("/");

    return json({ title: "Register" });
}

const JoinFormSchema = z
    .object({
        email: z
            .string()
            .email("Invalid Email")
            .transform((email) => email.toLowerCase()),
        password: z.string().min(8, "Password is too short"),
        name: z.string().min(1, "Please provide a name"),
        confirmPassword: z.string(),
        redirectTo: z.string().optional(),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        const strength = checkPasswordStrength(password, { length: 8, number: 1, special: 1, uppercase: 1 }) as {
            label: string;
            score: number;
        };

        if (strength.score < 4) {
            ctx.addIssue({
                code: "custom",
                message: strength.label,
                path: ["password"],
            });
        }
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ["confirmPassword"],
            });
        }
    });

export async function action({ request }: ActionFunctionArgs) {
    assertIsPost(request);
    const formData = await request.formData();
    const result = await JoinFormSchema.safeParseAsync(parseFormAny(formData));

    if (!result.success) {
        return json(
            {
                errors: result.error,
            },
            { status: 400 },
        );
    }

    const { email, password, redirectTo, name } = result.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return json({ errors: { email: "user-already-exist", password: null } }, { status: 400 });
    }

    const authSession = await createUserAccount(email, password, name);

    if (!authSession) {
        return json({ errors: { email: "unable-to-create-account", password: null } }, { status: 500 });
    }

    createRoom({ ownerId: authSession.userId, id: generateUuid(), name: "Default" });

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

export default function Join() {
    const zo = useZorm("join", JoinFormSchema);
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") ?? undefined;
    const navigation = useNavigation();
    const disabled = isFormProcessing(navigation.state);

    return (
        <Form ref={zo.ref} method="post" replace>
            <Flex w="100vw" justify="center" align="center">
                <Card w="30%" withBorder shadow="sm" padding="lg">
                    <h1>Sign up</h1>
                    <Stack>
                        <Input.Wrapper required label="Email" error={zo.errors.email()?.message}>
                            <Input name={zo.fields.email()} />
                        </Input.Wrapper>
                        <Input.Wrapper
                            description="Must contain at least 1 special character, uppercase character, and number"
                            label="Password"
                            required
                            error={zo.errors.password()?.message}
                        >
                            <Input type="password" name={zo.fields.password()} />
                        </Input.Wrapper>
                        <Input.Wrapper required label="Confirm Password" error={zo.errors.confirmPassword()?.message}>
                            <Input type="password" name={zo.fields.confirmPassword()} />
                        </Input.Wrapper>
                        <Input.Wrapper required label="Name" error={zo.errors.name()?.message}>
                            <Input name={zo.fields.name()} />
                        </Input.Wrapper>
                        <Button disabled={disabled} type="submit">
                            Sign up
                        </Button>
                        <Link to="/login">Already have an account?</Link>
                        <Card.Section>
                            <Divider />
                        </Card.Section>

                        <input name="redirectTo" id="redirectTo" type="hidden" value={redirectTo} />
                    </Stack>
                </Card>
            </Flex>
        </Form>
    );
}
