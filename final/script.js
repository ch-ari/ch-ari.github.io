function open_help(url){
    var left = (screen.availWidth-1200) / 2;
    var top = (screen.availHeight-800) / 2 - 50;
    var opt = "left=" + left + ",top=" + top + ",width=" + 1200  + ",height=" + 800;
    const help_win=window.open(url, "pop", opt);
    if(help_win == null){ alert("팝업이 차단되어 있습니다!")}
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
        location.replace("home_login.html");
        document.getElementById('login_form').innerHTML='<div id="id_name">'+value+'</div><br><input type="submit" value="로그아웃">';
        document.getElementById('login_form').onsubmit="logout('id_name'); event.preventDefault();";
        document.getElementsByClassName('warning').innerHTML=''
    }
}

function logout(){
    let username=GetCookie('username');
    let expire = new Date();
    SetCookie('username', username, expire);
    document.getElementById('login_form').innerHTML="<div><label for='id_name'>이름</label></div><input type='text' id='id_name' placeholder='최애리'><br><input type='submit' value='회원 로그인'>";
    document.getElementById('login_form').onsubmit="login('id_name'); event.preventDefault();";
    document.getElementsByClassName('warning').innerHTML='비회원 이용 시 프로필을 포함한 일부 기능 사용이 불가능할 수 있습니다.'
}

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

function check_login(){
    let username=GetCookie("username");
    if(username==null){ return False; }
    else{ return true; }
}

function check_main(){
    if(check_login()){}
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