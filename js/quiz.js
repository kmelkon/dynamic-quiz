document.addEventListener("DOMContentLoaded", function() {

    Quiz.commonMethods.getAllQuestions();
    var divs = document.querySelectorAll('div:not(#log-in)');
    var divsLen = divs.length;
    for (var i=0; i < divsLen; i++) {
        divs[i].style.display = 'none';
    }



    Quiz.commonMethods.registerNext();
    Quiz.commonMethods.registerBack();
    Quiz.commonMethods.registerChoice();



});


var Quiz = {};

Quiz.commonMethods = {
    score: 0,
    questionNumber: 0,
    userAnswerArr: [],
    allQuestions:  [],
    displayQA: function() {
        console.log("score", this.score);
        console.log("ques num", this.questionNumber);

        var choices = document.querySelectorAll("input[name='answer']");
        var prev = document.getElementById("prev-btn");

        // console.log(choices.length); 
        if (this.questionNumber === 0) {
            prev.style.display = "none";
        } else {
            prev.style.display = '';
        }
        console.log('[length', this.allQuestions.length);
        // var h1 = document.querySelector("h1");
        if ( this.questionNumber === this.allQuestions.length) {

            var h2 = document.querySelector("h2");
            h2.innerHTML = "You finished the quiz, your score is " + this.score;

            fadeIn(h2);
            for (i=0; i < 4; i++) {
                var div = document.getElementById("ans-" + i);
                div.parentNode.removeChild(div);
            }
            var next = document.getElementById("nxt-btn");
            var prev = document.getElementById("prev-btn");
            next.parentNode.removeChild(next);
            prev.parentNode.removeChild(prev);
        } else  {

            // console.log(this.allQuestions[this.questionNumber].question);
            var h2 = document.querySelector("h2");
            h2.innerHTML = this.allQuestions[this.questionNumber].question;            
            fadeIn(h2);
            // console.log(this.allQuestions[this.questionNumber]);
            for (i=0; i < 4; i++) {
                var inputContainer = document.querySelector("#ans-" + i);
                var input = document.querySelector("#ans-" + i + " input");
                var label = document.querySelector("#ans-" + i + " label");
                input.value = i;  
                input.id = this.allQuestions[this.questionNumber].choices[i];
                label.setAttribute("for", this.allQuestions[this.questionNumber].choices[i] );
                label.innerHTML = this.allQuestions[this.questionNumber].choices[i];
                fadeIn(inputContainer);
                // fadeIn(label);

            }
        }
    },
    registerNext: function() {
        var next = document.getElementById("nxt-btn");
        var _this = this;


        next.addEventListener("click", function() {
            var checkedRadio = document.querySelector('input[name="answer"]:checked');
            if (checkedRadio != null) {
                var usersAnswer = checkedRadio.value;
                //save answer value to userAnswerArr
                // _this.userAnswerArr.push(usersAnswer); 
                _this.userAnswerArr[_this.questionNumber] = usersAnswer; 


                console.log("user answer array",_this.userAnswerArr);
                console.log(_this.allQuestions[_this.questionNumber].answer, parseInt(usersAnswer));
                if (_this.allQuestions[_this.questionNumber].answer == usersAnswer) {
                    console.log("correct");
                    _this.score += 1;
                    _this.questionNumber += 1;
                } else {
                    console.log("wrong");
                    if (_this.score != 0) {
                        _this.score -= 1;
                    }

                    _this.questionNumber +=1;
                }
                // document.querySelector("h2").classList.add('hide');
                _this.displayQA();
                checkedRadio.checked = false;

            } else {

                alert("Please select an answer.");

            }

        }, false);
    },
    registerChoice: function() {
        var _this = this;
        var prev = document.getElementById("prev-btn");
        var input = document.querySelectorAll("input");
        var inputLen = input.length;
        var quesAns = []; 

        for (i=0; i<inputLen; i++) {
            input[i].addEventListener('click', function() {
                //         // alert(this.value);
                //         if (_this.questionNumber === quesAns[0]) {
                //             quesAns[_this.questionNumber] = this.value;
                //         } else {
                //             quesAns.push(_this.questionNumber, this.value);
                //         }
                //         _this.userAnswerArr.push( quesAns );
                //
                //         console.log(_this.userAnswerArr);
                //         console.log(_this.questionNumber);
            });
        }


    },
    registerBack: function() {
        var prev = document.getElementById("prev-btn");
        var _this = this;

        // save only the answer in userAnswerArr and specify the number of choices later on to know how much will be the length of the loop when looking for the answer in userAnswerArr 
        prev.addEventListener("click", function() {

            var checkedRadio = document.querySelector('input[name="answer"]:checked');
            // if (checkedRadio != null) {

            // var usersAnswer = checkedRadio.value;
            // console.log(_this.allQuestions[_this.questionNumber].answer, parseInt(usersAnswer));

            // if (_this.allQuestions[_this.questionNumber].answer == usersAnswer) {
            //     console.log("correct");
            //     // _this.score += 1;
            //     _this.questionNumber -= 1;
            //     _this.displayQA(); 
            // } else {
            console.log("sameer back");
            _this.questionNumber -=1;
            _this.displayQA();
            // }
            if (checkedRadio != null) {
                checkedRadio.checked = false;
            }

            // _this.userAnswerArr[_this.questionNumber] = usersAnswer; 
            var prevAns = parseInt(_this.userAnswerArr[_this.questionNumber]) ;
            // console.log('sdsdsdsd',_this.userAnswerArr[_this.questionNumber]);
            console.log('karam answer', prevAns);
            document.querySelector('input[value="'+ prevAns +'"]').checked = true;

            // } else {

            // alert("Please select an answer.");

            // }


        }, false);
    }

}

Quiz.commonMethods.getAllQuestions = function() {
    var xmlhttp = new XMLHttpRequest();
    var _this = this;
    // xmlhttp.overrideMimeType("application/json");
    xmlhttp.open('GET', 'quiz_data.json', true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
            var obj = JSON.parse(xmlhttp.responseText);
            // console.log(obj[0].question);
            var objLen = obj.length;
            for (var i=0; i < objLen; i++) {

                _this.allQuestions[i] = obj[i];
                console.log(_this.allQuestions);



                // Quiz.commonMethods.displayQA();
            }

            var divs = document.querySelectorAll('div:not(#log-in)');
            var divsLen = divs.length;

            if ( CookieUtil.getItem('name') !== null ) {
                console.log(CookieUtil.getItem('name'));

                for (var i=0; i < divsLen; i++) {
                    divs[i].style.display = '';
                }

                var logInContainer = document.querySelector('#log-in');

                fadeOut(logInContainer);
                logInContainer.style.display = 'none';

                Quiz.commonMethods.displayQA();

                var loggedInContainer = document.querySelector('#logged-in');
                var welcomeMsg = document.createElement('p');
                loggedInContainer.appendChild(welcomeMsg);
                welcomeMsg.innerHTML = 'Welcome back ' + CookieUtil.getItem('name') + '!';
                var resetBtn = document.createElement('button');
                resetBtn.type = 'submit';
                resetBtn.innerHTML = 'Reset';
                resetBtn.id = 'resetUser';
                loggedInContainer.appendChild(resetBtn);

                resetBtn.addEventListener('click', function(){
                    CookieUtil.unset('name', null);
                    document.location.reload();
                });


            } else {

                Quiz.commonMethods.logIn();

            }
        } //end of if 
    };
    xmlhttp.send(null);  
};

Quiz.commonMethods.logIn = function() {
    var logInBtn = document.querySelector("#submit-user-name");
    var logInTextField = document.querySelector('#user-name');

    logInTextField.addEventListener('keydown', function(event){
        if(event.keyCode === 13) {
            LogInHandler();
        }
    }, false);
    logInBtn.addEventListener('click', LogInHandler,  false);


};

// =========================== LogInHandler =====================
function LogInHandler() {
    var divs = document.querySelectorAll('div:not(#log-in)');
    var divsLen = divs.length;


    var logInInput = document.querySelector('#user-name');
    if ( logInInput.value !== '' ) {

        // save to browsers local storage
        localStorage.username = logInInput.value;

        // save a tasty cookie
        CookieUtil.set('name', logInInput.value);

        // show the question and hide the log in box
        for (var i=0; i < divsLen; i++) {
            divs[i].style.display = '';
        }
        var logInContainer = document.querySelector('#log-in');

        fadeOut(logInContainer);
        logInContainer.style.display = 'none';

        Quiz.commonMethods.displayQA();


    } else {

        alert('Please enter your name.');
        // console.log(logInInput.value);
    }
}

// ============================ FadeIn ==========================
function fadeIn(el) {
    el.style.opacity = 0;



    var tick = function() {
        el.style.opacity = +el.style.opacity + 0.02;


        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
        }
    };

    tick();
}

// ============================ FadeOut ==========================
function fadeOut(el) {
    el.style.opacity = 1.0;



    var tick = function() {
        el.style.opacity = +el.style.opacity - 0.02;


        if (+el.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
        }
    };

    tick();
}

// ============================ CookieUtil ==========================
var CookieUtil = {
    getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    set: function (name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + "=" +
            encodeURIComponent(value);
        if (expires instanceof Date) {
            cookieText += "; expires=" + expires.toGMTString();
        }
        if (path) {
            cookieText += "; path=" + path;
        }
        if (domain) {
            cookieText += "; domain=" + domain;
        }
        if (secure) {
            cookieText += "; secure";
        }
        document.cookie = cookieText;
    },
    unset: function (name, path, domain, secure){
        this.set(name, "", new Date(0), path, domain, secure);
    }
};
