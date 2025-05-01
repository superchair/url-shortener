export class IdCollisionError extends Error {
  constructor(
    public readonly userId: string,
    message: string = 'A UUID collision occurred while saving the Short URL aggregate.'
  ) {
    super(message)
  }
}
