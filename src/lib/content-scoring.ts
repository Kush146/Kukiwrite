import { generateWithAI } from './ai-providers'

export interface ContentScore {
  overall: number
  readability: number
  seo: number
  engagement: number
  originality: number
  brandAlignment?: number
  suggestions: string[]
}

export async function scoreContent(
  content: string,
  brandVoice?: string
): Promise<ContentScore> {
  const prompt = `Analyze the following content and provide a comprehensive score (0-100) for each metric. Be critical but fair.

Content to analyze:
${content}

${brandVoice ? `Brand Voice Guidelines: ${brandVoice}` : ''}

Provide scores for:
1. Readability (0-100) - How easy is it to read and understand?
2. SEO Optimization (0-100) - How well optimized for search engines?
3. Engagement Potential (0-100) - How engaging and compelling?
4. Originality (0-100) - How unique and original?
${brandVoice ? '5. Brand Alignment (0-100) - How well does it match brand voice?' : ''}

Also provide 3-5 specific, actionable suggestions for improvement.

Format your response as JSON:
{
  "readability": number,
  "seo": number,
  "engagement": number,
  "originality": number,
  ${brandVoice ? '"brandAlignment": number,' : ''}
  "suggestions": ["suggestion1", "suggestion2", ...]
}`

  try {
    const response = await generateWithAI(prompt, {
      model: 'gpt-4o-mini',
      temperature: 0.3,
      maxTokens: 1000
    })

    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const scores = JSON.parse(jsonMatch[0])
      
      const overall = Math.round(
        (scores.readability + scores.seo + scores.engagement + scores.originality + 
         (scores.brandAlignment || 0)) / 
        (brandVoice ? 5 : 4)
      )

      return {
        overall,
        readability: scores.readability || 0,
        seo: scores.seo || 0,
        engagement: scores.engagement || 0,
        originality: scores.originality || 0,
        brandAlignment: scores.brandAlignment,
        suggestions: scores.suggestions || []
      }
    }
  } catch (error) {
    console.error('Content scoring error:', error)
  }

  // Fallback scores
  return {
    overall: 75,
    readability: 80,
    seo: 70,
    engagement: 75,
    originality: 80,
    suggestions: ['Unable to analyze content. Please try again.']
  }
}

