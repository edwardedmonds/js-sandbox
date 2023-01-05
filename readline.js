import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'process';

async function getUserName(user, attemptsAllowed) {
  let userName = '';
  let loginAttempts = 1;

  while (user != userName) {
    let rl = readline.createInterface({ input, output });
    userName = await rl.question('Enter your user name: ');
    rl.close();

    if (user === userName) {
      console.log(`Hello ${userName}`);
    } else {
      if (loginAttempts < attemptsAllowed) {
        console.log('Your user name is incorrect. Try again.');
        loginAttempts++;
      } else {
        console.log('You have tried to many times. Goodbye.');
        break;
      }
    }
  }
}

async function getUserPassword(pass, attemptsAllowed) {
  let password = '';
  let passAttempts = 1;

  while (pass != password) {
    let rl = readline.createInterface({ input, output });
    password = await rl.question('Enter your password: ');
    rl.close();
    if (pass === password) {
      console.log('You are now logged in.');
    } else {
      if (passAttempts < attemptsAllowed) {
        console.log('Your password is incorrect. Please try again.');
        passAttempts++;
      } else {
        console.log(
          'You have entered the wrong password too many times. Goodbye.'
        );
        break;
      }
    }
  }
}

await getUserName('admin', 3);
await getUserPassword('pass', 3);

// if (userName === 'admin') {
//   console.log(`Hello ${userName}.`);
//   const userPass = await getUserPassword();
//   if (userPass === 'admin') {
//     console.log(`You are now logged in ${userName}`);
//   } else if (userPass === '' || userPass === null) {
//     console.log('Canceled');
//   } else {
//     console.log('Your password is incorrect. Goodbye.');
//   }
// } else if (userName === '' || userName === null) {
//   console.log('Canceled');
// } else {
//   console.log(`The user: ${userName}, does not exist.`);
// }
