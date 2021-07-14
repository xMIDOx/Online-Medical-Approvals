export class UserToken {
  constructor(
    public email: string,
    public _token: string,
    public _tokenExpirationDate: Date,
    public roles: string[]
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
      return null;

    return this._token;
  }
}
