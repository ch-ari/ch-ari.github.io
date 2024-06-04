function open_help(url){
    var left = (screen.availWidth-1200) / 2;
    var top = (screen.availHeight-800) / 2 - 50;
    var opt = "left=" + left + ",top=" + top + ",width=" + 1200  + ",height=" + 800;
    const help_win=window.open(url, "pop", opt);
    if(help_win == null){ alert("팝업이 차단되어 있습니다!")}
}

function login(formname){
    if(document.getElementById(formname).value != ""){
        alert("로그인하기")
    }else {
        alert("입력된 것이 없습니다")
    }
    
}

function check_login(){
    alert("로그인 하셨나요?")
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