// utils/geocode.js
const axios = require('axios');

const client = axios.create({
  baseURL: 'https://us1.locationiq.com/v1', // LocationIQ base URL
  timeout: 10000
});

const getCoordinates = async (address) => {
  try {
    // Make API request (like client.geocode in Google Maps)
    const response = await client.get('/search', {
      params: {
        key: process.env.LOCATIONIQ_KEY, // your LocationIQ API key
        q: address,                        // the address to geocode
        format: 'json',
        limit: 1                           // only the first result
      }
    });

    console.log(response.data); // log full response for debugging

    if (Array.isArray(response.data) && response.data.length > 0) {
      const first = response.data[0];
      return {
        lat: parseFloat(first.lat),
        lng: parseFloat(first.lon)
      }; // mimic Google Maps {lat, lng}
    }

    return null; // no results found

  } catch (err) {
    console.error("Geocoding Error:", err.response?.data || err.message);
    return null;
  }
};

module.exports = getCoordinates;
