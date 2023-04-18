import { useEffect, useState } from 'react';
import { Map, Draggable, Point, Marker } from 'pigeon-maps';
import { styled } from '~/shared/lib/MUI';

interface Props {
  latitude: number | null;
  longitude: number | null;
  onChange: (latitude: number, longitude: number) => void;
}

const Wrapper = styled('div')(() => ({
  width: '100%',
  className: 'locationSelector',
}));

export default function LocationSelector({ latitude, longitude, onChange }: Props) {
  const [anchor, setAnchor] = useState<Point | undefined>(undefined);

  const handleChange = (point: Point) => {
    setAnchor(point);
    onChange(point[0], point[1]);
  };

  useEffect(() => {
    if (latitude && longitude) {
      setAnchor([latitude, longitude]);
    } else {
      navigator.geolocation.getCurrentPosition((pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        setAnchor([latitude, longitude]);
      });
    }
  }, [latitude, longitude]);

  return (
    <Wrapper>
      <Map center={anchor} defaultZoom={15} height={250}>
        <Draggable offset={[25, 55]} anchor={anchor} onDragEnd={handleChange}>
          <Marker anchor={anchor} color='#2e87eb' width={50} />
        </Draggable>
      </Map>
    </Wrapper>
  );
}
