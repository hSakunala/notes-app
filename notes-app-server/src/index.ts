import express from "express";
import cors from "cors";

// create new express app
const app = express();

// parse the body of api request to json
app.use(express.json());
app.use(cors());

// ui will call this to get the notes
app.get("/api/notes", async (req, res) => {
    res.json({ message: "success!" });
});


app.listen(5000, () => {
    console.log("server running on localhost:5000")
});

