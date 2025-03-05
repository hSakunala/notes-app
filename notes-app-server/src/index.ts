import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// create new express app
const app = express();

// create new prisma client that was genderated from pushing db to supabase
const prisma = new PrismaClient();

// parse the body of api request to json
app.use(express.json());
app.use(cors());

// ui will call this to get the notes
app.get("/api/notes", async (req, res) => {

    // use prisma client to access note model and get all of the notes
    const notes = await prisma.note.findMany();

    // return notes as json
    res.json(notes);
});


app.listen(5000, () => {
    console.log("server running on localhost:5000")
});

