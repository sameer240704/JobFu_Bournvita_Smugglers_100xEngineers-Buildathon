import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export const useCurrentUserId = () => {
    const [userId, setUserId] = useState(null)
    const supabase = createClient()

    useEffect(() => {
        const getSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) {
                console.error('Error getting session:', error)
                return
            }
            setUserId(session?.user?.id ?? null)
        }

        getSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUserId(session?.user?.id ?? null)
        })

        // Cleanup
        return () => subscription?.unsubscribe()
    }, [supabase])

    return userId;
}