/* eslint-disable no-unused-vars */
import { ExtendedClient } from "./Client";

export abstract class Events {
    constructor(public client: ExtendedClient, public name: string, public once: boolean = false) {}

    public abstract run(...args: any[]): any;
}