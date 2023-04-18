import { useEffect, useState } from 'react';
import { Map, Draggable, Point, Marker } from 'pigeon-maps';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  location: Point | undefined;
  onSelectLocation: (latitude: number, longitude: number) => void;
}

export default function SelectLocationDialog({ open, onClose, location, onSelectLocation }: Props) {
  const [anchor, setAnchor] = useState<Point | undefined>(undefined);

  const handleSelect = () => {
    anchor && onSelectLocation(anchor[0], anchor[1]);
    onClose();
  };

  useEffect(() => {
    if (location) {
      setAnchor(location);
    } else {
      navigator.geolocation.getCurrentPosition((pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        setAnchor([latitude, longitude]);
      });
    }
  }, [location]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Выбор местоположения</DialogTitle>
      <DialogContent>
        <Map width={500} height={400} center={anchor} defaultZoom={15}>
          <Draggable offset={[25, 55]} anchor={anchor} onDragEnd={setAnchor}>
            <Marker anchor={anchor} color='#2e87eb' width={50} />
          </Draggable>
        </Map>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Отмена</Button>
        <Button onClick={handleSelect}>Подтвердить</Button>
      </DialogActions>
    </Dialog>
  );
}
