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

function createPreviewContent(restaurant) {
  const container = document.createElement("div");
  container.className = "restaurant-map-preview";

  const title = document.createElement("h3");
  title.className = "restaurant-map-preview__title";
  title.textContent = restaurant.name ?? "";

  const address = document.createElement("p");
  address.textContent = `${restaurant.city ?? ""}${restaurant.district ?? ""}${restaurant.address ?? ""}`;

  const phone = document.createElement("p");
  phone.textContent = restaurant.phone ?? "";

  container.append(title, address, phone);
  return container;
}

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

    const infoWindow = new window.google.maps.InfoWindow({
      headerDisabled: true,
    });

    markersRef.current = results.map((restaurant, index) => {
      const marker = new window.google.maps.Marker({
        title: restaurant.name,
        label: `${index + 1}`,
        map,
        position: { lat: restaurant.lat, lng: restaurant.lng },
      });

      const openPreview = () => {
        infoWindow.close();
        infoWindow.setContent(createPreviewContent(restaurant));
        infoWindow.open({ anchor: marker, map });
      };

      marker.addListener("mouseover", openPreview);
      marker.addListener("mouseout", () => infoWindow.close());
      marker.addListener("click", openPreview);
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
