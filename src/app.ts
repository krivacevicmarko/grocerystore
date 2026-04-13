import "reflect-metadata";
import express, {Application, Request, Response, NextFunction} from "express"
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"

const app: Application = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({status: "ok"});
});

app.use((req: Request, res: Response) => {
    res.status(404).json({message: "Route not found"});
});

app.use((err: any, req: Request, res: Response, next:NextFunction) => {
    const status = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(status).json({message});
});

export default app;

