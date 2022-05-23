// declare variables
let mapOptions = {'center': [34.0709,-118.444],'zoom':15}

// use the variables
const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
});

Esri_WorldGrayCanvas.addTo(map)

let inState = L.featureGroup();
let outOfState = L.featureGroup();
let intl = L.featureGroup();

//define layers
let layers = {
    "In state student": inState,
    "Out of state student": outOfState,
    "International student": intl
}

// add layer control box (legend)
L.control.layers(null,layers).addTo(map)

function addMarker(data){
    // console.log(data)
    // these are the names of our lat/long fields in the google sheets:
    if(data.student == "In State"){
        inState.addLayer(L.circleMarker([data.lat,data.lng],
            {"radius": 10,
            "color": "#C66FB3",
            "weight":5,
            "opacity":500}).addTo(map).
        bindPopup(`<h2>${data.college}</h2> <h3>${data.job}</h3> <h4>${data.how}</h4>`))
        createButtons(data.lat,data.lng,data['student'])
    }
    else if(data.student == "Out of State"){
        outOfState.addLayer(L.circleMarker([data.lat,data.lng],
            {"radius": 10,
            "color": "#2D3047",
            "weight":5,
            "opacity":500}).addTo(map).
        bindPopup(`<h2>${data.college}</h2> <h3>${data.job}</h3> <h4>${data.how}</h4>`))
        createButtons(data.lat,data.lng,data['student'])
    }
    else{
        intl.addLayer(L.circleMarker([data.lat,data.lng],
            {"radius": 10,
            "color": "#C66FB3",
            "weight":5,
            "opacity":500}).addTo(map).
        bindPopup(`<h2>${data.college}</h2> <h3>${data.job}</h3> <h4>${data.how}</h4>`))
        createButtons(data.lat,data.lng,data['student'])
    }
    return
}

function createButtons(lat,lng,title){
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "button"+title; // gives the button a unique id
    newButton.innerHTML = title; // gives the button a title
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); // sets the longitude 
    newButton.addEventListener('click', function(){
        map.flyTo([lat,lng]); //this is the flyTo from Leaflet
    })
    const spaceForButtons = document.getElementById('placeForButtons')
    spaceForButtons.appendChild(newButton);//this adds the button to our page.
}

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgzJYv5patSDAIUAzaoz-tC7pCmrNRCJEopbJlOAVuLnkw0GFzTycLxJCwPh-pQqL4UItpy27X4prg/pub?output=csv"

function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
}

function processData(results){
    console.log(results)
    results.data.forEach(data => {
        console.log(data)
        addMarker(data)
    })
    inState.addTo(map)
    outOfState.addTo(map)
    intl.addTo(map)
}

loadData(dataUrl)
