export abstract class BotError extends Error {
  public abstract readonly message: string;
  public readonly specialEmoji?: string;

  public toString(): string {
    return `${this.specialEmoji ?? '❌'} ${this.message}`;
  }
}

export class InvalidSyntaxError extends BotError {
  message = 'Invalid syntax';
  specialEmoji = '🥴';
}

export class NothingPlayingError extends BotError {
  message = 'Nothing playing in your server';
}

export class NoMatchesError extends BotError {
  message = 'No matches';
}

export class VideoUnavailableError extends BotError {
  message = 'Video unavailable';
}

export class NotConnectedError extends BotError {
  message = 'I am not connected to a voice channel';
}

export class UserNotConnectedError extends BotError {
  message = 'You have to be in a voice channel to use this command';
}

export class IllegalChannelTypeError extends BotError {
  message = 'I only support casual voice channels';
}

export class OutOfRangeError extends BotError {
  message: string;
  specialEmoji = '🤡';

  public constructor(minimum: number, maximum: number) {
    super();
    this.message = `Number is out of range: ${minimum} - ${maximum}`;
  }
}
