import * as utils from "./utils";
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    const method = request.method;
    const path = url.pathname.replace(/[/]$/, "");

    if (path !== "/api/video" && path !== "") {
      return utils.toError(
        `Unknown "${path}" URL; try "/api/video" instead.`,
        404
      );
    }

    if (path === "") {
      return utils.reply({
        hi: "just a tool",
      });
    }
    try {
      if (method === "GET") {
        const videourl = url.searchParams.get("url") || "";
        if (!videourl) {
          return utils.toError("Missing URL parameter.", 400);
        }
        let vdurl = videourl;
        if (!utils.isValidYoutubeUrl(videourl)) {
          vdurl = `https://www.youtube.com/watch?v=${videourl}`;
        }

        try {
          const response = await fetch(vdurl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const text = await response.text();
          const match = text.match(/"lengthSeconds":"(.+?)"/);
          if (match) {
            const videotime = match[1];
            return new Response(
              JSON.stringify({
                length: videotime,
                text: utils.formatDuration(videotime),
              }),
              {
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          } else {
            return new Response(
              JSON.stringify({ error: "Video length not found" }),
              {
                status: 404,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
        } catch (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }
      }
      return utils.toError("Method not allowed.", 405);
    } catch (err) {
      const msg = err.message || "Error with query.";
      return utils.toError(msg, 500);
    }
  },
};
