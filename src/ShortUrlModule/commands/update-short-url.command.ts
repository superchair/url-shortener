export class UpdateShortUrlCommand {
  constructor(
    public readonly shortCode: string,
    public readonly fullUrl: string
  ) {}
}
