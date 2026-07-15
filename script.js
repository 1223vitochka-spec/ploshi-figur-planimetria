/*======================================================
    Майстер площ планіметричних фігур
    script.js
    Частина 1/6
======================================================*/

"use strict";

//======================================================
// Глобальні змінні
//======================================================

let currentFigure = 0;

let currentQuestion = 0;

let score = 0;

let timer = 0;

let timerInterval = null;

let blitzInterval = null;

let blitzTime = 60;

let flashFront = true;

let dragScore = 0;

let statistics = JSON.parse(
localStorage.getItem("geometryStatistics")
) || {

games:0,

wins:0,

bestScore:0,

bestTime:9999,

history:[]

};

//======================================================
// Скорочення
//======================================================

const $ = (id)=>document.getElementById(id);

const $$ = (selector)=>document.querySelectorAll(selector);

//======================================================
// Завантаження сторінки
//======================================================

window.addEventListener("load",()=>{

hideLoading();

initNavigation();

loadStatistics();

showPage("home");

});

//======================================================

function hideLoading(){

setTimeout(()=>{

$("loading").style.display="none";

},800);

}

//======================================================
// Навігація
//======================================================

function initNavigation(){

$("menuHome").onclick=()=>showPage("home");

$("menuStudy").onclick=()=>{

showPage("study");

loadStudyCard();

};

$("menuCards").onclick=()=>{

showPage("cards");

loadFlashCard();

};

$("menuTest").onclick=()=>{

startTest();

};

$("menuBlitz").onclick=()=>{

startBlitz();

};

$("menuDrag").onclick=()=>{

showPage("drag");

createDragGame();

};

$("menuStats").onclick=()=>{

showPage("statistics");

loadStatistics();

};

$("startLearning").onclick=()=>{

showPage("study");

loadStudyCard();

};

$("startTesting").onclick=()=>{

startTest();

};

}

//======================================================

function showPage(page){

$$(".page").forEach(p=>{

p.classList.remove("active");

});

$(page).classList.add("active");

}

//======================================================
// Toast
//======================================================

function toast(text,color="#16a34a"){

const t=$("toast");

t.innerHTML=text;

t.style.background=color;

t.classList.add("show");

setTimeout(()=>{

t.classList.remove("show");

},2000);

}

//======================================================
// Modal
//======================================================

function showModal(title,text){

$("modalTitle").innerHTML=title;

$("modalText").innerHTML=text;

$("modal").classList.remove("hidden");

}

$("closeModal").onclick=()=>{

$("modal").classList.add("hidden");

};

//======================================================
// Звуки
//======================================================

function playCorrect(){

if(!SETTINGS.sound) return;

$("correctSound").play();

}

function playWrong(){

if(!SETTINGS.sound) return;

$("wrongSound").play();

}

function playFinish(){

if(!SETTINGS.sound) return;

$("finishSound").play();

}

//======================================================
// Таймер
//======================================================

function formatTime(sec){

let m=Math.floor(sec/60);

let s=sec%60;

if(m<10)m="0"+m;

if(s<10)s="0"+s;

return m+":"+s;

}

//======================================================

function startTimer(){

clearInterval(timerInterval);

timer=0;

$("timer").innerHTML="00:00";

timerInterval=setInterval(()=>{

timer++;

$("timer").innerHTML=formatTime(timer);

},1000);

}

//======================================================

function stopTimer(){

clearInterval(timerInterval);

}

//======================================================
// Перемішування
//======================================================

function shuffle(arr){

return [...arr].sort(()=>Math.random()-0.5);

}

//======================================================
// Випадкове число
//======================================================

function random(min,max){

return Math.floor(

Math.random()*(max-min+1)

)+min;

}
//======================================================
// РЕЖИМ "ВИВЧЕННЯ"
//======================================================

function loadStudyCard(){

const figure = FIGURES[currentFigure];

$("studyTitle").textContent = figure.name;

$("studyFormula").textContent = figure.formula;

$("studyDescription").innerHTML =
`
<b>Опис:</b><br>${figure.description}<br><br>
<b>Приклад:</b><br>${figure.example}<br><br>
<b>Підказка:</b><br>${figure.hint}
`;

$("studyImage").innerHTML =
`<img src="${figure.image}" alt="${figure.name}">`;

}

//======================================================

$("nextFigure").onclick=()=>{

currentFigure++;

if(currentFigure>=FIGURES.length){

currentFigure=0;

}

loadStudyCard();

};

//======================================================

$("prevFigure").onclick=()=>{

currentFigure--;

if(currentFigure<0){

currentFigure=FIGURES.length-1;

}

loadStudyCard();

};

//======================================================

$("flipFigure").onclick=()=>{

showModal(

FIGURES[currentFigure].name,

`<h3>${FIGURES[currentFigure].formula}</h3>
<p>${FIGURES[currentFigure].description}</p>
<p><b>Приклад:</b> ${FIGURES[currentFigure].example}</p>`

);

};

//======================================================
// ФЛЕШ-КАРТКИ
//======================================================

let flashIndex=0;

//======================================================

function loadFlashCard(){

const f=FIGURES[flashIndex];

$("flashCard").classList.remove("flip");

flashFront=true;

$("flashCard").innerHTML=

`
<div class="front">

<div>

<h2>${f.name}</h2>

<img
src="${f.image}"
style="width:170px;margin-top:20px;">

</div>

</div>

<div class="back">

<div>

<h2>${f.formula}</h2>

<p style="margin-top:25px;font-size:22px;">

${f.description}

</p>

</div>

</div>

`;

}

//======================================================

$("flashFlip").onclick=()=>{

$("flashCard").classList.toggle("flip");

flashFront=!flashFront;

};

//======================================================

$("flashCard").onclick=()=>{

$("flashCard").classList.toggle("flip");

flashFront=!flashFront;

};

//======================================================

$("flashNext").onclick=()=>{

flashIndex++;

if(flashIndex>=FIGURES.length){

flashIndex=0;

}

loadFlashCard();

};

//======================================================

$("flashPrev").onclick=()=>{

flashIndex--;

if(flashIndex<0){

flashIndex=FIGURES.length-1;

}

loadFlashCard();

};

//======================================================
// ВІДКРИТТЯ КАРТКИ ЗА НАЗВОЮ ФІГУРИ
//======================================================

function openFigure(id){

const index=FIGURES.findIndex(f=>f.id===id);

if(index===-1) return;

currentFigure=index;

showPage("study");

loadStudyCard();

}

//======================================================
// ПІДКАЗКА
//======================================================

function randomTip(){

return TIPS[
Math.floor(Math.random()*TIPS.length)
];

}

//======================================================
// ПОКАЗАТИ ВИПАДКОВУ ПІДКАЗКУ
//======================================================

function showRandomTip(){

toast(

randomTip(),

"#2563eb"

);

}
//======================================================
//                РЕЖИМ "ТЕСТ"
//======================================================

let testQuestions = [];

//------------------------------------------------------

function startTest(){

    showPage("test");

    score = 0;

    currentQuestion = 0;

    $("score").textContent = score;

    startTimer();

    testQuestions = shuffle(FIGURES);

    loadQuestion();

}

//------------------------------------------------------

function loadQuestion(){

    if(currentQuestion >= testQuestions.length){

        finishTest();

        return;

    }

    const q = testQuestions[currentQuestion];

    $("questionNumber").textContent =
        `${currentQuestion+1} / ${testQuestions.length}`;

    $("questionTitle").textContent =
        `Формула площі фігури "${q.name}"`;

    $("questionImage").innerHTML =
        `<img src="${q.image}" alt="${q.name}">`;

    const answers = shuffle(q.test);

    $("answers").innerHTML = "";

    answers.forEach(answer=>{

        const btn=document.createElement("div");

        btn.className="answer";

        btn.innerHTML=answer;

        btn.onclick=()=>checkAnswer(btn,answer,q.answer);

        $("answers").appendChild(btn);

    });

}

//------------------------------------------------------

function checkAnswer(button,userAnswer,correctAnswer){

    const all=document.querySelectorAll(".answer");

    all.forEach(b=>b.onclick=null);

    if(userAnswer===correctAnswer){

        button.classList.add("correct");

        playCorrect();

        score++;

        $("score").textContent=score;

        toast("✅ Правильно!");

    }else{

        button.classList.add("wrong");

        playWrong();

        toast("❌ Неправильно","#ef4444");

        all.forEach(el=>{

            if(el.innerHTML===correctAnswer){

                el.classList.add("correct");

            }

        });

    }

    setTimeout(()=>{

        currentQuestion++;

        loadQuestion();

    },1200);

}

//------------------------------------------------------

function finishTest(){

    stopTimer();

    playFinish();

    showPage("finish");

    $("finishScore").textContent =
        `${score} / ${testQuestions.length}`;

    let percent =
        Math.round(score/testQuestions.length*100);

    if(percent===100){

        $("finishMessage").innerHTML =
        "🏆 Відмінно! Ви знаєте всі формули!";

    }

    else if(percent>=80){

        $("finishMessage").innerHTML =
        "⭐ Дуже хороший результат!";

    }

    else if(percent>=60){

        $("finishMessage").innerHTML =
        "👍 Добре! Але ще трохи потренуйтеся.";

    }

    else{

        $("finishMessage").innerHTML =
        "📖 Варто повторити формули площ.";

    }

    saveStatistics(percent);

}

//------------------------------------------------------

$("playAgain").onclick=()=>{

    startTest();

};

$("backHome").onclick=()=>{

    showPage("home");

};

//======================================================
//             ЗБЕРЕЖЕННЯ СТАТИСТИКИ
//======================================================

function saveStatistics(percent){

    statistics.games++;

    if(score>statistics.bestScore){

        statistics.bestScore=score;

    }

    if(timer<statistics.bestTime){

        statistics.bestTime=timer;

    }

    statistics.history.unshift({

        date:new Date().toLocaleDateString(),

        score:score,

        percent:percent,

        time:formatTime(timer)

    });

    if(statistics.history.length>20){

        statistics.history.pop();

    }

    localStorage.setItem(

        "geometryStatistics",

        JSON.stringify(statistics)

    );

}
//======================================================
//                 РЕЖИМ "БЛІЦ"
//======================================================

let blitzQuestion = null;
let blitzScore = 0;

function startBlitz(){

    showPage("blitz");

    blitzScore = 0;
    blitzTime = 60;

    $("blitzScore").textContent = "⭐ " + blitzScore;
    $("blitzTime").textContent = blitzTime;

    nextBlitzQuestion();

    clearInterval(blitzInterval);

    blitzInterval = setInterval(()=>{

        blitzTime--;

        $("blitzTime").textContent = blitzTime;

        if(blitzTime<=0){

            clearInterval(blitzInterval);

            finishBlitz();

        }

    },1000);

}

//------------------------------------------------------

function nextBlitzQuestion(){

    blitzQuestion =
        BLITZ[random(0,BLITZ.length-1)];

    $("blitzQuestion").innerHTML =
        blitzQuestion.question;

    $("blitzAnswers").innerHTML="";

    shuffle(blitzQuestion.answers).forEach(answer=>{

        const btn=document.createElement("div");

        btn.className="answer";

        btn.innerHTML=answer;

        btn.onclick=()=>{

            if(answer===blitzQuestion.correct){

                blitzScore++;

                playCorrect();

                toast("Правильно!");

            }else{

                playWrong();

            }

            $("blitzScore").textContent=
                "⭐ "+blitzScore;

            nextBlitzQuestion();

        };

        $("blitzAnswers").appendChild(btn);

    });

}

//------------------------------------------------------

function finishBlitz(){

    showPage("finish");

    $("finishScore").innerHTML =
        blitzScore + " балів";

    $("finishMessage").innerHTML =
        "Режим «Бліц» завершено!";

    playFinish();

}

//======================================================
//                 DRAG & DROP
//======================================================

function createDragGame(){

    $("figuresList").innerHTML="";
    $("formulasList").innerHTML="";

    const figures = shuffle([...DRAG_DATA]);

    const formulas = shuffle([...DRAG_DATA]);

    figures.forEach(item=>{

        const div=document.createElement("div");

        div.className="dragItem";

        div.draggable=true;

        div.dataset.figure=item.figure;

        div.innerHTML=item.figure;

        div.addEventListener("dragstart",dragStart);

        $("figuresList").appendChild(div);

    });

    formulas.forEach(item=>{

        const zone=document.createElement("div");

        zone.className="dropZone";

        zone.dataset.formula=item.formula;

        zone.innerHTML=

        `<strong>${item.formula}</strong>`;

        zone.addEventListener("dragover",dragOver);

        zone.addEventListener("drop",dropItem);

        zone.addEventListener("dragleave",()=>{

            zone.classList.remove("hover");

        });

        $("formulasList").appendChild(zone);

    });

}

//------------------------------------------------------

let draggedFigure=null;

function dragStart(e){

    draggedFigure=e.target;

}

//------------------------------------------------------

function dragOver(e){

    e.preventDefault();

    e.currentTarget.classList.add("hover");

}

//------------------------------------------------------

function dropItem(e){

    e.preventDefault();

    e.currentTarget.classList.remove("hover");

    if(e.currentTarget.querySelector(".dragItem"))

        return;

    e.currentTarget.appendChild(draggedFigure);

}

//------------------------------------------------------

$("checkDrag").onclick=()=>{

    let correct=0;

    document.querySelectorAll(".dropZone")
    .forEach(zone=>{

        const item=zone.querySelector(".dragItem");

        if(!item) return;

        const figure=item.dataset.figure;

        const obj=DRAG_DATA.find(x=>x.figure===figure);

        if(obj && obj.formula===zone.dataset.formula){

            correct++;

            zone.style.background="#d1fae5";

        }else{

            zone.style.background="#fecaca";

        }

    });

    toast(
        `Правильно: ${correct} із ${DRAG_DATA.length}`
    );

};

//======================================================
//            КОНФЕТІ
//======================================================

function showConfetti(){

    $("confetti").style.display="block";

    setTimeout(()=>{

        $("confetti").style.display="none";

    },5000);

}
//======================================================
//          script.js
//          Частина 5/6
//======================================================


//======================================================
// СТАТИСТИКА
//======================================================

function loadStatistics(){

    $("gamesPlayed").textContent = statistics.games;

    $("bestScore").textContent = statistics.bestScore;

    $("bestTime").textContent =
        statistics.bestTime === 9999
        ? "--:--"
        : formatTime(statistics.bestTime);

    let avg = 0;

    if(statistics.history.length){

        avg = statistics.history.reduce((sum,item)=>

            sum + item.percent

        ,0);

        avg = Math.round(avg/statistics.history.length);

    }

    $("averageScore").textContent = avg + "%";

    const tbody = document.querySelector("#resultsTable tbody");

    tbody.innerHTML = "";

    statistics.history.forEach(item=>{

        const row=document.createElement("tr");

        row.innerHTML=`

            <td>${item.date}</td>

            <td>${item.score}</td>

            <td>${item.time}</td>

        `;

        tbody.appendChild(row);

    });

}


//======================================================
// ДОСЯГНЕННЯ
//======================================================

let unlocked = [];

function unlockAchievement(id){

    if(unlocked.includes(id)) return;

    unlocked.push(id);

    const ach = ACHIEVEMENTS.find(a=>a.id===id);

    if(!ach) return;

    toast("🏆 Досягнення: " + ach.title);

}

function checkAchievements(){

    if(score===1)

        unlockAchievement(1);

    if(score===10)

        unlockAchievement(2);

    if(score===FIGURES.length)

        unlockAchievement(3);

}


//======================================================
// ІНТЕРАКТИВНИЙ ПЛАКАТ
//======================================================

function createPosterMap(){

    const poster = $("poster");

    if(!poster) return;

    const container = poster.parentElement;

    POSTER_MAP.forEach(area=>{

        const btn=document.createElement("div");

        btn.className="posterArea";

        btn.style.left=area.x+"px";

        btn.style.top=area.y+"px";

        btn.style.width=area.w+"px";

        btn.style.height=area.h+"px";

        btn.dataset.id=area.id;

        btn.onclick=()=>{

            openFigure(area.id);

        };

        container.appendChild(btn);

    });

}


//======================================================
// ПІДСВІЧУВАННЯ ОБЛАСТІ
//======================================================

function highlightPoster(id){

    document.querySelectorAll(".posterArea")

    .forEach(a=>a.classList.remove("active"));

    const area=document.querySelector(

        '.posterArea[data-id="'+id+'"]'

    );

    if(area){

        area.classList.add("active");

    }

}


//======================================================
// ТЕМА
//======================================================

function toggleTheme(){

    document.body.classList.toggle("dark");

    SETTINGS.theme=

        document.body.classList.contains("dark")

        ? "dark"

        : "light";

}


//======================================================
// ЗВУК
//======================================================

function toggleSound(){

    SETTINGS.sound=!SETTINGS.sound;

    toast(

        SETTINGS.sound

        ? "🔊 Звук увімкнено"

        : "🔇 Звук вимкнено"

    );

}


//======================================================
// ВИПАДКОВА ПІДКАЗКА
//======================================================

function showDailyTip(){

    const tip=

        TIPS[random(0,TIPS.length-1)];

    showModal(

        "💡 Підказка",

        tip

    );

}


//======================================================
// АВТОЗБЕРЕЖЕННЯ
//======================================================

function saveSettings(){

    localStorage.setItem(

        "geometrySettings",

        JSON.stringify(SETTINGS)

    );

}

function loadSettings(){

    const s=

        JSON.parse(

            localStorage.getItem(

                "geometrySettings"

            )

        );

    if(!s) return;

    SETTINGS.sound=s.sound;

    SETTINGS.theme=s.theme;

    SETTINGS.animations=s.animations;

    SETTINGS.timer=s.timer;

    if(SETTINGS.theme==="dark"){

        document.body.classList.add("dark");

    }

}


//======================================================
// ЗАПУСК
//======================================================

window.addEventListener("load",()=>{

    loadSettings();

    createPosterMap();

    loadStatistics();

});
//======================================================
//             script.js
//             Частина 6/6
//======================================================


//======================================================
// Гарячі клавіші
//======================================================

document.addEventListener("keydown",(e)=>{

    switch(e.key){

        case "ArrowRight":

            if($("study").classList.contains("active")){

                $("nextFigure").click();

            }

            break;

        case "ArrowLeft":

            if($("study").classList.contains("active")){

                $("prevFigure").click();

            }

            break;

        case " ":

            if($("cards").classList.contains("active")){

                e.preventDefault();

                $("flashFlip").click();

            }

            break;

        case "Escape":

            $("modal").classList.add("hidden");

            break;

    }

});


//======================================================
// Повтор тесту
//======================================================

function restartGame(){

    score=0;

    currentQuestion=0;

    flashIndex=0;

    currentFigure=0;

    blitzScore=0;

    blitzTime=60;

}


//======================================================
// Скидання статистики
//======================================================

function resetStatistics(){

    if(!confirm("Очистити статистику?"))

        return;

    statistics={

        games:0,

        wins:0,

        bestScore:0,

        bestTime:9999,

        history:[]

    };

    localStorage.removeItem("geometryStatistics");

    loadStatistics();

    toast("Статистику очищено");

}


//======================================================
// Експорт статистики
//======================================================

function exportStatistics(){

    const text=

JSON.stringify(statistics,null,2);

    const blob=

new Blob([text],{

type:"application/json"

});

    const a=document.createElement("a");

    a.href=URL.createObjectURL(blob);

    a.download="geometry_statistics.json";

    a.click();

}


//======================================================
// Повідомлення після 100%
//======================================================

function perfectResult(){

    if(score!==FIGURES.length)

        return;

    showConfetti();

    toast(

        "🏆 Ідеальний результат!",

        "#f59e0b"

    );

}


//======================================================
// Випадкова порада
//======================================================

function showStartTip(){

    const tip=

TIPS[random(0,TIPS.length-1)];

    setTimeout(()=>{

        toast(tip,"#2563eb");

    },1200);

}


//======================================================
// Кнопка F1
//======================================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="F1"){

        e.preventDefault();

        showDailyTip();

    }

});


//======================================================
// Анімація кнопок
//======================================================

document.querySelectorAll("button")

.forEach(btn=>{

    btn.addEventListener("mousedown",()=>{

        btn.style.transform="scale(.95)";

    });

    btn.addEventListener("mouseup",()=>{

        btn.style.transform="";

    });

});


//======================================================
// Перевірка досягнень
//======================================================

setInterval(()=>{

    checkAchievements();

},3000);


//======================================================
// Автозбереження
//======================================================

window.addEventListener("beforeunload",()=>{

    saveSettings();

    localStorage.setItem(

        "geometryStatistics",

        JSON.stringify(statistics)

    );

});


//======================================================
// Запуск програми
//======================================================

window.addEventListener("load",()=>{

    loadSettings();

    loadStatistics();

    showStartTip();

    createPosterMap();

    console.log(

        "📐 Майстер площ успішно запущено"

    );

});


//======================================================
// Кінець script.js
//======================================================