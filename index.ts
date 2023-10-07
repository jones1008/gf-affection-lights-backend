import { Database } from "bun:sqlite";

console.info(`serving at http://localhost:3006`)

Bun.serve({
    port: 3006,
    fetch(req) {
        const reqUrl = new URL(req.url);
        if (reqUrl.pathname === "/send-affection-sms") {
            const message = reqUrl.searchParams.get("message");
            if (message) {
                const db = new Database("api-access.sqlite", { create: true });
                // check if last_access is older than 2 minutes
                const checkRes = db.query(`
                    SELECT last_access as lastAccess FROM api_access WHERE (strftime('%s', 'now') - strftime('%s', last_access)) < 120;
                `).all()

                // when a record is found, then return error to wait 2 minutes
                if (checkRes.length > 0 && checkRes.at(-1).lastAccess) {
                    db.close();
                    return new Response(null, {
                        status: 409,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json'
                        }
                    });
                } else {
                    // when no record is found then save current date to db and trigger sms API
                    db.query(`
                        INSERT INTO api_access(last_access) VALUES(datetime('now'))
                    `).run();
                    db.close();

                    const url = new URL("https://platform.clickatell.com/messages/http/send");
                    url.searchParams.append("apiKey", Bun.env.CLICKATELL_API_KEY?.toString());
                    url.searchParams.append("to", Bun.env.SMS_RECIPIENT?.toString());
                    url.searchParams.append("content", message);
                    return fetch(url);
                }
            } else {
                return new Response("searchParam `message` is missing", { status: 400 });
            }
        }
    },
});
