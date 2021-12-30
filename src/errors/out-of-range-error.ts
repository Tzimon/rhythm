import { BotError } from '../core/bot-error';

export class OutOfRangeError extends BotError {
  message: string;
  specialEmoji = '🤡';

  public constructor(minimum: number, maximum: number) {
    super();
    this.message = `Number is out of range: [${minimum}; ${maximum}]`;
  }
}
