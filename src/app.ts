import "reflect-metadata";
import "dotenv/config";
import "module-alias/register";

import logger from "@shared/utils/logger";
import express from "express";
import http from "http";
import bootstrapApp, { setErrorHandler } from "./bootstrap";
import routes from "./shared/routes/index.routes";
import RouteVersion from "@config/route.config";

class App {
  private app: express.Application;
  private server: http.Server;

  constructor() {
    this.app = express();

    bootstrapApp(this.app);

    this.registerModules();

    setErrorHandler(this.app);

    this.server = http.createServer(this.app);
  }

  private registerModules() {
    this.app.use(express.json());
    // this.app.use(routes.app); // Register your main app routes
    // this.app.use(routes.health); // Register health check routes
    this.app.use(`${RouteVersion.v1}/merchant`, routes.merchant);
    this.app.use(`${RouteVersion.v1}/user`, routes.user);
    this.app.use(`${RouteVersion.v1}/login`, routes.login);
    this.app.use(`${RouteVersion.v1}/upload`, routes.upload);
    this.app.use(`${RouteVersion.v1}/product`, routes.product);
    this.app.use(`${RouteVersion.v1}/order`, routes.order);
  }

  public getInstance() {
    return this.app;
  }

  public async close() {
    if (this.server) {
      this.server.close();
    }
  }

  public listen(port: number, address = "0.0.0.0") {
    return this.server.listen(port, address, () => {
      logger.info(`Server listening on ${address}:${port}`);
    });
  }
}

export default App;
