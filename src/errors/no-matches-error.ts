import { BotError } from '../core/bot-error';

export class NoMatchesError extends BotError {
  message = 'No matches';
}
