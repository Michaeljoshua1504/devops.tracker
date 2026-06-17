import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Grab the message from the frontend
    const { message } = await req.json()
    
    // Get the Groq Key from the Supabase Vault
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

    // Talk to Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are Jarvis, an elite DevOps AI assistant. Keep answers concise, technical, and formatted cleanly."
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "llama-3.3-70b-versatile", 
        temperature: 0.5,
        max_tokens: 1024
      })
    })

    const data = await response.json()
    
    // Send it back to the frontend
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})