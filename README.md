# GF affection lights backend

This is the backend of the gf affection lights. It serves an API endpoint via [Bun](https://bun.sh) (`Bun.serve()`).
This endpoint is available at `localhost:3006/send-affection-sms`.

The endpoint sends an SMS to the configured `SMS_RECIPIENT` via [clickatell](https://www.clickatell.com/).
The SMS can only be sent every two minutes. Otherwise it will return a `409 Conflict` response.

## Development setup
First install [Bun](https://bun.sh).

Then you need to copy the `.env.sample` file to the `.env` file and enter your env variables:

- `BUN_PORT` - The Port at which bun serves this backend.
- `CLICKATELL_API_KEY` - [clickatell](https://www.clickatell.com/) API key that is used to trigger the clickatell API 
- `SMS_RECIPIENT` - the recipient of the SMS to be sent

To install dependencies:

```bash
bun install
```

To run the server:

```bash
bun run index.ts
```

## Deployment
To run this on a server you first need to build and image:
```bash
docker build --tag 'gf-affection-lights-backend' .
```

After that you can run it with `--restart always` to always start when the host server starts. 
```bash
docker run --detach -p 3006:3006 --restart always 'gf-affection-lights-backend'
```

Then you probably want to configure a reverse proxy with a webserver to serve the API at `localhost:${BUN_PORT}/api`.


This project was created using `bun init` in bun v1.0.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
