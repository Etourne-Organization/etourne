import BOT_CONFIGS from "botConfig";
import { ColorResolvable, EmbedFooterData, MessageEmbed } from "discord.js";
import errorMessageTemplate, { MessageType } from "./errorMessageTemplate";

class DefaultErrorBase {
  protected embed: MessageEmbed;

  constructor(embed?: MessageEmbed) {
    this.embed = embed || new MessageEmbed();
  }

  protected setColor(color: ColorResolvable) {
    this.embed.setColor(color);
  }

  protected updateTitle(embeddedString: string) {
    const currentTitle = this.embed.title || "";
    this.embed.setTitle(`${embeddedString} ${currentTitle}`);
  }

  get Error() {
    this.updateTitle(":warning:");
    this.setColor(BOT_CONFIGS.color.red);
    return this.embed;
  }

  get Warning() {
    this.updateTitle(":warning:");
    this.setColor(BOT_CONFIGS.color.orange);
    return this.embed;
  }

  get Question() {
    this.updateTitle(":question:");
    this.setColor(BOT_CONFIGS.color.blue);
    return this.embed;
  }

  get Success() {
    this.updateTitle(":white_check_mark:");
    this.setColor(BOT_CONFIGS.color.green);
    return this.embed;
  }

  get Info() {
    this.setColor(BOT_CONFIGS.color.blue);
    return this.embed;
  }
}

class DefaultErrorTitle extends DefaultErrorBase {
  get SHORT() {
    const { title } = errorMessageTemplate(MessageType.SHORT);
    this.embed.setTitle(title);
    return this;
  }

  get LONG() {
    const { title } = errorMessageTemplate();
    this.embed.setTitle(title);
    return this;
  }

  // Added method to enable chaining with DefaultErrorDescription
  defaultErrorDescription() {
    return new DefaultErrorDescription(this.embed);
  }
}

class DefaultErrorDescription extends DefaultErrorBase {
  get SHORT() {
    const { description } = errorMessageTemplate(MessageType.SHORT);
    if (description) {
      this.embed.setDescription(description);
    }
    return this;
  }

  get LONG() {
    const { description } = errorMessageTemplate();
    if (description) {
      this.embed.setDescription(description);
    }
    return this;
  }
}

export class CustomMessageEmbed extends DefaultErrorBase {
  constructor(title?: string, description?: string) {
    super();
    if (title) this.embed.setTitle(title).setTimestamp();
    if (description) this.embed.setDescription(description);
  }

  setTitle(title: string) {
    this.embed.setTitle(title).setTimestamp();
    return this;
  }

  setDescription(description: string) {
    this.embed.setDescription(description);
    return this;
  }

  setTimestamp(timestamp?: Date | number | null) {
    this.embed.setTimestamp(timestamp);
    return this;
  }

  setThumbnail(thumbnailUrl: string) {
    this.embed.setThumbnail(thumbnailUrl);
    return this;
  }

  setFooter(options: EmbedFooterData | null) {
    this.embed.setFooter(options);
    return this;
  }

  addFields(fields: { name: string; value: string; inline?: boolean }[]) {
    this.embed.addFields(fields);
    return this;
  }

  defaultErrorTitle() {
    return new DefaultErrorTitle(this.embed).LONG;
  }

  defaultErrorDescription() {
    return new DefaultErrorDescription(this.embed).LONG;
  }
}

export default CustomMessageEmbed;
