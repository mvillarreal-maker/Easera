import Anthropic from '@anthropic-ai/sdk'

const BASE_SYSTEM = `You are EaseRA, a warm, calm companion inside an app for someone living with rheumatoid arthritis (RA). Give clear, supportive, practical guidance on managing RA: gentle movement, joint protection, flare care, pacing, heat/cold, using her hip exoskeleton, and emotional support. Be concise (2-4 short paragraphs max), kind, and specific. Always make clear you are informational support, not a doctor — encourage consulting their rheumatologist for medication, diagnosis, or worsening symptoms. Never give medication dosing.`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { messages, systemContext } = req.body

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured. Add ANTHROPIC_API_KEY to your environment variables.' })
  }

  const system = systemContext ? `${BASE_SYSTEM}\n\n${systemContext}` : BASE_SYSTEM

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 700,
      system,
      messages,
    })
    res.json({ content: response.content[0].text })
  } catch (err) {
    console.error('Anthropic error:', err)
    res.status(500).json({ error: "I couldn't reach my brain just now. Check your connection and try again." })
  }
}
