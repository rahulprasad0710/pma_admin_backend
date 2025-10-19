import "./subscribers";

import { Server } from "socket.io";
import { connectToDatabase } from "./db/data-source";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index";
import { socketConnect } from "./config/socket.config";
import startJobs from "./jobs/jobs";

dotenv.config();
const app = express();
export const httpServer = createServer(app);

const port = Number(process.env.PORT) || 3000;

connectToDatabase();
startJobs();

app.use(express.json());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://workcentrik.publicvm.com",
        ],
        credentials: true,
    })
);
app.use(helmet());
app.use(morgan("common"));
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
    })
);

app.use(cookieParser());

// socket connect
socketConnect(httpServer);

app.get("/", (req, res) => {
    res.send("Hello from server");
});

app.use("/api", routes);

app.use(errorHandler);

// app.listen(port, "0.0.0.0", () => {
//     console.log(`Server is running on port ${port}`);
// });

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
