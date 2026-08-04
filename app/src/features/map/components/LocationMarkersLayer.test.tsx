import { fireEvent, render, screen } from '@testing-library/react-native';

import type { LocationMarkersCollection } from '../hooks/useLocationMarkers';

import { LocationMarkersLayer } from './LocationMarkersLayer';

const markers: LocationMarkersCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'loc-1',
      geometry: { type: 'Point', coordinates: [2.6, 39.5] },
      properties: {
        id: 'loc-1',
        name: 'Test Club',
        category: 'club',
        occupancyLevel: 'high',
        occupancyColor: '#E31F27',
        imageUrl: 'https://example.com/logo.png',
        isSelected: false,
      },
    },
  ],
};

describe('LocationMarkersLayer', () => {
  it('rendert ShapeSource mit der Marker-FeatureCollection und registrierten Logo-Bildern', () => {
    render(<LocationMarkersLayer markers={markers} onPressLocation={jest.fn()} />);

    const shapeSource = screen.getByTestId('MapboxShapeSource');
    expect(shapeSource.props.shape).toEqual(markers);
    expect(shapeSource.props.cluster).toBe(true);

    const images = screen.getByTestId('MapboxImages');
    expect(images.props.images).toEqual({ 'loc-1': { uri: 'https://example.com/logo.png' } });
  });

  it('ruft onPressLocation beim Tippen auf einen einzelnen Marker auf', () => {
    const onPressLocation = jest.fn();
    render(<LocationMarkersLayer markers={markers} onPressLocation={onPressLocation} />);

    fireEvent(screen.getByTestId('MapboxShapeSource'), 'press', {
      features: [{ type: 'Feature', properties: { id: 'loc-1' } }],
    });

    expect(onPressLocation).toHaveBeenCalledWith('loc-1');
  });

  it('ruft onPressLocation beim Tippen auf einen Cluster nicht auf', () => {
    const onPressLocation = jest.fn();
    render(<LocationMarkersLayer markers={markers} onPressLocation={onPressLocation} />);

    fireEvent(screen.getByTestId('MapboxShapeSource'), 'press', {
      features: [{ type: 'Feature', properties: { point_count: 5 } }],
    });

    expect(onPressLocation).not.toHaveBeenCalled();
  });
});
