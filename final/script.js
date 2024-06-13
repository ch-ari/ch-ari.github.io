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
    document.getElementsByClassName('warning')[0].innerHTML = '비회원 이용 시 프로필을 포함한 일부 기능 사용이 불가능할 수 있습니다.';ㅕㅕ
    if(document.getElementById('section_title')==username+"님, 환영합니다!"){
        document.getElementById('section_title').innerHTML='이름으로 로그인하기';
    }
    let expire = new Date();
    SetCookie('username', username, expire.setTime(expire.getTime()-1));
    alert('로그아웃 되었습니다.');
    location.reload();
}

function check_login(name){
    let username=GetCookie("username");
    if(username!=null){ location.replace("profile.html"); }
    else{ alert("프로필 기능은 로그인하지 않으면 사용할 수 없습니다! "); }
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


    let d=document.getElementById("planner_date");
    let currentDate=new Date();
    currentDate.setDate(currentDate.getDate() + 7); // 현재 날짜로부터 7일 뒤를 계산
    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
    let day = currentDate.getDate().toString().padStart(2, '0');

    let defaultDate = year+'-'+month+'-'+day;
    d.value = defaultDate;
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

    let randomMinutes = Math.floor(Math.random() * 6) + 15;
    let randomMilliseconds = randomMinutes * 60 * 1000;

    // 타이머 바 초기화
    let timerBar = document.getElementById('timerBar');
    timerBar.style.transition = 'none';
    timerBar.style.height = '0%';

    // reflow를 강제하여 transition이 적용되도록 함
    void timerBar.offsetHeight;

    // 타이머 바 줄어들기 시작
    timerBar.style.transition = `height ${randomMilliseconds}ms ease-out`;
    timerBar.style.height = '100%';

    // 타이머 끝났을 때의 동작 정의 (선택 사항)
    setTimeout(() => {
        alert('타이머 종료!');
        button.style.display = "flex";
        timer.style.display = "none";
    }, randomMilliseconds);
}