export class ShortCodeCollisionError extends Error {
  constructor(
    public readonly userId: string,
    public readonly shortCode: string,
    message: string = 'A short code collision occurred while saving the Short URL aggregate.'
  ) {
    super(message)
  }
}
