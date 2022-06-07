import {
    Interaction,
    ChatInputCommandInteraction,
} from "discord.js";

import { ExtendedClient } from "../structures/Client";
import { Events } from "../structures/Event";
import guildModel from "../models/guild/Guild";

export default class interaction extends Events {
    constructor(client: ExtendedClient) {
        super(client, "interactionCreate");
    }
    public async run(
        interaction:
			| Interaction<"cached">
			| ChatInputCommandInteraction<"cached">
    ) {

        if (interaction.isCommand()) {
            const { commandName: name } = interaction;
            const Guild: any = interaction.guild;

            await guildModel.findOne({guildId: Guild.id }).then(async (results: any) => {
                if(results)
                    Guild.lang = results.lang;
                else {
                    const newGuild = new guildModel({
                        guildId: Guild.id.toString(),
                        lang: "es"
                    });

                    newGuild.save().catch((err: Error) => this.client.Loggers.error(err));
                }

                Guild.lang ? this.client.Languages.setLocale(Guild.lang) : this.client.Languages.setLocale("es");
            }).catch(err => this.client.Loggers.error(err));

            const cmd: any =  this.client.Commands.get(name);

            
            // permissions
            if(cmd.botPerms && !Guild.me.permissions.has(cmd.botPerms))
                return await interaction.reply({ content: this.client.Languages.__mf("general.errors.not_permissions_bot", { permissions: cmd.botPerms }) });
            
            if(cmd.userPerms && !interaction.member.permissions.has(cmd.userPerms))
                return await interaction.reply({ content: this.client.Languages.__mf("general.errors.not_permissions_user", { permissions: cmd.userPerms }) });

            // if maintenance mode
            if(cmd.maintenance && interaction.user.id !== this.client.Config.dev)
                return await interaction.reply({ content: this.client.Languages.__mf("general.errors.maintenance", { command: name }) });

            cmd.run({ client: this.client, interaction });

        }

    }
}