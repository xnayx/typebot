import { Client, Collection } from "discord.js";
import * as fs from "fs";
import config from "../configs/config.json";
import { I18n } from "i18n";
import path from "path";
import Logger from "../util/loggers";

export class ExtendedClient extends Client {
    constructor() {
        super({
            intents: [
                "Guilds",
                "GuildMembers",
                "GuildBans",
                "GuildIntegrations",
                "GuildWebhooks",
                "GuildInvites",
                "GuildVoiceStates",
                "GuildPresences",
                "GuildMessages",
                "GuildMessageReactions",
                "DirectMessages",
                "DirectMessageReactions",
            ],
        });
    }

    public Commands: Collection<string, any> = new Collection();
    public Languages: I18n = new I18n();
    public Loggers = new Logger();
    public Config = config;

    public init() {
        this.login(this.Config.token);
        fs.readdirSync("./commands/").forEach((dir) => {      
            fs.readdirSync(`./commands/${dir}`).forEach(async (file) => {
                this.Loggers.log(dir+"/"+file);
                if (!file.endsWith(".ts"))
                    return;

                const command = await import(`../commands/${dir}/${file}`);
                const data = new command.default();        

                this.Commands.set(data.options.data.name, data);
            });
        });
        this.events();

        // start i18n
        
        this.Languages.configure({
            locales: ["es", "en"],
            // eslint-disable-next-line no-undef
            directory: path.join(__dirname, "../locales"),
            defaultLocale: "es",
            retryInDefaultLocale: true,
            objectNotation: true,
            // eslint-disable-next-line no-undef
            register: global,

            logWarnFn: (wr) => this.Loggers.warn(wr),

            logErrorFn: (err) => this.Loggers.error(err),

            missingKeyFn: (_locale, value) => {
                return value;
            },

            mustacheConfig: {
                tags: ["{{", "}}"],
                disable: false
            }
        });

        this.Languages.setLocale("es");
    }


    public uploadCmds() {
        this.login(this.Config.token);
        this.commands();
    
    }

    private commands() {
        const cmds: Array<any> = [];
        fs.readdirSync("./commands/").forEach((dir) => {   
            fs.readdirSync(`./commands/${dir}`).forEach(async (file) => {
                this.Loggers.log(dir+"/"+file);
                if (!file.endsWith(".ts"))
                    return;

                const command = await import(`../commands/${dir}/${file}`);
                const data = new command.default();        

                cmds.push(data.options.data.toJSON());
                this.Commands.set(data.options.data.name, data);
            });
        });

        this.on("ready", () => {
            this.application?.commands.set(cmds).then(() => {
                this.Loggers.log("Commands uploaded!");
                // eslint-disable-next-line no-undef
                process.exit();
            }).catch(err => this.Loggers.error(err));
        });
    }

    private events() {
        fs.readdirSync("./events/")
            .filter((f) => f.endsWith(".ts"))
            .forEach(async file => {
                const event = await import("../events/"+file);
                const data = new event.default(this);

                if(data.once) this.once(data.name, (...args) => data.run(...args));
                else this.on(data.name, (...args) => data.run(...args));
            });
    }
}