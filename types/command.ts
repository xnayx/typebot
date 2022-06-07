/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */
import {  ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, PermissionResolvable } from "discord.js";
import { ExtendedClient } from "../structures/Client";

interface CommandType {
	botPerms: Array<PermissionResolvable> | false;
	userPerms: Array<PermissionResolvable> | false;
	data: SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	run({
	  client,
	  interaction,
	}: {
		client: ExtendedClient;
		interaction: ChatInputCommandInteraction<"cached">;
	}): Promise<any>;
}

export default CommandType;