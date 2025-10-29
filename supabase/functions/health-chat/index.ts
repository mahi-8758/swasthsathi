import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, healthContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing health chat request with messages:", messages.length);

    let systemPrompt = `You are a helpful AI health assistant for rural and semi-urban populations. Your role is to:
    
1. Educate about preventive healthcare, disease symptoms, and vaccination schedules
2. Provide accurate, easy-to-understand health information
3. Use simple language that can be understood by people with varying education levels
4. Always recommend consulting healthcare professionals for serious symptoms
5. Provide information about common diseases like Malaria, Tuberculosis, Dengue, Cholera, COVID-19
6. Explain vaccination schedules for children and adults
7. Share preventive health tips and hygiene practices
8. Alert about disease outbreaks when relevant
9. Be empathetic, supportive, and culturally sensitive
10. Focus on evidence-based medical information

IMPORTANT: Always encourage users to visit healthcare facilities for proper diagnosis and treatment. You provide information and awareness, not medical diagnosis or treatment.

Keep responses concise, practical, and actionable. Use bullet points when listing symptoms or prevention methods.`;

    // Add personalized health context if available
    if (healthContext) {
      systemPrompt += `\n\nIMPORTANT - PERSONALIZED CONTEXT:\nThe user has shared their health profile with you:\n\n${healthContext}\n\nUse this information to provide MORE PERSONALIZED and RELEVANT health recommendations. Consider their age, chronic conditions, allergies, medications, and lifestyle when giving advice. Always mention specific considerations based on their profile when relevant.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
          { 
            status: 429, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), 
          { 
            status: 402, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
    
  } catch (error) {
    console.error("Error in health-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
