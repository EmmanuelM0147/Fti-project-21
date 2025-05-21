// CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Content-Type": "application/json",
};

// Simple health check handler with performance optimizations
Deno.serve(async (req) => {
  try {
    // Handle CORS preflight request
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Only allow GET requests
    if (req.method !== "GET") {
      return new Response(
        JSON.stringify({
          error: "Method not allowed",
        }),
        {
          status: 405,
          headers: corsHeaders,
        }
      );
    }

    // Simplified health check response with minimal processing
    return new Response(
      JSON.stringify({
        status: "healthy",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          // Add cache control headers to reduce load
          "Cache-Control": "public, max-age=5, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("Health check error:", error);
    
    return new Response(
      JSON.stringify({ 
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});