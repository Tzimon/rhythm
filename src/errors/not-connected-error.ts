import { BotError } from '../core/bot-error';

export class NotConnectedError extends BotError {
  message = 'I am not connected to a voice channel';
}
