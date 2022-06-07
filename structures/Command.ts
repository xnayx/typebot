/* eslint-disable no-unused-vars */
import CommandType from "../types/command";
import { ExtendedClient } from "./Client";
import { ChatInputCommandInteraction } from "discord.js";

export class Command {
    constructor(options: CommandType) {
        this.options = options;
        this.run = options.run;
    }
    options: CommandType;
    run: ({
        client,
        interaction,
    }: {
		client: ExtendedClient;
		interaction: ChatInputCommandInteraction<"cached">;
	}) => Promise<any>;
}