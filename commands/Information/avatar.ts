import { Command } from "../../structures/Command";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default class commandC extends Command {
    constructor() {
        super({
            botPerms: ["SendMessages", "AttachFiles"],
            userPerms: false,
            data: new SlashCommandBuilder()
                .setName("avatar")
                .setDescription("View a member's avatar.")
                .addUserOption(o =>
                    o.setName("member")
                        .setDescription("the member who will show his avatar.")
                        .setRequired(false)
                ),

            run: async ({ client, interaction }) => {
                const user = interaction.options.getUser("member", false) || interaction.user;
                const embed = new EmbedBuilder()
                    .setTitle(client.Languages.__mf("avatar.results.avatar_title", { user: user.username }) )
                    .setImage(user?.displayAvatarURL({ size: 4096 }))
                    .setColor("Random")
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            },
        });
    }
}