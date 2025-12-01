let currentInput = '';
let expression = '';
let lastResult = null;
const resultDisplay = document.getElementById('result');
const expressionDisplay = document.getElementById('expression');
function appendNumber(num) {
    if (lastResult !== null && expression === '') 
    {
        currentInput = num;
        lastResult = null;
    } else {
        currentInput += num;
    }
    updateDisplay();
}
function appendDecimal() {
    if (!currentInput.includes('.')) 
    {
        currentInput += currentInput === '' ? '0.' : '.';
        updateDisplay();
    }
}
function appendOperator(op) {
    if (currentInput !== '' || lastResult !== null) 
    {
        if (lastResult !== null && expression === '') 
        {
            expression = lastResult + ' ' + op + ' ';
            currentInput = '';
            lastResult = null;
        } else if (currentInput !== '') 
        {
            expression += currentInput + ' ' + op + ' ';
            currentInput = '';
        }
        updateDisplay();
    }
}
function calculateSquareRoot() {
    const num = parseFloat(currentInput || lastResult || '0');
    if (num < 0) 
    {
        showError('Cannot calculate square root of negative number');
        return;
    }
    const result = Math.sqrt(num);
    currentInput = '';
    expression = '√' + num + ' = ';
    lastResult = result.toString();
    updateDisplay();
}
function calculateResult() {
    if (expression === '' && currentInput === '') return;

    try {
        const fullExpression = expression + currentInput;
        if (fullExpression === '') return;
        if (fullExpression.includes('/ 0') || fullExpression.includes('/0')) 
        {
            showError('Cannot divide by zero');
            return;
        }
        const evalExpression = fullExpression.replace(/×/g, '*');
        const result = evaluateExpression(evalExpression);
        if (!isFinite(result)) 
        {
            showError('Mathematical error');
            return;
        }
        expressionDisplay.textContent = fullExpression + ' =';
        resultDisplay.textContent = formatResult(result);
        resultDisplay.classList.remove('error');
        lastResult = result.toString();
        currentInput = '';
        expression = '';

    } 
    catch (error) {
        showError('Invalid expression');
    }
}
function evaluateExpression(expr) {
    expr = expr.replace(/\s/g, '');
    return Function('"use strict"; return (' + expr + ')')();
}
function formatResult(num) {
    const rounded = Math.round(num * 10000000000) / 10000000000;
    if (Number.isInteger(rounded)) 
    {
        return rounded.toString();
    }
    return rounded.toString();
}
function showError(message) {
    resultDisplay.textContent = message;
    resultDisplay.classList.add('error');
    expressionDisplay.textContent = '';
    currentInput = '';
    expression = '';
    lastResult = null;
}
function clearCalculator(){
    currentInput = '';
    expression = '';
    lastResult = null;
    expressionDisplay.textContent = '';
    resultDisplay.textContent = '0';
    resultDisplay.classList.remove('error');
}
function updateDisplay() {
    expressionDisplay.textContent = expression;
    resultDisplay.textContent = currentInput || lastResult || '0';
    resultDisplay.classList.remove('error');
}
document.addEventListener('keydown', function(e){
    if (e.key >= '0' && e.key <= '9')
    {
        appendNumber(e.key);
    }
    else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') 
    {
        appendOperator(e.key);
    }
    else if (e.key === '.')
    {
        appendDecimal();
    }
    else if (e.key === 'Enter' || e.key === '=')
    {
        e.preventDefault();
        calculateResult();
    }
    else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') 
    {
        clearCalculator();
    }
    else if (e.key === 'Backspace') 
    {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }
});
