const apiKey = 'AIzaSyBue6uh01GUtoeoMgMDtveqVwlWH9Hp5v8';
const radius = 500;
async function getPlacesAutocomplete(query, lat, long) {
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${apiKey}&language=en&types=establishment&location=${lat},${long}&radius=${radius}&strictbounds`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const responseJson = await response.json();
  return responseJson;
}

export { getPlacesAutocomplete };
