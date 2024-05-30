function open_help(url){
    var left = (screen.availWidth-1000) / 2;
    var top = (screen.availHeight-600) / 2 - 50;
    var opt = "left=" + left + ",top=" + top + ",width=" + 1000  + ",height=" + 600;
    const help_win=window.open(url, "pop", opt);
    if(help_win == null){ alert("팝업이 차단되어 있습니다!")}
}