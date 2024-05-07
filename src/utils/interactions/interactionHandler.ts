import {
  BaseCommandInteraction,
  ButtonInteraction,
  CacheType,
  GuildCacheMessage,
  InteractionReplyOptions,
  MessageOptions,
  ModalSubmitInteraction,
  SelectMenuInteraction,
} from "discord.js";

type InteractionTypes =
  | ButtonInteraction
  | ModalSubmitInteraction
  | BaseCommandInteraction
  | SelectMenuInteraction;

type EmbedTypes = NonNullable<MessageOptions["embeds"]>;

export interface InteractionHandlerInterface {
  embeds(...embeds: EmbedTypes | EmbedTypes[]): InteractionHandlerInterface;
  processing(customText?: string | null, options?: InteractionReplyOptions): Promise<void>;
  followUp(options?: InteractionReplyOptions): Promise<GuildCacheMessage<CacheType>>;
  reply(options?: InteractionReplyOptions): Promise<void>;
  editReply(options?: InteractionReplyOptions): Promise<GuildCacheMessage<CacheType>>;
}

export default class InteractionHandler implements InteractionHandlerInterface {
  private interaction: InteractionTypes;
  private _embeds: EmbedTypes = [];

  constructor(interaction: InteractionTypes) {
    this.interaction = interaction;
  }

  // Add embeds to the handler
  embeds(...embeds: EmbedTypes | EmbedTypes[]): InteractionHandler {
    // ? reset embeds
    this._embeds = [];
    // ? Flatten in case it's an array of arrays
    const flattened = embeds.flat();
    this._embeds.push(...flattened);
    return this;
  }

  async processing(
    customText: string | null = null,
    options?: InteractionReplyOptions,
  ): Promise<void> {
    let displayedText = "Processing...";
    if (customText !== null) displayedText = customText;

    return this.interaction.reply({
      ephemeral: true,
      content: `:hourglass_flowing_sand: ${displayedText}`,
      ...options,
    });
  }

  async followUp(options?: InteractionReplyOptions): Promise<GuildCacheMessage<CacheType>> {
    return this.interaction.followUp({
      embeds: this._embeds,
      ephemeral: true,
      ...options,
    });
  }

  async reply(options?: InteractionReplyOptions): Promise<void> {
    return this.interaction.reply({
      embeds: this._embeds,
      ephemeral: true,
      ...options,
    });
  }

  async editReply(options?: InteractionReplyOptions): Promise<GuildCacheMessage<CacheType>> {
    return this.interaction.editReply({
      embeds: this._embeds,
      content: " ",
      ...options,
    });
  }
}
