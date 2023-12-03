
const fs = require('fs').promises;
const process = require('process'); 
const request = require('request');

// Get the search term from the command line arguments
const searchTerm = process.argv[2];

// Check if a search term is provided
if (!searchTerm) {
  console.log('Please provide a search term for jokes or use "leaderboard" to see the most popular joke.');
  process.exit(1);  
}

// Check if the leaderboard command is used
if (searchTerm.toLowerCase() === 'leaderboard') {
  displayLeaderboard();
} else {
  // Search for jokes based on the provided term
  console.log(`Searching for jokes with the term: ${searchTerm}`);
  const apiUrl = `https://icanhazdadjoke.com/search?term=${searchTerm}`;

  // Make API request to get jokes
  request.get({
    url: apiUrl,
    headers: { 'Accept': 'application/json' }
  }, (error, response, body) => {
    if (error) {
      console.error('Error connecting to the API:', error);
    }

    const data = JSON.parse(body);
    const jokes = data.results;

    // Check if jokes are found
    if (jokes.length === 0) {
      console.log("No jokes found. The joke gods are taking a day off.");
    }

    // Select a random joke
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    console.log('Selected joke:');
    console.log(randomJoke.joke);

    // Save the joke to the jokes.txt file
    const fileName = 'jokes.txt';
    const jokeToSave = `Search Term: ${searchTerm}\nJoke: ${randomJoke.joke}\n\n`;

    fs.appendFile(fileName, jokeToSave)
      .then(() => {
        console.log('Joke saved to jokes.txt');
      })
      .catch(err => {
        console.error('Error saving the joke:', err);
      });
  });
}



// Display leaderboard 
async function displayLeaderboard() {
  const fileName = 'jokes.txt';

  try {

    const fileContent = await fs.readFile(fileName, 'utf-8');
    const jokes = fileContent.split('\n\n');

    // Check if jokes are present in the file
    if (jokes.length === 0) {
      console.log("No jokes found. The joke gods are taking a day off.");
    }


    const jokeCounts = countJokes(jokes);

    const mostPopularJoke = getMostPopularJoke(jokeCounts);

    // Display leaderboard information
    console.log('Leaderboard:');
    console.log(`Most Popular Joke: ${mostPopularJoke.joke}`);
    console.log(`Times Told: ${mostPopularJoke.count}`);
    console.log('Funny Comment: I am not Superstitious but I am a little stitious ');

  } catch (err) {
    console.error('Error reading jokes.txt:', err);
  }
}

// Function to count occurrences of each joke
function countJokes(jokes) {
  const jokeCounts = {};

  // Iterate through each joke and count occurrences
  jokes.forEach(joke => {
    const key = joke.trim(); 
    jokeCounts[key] = (jokeCounts[key] || 0) + 1;
  });

  return jokeCounts;
}

// Function to get the most popular joke
function getMostPopularJoke(jokeCounts) {
  let mostPopularJoke = { joke: '', count: 0 };

  // Iterate through each joke and find the most popular one
  for (const joke in jokeCounts) {
    const count = jokeCounts[joke];

    if (count > mostPopularJoke.count) {
      mostPopularJoke = { joke, count };
    }
  }

  return mostPopularJoke;
}
