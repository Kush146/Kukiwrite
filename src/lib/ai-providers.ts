import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export type AIModel = 'gpt-4o' | 'gpt-4o-mini' | 'claude-3-5-sonnet' | 'claude-3-opus' | 'gemini-pro'

export interface AIConfig {
  model: AIModel
  temperature?: number
  maxTokens?: number
}

export interface AIResponse {
  content: string
  model: string
  tokensUsed?: number
}

// OpenAI Client
let openaiClient: OpenAI | null = null
if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
}

// Anthropic Client
let anthropicClient: Anthropic | null = null
if (process.env.ANTHROPIC_API_KEY) {
  anthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })
}

// Google Gemini - Using OpenAI-compatible endpoint or direct API
// For now, we'll use OpenAI as fallback for Gemini

export async function generateWithAI(
  prompt: string,
  config: AIConfig = { model: 'gpt-4o-mini' }
): Promise<AIResponse> {
  const { model, temperature = 0.7, maxTokens = 2000 } = config

  try {
    // OpenAI Models
    if (model.startsWith('gpt-') && openaiClient) {
      const completion = await openaiClient.chat.completions.create({
        model: model as 'gpt-4o' | 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature,
        max_tokens: maxTokens
      })

      return {
        content: completion.choices[0]?.message?.content || '',
        model,
        tokensUsed: completion.usage?.total_tokens
      }
    }

    // Anthropic Claude Models
    if (model.startsWith('claude-') && anthropicClient) {
      const claudeModel = model === 'claude-3-5-sonnet' 
        ? 'claude-3-5-sonnet-20241022'
        : model === 'claude-3-opus'
        ? 'claude-3-opus-20240229'
        : 'claude-3-5-sonnet-20241022'
      
      const message = await anthropicClient.messages.create({
        model: claudeModel as any,
        max_tokens: maxTokens,
        temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      const content = message.content[0]
      if (content.type === 'text') {
        return {
          content: content.text,
          model,
          tokensUsed: message.usage.input_tokens + message.usage.output_tokens
        }
      }
    }

    // Fallback to OpenAI if model not available
    if (openaiClient) {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature,
        max_tokens: maxTokens
      })

      return {
        content: completion.choices[0]?.message?.content || '',
        model: 'gpt-4o-mini',
        tokensUsed: completion.usage?.total_tokens
      }
    }

    throw new Error('No AI provider available')
  } catch (error: any) {
    console.error('AI generation error:', error)
    throw new Error(`AI generation failed: ${error.message}`)
  }
}

export async function generateWithMultipleModels(
  prompt: string,
  models: AIModel[] = ['gpt-4o-mini', 'claude-3-5-sonnet']
): Promise<AIResponse[]> {
  const promises = models.map(model => 
    generateWithAI(prompt, { model }).catch(error => ({
      content: `Error: ${error.message}`,
      model,
      error: true
    }))
  )

  return Promise.all(promises)
}

export function getAvailableModels(): AIModel[] {
  const models: AIModel[] = []
  
  if (openaiClient) {
    models.push('gpt-4o', 'gpt-4o-mini')
  }
  
  if (anthropicClient) {
    models.push('claude-3-5-sonnet', 'claude-3-opus')
  }
  
  // Gemini would be added here when API key is available
  // if (process.env.GOOGLE_API_KEY) {
  //   models.push('gemini-pro')
  // }
  
  return models.length > 0 ? models : ['gpt-4o-mini'] // Fallback
}

// Legacy function for backward compatibility
export async function generateContent(prompt: string): Promise<string> {
  const response = await generateWithAI(prompt, { model: 'gpt-4o-mini' })
  return response.content
}

