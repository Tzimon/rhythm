export abstract class BotError extends Error {
  public abstract readonly message: string;
  public readonly specialEmoji?: string;

  public toString(): string {
    return `${this.specialEmoji ?? '❌'} ${this.message}`;
  }
}
