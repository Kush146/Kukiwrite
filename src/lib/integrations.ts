// Integration utilities for auto-posting to various platforms

export interface PostingPlatform {
  id: string
  name: string
  icon: string
  connected: boolean
  authUrl?: string
}

export interface PostData {
  title?: string
  content: string
  tags?: string[]
  category?: string
  publishDate?: Date
  status?: 'draft' | 'published' | 'scheduled'
}

export interface PostResult {
  success: boolean
  platform: string
  postId?: string
  url?: string
  error?: string
}

// WordPress Integration
export async function postToWordPress(
  content: string,
  title: string,
  siteUrl: string,
  username: string,
  password: string,
  status: 'draft' | 'publish' = 'draft'
): Promise<PostResult> {
  try {
    // WordPress REST API endpoint
    const endpoint = `${siteUrl}/wp-json/wp/v2/posts`
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
      },
      body: JSON.stringify({
        title,
        content,
        status
      })
    })

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      platform: 'wordpress',
      postId: data.id.toString(),
      url: data.link
    }
  } catch (error: any) {
    return {
      success: false,
      platform: 'wordpress',
      error: error.message
    }
  }
}

// Medium Integration
export async function postToMedium(
  content: string,
  title: string,
  accessToken: string,
  tags: string[] = [],
  publishStatus: 'draft' | 'public' | 'unlisted' = 'draft'
): Promise<PostResult> {
  try {
    // First, get user ID
    const userResponse = await fetch('https://api.medium.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!userResponse.ok) {
      throw new Error('Failed to authenticate with Medium')
    }

    const userData = await userResponse.json()
    const userId = userData.data.id

    // Create post
    const postResponse = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        contentFormat: 'html',
        content: `<h1>${title}</h1>${content}`,
        tags,
        publishStatus
      })
    })

    if (!postResponse.ok) {
      throw new Error(`Medium API error: ${postResponse.statusText}`)
    }

    const postData = await postResponse.json()
    
    return {
      success: true,
      platform: 'medium',
      postId: postData.data.id,
      url: postData.data.url
    }
  } catch (error: any) {
    return {
      success: false,
      platform: 'medium',
      error: error.message
    }
  }
}

// LinkedIn Integration (simplified - requires OAuth)
export async function postToLinkedIn(
  content: string,
  accessToken: string,
  visibility: 'PUBLIC' | 'CONNECTIONS' = 'PUBLIC'
): Promise<PostResult> {
  try {
    // Get user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!profileResponse.ok) {
      throw new Error('Failed to authenticate with LinkedIn')
    }

    const profileData = await profileResponse.json()
    const personUrn = profileData.id

    // Create post
    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify({
        author: `urn:li:person:${personUrn}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': visibility
        }
      })
    })

    if (!postResponse.ok) {
      throw new Error(`LinkedIn API error: ${postResponse.statusText}`)
    }

    const postData = await postResponse.json()
    
    return {
      success: true,
      platform: 'linkedin',
      postId: postData.id,
      url: `https://www.linkedin.com/feed/update/${postData.id}`
    }
  } catch (error: any) {
    return {
      success: false,
      platform: 'linkedin',
      error: error.message
    }
  }
}

// Twitter/X Integration (simplified)
export async function postToTwitter(
  content: string,
  accessToken: string,
  accessTokenSecret: string
): Promise<PostResult> {
  try {
    // Twitter API v2 requires OAuth 1.0a signing
    // This is a simplified version - in production, use a proper OAuth library
    // For now, return a placeholder
    return {
      success: false,
      platform: 'twitter',
      error: 'Twitter integration requires OAuth 1.0a implementation'
    }
  } catch (error: any) {
    return {
      success: false,
      platform: 'twitter',
      error: error.message
    }
  }
}

// Batch posting to multiple platforms
export async function postToMultiplePlatforms(
  postData: PostData,
  platforms: Array<{ platform: string; credentials: any }>
): Promise<PostResult[]> {
  const results = await Promise.all(
    platforms.map(async ({ platform, credentials }) => {
      switch (platform) {
        case 'wordpress':
          return postToWordPress(
            postData.content,
            postData.title || '',
            credentials.siteUrl,
            credentials.username,
            credentials.password,
            postData.status === 'published' ? 'publish' : 'draft'
          )
        case 'medium':
          return postToMedium(
            postData.content,
            postData.title || '',
            credentials.accessToken,
            postData.tags,
            postData.status === 'published' ? 'public' : 'draft'
          )
        case 'linkedin':
          return postToLinkedIn(
            postData.content,
            credentials.accessToken,
            'PUBLIC'
          )
        default:
          return {
            success: false,
            platform,
            error: 'Platform not supported'
          }
      }
    })
  )

  return results
}

