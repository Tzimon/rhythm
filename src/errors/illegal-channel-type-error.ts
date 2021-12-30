import { BotError } from '../core/bot-error';

export class IllegalChannelTypeError extends BotError {
  message = 'I only support casual voice channels';
}
