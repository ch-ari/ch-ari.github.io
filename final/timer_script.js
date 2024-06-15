document.addEventListener('DOMContentLoaded', () => {
    let savedSectionColor = localStorage.getItem('sectionColor');
    let savedSubColor = localStorage.getItem('subColor');
    let savedSectionSub = localStorage.getItem('sectionSub');
    if (savedSectionColor) {
        document.documentElement.style.setProperty('--section-color', savedSectionColor);
    }
    if (savedSubColor) {
        document.documentElement.style.setProperty('--sub-color', savedSubColor);
    }
    if (savedSectionSub){
        document.documentElement.style.setProperty('--section-color-light', savedSectionSub);
    }
    if(window.location.pathname.endsWith('timer_start.html')){
        window.addEventListener('blur', function() {
            clearInterval(timerInterval);
            // 로컬 스토리지 out_time 증가
            let outTime = parseInt(retrieve('out_time'));
            store('out_time', outTime + 1);

            alert("타이머가 중지되었습니다. 확인을 누르면 재개합니다.");
        });

        window.addEventListener('focus', function() {
            // 포커스가 돌아왔을 때 타이머 재개
            if (timeLeft > 0) {
                timerInterval = setInterval(updateTimer, 1000);
            }
        });

        startSection();
    }
});

function support_Lstorage(){
    if(!window.localStorage){ 
        alert("로컬 스토리지를 지원하지 않습니다!");
        return false;
    }
    return true;    
}
function support_Sstorage(){
    if(!window.sessionStorage){ 
        alert("세션 스토리지를 지원하지 않습니다!");
        return false;
    }
    return true;
}
function store(key, count){
    if(support_Lstorage()){
        localStorage.setItem(key, count);
    }else {
        return -1;
    }
}

function retrieve(item){
    if(support_Lstorage()){
        let val = localStorage.getItem(item);
        if(val == null){ val = 0; }
        return parseInt(val);
    }else {
        return -1;
    }
}

function session_store(key, item){
    if(support_Sstorage()){
        sessionStorage.setItem(key, item);
    }else{
        return -1;
    }
}

function session_retrieve(item){
    if(support_Lstorage()){
        let val = sessionStorage.getItem(item);
        if(val == null){ val = 0; }
        return parseInt(val);
    }else {
        return -1;
    }
}

function open_help(url){
    var left = (screen.availWidth-1200) / 2;
    var top = (screen.availHeight-800) / 2 - 50;
    const opt = "left=" + left + ",top=" + top + ",width=" + 1200  + ",height=" + 800;
    let help_win = window.open(url, "pop", opt);
    if(help_win == null){ alert("팝업이 차단되어 있습니다!") }
}

function start_timer() {
    let focus = document.getElementById("focus").value;
    let rest = document.getElementById("rest").value;
    let sections = document.getElementById("section_timer").value;

    if (focus === "" || rest === "" || sections === "") {
        alert("모든 값이 입력되어야 합니다!");
        return;
    }

    if (parseInt(rest) > parseInt(focus)) {
        alert("휴식 시간은 집중 시간보다 짧아야 합니다!");
        return;
    }

    store("lazy_able", 0);

    session_store("focus_time", parseInt(focus));
    session_store("rest_time", parseInt(rest));
    session_store("total_section", parseInt(sections));
    session_store("current_section", parseInt(sections));

    window.location.href = 'timer_start.html';
}

let timeLeft;
let isFocusTime=true;

function startSection() {
    let currentSection=session_retrieve("current_section");
    if (currentSection <= 0) {
        clearInterval(timerInterval);
        document.getElementById("sect_type").innerHTML = "완료!";
        alert("타이머 종료!");
        setTimeout(() => {
            window.location.href = 'timer.html';
        }, 2000);
        session_store("focus_time", 0);
        session_store("rest_time", 0);
        session_store("total_section", 0);
        return;
    }
    let focusTime=session_retrieve("focus_time");
    let restTime=session_retrieve("rest_time");

    document.getElementById("sect_type").innerHTML = isFocusTime ? "공부" : "휴식";
    document.getElementById("sect_time").innerHTML = currentSection;
    timeLeft = isFocusTime ? parseInt(focusTime)*60 : parseInt(restTime)*60;
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    let focusTime=parseInt(session_retrieve("focus_time"));
    let currentSection=session_retrieve("current_section");
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (isFocusTime) {
            let studyTime = parseInt(retrieve("study_time"));
            store('study_time', studyTime + focusTime);

            let totalSet = parseInt(retrieve('total_set'));
            store('total_set', totalSet + 1);
        }
        if (!isFocusTime) {
            currentSection--;
            session_store("current_section", currentSection);
        }
        isFocusTime = !isFocusTime;
        startSection();
    } else {
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        document.getElementById("timer_time").innerHTML=minutes+" : "+seconds;
    }
}
