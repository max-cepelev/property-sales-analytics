import { styled, Typography } from '~/shared/lib/MUI';
import { Map, Marker, Overlay, Point, ZoomControl } from 'pigeon-maps';
import { useEffect, useState } from 'react';
import { BuildingForMap } from '~/shared/models/gql/graphql';
import { PropertyClasses } from '~/shared/constants/enums';

interface Props {
  onClick: (id: number) => void;
  data: BuildingForMap[];
  selectedIds?: number[];
  zoom?: number;
  mapCenter?: Point;
}

const MapWrapper = styled('div')(() => ({
  borderRadius: '0.5rem',
  padding: 5,
  width: '100%',
  height: '50vh',
  minHeight: 300,
}));

const Tooltip = styled('div')(() => ({
  display: 'flex',
  borderRadius: '5px',
  backgroundColor: '#ffffff',
  padding: '10px 20px',
  boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.25)',
  flexDirection: 'column',
  rowGap: '5px',
  transition: 'all 0.3s',
}));

export default function BuildingsMap({ onClick, mapCenter, data, selectedIds, zoom = 12 }: Props) {
  const [center, setCenter] = useState<Point | undefined>(undefined);
  const [visibility, setVisibility] = useState(false);
  const [overlay, setOverlay] = useState<{
    anchor: [number, number] | undefined;
    payload: BuildingForMap | null;
  }>({
    anchor: undefined,
    payload: null,
  });

  const onOpenOverlay = ({ payload, anchor }: { payload: any; anchor: any }) => {
    setVisibility(true);
    setOverlay({ anchor, payload });
  };

  const onCloseOverlay = () => {
    setVisibility(false);
  };

  useEffect(() => {
    if (mapCenter) {
      setCenter(mapCenter);
    } else {
      navigator.geolocation.getCurrentPosition((pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        setCenter([latitude, longitude]);
      });
    }
  }, [mapCenter]);

  return (
    <MapWrapper>
      <Map center={center} defaultZoom={zoom}>
        <ZoomControl />
        {data.map((item) => (
          <Marker
            key={item.id}
            onClick={() => onClick(item.id)}
            width={35}
            anchor={[item.latitude!, item.longitude!]}
            payload={item}
            onMouseOver={onOpenOverlay}
            onMouseOut={onCloseOverlay}
            color={!selectedIds?.includes(item.id) ? '#2e87eb' : '#FF1B1C'}
          />
        ))}
        <Overlay anchor={overlay.anchor} offset={[0, 0]}>
          <Tooltip
            sx={{
              display: visibility ? 'inherit' : 'none',
            }}
          >
            <Typography fontWeight='bold' variant='subtitle1'>
              {overlay.payload ? overlay.payload.complexName : ''}
            </Typography>
            <Typography>{overlay.payload ? overlay.payload.name : ''}</Typography>
            <Typography>
              {overlay.payload?.propertyClass ? PropertyClasses[overlay.payload.propertyClass] : ''}
            </Typography>
          </Tooltip>
        </Overlay>
      </Map>
    </MapWrapper>
  );
}
