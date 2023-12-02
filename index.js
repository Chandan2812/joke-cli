const fs = require('fs').promises;
const { argv, exit } = require('process');
const request = require('request');

const searchTerm = argv[2];

if (!searchTerm) {
  console.log('Please provide a search term for jokes or use "leaderboard" to see the most popular joke.');
  exit(1);
}

if (searchTerm.toLowerCase() === 'leaderboard') {
  displayLeaderboard();
} else {
  console.log(`Searching for jokes with the term: ${searchTerm}`);
  const apiUrl = `https://icanhazdadjoke.com/search?term=${searchTerm}`;

  request.get({
    url: apiUrl,
    headers: { 'Accept': 'application/json' }
  }, (error, response, body) => {
    if (error) {
      console.error('Error connecting to the API:', error);
      exit(1);
    }

    const data = JSON.parse(body);
    const jokes = data.results;

    if (jokes.length === 0) {
      console.log("No jokes found. The joke gods are taking a day off.");
      exit(0);
    }

    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    console.log('Selected joke:');
    console.log(randomJoke.joke);

    const fileName = 'jokes.txt';
    const jokeToSave = `Search Term: ${searchTerm}\nJoke: ${randomJoke.joke}\n\n`;

    fs.appendFile(fileName, jokeToSave)
      .then(() => {
        console.log('Joke saved to jokes.txt');
        exit(0);
      })
      .catch(err => {
        console.error('Error saving the joke:', err);
        exit(1);
      });
  });
}

// Leaderboard Feature

async function displayLeaderboard() {
  const fileName = 'jokes.txt';

  try {
    const fileContent = await fs.readFile(fileName, 'utf-8');
    const jokes = fileContent.split('\n\n');
    // console.log(jokes)
    if (jokes.length === 0) {
      console.log("No jokes found. The joke gods are taking a day off.");
      exit(0);
    }

    const jokeCounts = countJokes(jokes);
    const mostPopularJoke = getMostPopularJoke(jokeCounts);

    console.log('Leaderboard:');
    console.log(`Most Popular Joke: ${mostPopularJoke.joke}`);
    console.log(`Times Told: ${mostPopularJoke.count}`);
    console.log('Funny Comment: I am not Superstitious but I am a little stitious ');

    exit(0);
  } catch (err) {
    console.error('Error reading jokes.txt:', err);
    exit(1);
  }
}

function countJokes(jokes) {
  const jokeCounts = {};

  jokes.forEach(joke => {
    const key = joke.trim(); 
    jokeCounts[key] = (jokeCounts[key] || 0) + 1;
  });

  return jokeCounts;
}




function getMostPopularJoke(jokeCounts) {

  let mostPopularJoke = { joke: '', count: 0 };

  for (const joke in jokeCounts) {
    const count = jokeCounts[joke];

    if (count > mostPopularJoke.count) {

      mostPopularJoke = { joke, count };
    }
  }

  return mostPopularJoke;
}

