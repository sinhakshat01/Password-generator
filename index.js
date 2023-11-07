const inputSlider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password ="";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
//set strength circle color to grey initially

// functions to make handleslider() copycontent() generatepassword() setindicator() getrandominteger() getrandomuppercase() getlowercase() getrandomnumber() getrandomsymbols() calcstrength()

// sets password length
function handleSlider(){
   inputSlider.value = passwordLength;
   lengthDisplay.innerText = passwordLength;
}

//set indicator

function setIndicator(color){
    indicator.style.backgroundColor = color;
}

function getRndInteger(min,max)
{
   Math.floor(Math.random()*(max-min)) + min;
}

function generateRandomNumber()
{
    return getRndInteger(0,9);
}

function generateLowerCase()
{
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase()
{
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol()
{
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength()
{
    // by default checkbox checked nahi hai
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    // agar saare checkbox checked hai
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) 
    {
      setIndicator("#0f0");
    } 
    else if ( (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6)
    {
      setIndicator("#ff0");
    }
    else
    {
      setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");
    
    // 2sec baad copied vala msg chala gya
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// agar koi checkcox check hora hai ya uncheck hora hai toh count karo bhai k kitne checkbox checked hain
function handleCheckBoxChange() {
        checkCount=0;
        allCheckBox.forEach((checkbox)=>{
            if(checkbox.checked)
            checkCount++;
        });
        if(passwordLength < checkCount)
        {
              passwordLength = checkCount;
              handleSlider();
        }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange)
})

// slider hila ne pe number change hora h

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

//input pe value padi h toh copy kar paoge otherwise nahi kar paoge

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
});

generateBtn.addEventListener('click',()=>{

    if(checkCount == 0)
    return;
    
    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }

    // remove old password
    password="";


    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }

    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        
        let randIndex = getRndInteger(0 , funcArr.length);

        console.log("randIndex" + randIndex);

        password += funcArr[randIndex]();
    }

    console.log("Remaining adddition done");

    //shuffle the password
    password = shufflePassword(Array.from(password));

    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");

    //calculate strength
    calcStrength();

});