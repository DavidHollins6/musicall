import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { z } from "zod";

const ResetPasswordSchema = z
    .object({
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
        const result = ResetPasswordSchema.safeParse(formPayload);

        if (!result.success) {
            return fail(400, {
                issues: result.error.issues,
                success: false,
            });
        }

        const { error } = await supabase.auth.updateUser({
            password: result.data.password,
        });

        if (error) {
            console.error(error);
            return fail(400, {
                error: true,
            });
        }

        return redirect(302, "/reset-password/success");
    },
};
