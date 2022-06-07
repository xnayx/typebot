import { Command } from "../../structures/Command";
import { SlashCommandBuilder } from "discord.js";
import guildModel from "../../models/guild/Guild";

export default class ticket extends Command {
    constructor() {
        super({
            botPerms: ["ManageGuild"],
            userPerms: ["ManageGuild"],

            data: new SlashCommandBuilder()
                .setName("setlanguage")
                .setDescription("Set a language for bot in this guild.")
                .addStringOption((s) =>
                    s.setName("language")
                        .setDescription("Language to set.")
                        .addChoices(
                            { name: "español", value: "es" },
                            { name: "english", value: "en" }
                        )
                        .setRequired(true)
                ),

            run: async ({ client, interaction }) => {
                const language: any = interaction.options.getString("language");
                await guildModel.findOne({ guildId: interaction.guild.id })
                    .then(async (results: any) => {
                        if(results.lang === language)
                            return await interaction.reply({ content: client.Languages.__("setLang.errors.lang_already_seted"), ephemeral: true });

                        if(results) {
                            results.lang = language;
                            results.save().catch((err: Error) => client.Loggers.error(err));
                        } else {
                            const newGuild = new guildModel({
                                guildId: interaction.guild.id.toString(),
                                lang: language
                            });

                            newGuild.save().catch((err: Error) => client.Loggers.error(err));
                        }
                        client.Languages.setLocale(language);
                        setTimeout(async () =>
                            await interaction.reply({
                                content: client.Languages.__mf("setLang.results.lang_seted",
                                    { lang: language === "es" ? "español" : "english" }
                                ), ephemeral: true }),
                        500);
                    });
            },
        });
    }
}