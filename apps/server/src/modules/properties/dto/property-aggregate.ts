export class PropAggregate {
  count: number;
  totalArea: number;
  avgArea: number;
  minArea: number;
  maxArea: number;
  floors: number;
  entrances: number;
}

export class PropAggregateResponse {
  living: PropAggregate;
  commercial: PropAggregate;
  parking: PropAggregate;
}

export class PropCounts {
  living: number;
  commercial: number;
  parking: number;
}
