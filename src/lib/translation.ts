import { generateWithAI } from './ai-providers'

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'cs', name: 'Czech' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'el', name: 'Greek' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'he', name: 'Hebrew' },
  { code: 'uk', name: 'Ukrainian' }
]

export interface TranslationOptions {
  preserveTone?: boolean
  preserveFormatting?: boolean
  targetAudience?: string
  domain?: string // e.g., 'business', 'technical', 'casual'
}

export async function translateContent(
  content: string,
  targetLanguage: string,
  sourceLanguage: string = 'en',
  options: TranslationOptions = {}
): Promise<string> {
  const targetLangName = SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage
  const sourceLangName = SUPPORTED_LANGUAGES.find(l => l.code === sourceLanguage)?.name || sourceLanguage

  const prompt = `Translate the following content from ${sourceLangName} to ${targetLangName}.

${options.preserveTone ? 'IMPORTANT: Preserve the original tone and style of the content.' : ''}
${options.preserveFormatting ? 'IMPORTANT: Preserve all formatting, including line breaks, lists, and structure.' : ''}
${options.targetAudience ? `Target audience: ${options.targetAudience}` : ''}
${options.domain ? `Domain/context: ${options.domain}` : ''}

Content to translate:
${content}

Provide only the translated content, maintaining the same structure and formatting.`

  try {
    const response = await generateWithAI(prompt, {
      model: 'gpt-4o-mini',
      temperature: 0.3,
      maxTokens: 4000
    })

    return response.content.trim()
  } catch (error) {
    console.error('Translation error:', error)
    throw new Error('Translation failed')
  }
}

export async function translateToMultipleLanguages(
  content: string,
  targetLanguages: string[],
  sourceLanguage: string = 'en',
  options: TranslationOptions = {}
): Promise<Record<string, string>> {
  const translations: Record<string, string> = {}
  
  // Translate to multiple languages in parallel
  const promises = targetLanguages.map(async (lang) => {
    try {
      const translated = await translateContent(content, lang, sourceLanguage, options)
      return { lang, translated }
    } catch (error) {
      console.error(`Translation to ${lang} failed:`, error)
      return { lang, translated: '' }
    }
  })

  const results = await Promise.all(promises)
  results.forEach(({ lang, translated }) => {
    if (translated) {
      translations[lang] = translated
    }
  })

  return translations
}

