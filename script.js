'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  //text content simply returns the text itself ; innerHTML returns everything,including html .

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

function updateUI(acc) {
  //Display Movements
  displayMovements(acc.movements);
  //Display Balance
  calcDisplayBalance(acc);
  //Display Summary
  calcDisplaySummary(acc);
}

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)}`;
};

let currentAccount;
//Event Handler
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('LOGIN');
    //Display UI and message
    labelWelcome.textContent = `Welcome back , ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //clear fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add moevment
    currentAccount.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    //delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);

  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// /////////////////////////////////////////////////
// // Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// // Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// const checkDogs = function (dogsJulia, dogsKate) {
//   const copyDogsJulia = dogsJulia.slice(1, 3);
//   const allDogs = [...copyDogsJulia, ...dogsKate];
//   allDogs.forEach(function (age, index, arr) {
//     age >= 3
//       ? console.log(
//           `Dog number ${index + 1} is an adult, and is ${age} years old`
//         )
//       : console.log(`Dog number ${index + 1} is still a puppy.`);
//   });
// };

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];
// checkDogs(dogsJulia, dogsKate);

//challenge2
// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(function (dogAge) {
//     if (dogAge <= 2) return 2 * dogAge;
//     else return 16 + dogAge * 4;
//   });

//   const adults = humanAges.filter(function (age) {
//     return age > 18;
//   });

//   const average =
//     adults.reduce(function (acc, age) {
//       return acc + age;
//     }, 0) / adults.length;

//   return average;

//   console.log(humanAges);
//   console.log(adults);
//   console.log(total);
// };

//challenge3
const calcAverageHumanAge = ages =>
  // const humanAges = ages.map(function (dogAge) {
  //   if (dogAge <= 2) return 2 * dogAge;
  //   else return 16 + dogAge * 4;
  // });

  // const adults = humanAges.filter(function (age) {
  //   return age > 18;
  // });

  // const average =
  //   adults.reduce(function (acc, age) {
  //     return acc + age;
  //   }, 0) / adults.length;

  // return average;

  // console.log(humanAges);
  // console.log(adults);
  // console.log(total);
  ages
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(humanAge => humanAge > 18)
    .reduce((acc, av, index, arr) => acc + av / arr.length, 0);
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// const av1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// const av2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(av1, av2);

// const movementsUSD = account1.movements.map(mov => {});

// const withdrawals = account1.movements.filter(mov => mov < 0);

// console.log(withdrawals);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);

// console.log(max);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositsUSD);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');

// console.log(account);

// for (const acc of accounts) acc.owner === 'Jessica Davis';

//return < 0 ; A ,B (keep order)
//return > 0 ; B ,A (switch order)
//Ascending
//1
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
// //2
// movements.sort((a, b) => a - b);

// //Decending
// //1
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (b > a) return 1;
// });
// //2
// movements.sort((a, b) => b - a);

//challenge4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//   1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
// the recommended food portion and add it to the object as a new property. Do
// not create a new array, simply loop over the array. Forumla:
// recommendedFood = weight ** 0.75 * 28. (The result is in grams of
// food, and the weight needs to be in kg)
dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);

console.log(dogs);

// 2. Find Sarah's dog and log to the console whether it's eating too much or too
// little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
// the owners array, and so this one is a bit tricky (on purpose) 🤓

const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating too ${
    sarahDog.curFood > sarahDog.recommendedFood ? 'much' : 'little'
  }`
);

// 3. Create an array containing all owners of dogs who eat too much
// ('ownersEatTooMuch') and an array with all owners of dogs who eat too little
// ('ownersEatTooLittle').

// let ownersEatTooMuch = [];
// let ownersEatTooLittle = [];

// dogs.map(dog =>
//   dog.curFood > dog.recommendedFood
//     ? ownersEatTooMuch.push(...dog.owners)
//     : ownersEatTooLittle.push(...dog.owners)
// );

// console.log(ownersEatTooMuch);
// console.log(ownersEatTooLittle);

// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
// .flat();
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4. Log a string to the console for each array created in 3., like this: "Matilda and
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
// too little!"

console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much`);

console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little`);

// 5. Log to the console whether there is any dog eating exactly the amount of food
// that is recommended (just true or false)

console.log(dogs.some(dog => dog.curFood == dog.recommendedFood));

// 6. Log to the console whether there is any dog eating an okay amount of food
// // (just true or false)
// current > (recommended * 0.90) && current < (recommended *1.10).

console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);

// 7. Create an array containing the dogs that are eating an okay amount of food (try
//to reuse the condition used in 6.)

const foodOk = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);

console.log(foodOk);

// 8. Create a shallow copy of the 'dogs' array and sort it by recommended food
// portion in an ascending order (keep in mind that the portions are inside the
// array's objects 😉)

const dogsCopy = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);

console.log(dogs);
console.log(dogsCopy);
