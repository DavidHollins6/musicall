import { isBrowser } from "./isBrowser";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {}
    }
}

type EnvOptions = {
    isSecret?: boolean;
    isRequired?: boolean;
};
function getEnv(name: string, { isRequired, isSecret }: EnvOptions = { isSecret: true, isRequired: true }) {
    if (isBrowser && isSecret) return "";

    const source = (isBrowser ? {} : process.env) ?? {};

    const value = source[name as keyof typeof source];

    if (!value && isRequired) {
        throw new Error(`${name} is not set`);
    }

    return value;
}

/**
 * Server env
 */

/**
 * Shared envs
 */
export const NODE_ENV = getEnv("NODE_ENV", {
    isSecret: false,
    isRequired: false,
});

export function getBrowserEnv() {
    return {};
}
