import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';
import fs from 'fs';
import brain from 'brain.js';
import ora from 'ora';

const scoreCard = {
  numberOfRoundsToPlay: 0,
  numberOfRoundsPlayed: 0,
  playerName: '',
  playerWins: 0,
  computerWins: 0,
  ties: 0,
  history: [],
};

function saveScoreCard(scoreCard) {
  fs.writeFileSync('scoreCard.json', JSON.stringify(scoreCard), (error) => {
    if (error) {
      console.error(error);
      return;
    }
  });
}

// function computerChoice() {
//   let choices = ['rock', 'paper', 'scissors'];
//   let computerSelection = Math.floor(Math.random() * 3);
//   return choices[computerSelection];
// }

let net;

// This function trains the neural network on the player's past selections
async function trainNeuralNetwork() {
  // Create a new spinner
  const spinner = ora('Thinking...').start();

  // Load the data from the scoreCard.json file
  const data = await fs.promises
    .readFile('scoreCard.json', 'utf8')
    .then((data) => JSON.parse(data));

  // Create an array of all the player's past selections
  const playerSelections = data.history.map((round) => round.playerSelection);

  // Create a new neural network
  net = new brain.recurrent.LSTM();

  // Train the neural network on the player's past selections
  net.train(playerSelections, {
    iterations: 15,
  });

  // Stop the spinner
  spinner.stop();
}

// This function uses the trained neural network to predict the player's next selection
function computerChoice(playerSelections) {
  // Use the neural network to predict the player's next selection
  const prediction = net.run(playerSelections);

  // Return a random choice if the prediction is not rock, paper, or scissors
  if (!['rock', 'paper', 'scissors'].includes(prediction)) {
    return computerChoice(playerSelections);
  }

  // Return the predicted choice
  return prediction;
}

async function playerChoice() {
  const playerItemChoice = {
    type: 'list',
    name: 'playerItemSelection',
    message: 'What item do you want to pick?',
    choices: ['rock', 'paper', 'scissors'],
  };

  let playerSelection = '';

  await inquirer.prompt(playerItemChoice).then((answer) => {
    playerSelection = answer.playerItemSelection;
  });

  return playerSelection;
}

async function playRound(round, playerSelection, computerSelection) {
  const result = getResult(playerSelection, computerSelection);
  scoreCard.history.push({
    round: round,
    result: result,
    playerSelection: playerSelection,
    computerSelection: computerSelection,
  });
  switch (result) {
    case 'tie':
      scoreCard.ties++;
      return 'Tie';
      break;
    case 'win':
      scoreCard.playerWins++;
      return `${scoreCard.playerName} wins!`;
      break;
    case 'loss':
      scoreCard.computerWins++;
      return 'Computer wins!';
      break;
    default:
      return 'Tie';
  }

  // Save the updated score card after each round
  saveScoreCard(scoreCard);
}

function getResult(playerSelection, computerSelection) {
  if (!['rock', 'paper', 'scissors'].includes(playerSelection)) {
    throw new Error(`Invalid player selection: ${playerSelection}`);
  }

  if (!['rock', 'paper', 'scissors'].includes(computerSelection)) {
    throw new Error(`Invalid computer selection: ${computerSelection}`);
  }

  const results = new Map();
  results.set('rock', {
    rock: 'tie',
    scissors: 'win',
    paper: 'loss',
  });
  results.set('paper', {
    rock: 'win',
    scissors: 'loss',
    paper: 'tie',
  });
  results.set('scissors', {
    rock: 'loss',
    scissors: 'tie',
    paper: 'win',
  });

  return results.get(playerSelection)[computerSelection];
}

function whoWinsTheGame() {
  if (scoreCard.playerWins > scoreCard.computerWins) {
    console.log(
      boxen(`${scoreCard.playerName} wins the game!`.toUpperCase(), {
        padding: 1,
        borderColor: 'cyan',
      })
    );
  } else if (scoreCard.playerWins < scoreCard.computerWins) {
    console.log(
      boxen('computer wins the game!'.toUpperCase(), {
        padding: 1,
        borderColor: 'cyan',
      })
    );
  } else {
    console.log(
      boxen('tie game!'.toUpperCase(), { padding: 1, borderColor: 'cyan' })
    );
  }

  console.log(`\nGame history:`);

  let table = new Table({
    head: ['Round', 'Result', scoreCard.playerName, 'Computer'],
  });

  for (let i = 0; i < scoreCard.history.length; i++) {
    let round = scoreCard.history[i].round;
    let result = scoreCard.history[i].result;
    let playerSelection = scoreCard.history[i].playerSelection;
    let computerSelection = scoreCard.history[i].computerSelection;
    table.push([round, result, playerSelection, computerSelection]);
  }

  console.log(table.toString());
}

async function askHowManyRoundsToPlay() {
  const howManyRounds = {
    type: 'number',
    name: 'numberOfRoundsSelected',
    message: `How many rounds would you like to play ${scoreCard.playerName}?`,
    default: 5,
  };

  await inquirer.prompt(howManyRounds).then((answer) => {
    scoreCard.numberOfRoundsToPlay = answer.numberOfRoundsSelected;
  });
}

async function askForPlayerName() {
  const whatIsYourName = {
    type: 'input',
    name: 'myNameIs',
    message: 'What is your name?',
    default: 'player1',
  };

  await inquirer.prompt(whatIsYourName).then((answer) => {
    scoreCard.playerName = answer.myNameIs;
  });
}

async function playGame() {
  console.log(
    boxen('Rock! Paper! Scissors!', { padding: 1, borderColor: 'cyan' })
  );

  await askForPlayerName();

  await askHowManyRoundsToPlay();

  for (let i = 0; i < scoreCard.numberOfRoundsToPlay; i++) {
    await trainNeuralNetwork();
    await playRound(i + 1, await playerChoice(), computerChoice()).then(
      (whoWon) => {
        console.log(whoWon);
      }
    );
  }

  whoWinsTheGame();

  saveScoreCard(scoreCard);
}

playGame();
