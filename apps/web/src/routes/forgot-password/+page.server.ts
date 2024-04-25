import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import * as v from "valibot";

const schema = v.object({
    email: v.string("Your email must be a string.", [v.email("Please enter a valid email address")]),
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
    default: async ({ request, locals: { supabase } }) => {
        const form = await superValidate(request, valibot(schema));

        if (!form.valid) {
            return fail(400, { form, invalidCredentials: false });
        }

        const { error } = await supabase.auth.resetPasswordForEmail(form.data.email, {
            redirectTo: "http://localhost:5173/reset-password",
        });

        if (error) {
            console.error(error);
            return fail(400, {
                form,
                invalidCredentials: true,
            });
        }

        return redirect(302, "/forgot-password/success");
    },
};
