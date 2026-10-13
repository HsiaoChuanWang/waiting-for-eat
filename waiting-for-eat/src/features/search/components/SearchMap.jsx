/* eslint-disable react/prop-types */
import { GoogleMap } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import "./SearchMap.css";

const MAP_OPTIONS = {
  disableDefaultUI: true,
  clickableIcons: false,
  zoomControl: true,
  mapTypeControl: false,
};

function SearchMap({ center, results }) {
  const [map, setMap] = useState(null);
  const markersRef = useRef([]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  }, []);

  useEffect(() => {
    clearMarkers();
    if (!map) return;

    const infoWindow = new window.google.maps.InfoWindow();

    markersRef.current = results.map((restaurant, index) => {
      const marker = new window.google.maps.Marker({
        title: restaurant.name,
        label: `${index + 1}`,
        map,
        position: { lat: restaurant.lat, lng: restaurant.lng },
      });

      marker.addListener("mouseover", () => {
        infoWindow.close();
        infoWindow.setContent(`
          <div class="modal" style="width: 250px">
            <div class="modal-body">
              <h3 class="modal-title" style="font-size: 16px; font-weight: 700; margin-top: 8px; margin-bottom: 8px">${restaurant.name}</h3>
              <p class="total" style="margin-top: 8px; margin-bottom: 8px">${restaurant.city}${restaurant.district}${restaurant.address}</p>
              <p class="remain" style="margin-top: 10px; margin-bottom: 8px">${restaurant.phone}</p>
            </div>
          </div>
        `);
        infoWindow.open(map, marker);
      });

      marker.addListener("mouseout", () => infoWindow.close());
      return marker;
    });

    return () => {
      infoWindow.close();
      clearMarkers();
    };
  }, [clearMarkers, map, results]);

  const handleMapLoad = useCallback((loadedMap) => setMap(loadedMap), []);
  const handleMapUnmount = useCallback(() => {
    clearMarkers();
    setMap(null);
  }, [clearMarkers]);

  return (
    <GoogleMap
      zoom={14}
      center={center}
      mapContainerClassName="map-container"
      options={MAP_OPTIONS}
      onLoad={handleMapLoad}
      onUnmount={handleMapUnmount}
    />
  );
}

export default SearchMap;
