const NodeGeocoder = require('node-geocoder');
 
const options = {
  provider: 'here',
  apiKey: 'LMZ6R4ki2QL4pqDAkouz_nc5lnKBmG1WRRBF0BouJlA',
  formatter: null
};
 
const geocoder = NodeGeocoder(options);
 
const getLatLonfromName = async name => {
  try{
    const data = await geocoder.geocode(name);
    const latitude = data[0].latitude;
    const longitude = data[0].longitude;
    const countryCode = data[0].countryCode;
    const latlon = {latitude, longitude, countryCode};
    return latlon;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { getLatLonfromName };