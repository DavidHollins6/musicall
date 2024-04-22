export const load = async ({ locals: { getUser, getSession } }) => {
    return {
        user: await getUser(),
        session: await getSession(),
    };
};
