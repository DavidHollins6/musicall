import {
  createClient,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "@redis/client";
import { RedisClientType } from "redis";

export type RedisCache = RedisClientType<
  RedisModules,
  RedisFunctions,
  RedisScripts
>;

export const createCache = (url: string, password: string) => {
  const client = createClient({
    url: `redis://${url}`,
    password: password,
  });
  ``;
  client.connect();

  return client;
};
