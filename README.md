# Joke Command Line Tool

## Overview

This is a command line tool written in Node.js that interacts with the "icanhazdadjoke" API to fetch and save jokes. It includes a leaderboard feature to display the most popular joke stored in the jokes.txt file.

## Usage

To use the tool, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Run the tool using `node index.js [searchTerm]` or `node index.js leaderboard` for the leaderboard feature.

## Command Line Arguments

- `[searchTerm]`: Specify a search term to find jokes.
- `leaderboard`: Display the most popular joke in the jokes.txt file.

## Example

```bash
# Search for jokes with the term "friend"
$ node index.js friend

# Display the leaderboard
$ node index.js leaderboard
