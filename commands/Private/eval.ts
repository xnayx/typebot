/* eslint-disable no-unused-vars */
import { Command } from "../../structures/Command";
import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from "discord.js";
import { inspect } from "util";

export default class Eval extends Command {
    constructor() {
        super({
            botPerms: false,
            userPerms: ["Administrator"],
            data: new SlashCommandBuilder()
                .setName("eval")
                .setDescription("evaluate a javascript expression"),

            run: async ({ client, interaction }) => {
                if(interaction.user.id !== client.Config.dev)
                    return await interaction.reply({ content: "This command is for developers only, it cannot be used.", ephemeral: true});
                
                const modal = new ModalBuilder()
                    .setCustomId("evalModal")
                    .setTitle("Evaluate a JavaScript expression");

                const code = new TextInputBuilder()
                    .setCustomId("evalCode")
                    .setLabel("Code to execute")
                    .setPlaceholder("code")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph);

                const row = new ActionRowBuilder<TextInputBuilder>().addComponents(code);

                modal.addComponents(row);

                await interaction.showModal(modal);

                const coll = await interaction.awaitModalSubmit({ time: 120000 });

                
                
                try{
                    let result = await eval(coll.fields.getTextInputValue("evalCode"));
                    result = inspect(result, { depth: 1 });

                    await coll.reply({ content: `\`\`\`js\n${result}\`\`\``, ephemeral: true});
                } catch(e){
                    await coll.reply({ content: `Error:\n\`\`\`js\n${e}\`\`\``, ephemeral: true});
                }
            },
        });
    }
}