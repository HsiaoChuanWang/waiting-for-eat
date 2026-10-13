function geocodeAddress(address) {
  const geocoder = new window.google.maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode({ address, region: "TW" }, (results, status) => {
      if (status !== "OK" || results.length === 0) {
        resolve(null);
        return;
      }

      resolve({
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      });
    });
  });
}

export { geocodeAddress };
