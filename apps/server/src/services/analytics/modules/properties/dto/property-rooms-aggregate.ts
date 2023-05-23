export class PropertyRoomsAggregate {
  count: number;
  maxArea: number;
  minArea: number;
  avgArea: number;
}

export class PropertyRoomsAggregateResponse {
  one: PropertyRoomsAggregate;
  two: PropertyRoomsAggregate;
  three: PropertyRoomsAggregate;
  four: PropertyRoomsAggregate;
}
