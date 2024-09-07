import compression from "compression";
import * as dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";
import { Container } from "typedi";
import * as TypeORM from "typeorm";
import route from "./routes";
import cors = require("cors");
import { ApolloServer } from "apollo-server-express";
import { GraphQLError, GraphQLFormattedError } from "graphql";
//nằm ở đây và chiếm bộ nhớ. có thể gây ra conflict khi đặt.
import buildSchema from "./apps/modules/graphql/schema";
import { configBot } from "./apps/loggers/telegram.log";

dotenv.config();

// register 3rd party IOC container
TypeORM.useContainer(Container);

const bootstrap = async () => {
  try {
    const app = express();

    app.use(morgan("combined"));
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // app.use(express.static(path.join(__dirname, "public")));
    // create TypeORM connection
    // await TypeORM.createConnection();

    const corsConfig = {
      methods: "GET, HEAD, PUT,PATCH,POST,DELETE,OPTIONS",
      credentials: true,
      origin: "*",
    };

    require("./dbs/init.my-sql");
    // require("./dbs/init.redis");
    configBot();
    app.use(cors(corsConfig));

    //Apolo server sẽ tạo graphql server,
    //playGround: true: có thể test các schema trực tiếp tại localhost localhos:
    const schema = await buildSchema(Container);

    const server = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
      debug: true,
      playground: true,
      formatError: (error: GraphQLError): GraphQLFormattedError => {
        if (error && error.extensions) {
          error.extensions.code = "GRAPHQL_VALIDATION_FAILED";
        }
        return error;
      },
    });

    server.applyMiddleware({ app, cors: corsConfig });
    route(app);
    let port = 3003;
    const serverVip = app.listen({ port }, () => {
      console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    });

    process.on("SIGINT", () => {
      serverVip.close(() => console.log("Exit Server Express"));
    });
  } catch (err) {
    console.error("App", err);
  }
};

bootstrap();
