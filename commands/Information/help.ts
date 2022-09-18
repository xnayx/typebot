import { Command } from "../../structures/Command";
import { EmbedBuilder, SelectMenuBuilder, SlashCommandBuilder, SelectMenuComponentOptionData, ActionRowBuilder, SelectMenuInteraction } from "discord.js";
import fs from "fs";

export default class commandC extends Command {
    constructor() {
        super({
            botPerms: false,
            userPerms: false,
            data: new SlashCommandBuilder()
                .setName("help")
                .setDescription("See the bot commands."),

            run: async ({ client, interaction }) => {
                const commands: { [key: string]: string[] } = {};
                const options: SelectMenuComponentOptionData[] = [];
                
                for(let dir of fs.readdirSync("./commands/")) {
                    for(let file of fs.readdirSync("./commands/"+dir).filter(f => f.endsWith(".ts"))) {
                        const command = await import(`../${dir}/${file}`);
                        const data = new command.default();

                        if(commands[dir]) {
                            commands[dir].push(data.options.data.name);
                        } else {
                            commands[dir] = [data.options.data.name];
                            options.push({
                                label: dir,
                                value: dir,
                                description: client.Languages.__mf("help.menu.optionDescription", {
                                    category: dir
                                })
                            });
                        }
                    }
                }

                const mainEmbed = new EmbedBuilder()
                    .setTitle(client.Languages.__("help.embeds.main.title"))
                    .setDescription(client.Languages.__mf("help.embeds.main.description", {
                        commandsSize: client.Commands.size,
                        user: interaction.user.toString()
                    }) )
                    .setColor("#00CCFF")
                    .setThumbnail(client.user?.displayAvatarURL({ size: 1024 }) || null)
                    .setTimestamp();
                
                const menu = new SelectMenuBuilder()
                    .setPlaceholder(client.Languages.__("help.embeds.main.menuText"))
                    .setCustomId("selectMenuHelp")
                    .addOptions(options);
                
                const row = new ActionRowBuilder<SelectMenuBuilder>()
                    .addComponents(menu);

                await interaction.reply({
                    embeds: [mainEmbed],
                    components: [row]
                });

                const collector = interaction.channel?.createMessageComponentCollector({
                    filter: (user) => user.user.id === interaction.user.id,
                    time: 120 * 1000
                });

                collector?.on("collect", async (int: SelectMenuInteraction) => {
                    await int.deferUpdate();
                    console.log(int.values);

                    const commandsToView = commands[int.values[0]];

                    const embed = new EmbedBuilder()
                        .setTitle(
                            client.Languages.__mf("help.embeds.commandsCategory", {
                                category: int.values[0]
                            })
                        )
                        .setDescription("`"+commandsToView.join("` `")+"`")
                        .setColor("#00CCFF")
                        .setTimestamp();
                    
                    await int.editReply({
                        embeds: [embed]
                    });
                });

                collector?.on("end", (_, reason) => {
                    if(reason === "time") {
                        interaction.editReply({
                            components: []
                        });
                    }
                });
            },
        });
    }
}