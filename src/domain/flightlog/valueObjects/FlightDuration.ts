// src/domain/shared/valueObjects/FlightDuration.ts
import {BaseValueObject} from '../../shared/BaseValueObject';

interface FlightDurationProps {
  value: number; // Duration in minutes
}

export class FlightDuration extends BaseValueObject<FlightDurationProps> {
  private constructor(props: FlightDurationProps) {
    super(props);
    this.validate(props);
  }

  protected validate(props: FlightDurationProps): void {
    if (props.value <= 0) {
      throw new Error('Flight duration must be positive');
    }
  }

  public static create(duration: number): FlightDuration {
    return new FlightDuration({value: duration});
  }

  public toString(): string {
    return `${this.props.value} minutes`;
  }
}
