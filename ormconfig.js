function env(key, defaulValue) {
  return process.env[key] ?? defaulValue;
}

module.exports = {
  type: "mysql",
  //database config Azure
  host: process.env.DB_HOST,
  port: parseInt(`${process.env.DB_PORT}`),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  synchronize: false,
  logger: "advanced-console",
  logging: env("NODE_ENV") === "production" ? ["error", "warn"] : "all",
  cache: true,
  dropSchema: false,
  entities: env("NODE_ENV") !== "test" ? ["dist/apps/modules/entities/*.js"] : ["src/apps/modules/entities/*.ts"],
  migrations: ["dist/migration/**/*.js"],
  subscribers: ["dist/subscriber/**/*.js"],
  cli: {
    entitiesDir: "dist/models",
    migrationsDir: "dist/migration",
    subscribersDir: "dist/subscriber",
  },
};
