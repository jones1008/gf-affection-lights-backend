console.info(`serving at http://localhost:${Bun.env.BUN_PORT}`)

Bun.serve({
    fetch(req) {
        const reqUrl = new URL(req.url);
        if (reqUrl.pathname === "/send-affection-sms") {
            const message = reqUrl.searchParams.get("message");
            if (message) {
                const url = new URL("https://platform.clickatell.com/messages/http/send");
                url.searchParams.append("apiKey", Bun.env.CLICKATELL_API_KEY?.toString());
                url.searchParams.append("to", Bun.env.SMS_RECEIPIENT?.toString());
                url.searchParams.append("content", message);
                return fetch(url);
            } else {
                return new Response("searchParam `message` is missing", { status: 400 });
            }
        }
    },
});
