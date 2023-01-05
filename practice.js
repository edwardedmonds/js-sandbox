// let num1 = 4;
// console.log(num1++);
// console.log(num1);

// console.log(4 ** (1 / 2)); // 2 (power of 1/2 is the same as a square root)
// console.log(8 ** (1 / 3)); // 2 (power of 1/3 is the same as a cubic root)

// let apples = "2";
// let oranges = "3";

// alert( apples + oranges ); // "23", the binary plus concatenates strings

// let apples = "2";
// let oranges = "3";

// both values converted to numbers before the binary plus
// alert( +apples + +oranges ); // 5

// the longer variant
// alert( Number(apples) + Number(oranges) ); // 5

// let greeting = 'Hello World!'.split('');

// for (eachLetter of greeting) {
//   console.log(eachLetter);
// }

// const str1 = '5';

// console.log(str1.padStart(2, '0'));
// // expected output: "05"

// const fullNumber = '2034399002125581';
// const last4Digits = fullNumber.slice(-4);
// const maskedNumber = last4Digits.padStart(fullNumber.length, '*');

// console.log(maskedNumber);
// // expected output: "************5581"

// let text = '5';
// text = text.padStart(10);

// console.log(text);

// let age = 91;

// if (age >= 14 && age <= 90) {
//   console.log('You are between 14 and 90 years old.');
// } else if (age < 14) {
//   console.log('You are under 14 years old.');
// } else {
//   console.log('You are over 90 years old.');
// }

let i = 0;
while (i++ < 5) {
  console.log(i);
}
