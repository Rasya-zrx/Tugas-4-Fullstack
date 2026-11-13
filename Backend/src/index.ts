import "dotenv/config";
import express, { type Application } from "express";
import { sql } from "drizzle-orm";
import swaggerUi from "swagger-ui-express";
import { getDb } from "./db/index.ts";
import { stallRouter } from "./routes/stallRouter.ts";
import { authRouter } from "./routes/authRouter.ts";
import { notFoundHandler } from "./middlewares/notfound.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { openApiDocument } from "./docs/openapi.ts";
import cors from "cors";

const app: Application = express();
const PORT = Number(process.env.PORT ?? 3000);
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(cors());
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get("/health", async (_req, res) => {
  const db = await getDb();
  await db.execute(sql`SELECT 1 AS ok`);
  res.status(200).json({ status: "success", message: "Server dan database terhubung" });
});

app.use("/api/v1/stalls", stallRouter);
app.use("/api/v1/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`Dokumentasi API: http://localhost:${PORT}/docs`);
});
