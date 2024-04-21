import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { z } from "zod";

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
    const session = await getSession();
    if (session) {
        throw redirect(302, "/");
    }

    return {};
};

export const actions = {
    default: async ({ request, url, locals: { supabase } }) => {
        const queryParams = new URLSearchParams(url.search);
        const formData = await request.formData();
        const email = formData.get("email");

        if (!email) {
            return fail(400, {
                email,
                emailMissing: true,
            });
        }

        const isEmailValid = z.string().email().safeParse(email.toString()).success;

        if (!isEmailValid) {
            return fail(400, {
                email,
                invalidEmail: true,
            });
        }
        const { error } = await supabase.auth.resetPasswordForEmail(email.toString(), {
            redirectTo: "http://localhost:5173/reset-password",
        });

        if (error) {
            console.error(error);
            return fail(400, {
                invalidEmail: true,
                email,
            });
        }

        return redirect(302, "/forgot-password/success");
    },
};
