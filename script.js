let answerField = document.getElementById("answer_field");
let answerSubmitBtn = document.getElementById("answer_submit_btn");
let validationField = document.getElementById("validation");
let scoreField = document.getElementById("score");
let timerField = document.getElementById("timer");
let ueber = document.getElementsByClassName("ueber")[0];
let quest_counter = document.getElementById("question_counter")

answerSubmitBtn.addEventListener("click", _on_Submit);

const TIME_PER_QUESTION = 6;

var score = 0;
const LANG_AMT = 3;//How many lanugages until games is done
var curr_lang_count = LANG_AMT;
const QUES_AMT = 5;//Max. amount of questions asked per language
var curr_q_count = 5;
var timer = setInterval(timeTick, 1000);
var sec_left = TIME_PER_QUESTION;

function _on_Submit(event) {
    event.preventDefault();
    if (!ready) {
        return;
    }
    if (validLanguage(answerField.value,current_lang)) {
        validationField.innerText = "Correct";
        nextLanguage();
        setScore(score + 1 + curr_q_count);
    } else {
        validationField.innerText = "Wrong";
    }
}

function validLanguage(answer, language){
    return ((answer.toUpperCase() == language.name.toUpperCase()) || (language.aliases.map(str => str.toUpperCase()).includes(answer.toUpperCase()) )  );
}

answerField.addEventListener("keyup", (event)=>{
    if (event.keyCode === 13) {
        _on_Submit(event);
    }
})


function setScore(new_score) {
    score = new_score;
    scoreField.innerText = score;
}

function Lang(name, questions, alias=[]) {
    this.name = name;
    this.aliases = alias
    this.questions = questions;
    this.addQuestion = (q) => {
        this.questions.push(q);
    };
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function completed() {
    console.log("DONE");
    console.log(score)
    let done_html=`<h1>DONE</h1> <h1>Score: ${score} </h1><button id="restart-btn" onClick="window.location.reload();"><span>Restart</span>  </button>`
    ueber.innerHTML = done_html;
    clearInterval(timer);

}

var jsonFetched = false;
//Define Languages
let langJSON;
var languages = [];
var ready = false; //waiting until data is fetched

fetch("./langs.json")
    .then((results) => results.json())
    .then((jsondata) => (langJSON = jsondata))
    .then((x) => initialize(langJSON));

var current_lang;
var current_question;
function initialize(langJSON) {

    for (l of langJSON.languages) {
        languages.push(new Lang(l.name, l.questions, l.alias));
    }
    ready = true;
    console.log(languages);

    //Randomly select language
    nextLanguage(true);
}

function nextLanguage(first = false) {

    
    if (!first) {
        curr_lang_count--;
        refreshLangCounter();
        languages.splice(languages.indexOf(current_lang),1);
        if (languages.length == 0 || curr_lang_count<= 0) {
            completed();
            return;
        }
    }

    refreshLangCounter()
    current_lang = languages[getRandomInt(languages.length)];
    curr_q_count =
        QUES_AMT > current_lang.questions.length
            ? current_lang.questions.length
            : QUES_AMT;
    nextQuestion(true);
}

function refreshLangCounter(){
    quest_counter.innerText = `Language:${LANG_AMT-curr_lang_count +1}/${LANG_AMT}`
}

function nextQuestion(first=false) {
    clearInterval(timer);
    sec_left = TIME_PER_QUESTION; //Time per question
    timerField.innerText = sec_left;
    timer = setInterval(timeTick, 1000);

    if (!first){
        current_lang.questions.splice(current_lang.questions.indexOf(current_question),1);//pop(current_question);
    }

    curr_q_count -= 1;
    if (curr_q_count > 0 && current_lang.questions.length > 0) {
        //Set Question
        let question = document.getElementById("question");
        let randQuestion =
            current_lang.questions[getRandomInt(current_lang.questions.length)];
        current_question = randQuestion;
        question.innerHTML = current_question;
    } else {
        nextLanguage();
    }
}

function timeTick() {
    sec_left--;
    timerField.innerText = sec_left;

    if (sec_left <= 0) {
        nextQuestion();
    }
}

