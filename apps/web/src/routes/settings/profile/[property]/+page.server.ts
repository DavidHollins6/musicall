import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals: { getUser } }) => {
    const user = await getUser();
    if (!user) {
        throw redirect(302, "/login?redirect=" + url);
    }

    return {
        name: user.user_metadata.name,
    };
};

export const actions = {
    default: async ({ request, locals: { supabase } }) => {
        const data = await request.formData();
        const name = data.get("name");
        await supabase.auth.updateUser({ data: { name: name } });

        return { name };
    },
} satisfies Actions;
