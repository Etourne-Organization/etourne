import { createClient } from "@supabase/supabase-js";
import { Database } from "supabaseDB/database.type";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("Missing Supabase environment variables");

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
