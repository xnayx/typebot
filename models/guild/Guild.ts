import { Schema, model } from "mongoose";

const Model = model<Guild>(
    "Guild",
    new Schema({
        guildId: String,
        lang: String
    })
);

interface Guild {
    guildId: string;
    lang: string;
}

export default Model;