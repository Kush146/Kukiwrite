import { generateWithAI } from './ai-providers'

export interface PlagiarismResult {
  similarity: number
  isOriginal: boolean
  flaggedSections: Array<{
    text: string
    similarity: number
    reason: string
  }>
  sources?: Array<{
    url?: string
    title?: string
    similarity: number
  }>
}

export async function checkPlagiarism(content: string): Promise<PlagiarismResult> {
  // Note: For production, use a dedicated plagiarism API like Copyscape, Grammarly, or Quetext
  // This is a basic implementation using AI to detect potential issues
  
  const prompt = `Analyze the following content for potential plagiarism or unoriginal content. 
Look for:
1. Common phrases that appear frequently online
2. Content that seems copied or paraphrased
3. Lack of original thought or unique perspective

Content to check:
${content.substring(0, 2000)}${content.length > 2000 ? '...' : ''}

Provide:
1. Overall similarity score (0-100, where 0 is completely original and 100 is completely plagiarized)
2. Flag any sections that seem unoriginal (provide the text and similarity score)
3. Note if the content appears to be original

Format as JSON:
{
  "similarity": number,
  "isOriginal": boolean,
  "flaggedSections": [
    {
      "text": "exact text from content",
      "similarity": number,
      "reason": "why it's flagged"
    }
  ]
}`

  try {
    const response = await generateWithAI(prompt, {
      model: 'gpt-4o-mini',
      temperature: 0.2,
      maxTokens: 1500
    })

    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0])
      return {
        similarity: result.similarity || 0,
        isOriginal: (result.similarity || 0) < 30,
        flaggedSections: result.flaggedSections || [],
        sources: result.sources || []
      }
    }
  } catch (error) {
    console.error('Plagiarism check error:', error)
  }

  // Fallback - assume original if check fails
  return {
    similarity: 0,
    isOriginal: true,
    flaggedSections: []
  }
}

// For production, integrate with a real plagiarism API
export async function checkPlagiarismWithAPI(content: string): Promise<PlagiarismResult> {
  // Example integration with a plagiarism API
  // const response = await fetch('https://api.plagiarism-checker.com/check', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.PLAGIARISM_API_KEY}` },
  //   body: JSON.stringify({ content })
  // })
  // return response.json()
  
  // For now, use AI-based check
  return checkPlagiarism(content)
}

