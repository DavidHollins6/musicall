import { syncedStore, getYjsDoc } from "@syncedstore/core";
import YPartyKitProvider from "y-partykit/provider";
import { svelteSyncedStore } from "@syncedstore/svelte";

// Create your SyncedStore store
export const store = syncedStore<{ todos: { title: string; completed: boolean }[] }>({ todos: [] });
export const svelteStore = svelteSyncedStore(store);

const doc = getYjsDoc(store);
export const provider = new YPartyKitProvider("localhost:1999", "call-store", doc, { connect: false });
