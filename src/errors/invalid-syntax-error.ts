import { BotError } from '../core/bot-error';

export class InvalidSyntaxError extends BotError {
  message = 'Invalid syntax';
  specialEmoji = '🥴';
}
