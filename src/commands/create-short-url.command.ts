export class CreateShortUrlCommand {
  constructor(
    public readonly name: string,
    public readonly phoneNumber: string
  ) {}
}
