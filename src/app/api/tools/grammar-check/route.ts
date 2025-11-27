import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateContent } from '@/lib/openai'
import { canUseTool } from '@/lib/usage'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { content } = await req.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const usage = await canUseTool(userId)

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: 'Usage limit exceeded',
          remaining: usage.remaining,
          limit: usage.limit,
          plan: usage.plan
        },
        { status: 403 }
      )
    }

    const prompt = `Please check the following text for grammar, spelling, punctuation, and style issues. 

Text to check:
${content}

Please provide:
1. A corrected version of the text
2. A list of issues found with:
   - Type (grammar, spelling, punctuation, style)
   - Message describing the issue
   - Suggested correction
   - Severity (error, warning, info)
   - Position (start and end character indices)

Format the response as JSON:
{
  "correctedContent": "...",
  "issues": [
    {
      "type": "grammar|spelling|punctuation|style",
      "message": "...",
      "suggestion": "...",
      "position": { "start": 0, "end": 10 },
      "severity": "error|warning|info"
    }
  ]
}`

    const output = await generateContent(prompt)
    
    // Try to parse JSON from the output
    let result
    try {
      const jsonMatch = output.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        // Fallback if no JSON found
        result = {
          correctedContent: output,
          issues: []
        }
      }
    } catch (parseError) {
      // If parsing fails, use the raw output as corrected content
      result = {
        correctedContent: output,
        issues: []
      }
    }

    await prisma.generation.create({
      data: {
        userId,
        type: 'GRAMMAR_CHECK',
        input: JSON.stringify({ content }),
        output: result.correctedContent
      }
    })

    return NextResponse.json({
      correctedContent: result.correctedContent || content,
      issues: result.issues || [],
      remaining: usage.remaining - 1,
      limit: usage.limit
    })
  } catch (error: any) {
    console.error('Grammar check error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check grammar' },
      { status: 500 }
    )
  }
}



