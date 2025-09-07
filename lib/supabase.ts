import { createClient } from "@supabase/supabase-js"

// Check if Supabase is configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("🔧 Supabase URL:", supabaseUrl ? "✅ Configured" : "❌ Not configured")
console.log("🔧 Supabase Anon Key:", supabaseAnonKey ? "✅ Configured" : "❌ Not configured")
console.log("🔧 Environment:", process.env.NODE_ENV)

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Create a fallback client that won't break the app
const createSupabaseClient = () => {
  if (isSupabaseConfigured()) {
    return createClient(supabaseUrl!, supabaseAnonKey!)
  }

  // Return a mock client for development
  return {
    auth: {
      signUp: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signInWithPassword: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: new Error("Supabase not configured") }),
      update: () => ({ data: null, error: new Error("Supabase not configured") }),
      delete: () => ({ data: null, error: new Error("Supabase not configured") }),
    }),
  } as any
}

export const supabase = createSupabaseClient()
