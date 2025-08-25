import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant for TrustHive, a freelancing platform. You help users with:

1. General freelancing advice and tips
2. Information about TrustHive features like:
   - AI-powered job matching
   - Secure escrow payments
   - Global community of freelancers and clients
   - Easy job posting and application process
3. Career guidance for freelancers
4. Best practices for clients hiring freelancers

Keep responses concise, helpful, and professional. Focus on being encouraging and supportive. If asked about specific jobs, direct users to search for jobs using phrases like "show me all jobs" or mention specific skills.

TrustHive features:
- AI-powered matching system
- Secure escrow payments
- Global freelancer community
- Easy job posting for clients
- Smart job recommendations
- Real-time chat support
- Professional profiles and portfolios
- Milestone-based payments
- Dispute resolution system`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("OpenAI API Error:", response.status, errorData)
      throw new Error(`OpenAI API request failed: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || "I'm here to help! What would you like to know?"

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        response:
          "I'm having trouble connecting right now, but I can still help you search for jobs! Try asking me to 'show all jobs' or search for specific skills like 'React developer jobs'.",
      },
      { status: 200 },
    )
  }
}
