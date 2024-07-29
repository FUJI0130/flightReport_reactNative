// src/domain/shared/valueObjects/Date.ts
import {BaseValueObject} from '../BaseValueObject';

interface FlightDateProps {
  value: string; // Use string to store date in ISO format
}

export class FlightDate extends BaseValueObject<FlightDateProps> {
  private constructor(props: FlightDateProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  protected validate(props: FlightDateProps): void {
    if (!this.isValidDate(props.value)) {
      throw new Error('Invalid date format');
    }
  }

  private isValidDate(date: string): boolean {
    return !isNaN(Date.parse(date));
  }

  public static create(date: string): FlightDate {
    return new FlightDate({value: date});
  }
}
