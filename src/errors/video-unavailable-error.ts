import { BotError } from '../core/bot-error';

export class VideoUnavailableError extends BotError {
  message = 'Video unavailable';
}
