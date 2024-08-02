import { createClient } from "redis";
import { REDIS_URL } from "~/utils/env";

console.log(REDIS_URL);

const client = createClient({
    url: `redis://${REDIS_URL}`,
});

export { client as redis };
