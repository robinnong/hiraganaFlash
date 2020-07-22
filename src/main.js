// import './styles.css';
// import Vue from '../node_modules/vue/dist/vue.esm.js';  
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js';
import hiragana from './hiragana.js';    
import katakana from './katakana.js';

const app = new Vue({
    el: '#app',
    data: {
        chart: {},  
        answerKey: {}, // Format ==> {O: "お", KO: "こ"}
        answerLog: {}, // Format ==> {O: "お", KO: "こ"}
        result: {},
        answerCards: [],
        promptCards: [],
        key: 0,
        round: 0, 
        score: 0,
        currentMatch: 0, 
        currentCard: "",
        isModalOn: false,  
        display: "home",
        isOpen: false,
        quizType: "",
    }, 
    mounted: function () {
        this.loadChart('basic')
    }, 
    methods: {
        closeNav: function() { 
            this.isOpen = false;
        },
        // Displays chart type based on user's selection  
        loadChart: function(kanaType) {
            this.chart = hiragana.filter(item => item.type === kanaType);
        },
        changeChart: function(e) {
            this.loadChart(e.target.value);
        },
        getQuizType: function(e){
            this.quizType = e.currentTarget.value;
            this.loadQuiz();
        },
        loadQuiz: function() {  
            this.display = 'quiz'; 
            let promptSet = undefined;  
            // Returns an array of 6 random hiragana  
            switch (this.quizType) {
                case 'hiragana':
                    promptSet = getRandomArray(hiragana, 6); 
                    break;
                case 'katakana':
                    promptSet = getRandomArray(katakana, 6); 
                    break;
                default:
                    console.log('error')
            }
            // Set current round's answer key
            promptSet.forEach(index => this.answerKey[index.romaji] = index.kana);
            this.promptCards = promptSet.map(item => item.kana); 
            this.answerCards = getRandomArray(promptSet, promptSet.length).map(item => item.romaji); 
        }, 
        evaluateAnswer: function() {
            evaluateAnswers();    
            if (this.round === 5) {         
                this.isModalOn = true;
                this.result = assignGrade(this.score); 
                this.round = 0;
            } else {
                app.round++;
            } 
            this.loadQuiz();
            this.currentMatch = 0; 
        },
        closeModal: function(e) {
            // When user clicks outside of the modal, close modal 
            e.target.closest('.modalInner') === null ? this.isModalOn = false : null;  
            this.score = 0;
        },
        setCurrentCard: function(e) {
            if (this.currentMatch < 6) {
                this.currentCard = e.currentTarget.id;    
                this.answerLog[e.currentTarget.id] = this.promptCards[this.currentMatch]; 
                this.currentMatch++;  
            } else {

            }
        }
    }
})

// Checks if the user has match the pairs of kana and romaji correctly by comparing pairs to the original object
function evaluateAnswers() {  
    for (const prop in app.answerLog) { 
        if (app.answerLog[prop] === app.answerKey[prop]) { 
            app.score++;   
        }
    }     
    app.answerKey = {};
    app.answerLog = {};
} 

// Returns a randomized array, accepts the data array and desired length as parameters
function getRandomArray (array, length) {
    let randomArray = [];
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random()*array.length);
        if (randomArray.includes(array[index])) {
            i -= 1;
        } else {
            randomArray.push(array[index]);
        }
    } 
    return randomArray; 
}    

function assignGrade(finalScore) {
    if (finalScore === 0) {
        return { grade: "F", message: "Keep Studying! 😢" };
    } else if (finalScore > 0 && finalScore < 15) {
        return { grade: "D", message: "Keep Studying! 😢" };
    } else if (finalScore > 15 && finalScore < 21) {
        return { grade: "C", message: "Keep Studying! 😁" };
    } else if (finalScore > 21 && finalScore < 24) {
        return { grade: "B", message: "Good Job! 😄" };
    } else if (finalScore > 24 && finalScore < 30) {
        return { grade: "A", message: "Excellent! 😄" };
    } else if (finalScore === 100) {
        return { grade: "A+", message: "Perfect! 🎉" };
    }
}  