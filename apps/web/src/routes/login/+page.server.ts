import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { getUser } }) => {
    const user = await getUser();
    if (user) {
        throw redirect(302, "/");
    }

    return {};
};

export const actions = {
    default: async ({ request, url, locals: { supabase } }) => {
        const queryParams = new URLSearchParams(url.search);
        const formData = await request.formData();
        const email = formData.get("email");
        console.log(email);

        if (!email) {
            return fail(400, {
                email,
                emailMissing: true,
            });
        }

        const password = formData.get("password");

        if (!password) {
            return fail(400, {
                email,
                passwordMissing: true,
            });
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: email.toString(),
            password: password.toString(),
        });

        if (error) {
            return fail(400, {
                invalidCredentials: true,
                email,
            });
        }

        if (queryParams.has("redirect")) {
            throw redirect(302, queryParams.get("redirect") as string);
        }

        throw redirect(302, "/");
    },
};
