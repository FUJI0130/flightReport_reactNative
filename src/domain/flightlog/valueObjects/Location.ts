// src/domain/flightlog/valueObjects/Location.ts
import {BaseValueObject} from '../../shared/BaseValueObject';

interface LocationProps {
  location: string;
  time: string;
}

export class Location extends BaseValueObject<LocationProps> {
  private constructor(props: LocationProps) {
    super(props);
  }

  get location(): string {
    return this.props.location;
  }

  get time(): string {
    return this.props.time;
  }

  protected validate(props: LocationProps): void {
    if (props.location.trim() === '') {
      throw new Error('Location cannot be empty');
    }
    if (props.time.trim() === '') {
      throw new Error('Time cannot be empty');
    }
  }

  public static create(location: string, time: string): Location {
    return new Location({location, time});
  }
}
