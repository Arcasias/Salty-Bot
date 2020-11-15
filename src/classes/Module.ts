import Event from "./Event";

export default class Module {
  public async onChannelDelete(event: Event<"channelDelete">): Promise<any> {}

  public async onError(event: Event<"error">): Promise<any> {}

  public async onGuildCreate(event: Event<"guildCreate">): Promise<any> {}

  public async onGuildDelete(event: Event<"guildDelete">): Promise<any> {}

  public async onGuildMemberAdd(event: Event<"guildMemberAdd">): Promise<any> {}

  public async onGuildMemberRemove(
    event: Event<"guildMemberRemove">
  ): Promise<any> {}

  public async onReady(event: Event<"ready">): Promise<any> {}

  public async onMessage(event: Event<"message">): Promise<any> {}
}
