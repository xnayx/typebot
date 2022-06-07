import chalk from "chalk";

export default class Logger {
    public raw(message: string) {
        console.log(message);
    }

    public log(message: string) {
        console.log(chalk.cyan("[CONSOLE]") +" "+ message);
    }

    public warn(message: string | Error) {
        console.warn(chalk.yellow("[WARNING]") +" "+ message);
    }

    public error(message: string | Error) {
        console.error(chalk.red("[ERROR]") +" "+ message);
    }
}