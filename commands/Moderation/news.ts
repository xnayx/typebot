import { Command } from "../../structures/Command";
import { SlashCommandBuilder, EmbedBuilder, Attachment } from "discord.js";

export default class ticket extends Command {
    constructor() {
        super({
            botPerms: ["ManageGuild"],
            userPerms: ["ManageGuild"],

            data: new SlashCommandBuilder()
                .setName("news")
                .setDescription("anuncia un texto.")
                .addChannelOption((c) =>
                    c
                        .setName("canal")
                        .setDescription("Channel where the text will be announced.")
                        .setRequired(true)
                )
                .addStringOption((s) =>
                    s
                        .setName("titulo")
                        .setDescription("Title of announce.")
                        .setRequired(true)
                )
                .addStringOption((s) =>
                    s.setName("descripción")
                        .setDescription("description of announce.")
                        .setRequired(false)
                )
                .addStringOption(col =>
                    col.setName("color")
                        .setDescription("color of announce embed. Must be a hex color code."))
                .addStringOption((s) =>
                    s.setName("footer")
                        .setDescription("footer of announce embed.")
                        .setRequired(false)
                )
                .addAttachmentOption((a) =>
                    a.setName("imagen")
                        .setDescription("image of announce")
                        .setRequired(false)
                )
                .addBooleanOption((b) =>
                    b.setName("everyone")
                        .setDescription("you want to mention all members?")
                        .setRequired(false)
                ),

            run: async ({ interaction, client }) => {
                const canal = interaction.options.getChannel("canal", true);

                if (!canal.isTextBased() || !canal?.viewable)
                    return await interaction.reply({
                        content: client.Languages.__("general.errors.not_viewable_or_txtBased"),
                        ephemeral: true,
                    });

                const titulo: string | null = interaction.options.getString("titulo");
                const descripcion: string | null = interaction.options.getString("descripción");
                const footer: string | null = interaction.options.getString("footer");
                const img: Attachment | null = interaction.options.getAttachment("imagen");
                const color: string = "#fff";
                const regex: RegExp = /\.(jpeg|jpg|png)$/;

                if (img && !regex.test(img.attachment.toString()))
                    return await interaction.reply({
                        content: client.Languages.__("general.errors.type_images"),
                        ephemeral: true,
                    });

                const everyone = interaction.options.getBoolean("everyone");
                const embed = new EmbedBuilder().setTitle(titulo);

                descripcion ? embed.setDescription(descripcion) : null;
                footer ? embed.setFooter({ text: footer}) : null;
                img ? embed.setImage(img.attachment + "?size=4096") : null;
                color ? embed.setColor("#fff") : null;

                canal.send({ embeds: [embed], content: everyone ? "@everyone" : null });
                await interaction.reply({ content: client.Languages.__("general.results.message_sent"), ephemeral: true });
            },
        });
    }
}