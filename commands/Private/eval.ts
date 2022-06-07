import { Command } from "../../structures/Command";
import { SlashCommandBuilder } from "discord.js";
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

                const code: any = interaction.options.getString("code");
                
                try{
                    let result: any = await eval(code);
                    result = inspect(result, { depth: 0 });

                    await interaction.reply({ content: `\`\`\`js\n${result}\`\`\``, ephemeral: true});
                } catch(e){
                    await interaction.reply({ content: `Error:\n\`\`\`js\n${e}\`\`\``, ephemeral: true});
                }
            },
        });
    }
}