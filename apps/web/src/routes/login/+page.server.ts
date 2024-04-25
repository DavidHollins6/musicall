import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import * as v from "valibot";

const schema = v.object({
    email: v.string("Your email must be a string.", [v.email("Please enter a valid email address")]),
    password: v.string("Your password must be a string.", [v.minLength(1, "Please enter your password.")]),
});

export const load: PageServerLoad = async ({ locals: { getUser } }) => {
    const user = await getUser();
    if (user) {
        throw redirect(302, "/");
    }

    const form = await superValidate(valibot(schema));

    return { form };
};

export const actions = {
    default: async ({ request, url, locals: { supabase } }) => {
        const queryParams = new URLSearchParams(url.search);

        const form = await superValidate(request, valibot(schema));

        if (!form.valid) {
            return fail(400, { form, invalidCredentials: false });
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: form.data.email,
            password: form.data.password,
        });

        if (error) {
            return fail(400, { form, invalidCredentials: true });
        }

        if (queryParams.has("redirect")) {
            throw redirect(302, queryParams.get("redirect") as string);
        }

        throw redirect(302, "/");
    },
};
