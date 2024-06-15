import next from "next";
import express from "express";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3010;

const app = next({ dev, hostname, port });

app
  .prepare()
  .then(() => {
    const expressApp = express();
    const handle = app.getRequestHandler();

    expressApp.all("*", (req, res) => {
      return handle(req, res);
    });

    expressApp.listen(port, () => {
      console.log(`🚀 ~ Server is listening On ~> http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
