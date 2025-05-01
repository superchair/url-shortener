export class CreateShortUrlCommand {
  constructor(
    public readonly fullUrl: string,
    public readonly shortCodeLength: number = 6
  ) {}
}
