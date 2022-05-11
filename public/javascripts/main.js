const mapOptions = {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom:7,
};

const map = new naver.maps.Map("map", mapOptions);
map.setOptions({
    logoControl: false,
    scaleControl: true,
    zoomControl: true, 
    zoomControlOptions : {
      style: naver.maps.ZoomControlStyle.LARGE,
      position: naver.maps.Position.LEFT_CENTER
    },
    mapDataControl: false, 
    mapTypeControl: false,
    });

$.ajax({
    url: "/location",
    type: "GET",
}).done((response) =>{
    if (response.message !== "success") return;
    const data = response.data;

    
    let markerList =[];
let infowindowList = [];

const getClickHandler = (i) =>() => {
    const marker = markerList[i];
    const infowindow = infowindowList[i];
    if (infowindow.getMap()) {
      infowindow.close();
    } else {
      infowindow.open(map,marker);
    }
};

const getClickMap = (i) => () => {
    const infowindow = infowindowList[i];
    infowindow.close();
};

for (let i in data){
    const target = data[i];
    const latlng = new naver.maps.LatLng(target.lat, target.lng);

    let marker = new naver.maps.Marker({
        map: map,
        position: latlng,
        icon : {
            content : `<div class ="marker"></div>`,
            anchor: new naver.maps.Point(7.5,7.5),
        },
    });

    const content = `
        <div class = "infowindow_wrap">
           <img src = "${target.image}"/ width= "100px" height="100px">
           <div class ="infowindow_policyname"> 정책명: ${target.policyname}</div>
           <hr style = align ="center" style= "border: solid 10px; width: 80 %;">  
           <div class ="infowindow_votetitle"> 선거명: ${target.votetitle}</div>
           <div class = "infowindow_name"> 이름: ${target.name}</div>
           <div class = "infowindow_party"> 정당명: ${target.party}</div>
           <div class ="infowindow_title"> 장소: ${target.title}</div>
           <div class = "infowindow_address">주소: ${target.address}</div>
           <div class = "infowindow_content"> 주요 내용: ${target.content}</div>
           <a href ="${target.contact}" target="_self">연락처</a>
        </div>
    `;

    const infowindow = new naver.maps.InfoWindow({
        content: content,
        backgroundColor: "#00ff0000",
        borderColor: "#00ff0000",
        anchorSize: new naver.maps.Size(0,0),
    });

    markerList.push(marker);
    infowindowList.push(infowindow);
}

for (let i = 0, ii = markerList.length; i<ii; i++) {
  naver.maps.Event.addListener(markerList[i], "click" ,getClickHandler(i));
  naver.maps.Event.addListener(map, "click" ,getClickMap(i));
}

const cluster1 = {
    content: `<div class = "cluster1"></div>`,
};

const cluster2 = {
    content: `<div class = "cluster2"></div>`,
};

const cluster3 = {
    content: `<div class = "cluster3"></div>`,
};

const markerClustering = new MarkerClustering({
    minClusterSize:2,
    maxZoom: 12,
    map: map,
    markers: markerList,
    disableClickZoom: false,
    gridSize: 20,
    icons: [cluster1, cluster2, cluster3],
    indexGernerator: [2,5,10],
    stylingFunction:(clusterMarker, count) =>{
        $(clusterMarker.getElement()).find("div:first-child").text(count);    
    },
});
}); 

const urlPrefix = "https://navermaps.github.io/maps.js/docs/data/region";
const urlSuffix = ".json";

let regionGeoJson =[];
let loadCount = 0;

const tooltip = $(
    `<div style = "position:abolute; z-index:1000; padding:5px 10px; background: white; border: 1px solid black; font-size:14px; display:none; pointer-events:none;"></div>`
);

tooltip.appendTo(map.getPanes().floatPane);

naver.maps.Event.once(map,"init_stylemap",()=>{
    for (let i =1; i<18; i++){
        let keyword = i.toString();
        if (keyword.length ===1) { 
        keyword = "0" + keyword;
        }
        $.ajax({
            url : urlPrefix + keyword + urlSuffix,
        }).done((geojson)=> {
            regionGeoJson.push(geojson);
            loadCount++;
            if (loadCount === 17) {
                startDataLayer();
            }
        });
    }
});



function onSuccessGeolocation(position) {
    var location = new naver.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

    map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
    map.setZoom(15); // 지도의 줌 레벨을 변경합니다.

    infowindow.setContent('<div style="padding:20px;">' + 'geolocation.getCurrentPosition() 위치' + '</div>');

    infowindow.open(map, location);
    console.log('Coordinates: ' + location.toString());
}

function onErrorGeolocation() {
    var center = map.getCenter();

    infowindow.setContent('<div style="padding:20px;">' +
        '<h5 style="margin-bottom:5px;color:#f00;">Geolocation failed!</h5>'+ "latitude: "+ center.lat() +"<br />longitude: "+ center.lng() +'</div>');

    infowindow.open(map, center);
}

$(window).on("load", function() {
    if (navigator.geolocation) {
        /**
         * navigator.geolocation 은 Chrome 50 버젼 이후로 HTTP 환경에서 사용이 Deprecate 되어 HTTPS 환경에서만 사용 가능 합니다.
         * http://localhost 에서는 사용이 가능하며, 테스트 목적으로, Chrome 의 바로가기를 만들어서 아래와 같이 설정하면 접속은 가능합니다.
         * chrome.exe --unsafely-treat-insecure-origin-as-secure="http://example.com"
         */
        navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
    } else {
        var center = map.getCenter();
        infowindow.setContent('<div style="padding:20px;"><h5 style="margin-bottom:5px;color:#f00;">Geolocation not supported</h5></div>');
        infowindow.open(map, center);
    }
});