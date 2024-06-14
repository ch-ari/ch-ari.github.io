
function GetCookie (name) {
	let pairs = document.cookie.split(";"); // 쿠키문자열을 ;을 경계로 분할
	for(let i=0; i<pairs.length; i++) {
		let pair = pairs[i].trim(); // 쿠키 앞뒤의 빈칸 제거
		let unit = pair.split("=");
		if(unit[0] == name)
			return unescape(unit[1]);
	}
	return null;
}
function SetCookie (name, value, expireDate) {
	let cookieStr = name + "=" + escape(value) + 
        ((expireDate == null)?"":("; expires=" + expireDate.toUTCString()));
        document.cookie = cookieStr;
}
function support_Sstorage(){
    if(!window.sessionStorage){ 
        alert("세션 스토리지를 지원하지 않습니다!");
        return false;
    }
    return true;
}
function support_Lstorage(){
    if(!window.localStorage){ 
        alert("로컬 스토리지를 지원하지 않습니다!");
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
    if(support_Lstorage){
        let val=localStorage.getItem(item);
        if(val==null){ val=0; }
        return val
    }else {
        return -1;
    }
}


function open_help(url){
    var left = (screen.availWidth-1200) / 2;
    var top = (screen.availHeight-800) / 2 - 50;
    const opt = "left=" + left + ",top=" + top + ",width=" + 1200  + ",height=" + 800;
    let help_win=window.open(url, "pop", opt);
    if(help_win == null){ alert("팝업이 차단되어 있습니다!")}
}
function help_click(li){
    if(li.style.height=='1000px'){
        for (var i = 0; i < document.querySelectorAll('.help_content').length; i++) {
            document.querySelectorAll('.help_content')[i].style.display = 'none';
        }
        li.style.height='60px';
        return;
    }
    for (var i = 0; i < document.querySelectorAll('.help_content').length; i++) {
        document.querySelectorAll('.help_content')[i].style.display = 'none';
        document.querySelectorAll('.help_content')[i].style.height = '60px';
    }
    li.querySelector('.help_content').style.display='flex';
    li.style.height='1000px';
}


function login(name){
    let username = GetCookie("username");
    let value = document.getElementById(name).value;
    if(value == "") {
        alert("입력된 것이 없습니다");
        return;
    }else if(username == null){
        let expire = new Date();
        expire.setTime(expire.getTime() + (365 * 24 * 3600 * 1000));
        SetCookie("username",value,expire);
        alert("로그인 되었습니다.");
        document.getElementById('login_form').innerHTML = '<div id="id_name">' + username + '</div><br><input type="submit" value="로그아웃">';
        document.getElementById('login_form').onsubmit = function(event) {
            event.preventDefault();
            logout();
        };
        if(document.getElementById('section_title')=='이름으로 로그인하기'){
            document.getElementById('section_title').innerHTML=value+"님, 환영합니다!";
        }
        location.reload();
    }
}

function logout(){
    let username=GetCookie('username');
    document.getElementById('login_form').innerHTML = "<div><label for='id_name'>이름</label></div><input type='text' id='id_name' placeholder='최애리'><br><input type='submit' value='회원 로그인'>";
    document.getElementById('login_form').onsubmit = function(event) {
        event.preventDefault();
        login('id_name');
    };
    document.getElementsByClassName('warning')[0].innerHTML = '비회원 이용 시 프로필을 포함한 일부 기능 사용이 불가능할 수 있습니다.';
    if(document.getElementById('section_title')==username+"님, 환영합니다!"){
        document.getElementById('section_title').innerHTML='이름으로 로그인하기';
    }
    let expire = new Date(0);
    SetCookie('username', username, expire);
    alert('로그아웃 되었습니다.');
    location.reload();
}

function check_login(name){
    let username=GetCookie("username");
    if(username!=null){ location.replace("profile.html"); }
    else{ alert("프로필 기능은 로그인하지 않으면 사용할 수 없습니다! "); }
}

function login_home(){
    let username = GetCookie("username");
    if (username !== null) {
        document.getElementById('login_form').innerHTML = '<div id="id_name">' + username + '</div><br><input type="submit" value="로그아웃">';
        document.getElementById('login_form').onsubmit = function(event) {
            event.preventDefault();
            logout();
        };
        document.getElementsByClassName('warning')[0].innerHTML = '';
    } else {
        document.getElementById('login_form').innerHTML = "<div><label for='id_name'>이름</label></div><input type='text' id='id_name' placeholder='최애리'><br><input type='submit' value='회원 로그인'>";
        document.getElementById('login_form').onsubmit = function(event) {
            event.preventDefault();
            login('id_name');
        };
        document.getElementsByClassName('warning')[0].innerHTML = '비회원 이용 시 프로필을 포함한 일부 기능 사용이 불가능할 수 있습니다.';
    }
}



function append_plan(name){
    let plan=document.querySelector("#planner_list");
    let cont=document.getElementById("planner_cont").value;
    let date=document.getElementById("planner_date").value;

    if(cont.trim() === "" || date.trim()===""){
        alert("계획과 날짜를 모두 입력해야 합니다.");
        return;
    }

    let newdiv=document.createElement("div");
    newdiv.setAttribute("class", date);
    newdiv.setAttribute("id", "plan");

    let new_text=cont+" | 기한:"+date;

    newdiv.appendChild(document.createTextNode(new_text));
    
    plan.insertBefore(newdiv, plan.childNodes[0]);

    document.getElementById("planner_cont").value = "";
    document.getElementById("planner_date").value = "";


    let plans=document.querySelectorAll("#plan");
    for(i=0;i<plans.length;i++){
        plans[i].addEventListener("click", function(){ this.remove(); })
    }

    set_plannerdate();
}

function set_plannerdate(){
    let d=document.getElementById("planner_date");
    let currentDate=new Date();
    currentDate.setDate(currentDate.getDate() + 7); // 현재 날짜로부터 7일 뒤를 계산
    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
    let day = currentDate.getDate().toString().padStart(2, '0');

    let defaultDate = year+'-'+month+'-'+day;
    d.value = defaultDate;
}

function start_lazy(){
    let button = document.getElementById('lazyButton');
    let timer = document.getElementById('timerContainer');
    button.style.display = "none";
    timer.style.display = "flex";

    let randomMinutes = Math.floor(Math.random() * 11) + 10;
    let randomMilliseconds = randomMinutes * 60 * 1000;

    let timerBar = document.getElementById('timerBar');
    timerBar.style.transition = 'none';
    timerBar.style.height = '0%';

    void timerBar.offsetHeight;

    timerBar.style.transition = `height ${randomMilliseconds}ms ease-out`;
    timerBar.style.height = '100%';

    setTimeout(() => {
        alert('타이머 종료!');
        button.style.display = "flex";
        timer.style.display = "none";
    }, randomMilliseconds);

    let lazy_time=retrieve("lazy_time");
    let lazy_able=retrieve("lazy_able");
    if(lazy_time!=-1 && lazy_able==0){ 
        store("lazy_time", parseInt(lazy_time)+parseInt(randomMinutes));
        lazy_able++;
    }else if(lazy_able>0){
        alert("2번 이상 연속으로 미룰 수 없습니다!");
        return;
    }
    else{ return; }
    
}

function start_timer(){
    let focus=document.getElementById("focus");
    let rest=document.getElementById("rest");
    let sections=document.getElementById("section_timer");


}

function profile_onload(){
    let total_study_time=document.getElementById("total_study_time");
    let total_set=document.getElementById("total_set");
    let total_lazy_time=document.getElementById("total_lazy_time");
    let total_out=document.getElementById("total_out");
    let name=document.getElementById("profile_title");

    total_study_time.innerHTML=retrieve("study_time");
    total_set.innerHTML=retrieve("total_set");
    total_lazy_time.innerHTML=retrieve("lazy_time");
    total_out.innerHTML=retrieve("out_time");

    cookie_name=GetCookie("username");
    if(cookie_name==null){ cookie_name="익명"; }
    cookie_name+="님의 기록";
    name.innerHTML=cookie_name;
}

function set_colorpicker(){
    let sec=document.getElementById("section_color");
    let sub=document.getElementById("sub_color");

    let rootStyles = getComputedStyle(document.documentElement);

    let sectionColor = rootStyles.getPropertyValue('--section-color').trim();
    let subColor = rootStyles.getPropertyValue('--sub-color').trim();

    sec.value=sectionColor;
    sub.value=subColor;
}

function change_theme(){
    let sec=document.getElementById("section_color");
    let sub=document.getElementById("sub_color");
    document.documentElement.style.setProperty('--section-color', sec.value);
    document.documentElement.style.setProperty('--sub-color', sub.value);

    store("sectionColor", sec.value);
    store("subColor", sub.value);
}

document.addEventListener('DOMContentLoaded', () => {
    let savedSectionColor = localStorage.getItem('sectionColor');
    let savedSubColor = localStorage.getItem('subColor');
    if (savedSectionColor) {
        document.documentElement.style.setProperty('--section-color', savedSectionColor);
    }
    if (savedSubColor) {
        document.documentElement.style.setProperty('--sub-color', savedSubColor);
    }
});