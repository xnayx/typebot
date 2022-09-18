import { ExtendedClient } from "./structures/Client";

new ExtendedClient().init();
// eslint-disable-next-line no-undef
process.on("unhandledRejection", (err) => {
    console.log(err);
});