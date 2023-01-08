import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';

// const scoreCard = {
//   numberOfRoundsToPlay: 0,
//   numberOfRoundsPlayed: 0,
//   playerName: '',
//   playerWins: 0,
//   computerWins: 0,
//   ties: 0,
// };

const scoreCard = {
  numberOfRoundsToPlay: 0,
  numberOfRoundsPlayed: 0,
  playerName: '',
  playerWins: 0,
  computerWins: 0,
  ties: 0,
  history: [],
};

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

// async function playRound(playerSelection, computerSelection) {
//   if (playerSelection == computerSelection) {
//     scoreCard.ties++;
//     return chalk.blue('tie!'.toUpperCase());
//   } else if (
//     (playerSelection === 'rock' && computerSelection === 'scissors') ||
//     (playerSelection === 'paper' && computerSelection === 'rock') ||
//     (playerSelection === 'scissors' && computerSelection === 'paper')
//   ) {
//     scoreCard.playerWins++;
//     return chalk.green(`${scoreCard.playerName} wins!`.toUpperCase());
//   } else if (
//     (computerSelection === 'rock' && playerSelection === 'scissors') ||
//     (computerSelection === 'paper' && playerSelection == 'rock') ||
//     (computerSelection === 'scissors' && playerSelection === 'paper')
//   ) {
//     scoreCard.computerWins++;
//     return chalk.magenta('computer wins!'.toUpperCase());
//   }
// }

async function playRound(round, playerSelection, computerSelection) {
  if (playerSelection == computerSelection) {
    scoreCard.ties++;
    scoreCard.history.push({
      round: round,
      result: 'tie',
      playerSelection: playerSelection,
      computerSelection: computerSelection,
    });
    return chalk.blue('tie!'.toUpperCase());
  } else if (
    (playerSelection === 'rock' && computerSelection === 'scissors') ||
    (playerSelection === 'paper' && computerSelection === 'rock') ||
    (playerSelection === 'scissors' && computerSelection === 'paper')
  ) {
    scoreCard.playerWins++;
    scoreCard.history.push({
      round: round,
      result: 'win',
      playerSelection: playerSelection,
      computerSelection: computerSelection,
    });
    return chalk.green(`${scoreCard.playerName} wins!`.toUpperCase());
  } else if (
    (computerSelection === 'rock' && playerSelection === 'scissors') ||
    (computerSelection === 'paper' && playerSelection == 'rock') ||
    (computerSelection === 'scissors' && playerSelection === 'paper')
  ) {
    scoreCard.computerWins++;
    scoreCard.history.push({
      round: round,
      result: 'loss',
      playerSelection: playerSelection,
      computerSelection: computerSelection,
    });
    return chalk.magenta('computer wins!'.toUpperCase());
  }
}

// function whoWinsTheGame() {
//   if (scoreCard.playerWins > scoreCard.computerWins) {
//     return `${scoreCard.playerName} wins the game!`.toUpperCase();
//   } else if (scoreCard.playerWins < scoreCard.computerWins) {
//     return 'computer wins the game!'.toUpperCase();
//   } else {
//     return 'tie game!'.toUpperCase();
//   }
// }

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
    head: ['Round', 'Result', 'Player', 'Computer'],
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

// async function playGame() {
//   console.log(
//     boxen('Rock! Paper! Scissors!', { padding: 1, borderColor: 'cyan' })
//   );

//   await askForPlayerName();

//   await askHowManyRoundsToPlay();

//   while (scoreCard.numberOfRoundsPlayed < scoreCard.numberOfRoundsToPlay) {
//     await playRound(await playerChoice(), computerChoice()).then((whoWon) => {
//       console.log(whoWon);
//     });
//     scoreCard.numberOfRoundsPlayed++;
//   }

//   console.log(boxen(whoWinsTheGame(), { padding: 1, borderColor: 'cyan' }));
// }

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
}

playGame();
