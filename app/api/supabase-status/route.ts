// app/api/supabase-status/route.ts
// Server-side proxy for Supabase status - avoids fetch() inside useEffect on client
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    try {
        const response = await fetch('https://status.supabase.com/api/v2/status.json', {
            cache: 'no-store',
            next: { revalidate: 0 },
        })
        const data = await response.json()
        return NextResponse.json({ indicator: data.status.indicator })
    } catch {
        // On any upstream error, treat as degraded
        return NextResponse.json({ indicator: 'minor' })
    }
}
