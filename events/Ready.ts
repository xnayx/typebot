import { ExtendedClient } from "../structures/Client";
import { Events } from "../structures/Event";
import mongoose from "mongoose";

export default class Ready extends Events {
    constructor(client: ExtendedClient) {
        super(client, "ready");
    }

    run() {
        this.client.Loggers.log("Logged in client: "+this.client.user?.tag);
        mongoose.connect("").then(async () => {
            this.client.Loggers.log("conectado a MongoDB");
        }).catch((err: Error) => {
            this.client.Loggers.error(err);
        });
    }
}
