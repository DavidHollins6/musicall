import { SupabaseClient, User, Session } from "@supabase/supabase-js";
import { Database } from "./DatabaseDefinitions";
import "unplugin-icons/types/svelte";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
        interface Locals {
            supabase: SupabaseClient<Database>;
            getUser(): Promise<User | null>;
            getSession(): Promise<Session | null>;
        }
        interface PageData {
            user: User | null;
        }
    }
}

export {};
