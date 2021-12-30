import { BotError } from '../core/bot-error';

export class UserNotConnectedError extends BotError {
  message = 'You have to be in a voice channel to use this command';
}
