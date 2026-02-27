import express from "express";
import dotenv from "dotenv";
import { ENV } from "./src/lib/env.js";
import cors from "cors";

const app = express();

dotenv.config();

app.use(express.json());

app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true
}))


const startServer = async () => {
  try {
    // await connectDB();
    app.listen(ENV.PORT, () =>
      console.log(`Server is running on port : ${ENV.PORT}`))
  } catch (error) {
    console.error("❌ Error in starting the server ..")
  }
}

startServer();
