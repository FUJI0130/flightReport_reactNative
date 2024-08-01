// src/domain/shared/valueObjects/BaseValueObject.ts
export abstract class BaseValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = props;
    this.validate(props);
  }

  protected abstract validate(props: T): void;

  equals(vo?: BaseValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
