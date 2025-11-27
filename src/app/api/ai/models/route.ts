import { NextResponse } from 'next/server'
import { getAvailableModels } from '@/lib/ai-providers'

export async function GET() {
  try {
    const models = getAvailableModels()
    return NextResponse.json({ models })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get available models' },
      { status: 500 }
    )
  }
}

