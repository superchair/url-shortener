export class ShortCodeCollisionError extends Error {
  constructor(
    public readonly userId: string,
    public readonly shortCode: string,
    message: string = `Short code collision error on id ${userId}: ${shortCode}`
  ) {
    super(message)
  }
}
