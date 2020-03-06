function eval() {
  // Do not use eval!!!
  return;
}

function expressionCalculator(expr) {
  const brackets = expr.split("").filter(sym => sym === "(" || sym === ")");
  if (brackets.length > 0) {
    if (!check(brackets, [["(", ")"]]))
      throw new ExpressionError("ExpressionError: Brackets must be paired");
  }

  const priorityOps = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2
  };
  const ops = Object.keys(priorityOps);
  let input = expr
    .split("")
    .filter(sym => (sym === " " ? "" : sym))
    .reduce((result, sym) => {
      if (isNaN(sym)) {
        return [...result, sym];
      } else if (!isNaN(result[result.length - 1])) {
        result.splice(result.length - 1, 1, result[result.length - 1] + sym);
        return result;
      }
      return [...result, sym];
    }, []);

  let stack = [];

  let rpn = input.reduce((result, sym) => {
    if (isNaN(sym)) {
      if (sym === "(") stack.push(sym);
      if (sym === ")") {
        let stackChunk = [];
        for (let i = stack.length - 1; i >= 0; i--) {
          let fromStack = stack.pop();
          if (fromStack !== "(") {
            stackChunk = [...stackChunk, fromStack];
          } else {
            break;
          }
        }
        return [...result, ...stackChunk];
      }
      if (ops.includes(sym)) {
        while (
          stack.length > 0 &&
          ops.includes(stack[stack.length - 1]) &&
          priorityOps[stack[stack.length - 1]] >= priorityOps[sym]
        ) {
          result = [...result, stack.pop()];
        }
        stack.push(sym);
      }
    } else {
      return [...result, sym];
    }

    return result;
  }, []);

  rpn = [...rpn, ...stack.reverse()];

  let result = rpn.reduce((stack, el) => {
    if (ops.includes(el)) {
      stack.splice(
        stack.length - 2,
        2,
        calc(stack[stack.length - 2], stack[stack.length - 1], el)
      );
      return stack;
    } else {
      return [...stack, el];
    }
  }, [])[0];

  return result;
}

function calc(firstNumber, secondNumber, operation) {
  switch (operation) {
    case "*":
      return +(firstNumber * secondNumber);
    case "/":
      if (+secondNumber === 0)
        throw new TypeError("TypeError: Division by zero.");
      return +(firstNumber / secondNumber);
    case "+":
      return +(+firstNumber + +secondNumber);
    case "-":
      return +(firstNumber - secondNumber);
    default:
      return 0;
  }
}

function check(str, bracketsConfig) {
  const confObj = {};
  let currentBracket = "",
    buffer = "";

  for (let i = 0; i < bracketsConfig.length; i++) {
    confObj[bracketsConfig[i][0]] = bracketsConfig[i][1];
  }

  if (!confObj[str[0]]) return false;

  for (let i = 0; i < str.length; i++) {
    if (
      confObj[str[i]] &&
      !(str[i] === confObj[str[i]] && currentBracket === str[i])
    ) {
      currentBracket = str[i];
      buffer += str[i];
    } else {
      if (str[i] === confObj[currentBracket]) {
        buffer = buffer.substring(0, buffer.length - 1);
        currentBracket = buffer[buffer.length - 1];
      } else {
        return false;
      }
    }
  }

  if (buffer.length > 0) return false;
  return true;
}

class ExpressionError extends Error {
  constructor(message) {
    super(message);
    this.name = "ExpressionError";
  }
}

module.exports = {
  expressionCalculator
};
