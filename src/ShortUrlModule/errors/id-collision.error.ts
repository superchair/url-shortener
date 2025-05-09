export class IdCollisionError extends Error {
  constructor(
    public readonly userId: string,
    message: string = `ID collision error: ${userId}`
  ) {
    super(message)
  }
}
