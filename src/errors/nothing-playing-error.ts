import { BotError } from '../core/bot-error';

export class NothingPlayingError extends BotError {
  message = 'Nothing playing in your server';
}
