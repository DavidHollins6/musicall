import { json, error } from "@sveltejs/kit";

export const GET = async ({ locals: { getUser } }) => {
    const user = await getUser();
    if (!user) {
        // the user is not signed in
        throw error(401, { message: "Unauthorized" });
    }

    return json({ user });
};
