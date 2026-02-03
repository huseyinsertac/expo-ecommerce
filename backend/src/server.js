import express from "express";
import path from "path";
import { ENV } from "./config/env.js";

const app = express();

app.get("/api/health", (req,res) => {
 res.status(200).json({ message: "Success" });
});

if(ENV.NODE_ENV === "production"){
	app.use(express.static(path.join(__dirname,"../admin/dist")));

	app.get("/{*any}", (req, res) => {
		res.sendFile(path.join(__dirname,"../admin","dist","index.html"));
	});
}

app.listen(ENV.PORT, () => console.log("Server is up and running"))
