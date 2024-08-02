import { createClient } from "redis";

const client = createClient({
  url: `redis://${process.env.REDIS_URL}`,
});

export { client as redis };
