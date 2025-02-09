import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./database/dbConfig.js";
import userRoutes from "./routes/user.router.js"
import orderRoutes from "./routes/order.router.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes)
app.use("/api/order", orderRoutes)

connectDB();

app.listen(process.env.PORT, () => {
    console.log("App is listening on PORT:", process.env.PORT);
})