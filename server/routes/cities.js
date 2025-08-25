const express = require('express');
const { indianCities, getCityById, getCitiesByTier, getCitiesByState, searchCities, getPopularCities, getNearbyCities } = require('../utils/indianCities');

const router = express.Router();

// Get all cities
router.get('/', async (req, res) => {
  try {
    const { tier, state, search, popular, nearby } = req.query;
    
    let cities = [...indianCities];

    // Filter by tier
    if (tier) {
      cities = getCitiesByTier(parseInt(tier));
    }

    // Filter by state
    if (state) {
      cities = getCitiesByState(state);
    }

    // Search cities
    if (search) {
      cities = searchCities(search);
    }

    // Get popular cities (tier 1)
    if (popular === 'true') {
      cities = getPopularCities();
    }

    // Get nearby cities
    if (nearby && req.query.lat && req.query.lng) {
      const lat = parseFloat(req.query.lat);
      const lng = parseFloat(req.query.lng);
      const radius = req.query.radius ? parseFloat(req.query.radius) : 100;
      cities = getNearbyCities(lat, lng, radius);
    }

    res.json({
      success: true,
      count: cities.length,
      cities: cities.map(city => ({
        id: city.id,
        name: city.name,
        state: city.state,
        tier: city.tier,
        description: city.description,
        coordinates: city.coordinates,
        collegesCount: city.colleges.length,
        techCompaniesCount: city.techCompanies.length
      }))
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get city by ID
router.get('/:cityId', async (req, res) => {
  try {
    const city = getCityById(req.params.cityId);
    
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    res.json({
      success: true,
      city: {
        id: city.id,
        name: city.name,
        state: city.state,
        tier: city.tier,
        description: city.description,
        coordinates: city.coordinates,
        colleges: city.colleges,
        techCompanies: city.techCompanies
      }
    });
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get colleges in a city
router.get('/:cityId/colleges', async (req, res) => {
  try {
    const city = getCityById(req.params.cityId);
    
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    res.json({
      success: true,
      city: city.name,
      colleges: city.colleges
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get tech companies in a city
router.get('/:cityId/companies', async (req, res) => {
  try {
    const city = getCityById(req.params.cityId);
    
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    res.json({
      success: true,
      city: city.name,
      techCompanies: city.techCompanies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get states
router.get('/states/list', async (req, res) => {
  try {
    const states = [...new Set(indianCities.map(city => city.state))].sort();
    
    res.json({
      success: true,
      states: states
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get cities by state
router.get('/state/:stateName', async (req, res) => {
  try {
    const cities = getCitiesByState(req.params.stateName);
    
    res.json({
      success: true,
      state: req.params.stateName,
      count: cities.length,
      cities: cities.map(city => ({
        id: city.id,
        name: city.name,
        tier: city.tier,
        description: city.description
      }))
    });
  } catch (error) {
    console.error('Error fetching cities by state:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
