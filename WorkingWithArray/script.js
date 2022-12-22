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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (movements, sort) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal'
    const html = `   
  <div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__value">${movement}€</div>
</div>`
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}


const getUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(us => us[0]).join('')
  })
}
getUserName(accounts);
// console.log(accounts);
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((sum, cur) => sum + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
}


const summaryBalance = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((sum, mov) => sum + mov, 0)
  labelSumIn.textContent = `${incomes}€`
  const outcomes = acc.movements.filter(mov => mov < 0).reduce((sum, mov) => sum + mov, 0)
  labelSumOut.textContent = `${Math.abs(outcomes)}€`
  const interest = acc.movements.filter(mov => mov > 0).map(mov => mov * acc.interestRate / 100).filter(inter => inter >= 1).reduce((sum, mov) => sum + mov)
  labelSumInterest.textContent = `${interest}€`

}
const updateUI = function (acc) {
  //Display Balance
  displayBalance(acc);
  //Display History
  displayMovements(acc.movements);
  //Display Summary
  summaryBalance(acc);
}
//
let currentAccount;

//LOGIN
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(account => inputLoginUsername.value === account.username);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Hi, ${currentAccount.owner.split(' ')[0]}`
    //Clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    // inputLoginPin.blur();
    updateUI(currentAccount);
  }
})

//TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const toAccount = accounts.find(acc => inputTransferTo.value == acc.username);
  const amount = inputTransferAmount.value;
  inputTransferAmount.value = inputTransferTo.value = '';
  if (amount > 0 && currentAccount.balance >= amount && toAccount?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    toAccount.movements.push(amount);
    updateUI(currentAccount);
  }

})
//DELETE ACCOUNT 
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const username = inputCloseUsername.value;
  const pin = inputClosePin.value;
  if (currentAccount.username === username && currentAccount.pin === Number(pin)) {
    const index = accounts.findIndex(acc => acc.username === username)
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.valuee = '';
  }
})
//REQUEST LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
  };
  inputLoanAmount.value = '';
  updateUI(currentAccount);
})
//SORT
let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})




/////////////////////////////////////////////////

const deposit = accounts.flatMap(acc => acc.movements).filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0);
console.log(deposit);

// const numberAbove1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).reduce((count, cur) => count + 1, 0)
const numberAbove1000 = accounts.flatMap(acc => acc.movements).reduce((count, cur) => cur >= 1000 ? ++count : count, 0)

console.log(numberAbove1000);

//FILL                                         NOTE
// const arr = new Array(7);
// arr.fill(1, 2, 5);
// arr.fill(45, 0, 2)
// console.log(arr);
// //FROM                                         NOTE
// const arr2 = Array.from({ length: 7 }, () => 2);
// console.log(arr2);

// const arr3 = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(arr3);
// labelBalance.addEventListener('click', function () {
//   const arr4 = Array.from(document.querySelectorAll('.movements__value'));
//   console.log(arr4);
// })


//SORT                                         NOTE
// movements.sort((a, b) => a - b)
// if (a > b) return 1;
// if (a < b) return -1;)

//FLAT FLATMAP                                 NOTE
// const movementsOverall = accounts.map(acc => acc.movements).flat().reduce((acc, cur) => acc + cur, 0);
// console.log(movementsOverall);

// const overal = accounts.flatMap(acc => acc.movements).reduce((acc, cur) => acc + cur, 0);
// console.log(movementsOverall);

// const arr = [2, 3, 4, 5, 6]
// arr.splice(4, 1);
// console.log(arr);

// console.log(accounts);

//FIND                                         NOTE
// const person = accounts.find(account => account.owner === 'Jessica Davis');
// console.log(person);


// console.log(movements);

// const eurToUSD = 1.1;
// const depositTotal = movements.filter(mov => mov > 0).map(mov => mov * eurToUSD).reduce((acc, mov) => acc + mov, 0)
// console.log(depositTotal);


 //Maximum value
// const maximumValue = movements.reduce((acc, mov) => {
//   console.log('ACC: ' + acc);
//   console.log('MOV: ' + mov);
//   const max = acc > mov ? acc : mov;
//   return max
// }, movements[0])

// console.log('Max' + maximumValue);

//REDUCE                                       NOTE
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   return acc + cur;
// }, 0)
// console.log(balance);

//FILTER                                       NOTE
// const deposit = movements.filter(mov => mov > 0)
// console.log(deposit);
// const withdrawal = movements.filter(mov => mov < 0)
// console.log(withdrawal);

//MAP                                          NOTE
// const movementUSD = movements.map(function (movement) {
//   return movement * 1.1;
// })
// const movementUSD = movements.map(movement => movement * 1.1)
// console.log(movementUSD);


// currencies.forEach(function (value, key, map) {
//   console.log(`${value} : ${key}`);

// })

// movements.forEach(function (movement, i) {
//   if (movement > 0) {
//     console.log(`Movement ${i}: You deposited ${movement}`);
//   }
//   else {
//     console.log(`Movement ${i}: You withdrew ${Math.abs(movement)}`);
//   }
// })

// const arr = ['a', 'b', 'c', 'd', 'e', 'f'];

// console.log(arr.slice(1, 3));
// console.log(arr.splice(1, 3));
// console.log(arr);

// const arr2 = ['s', 'w', 'e'];
// console.log(arr.concat(arr2));
// console.log(arr2.reverse());

// console.log([...arr, ...arr2].join('-'))
//   ;

// const arr = [12, 33, 77];
//getting last element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));





