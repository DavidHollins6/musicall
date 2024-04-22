import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { z } from "zod";

const SignupFormSchema = z
    .object({
        name: z.string().min(1, { message: "Name is required" }),
        email: z.string().min(1, { message: "Email is required" }).email(),
        password: z
            .string()
            .regex(/^.{8,}$/, "Password needs to be more than 8 characters")
            .regex(/.*\d+.*/, "Password must contain a number")
            .regex(/.*[A-Z].*/, "Password must contain an uppercase character")
            .regex(/.*[@$!%*?&].*/, "Password must contain a special character"),
        confirmPassword: z.string().min(1, { message: "Password is required" }),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "The passwords did not match",
            });
        }
    });

export const load: PageServerLoad = async ({ locals: { getUser } }) => {
    const user = await getUser();
    if (user) {
        throw redirect(302, "/");
    }

    return {};
};

export const actions = {
    default: async ({ request, locals: { supabase } }) => {
        const formPayload = Object.fromEntries(await request.formData());
        const result = SignupFormSchema.safeParse(formPayload);

        if (!result.success) {
            return fail(400, {
                issues: result.error.issues,
                success: false,
            });
        }

        const { error } = await supabase.auth.signUp({
            email: result.data.email,
            password: result.data.password,
            options: {
                data: {
                    full_name: result.data.name,
                },
                emailRedirectTo: "http://localhost:5173/post-sign-up",
            },
        });

        if (error) {
            console.error(error);
            return fail(400, {
                signInError: "Server error. Try again later.",
                success: false,
                email: result.data.email,
                name: result.data.name,
            });
        }
    },
};
