import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const userData = await request.json()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      throw new Error('Failed to sync user')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sync user error:', error)
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    )
  }
}