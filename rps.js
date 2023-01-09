import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';
import fs from 'fs';

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
  fs.writeFileSync('scoreCard.json', JSON.stringify(scoreCard));
}

function computerChoice() {
  let choices = ['rock', 'paper', 'scissors'];
  let computerSelection = Math.floor(Math.random() * 3);
  return choices[computerSelection];
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
      return chalk.blue('tie!'.toUpperCase());
    case 'win':
      scoreCard.playerWins++;
      return chalk.green(`${scoreCard.playerName} wins!`.toUpperCase());
    case 'loss':
      scoreCard.computerWins++;
      return chalk.magenta('computer wins!'.toUpperCase());
  }
}

function getResult(playerSelection, computerSelection) {
  const results = new Map();
  results.set('rock', {
    rock: 'tie',
    scissors: 'win',
    paper: 'loss',
  });
  results.set('paper', {
    rock: 'loss',
    scissors: 'tie',
    paper: 'win',
  });
  results.set('scissors', {
    rock: 'win',
    scissors: 'loss',
    paper: 'tie',
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
