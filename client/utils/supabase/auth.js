import { createClient } from "./client"

export const logout = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.error('Error logging out:', error)
        throw error
    }
}