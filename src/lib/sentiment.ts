import { generateWithAI } from './ai-providers'

export type Tone = 'formal' | 'casual' | 'friendly' | 'professional' | 'humorous' | 'serious' | 'enthusiastic' | 'neutral'
export type Sentiment = 'positive' | 'neutral' | 'negative'

export interface ToneAnalysis {
  tone: Tone
  confidence: number
  alternativeTones: Array<{ tone: Tone; confidence: number }>
}

export interface SentimentAnalysis {
  sentiment: Sentiment
  score: number // -1 (very negative) to 1 (very positive)
  confidence: number
}

export interface ContentAnalysis {
  tone: ToneAnalysis
  sentiment: SentimentAnalysis
  emotionalMarkers: string[]
  suggestions: string[]
}

export async function analyzeToneAndSentiment(content: string): Promise<ContentAnalysis> {
  const prompt = `Analyze the tone and sentiment of the following content:

${content}

Provide:
1. Primary tone (formal, casual, friendly, professional, humorous, serious, enthusiastic, neutral)
2. Tone confidence (0-100)
3. Alternative tones with confidence scores
4. Sentiment (positive, neutral, negative)
5. Sentiment score (-1 to 1, where -1 is very negative and 1 is very positive)
6. Sentiment confidence (0-100)
7. Key emotional markers (words/phrases that indicate emotion)
8. Suggestions for adjusting tone or sentiment if needed

Format as JSON:
{
  "tone": {
    "tone": "primary tone",
    "confidence": number,
    "alternativeTones": [
      {"tone": "alternative", "confidence": number}
    ]
  },
  "sentiment": {
    "sentiment": "positive|neutral|negative",
    "score": number,
    "confidence": number
  },
  "emotionalMarkers": ["marker1", "marker2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`

  try {
    const response = await generateWithAI(prompt, {
      model: 'gpt-4o-mini',
      temperature: 0.3,
      maxTokens: 1000
    })

    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0])
      return {
        tone: {
          tone: analysis.tone?.tone || 'neutral',
          confidence: analysis.tone?.confidence || 0,
          alternativeTones: analysis.tone?.alternativeTones || []
        },
        sentiment: {
          sentiment: analysis.sentiment?.sentiment || 'neutral',
          score: analysis.sentiment?.score || 0,
          confidence: analysis.sentiment?.confidence || 0
        },
        emotionalMarkers: analysis.emotionalMarkers || [],
        suggestions: analysis.suggestions || []
      }
    }
  } catch (error) {
    console.error('Tone/sentiment analysis error:', error)
  }

  // Fallback
  return {
    tone: {
      tone: 'neutral',
      confidence: 0,
      alternativeTones: []
    },
    sentiment: {
      sentiment: 'neutral',
      score: 0,
      confidence: 0
    },
    emotionalMarkers: [],
    suggestions: []
  }
}

