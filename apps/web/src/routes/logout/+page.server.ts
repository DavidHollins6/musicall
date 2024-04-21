import { redirect } from "@sveltejs/kit";

export const load = async ({ locals: { supabase } }) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error(error);
    }

    throw redirect(302, "/login");
};
