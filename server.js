const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const convert = require('convert-units');

const conversions = {
  minute: {unit_name: 's', multiplication_factor: parseFloat(convert(1).from('min').to('s').toFixed(14))},
  min: {unit_name: 's', multiplication_factor: parseFloat(convert(1).from('min').to('s').toFixed(14))},
  hour: {unit_name: 's', multiplication_factor: parseFloat(convert(1).from('h').to('s').toFixed(14))},
  h: {unit_name: 's', multiplication_factor: parseFloat(convert(1).from('h').to('s').toFixed(14))},
  day: {unit_name: 's', multiplication_factor: parseFloat(convert(1).from('d').to('s').toFixed(14))},
  d: {unit_name: 's', multiplication_factor: parseFloat(convert(1).from('d').to('s').toFixed(14))},
  degree: {unit_name: 'rad', multiplication_factor: parseFloat((Math.PI / 180).toFixed(14))},
  '°': {unit_name: 'rad', multiplication_factor: parseFloat((Math.PI / 180).toFixed(14))},
  "'": {unit_name: 'rad', multiplication_factor: parseFloat((Math.PI / 10800).toFixed(14))},
  second: {unit_name: 'rad', multiplication_factor: parseFloat((Math.PI / 648000).toFixed(14))},
  '"': {unit_name: 'rad', multiplication_factor: parseFloat((Math.PI / 648000).toFixed(14))},
  hectare: {unit_name: 'm2', multiplication_factor: parseFloat(convert(1).from('ha').to('m2').toFixed(14))},
  ha: {unit_name: 'm2', multiplication_factor: parseFloat(convert(1).from('ha').to('m2').toFixed(14))},
  litre: {unit_name: 'm3', multiplication_factor: parseFloat(convert(1).from('l').to('m3').toFixed(14))},
  L: {unit_name: 'm3', multiplication_factor: parseFloat(convert(1).from('l').to('m3').toFixed(14))},
  tonne: {unit_name: 'kg', multiplication_factor: parseFloat(convert(1).from('t').to('kg').toFixed(14))},
  t: {unit_name: 'kg', multiplication_factor: parseFloat(convert(1).from('t').to('kg').toFixed(14))},
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/units/si', (req, res) => {
  const unit = req.query.units;
  
  if (unit) {
    if (unit.includes('/') || unit.includes('*') || unit.includes('(')) {
      evaluate(unit, (unitName, data) => {
        res.status(200).json({unit_name: unitName, multiplication_factor: parseFloat(data.toFixed(14))});
      });
    } else if (unit && conversions[unit]) {
      res.status(200).json(conversions[unit]);
    } else {
      res.status(404).json(['Invalid search parameter value. Try one of these below:'].concat(Object.keys(conversions)));
    }
  } else if (req.query.hasOwnProperty('units')) {
    res.status(404).json(['Missing search parameter value. (e.g. units=min) Try one of these below:'].concat(Object.keys(conversions)));
  } else {
    res.status(400).json('Invalid search parameter key. Please input -> units (e.g  /units/si?units)');
  }
});

app.get('/', (req, res) => {
  res.json('Welcome! To get started converting, use an endpoint like: /units/si?units=minute');
});

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));


function evaluate(expression, callback) {
  let tokens = expression.split('');
  // Stack for numbers: 'values'
  let values = [];
  // Stack for Operators: 'ops'
  let ops = [];
  let unitConvert = '';
  let alpha = `°"'abcdefghijklmnopqrstuvwyz`;
  let i = 0;
  
  while(i < tokens.length) {
    // Current token is a whitespace, skip it
    if (tokens[i] === ' ') {
      continue;
    }

    // Current token is a number, push it to stack for numbers
    if (alpha.includes(tokens[i])) {
      let nextIndex = i+1;
      let resStr = tokens[i];
      while(alpha.includes(tokens[nextIndex])) {
        resStr+= tokens[nextIndex];
        nextIndex++;
      }
      unitConvert+= conversions[resStr].unit_name;
      if (tokens[nextIndex]) {
        unitConvert += tokens[nextIndex];
      }
      
      i = nextIndex-1;
      values.push(conversions[resStr].multiplication_factor)
    // Current token is an opening brace, push it to 'ops'
    } else if (tokens[i] === '(') {
      unitConvert += tokens[i];
      ops.push(tokens[i]);
    // Closing brace encountered, solve entire brace
    } else if (tokens[i] === ')') {
      while (ops[ops.length-1] != '(')
        values.push(applyOp(ops.pop(), values.pop(), values.pop()));
      ops.pop();
    // Current token is an operator.
    } else if (tokens[i] === '+' || tokens[i] === '-' || tokens[i] === '*' || tokens[i] === '/') {
      // While top of 'ops' has same or greater precedence to current
      // token, which is an operator. Apply operator on top of 'ops'
      // to top two elements in values stack
      while (ops.length !== 0 && hasPrecedence(tokens[i], ops[ops.length -1]))
        values.push(applyOp(ops.pop(), values.pop(), values.pop()));

      // Push current token to 'ops'.
      ops.push(tokens[i]);
    }
    i++
  }

  // Entire expression has been parsed at this point, apply remaining
  // ops to remaining values
  while (ops.length !== 0)
    values.push(applyOp(ops.pop(), values.pop(), values.pop()));

  // Top of 'values' contains result, pass to callback
  callback(unitConvert, values.pop());
}

// Returns true if 'op2' has higher or same precedence as 'op1',
// otherwise returns false.
function hasPrecedence(op1, op2) {
  if (op2 === '(' || op2 === ')') {
    return false;
  }
  if ((op1 === '*' || op1 === '/') && (op2 === '+' || op2 === '-')) {
    return false;
  } else {
    return true;
  }
}

// A utility method to apply an operator 'op' on operands 'a' 
// and 'b'. Return the result.
function applyOp(op, b, a) {
  switch (op) {
  case '+':
    return a + b;
  case '-':
    return a - b;
  case '*':
    return a * b;
  case '/':
    if (b === 0) {
      throw new Error("Cannot divide by zero");
    }
    return a / b;
  }
  return 0;
}