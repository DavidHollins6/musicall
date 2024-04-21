import { SupabaseClient, Session } from "@supabase/supabase-js";
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
            getSession(): Promise<Session | null>;
        }
        interface PageData {
            session: Session | null;
        }
    }
}

export {};
