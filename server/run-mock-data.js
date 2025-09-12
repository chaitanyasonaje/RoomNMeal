const { generateAllMockData } = require('./mock-data-generator');

// Run the mock data generation
generateAllMockData()
  .then(() => {
    console.log('Mock data generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error generating mock data:', error);
    process.exit(1);
  });
