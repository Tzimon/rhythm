import { BotError } from '../core/bot-error';

export class EmptyQueueError extends BotError {
  message = 'The queue is empty';
}
