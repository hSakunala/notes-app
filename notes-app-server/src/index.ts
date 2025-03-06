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

// endpoint to create a note
app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;

    // Error handeling for empty title or content
    if (!title || !content) {
        res
            .status(400) // status 400 indicates error
            .send("title and content fields required");
        return;
    };

    try {

        // call prisma client and use create func to create new note
        const note = await prisma.note.create({
            data: { title, content }
        })

        // return note as json
        res.json(note);

    } catch (error) {
        res
            .status(500)
            .send("Oops something went wrong");
    };
});

// endpoint to update a note, specify the id with ':'
app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id) // get the id from the query parameter and parse as int

    if (!title || !content) {
        res
            .status(400) // status 400 indicates error
            .send("title and content fields required");
        return;
    };

    if (!id || isNaN(id)) {
        res
            .status(400)
            .send("ID must be a valid number");
        return;
    };

    // try to update the note with the selected id and catch errors
    try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content }
        });
        res.json(updatedNote);
    } catch (error) {
        res
            .status(500)
            .send("Oops, something went wrong");
        return;
    }
});

app.listen(5000, () => {
    console.log("server running on localhost:5000")
});

