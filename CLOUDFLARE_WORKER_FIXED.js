// ✅ FIXED Cloudflare Worker with Proper CORS
// Copy this ENTIRE code and paste into your Cloudflare Worker editor

const ALLOWED_ORIGINS = [
  "https://3dhustle.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost"
];

const ADMIN_SECRET_HEADER = "x-admin-secret";

function corsHeaders(requestOrigin) {
  // Find matching origin (with or without trailing slash)
  const origin = ALLOWED_ORIGINS.find(o => 
    requestOrigin === o || 
    requestOrigin === o + '/' ||
    requestOrigin?.startsWith(o)
  ) || ALLOWED_ORIGINS[0];
  
  return {
    "Access-Control-Allow-Origin": requestOrigin || origin,
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS, HEAD",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-secret",
    "Access-Control-Expose-Headers": "ETag, Content-Length, Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get("Origin") || "";
    const headers = corsHeaders(requestOrigin);

    try {
      // Handle preflight OPTIONS
      if (request.method === "OPTIONS") {
        return new Response(null, { 
          status: 204,
          headers 
        });
      }

      const url = new URL(request.url);

      // Health check
      if (url.pathname === "/" || url.pathname === "/health") {
        return new Response(JSON.stringify({
          status: "ok",
          worker: "bim-models-api",
          timestamp: new Date().toISOString(),
          bindings: {
            r2: typeof env.MODELS_BUCKET !== 'undefined',
            secret: typeof env.ADMIN_SECRET !== 'undefined'
          }
        }), {
          status: 200,
          headers: { 
            ...headers, 
            "Content-Type": "application/json" 
          }
        });
      }

      // Only handle /models/* routes
      if (!url.pathname.startsWith("/models/")) {
        return new Response(JSON.stringify({
          error: "Not found",
          message: "Only /models/* paths are supported"
        }), {
          status: 404,
          headers: { 
            ...headers, 
            "Content-Type": "application/json" 
          }
        });
      }

      // Check R2 binding
      if (!env.MODELS_BUCKET) {
        console.error("MODELS_BUCKET binding not configured");
        return new Response(JSON.stringify({
          error: "Configuration error",
          message: "R2 bucket binding not found"
        }), {
          status: 500,
          headers: { 
            ...headers, 
            "Content-Type": "application/json" 
          }
        });
      }

      const key = url.pathname.slice(1); // remove leading slash
      const method = request.method.toUpperCase();

      // Admin-only methods: PUT & DELETE
      if (method === "PUT" || method === "DELETE") {
        if (!env.ADMIN_SECRET) {
          console.error("ADMIN_SECRET not configured");
          return new Response(JSON.stringify({
            error: "Configuration error",
            message: "Admin secret not configured"
          }), {
            status: 500,
            headers: { 
              ...headers, 
              "Content-Type": "application/json" 
            }
          });
        }

        const secret = request.headers.get(ADMIN_SECRET_HEADER) || "";
        if (!secret || secret !== env.ADMIN_SECRET) {
          return new Response(JSON.stringify({
            error: "Unauthorized",
            message: "Invalid or missing admin secret"
          }), {
            status: 401,
            headers: { 
              ...headers, 
              "Content-Type": "application/json" 
            }
          });
        }
      }

      // GET or HEAD - Download file
      if (method === "GET" || method === "HEAD") {
        const object = await env.MODELS_BUCKET.get(key);
        
        if (!object) {
          return new Response(JSON.stringify({
            error: "Not found",
            message: `File not found: ${key}`
          }), {
            status: 404,
            headers: { 
              ...headers, 
              "Content-Type": "application/json" 
            }
          });
        }

        const objectHeaders = {
          ...headers,
          "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
          "Content-Length": object.size?.toString() || "0",
          "ETag": object.etag || "",
          "Cache-Control": "public, max-age=31536000"
        };

        if (method === "HEAD") {
          return new Response(null, { 
            status: 200, 
            headers: objectHeaders 
          });
        }

        return new Response(object.body, { 
          status: 200, 
          headers: objectHeaders 
        });
      }

      // PUT - Upload file
      if (method === "PUT") {
        const contentType = request.headers.get("Content-Type") || "application/octet-stream";
        const body = await request.arrayBuffer();

        if (body.byteLength === 0) {
          return new Response(JSON.stringify({
            error: "Bad request",
            message: "Empty file"
          }), {
            status: 400,
            headers: { 
              ...headers, 
              "Content-Type": "application/json" 
            }
          });
        }

        await env.MODELS_BUCKET.put(key, body, {
          httpMetadata: { contentType }
        });

        return new Response(JSON.stringify({
          ok: true,
          path: `/${key}`,
          size: body.byteLength,
          message: "Upload successful"
        }), {
          status: 200,
          headers: { 
            ...headers, 
            "Content-Type": "application/json" 
          }
        });
      }

      // DELETE - Delete file
      if (method === "DELETE") {
        await env.MODELS_BUCKET.delete(key);
        
        return new Response(JSON.stringify({
          ok: true,
          deleted: `/${key}`,
          message: "Delete successful"
        }), {
          status: 200,
          headers: { 
            ...headers, 
            "Content-Type": "application/json" 
          }
        });
      }

      return new Response(JSON.stringify({
        error: "Method not allowed",
        message: `Method ${method} is not supported`
      }), {
        status: 405,
        headers: { 
          ...headers, 
          "Content-Type": "application/json" 
        }
      });

    } catch (err) {
      console.error("Worker error:", err);
      return new Response(JSON.stringify({
        error: "Internal server error",
        message: err.message || "Unknown error",
        stack: err.stack
      }), {
        status: 500,
        headers: { 
          ...headers, 
          "Content-Type": "application/json" 
        }
      });
    }
  }
};
