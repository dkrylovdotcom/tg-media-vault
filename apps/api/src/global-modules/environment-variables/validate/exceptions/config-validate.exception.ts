import { ValidationError } from 'class-validator';

export class ConfigValidateException extends Error {
  private readonly error: ValidationError[];

  public name = 'ConfigValidateException';

  constructor(error: ValidationError[]) {
    super();
    this.error = error;
    this.initMessage();
  }

  public getError(): ValidationError[] {
    return this.error;
  }

  public initMessage(): void {
    this.message = (this.getError() as ValidationError[])
      .map(({ constraints = {} }) => Object.values(constraints))
      .join('\n');
  }
}
