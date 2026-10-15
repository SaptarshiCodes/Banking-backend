import dns from "dns";
dns.setServers(["1.1.1.1","8.8.8.8"])

import app from "./src/app.js";
import { ENV } from "./src/lib/env.js";
import { connectDB } from "./src/lib/db.js";

const PORT = ENV.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
};

startServer();
