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
});

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

function append_rate(){
    let r = document.querySelector("#rate_list");
    let rate = document.getElementById("rate").value;
    let star_rate = parseInt(document.getElementById("star_rate").value);
    let place = document.getElementById("place").value;
    let place_name = document.getElementById("placeName").value;

    if(rate === "" || isNaN(star_rate) || place === "" || place_name === ""){
        alert("모든 요소를 입력해야 합니다.");
        return;
    }

    let newdiv = document.createElement("div");
    newdiv.setAttribute("class", star_rate);
    newdiv.setAttribute("id", "rates");

    let s = "";
    switch(star_rate){
        case 0: s = "☆☆☆☆☆"; break;
        case 1: s = "★☆☆☆☆"; break;
        case 2: s = "★★☆☆☆"; break;
        case 3: s = "★★★☆☆"; break;
        case 4: s = "★★★★☆"; break;
        case 5: s = "★★★★★"; break;
    }

    let new_text = place_name + " || 주소명 : " + place + " || 평점 : " + s + " || 한줄평 : " + rate;
    newdiv.appendChild(document.createTextNode(new_text));

    document.getElementById("rate").value = "";
    document.getElementById("place").value = "";

    let mapbutton=document.createElement("button");
    mapbutton.innerHTML="위치"
    mapbutton.setAttribute("class", "places_top");
    mapbutton.addEventListener("click", function(){
        let address = (place.split(' || '))[1].slice(5).trim();
        showOnMap(address);
    });


    let topButton=document.createElement("button");
    topButton.innerHTML="대표 설정";
    topButton.setAttribute("value", place_name);
    topButton.setAttribute("class", "places_top");
    topButton.addEventListener("click", function(){
        store("place_rate_top", place_name);
    })
    newdiv.appendChild(topButton);

    let newbutton = document.createElement("input");
    newbutton.setAttribute("type", "submit");
    newbutton.setAttribute("id", "deleteButton");
    newbutton.setAttribute("value", "삭제");

    newbutton.addEventListener("click", function(){
        newdiv.remove();
        saveRates();
    });
    newdiv.appendChild(newbutton);

    r.insertBefore(newdiv, r.childNodes[0]);

    saveRates();
}

function saveRates(){
    let rates = document.querySelectorAll("#rates");
    let planArray = [];
    rates.forEach(rates => {
        let textContent = rates.textContent.slice(0, -5);
        textContent=textContent.split("위치 표시");
        planArray.push(textContent[0]);
    });
    store("rates", JSON.stringify(planArray));

    rates = document.querySelectorAll(".places_top");
    planArray = [];
    rates.forEach(rates => {
        planArray.push(rates.value);
    });
    store("places_name", JSON.stringify(planArray));
}

function loadRates(){
    let plans = localStorage.getItem("rates");
    let places = localStorage.getItem("places_name");
    if (plans && places) {
        let planArray = JSON.parse(plans);
        let place_name = JSON.parse(places);
        for (let i = 0; i < planArray.length; i++) {
            let newdiv = document.createElement("div");
            newdiv.setAttribute("id", "rates");

            let texts = document.createTextNode(planArray[i]);
            newdiv.appendChild(texts);

            let mapbutton=document.createElement("button");
            mapbutton.innerHTML="위치 표시"
            mapbutton.setAttribute("class", "places_top");
            mapbutton.addEventListener("click", function(){
                let address = ((planArray[i].split(' || '))[1].slice(5)).trim();
                showOnMap(address);
            });
            newdiv.appendChild(mapbutton);

            let topButton = document.createElement("button");
            topButton.innerHTML="대표 설정";
            topButton.setAttribute("value", place_name[i]);
            topButton.setAttribute("class", "places_top");
            topButton.addEventListener("click", function () {
                store("place_rate_top", place_name[i]);
                alert("주 공부 장소가 "+ place_name[i] + "(으)로 설정되었습니다!");
            });
            newdiv.appendChild(topButton);

            let newbutton = document.createElement("input");
            newbutton.setAttribute("type", "submit");
            newbutton.setAttribute("value", "삭제");
            newbutton.setAttribute("id", "deleteButton");
            newbutton.addEventListener("click", function () {
                newdiv.remove();
                let check=localStorage.getItem("place_rate_top");
                if(check==place_name[i]){ store("place_rate_top", ""); }
                saveRates();
            });
            newdiv.appendChild(newbutton);

            document.querySelector("#rate_list").appendChild(newdiv);
        }
    }
}


function showOnMap(address) {
    naver.maps.Service.geocode({ query: address }, function(status, response) {
        if (status !== naver.maps.Service.Status.OK) {
            return alert('Something wrong!');
        }

        console.log(response); // 응답 객체를 로그로 출력하여 확인

        if (!response.v2 || !response.v2.addresses || response.v2.addresses.length === 0) {
            return alert('해당 주소는 존재하지 않습니다!');
        }

        let result = response.v2.addresses[0];
        let coords = new naver.maps.LatLng(result.y, result.x);

        map.setCenter(coords);
        new naver.maps.Marker({
            position: coords,
            map: map
        });
    });
}


