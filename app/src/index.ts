import { serve } from "@hono/node-server";
import { Hono } from "hono";
import fundsRouter from "./routes/funds/index.js";
import investorsRouter from "./routes/investors/index.js";

const app = new Hono();

app.route("/funds", fundsRouter);
app.route("/investors", investorsRouter);

app.get("/", (c) => {
    return c.text("Hello from Titanbay!");
});
app.onError((error, c) => {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
});

serve(
    {
        fetch: app.fetch,
        port: 3000,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    },
);
