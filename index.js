const translateForm = document.getElementById('translate-form');
const langSelect = document.getElementById('lang-select');
const translateText = document.getElementById('translate-text')
const translation = document.getElementById("translation")
const userForm = document.getElementById('user-form')
const userName = document.getElementById('user-name')
const tripForm = document.getElementById('trip-form')
const tripName = document.getElementById('trip-name')
const userDisplay = document.getElementById('user-display')
const tripList = document.getElementById("trip-list")
const selectedTrip = document.getElementById('selected-list')
const translationList = document.getElementById("translation-list")
const mainTranslate = document.getElementById('main');
const userLogin = document.getElementById('user-login')
const baseURL = "http://localhost:3000/api/v1"
const clockDiv = document.getElementById("analog-clock")

const currencyDiv = document.getElementById('currency-div')
const currencyForm = document.getElementById('currency-form')
const baseCurrency = document.getElementById('base-currency')
const convertCurrency = document.getElementById('convert-currency')
const displayResult = document.getElementById('display-result')
const CURRENCY_URL = 'https://api.exchangeratesapi.io/latest?base='
const baseSpan = document.getElementById('base-span')
const convertSpan = document.getElementById('convert-span')

// const currencyDate = document.getElementById('date')
userForm.addEventListener('submit', (ev)=> {
  ev.preventDefault()
  if(validateUserForm()){
  clickAudio('click');//play the click
  tripForm.classList.remove('hidden')
  sidebar.classList.remove('hidden')
  userLogin.classList.add('hidden')
  fetch( baseURL + '/users', {
    method: "POST",
    headers:{
      "Content-Type": "application/json",
       Accept: "application/json"
    },
    body: JSON.stringify({
      username: userName.value
    })
  })
  .then(resp => resp.json())
  .then(json => {
    userDisplay.innerText = json.username
    const logoutButton = document.createElement('button')
    logoutButton.innerText = "Logout"
    logoutButton.classList.add("btn-info")
    logoutButton.classList.add("btn")
    logoutButton.classList.add("btn-sm")
    let br = document.createElement('br')
    userDisplay.appendChild(br)
    userDisplay.appendChild(logoutButton)
    logoutButton.addEventListener('click', ()=>{
      clickAudio("logout");
      setTimeout(window.location.reload.bind(location), 1000);
    })

    userDisplay.setAttribute("user-id", json.id)
    userForm.classList.add('hidden')
    clockDiv.classList.add('hidden')
    currencyDiv.classList.add('hidden')
    for (let i = 0; i < json.trips.length; i++){
      addTripToList(json.trips[i])
    }
  })
}
})

tripForm.addEventListener('submit', (ev)=> {
  ev.preventDefault()
if(validateTripForm()){
  clickAudio('click');
  fetch(baseURL + '/trips', {
    method: "POST",
    headers:{
      "Content-Type": "application/json",
       Accept: "application/json"
    },
    body: JSON.stringify({
      name: tripName.value,
      user_id: userDisplay.getAttribute("user-id")
    })
  })
  .then(resp => resp.json())
  .then(json => {
    addTripToList(json)
    tripName.value = ''
  })
}
})

translateForm.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  if(validateTranslateForm()){
    clickAudio("click");
  fetch(baseURL + '/translate', {
    method: "POST",
    headers:{
      "Content-Type": "application/json",
       Accept: "application/json"
    },
    body: JSON.stringify({
      text: translateText.value,
      language: langSelect.value
    })
  })
  .then(resp => {
    return resp.json()
  })
  .then(json => {
      createTranslation(json)
  })
}
})

function addTripToList(trip) {
  let li = document.createElement("li")

  let deleteButton = document.createElement("button")
  let emptySpan = document.createElement("span")
  let tripSpan = document.createElement("span")
  let deleteSpan = document.createElement('span')
  deleteSpan.innerText = "Delete"
  deleteSpan.classList.add("tooltiptext")
  tripSpan.classList.add('trip-list-item')
  emptySpan.innerText = "  "
  deleteButton.classList.add("btn")
  deleteButton.classList.add("btn-danger")
  deleteButton.classList.add("btn-sm")
  deleteButton.setAttribute("id", "delete-list")
  tripSpan.innerText = trip.name
  li.setAttribute("trip-id", trip.id)
  deleteButton.innerText = "X"
  deleteButton.appendChild(deleteSpan)
  li.appendChild(tripSpan)
  li.appendChild(emptySpan)
  li.appendChild(deleteButton)
  // li.classList.add("trip-list-item")
  tripList.appendChild(li)
  tripSpan.addEventListener("click", ()=> {
    clickAudio("list");
    translation.innerText = ''
    mainTranslate.classList.remove('hidden')
    selectedTrip.innerText = trip.name
    selectedTrip.setAttribute("trip-id", trip.id)
    fetch(baseURL + "/trips/" + trip.id,{
      method: "GET"
    })
    .then(resp => resp.json())
    .then(json => {
      translationList.innerText = ''
      for (let i = 0; i < json.translations.length; i++){
        renderTranslation(json.translations[i])
      }
    })
  })
  deleteButton.addEventListener("click", ()=> {

    if (confirm('Are you sure you want to delete this trip?')) {
      clickAudio("delete");
      fetch(baseURL + /trips/ + `${li.getAttribute("trip-id")}`, {
      method: "DELETE"})
      li.remove()
      mainTranslate.classList.add("hidden")
    }
  })
}

function renderTranslation(translation){
  let li = document.createElement("li")
  let deleteButton = document.createElement("button")
  let emptySpan = document.createElement("span")
  let hoverSpan = document.createElement('span')
  hoverSpan.classList.add("tooltiptext")
  hoverSpan.innerText = "Delete"
  emptySpan.innerText = "  "
  deleteButton.innerText = "X"
  deleteButton.classList.add("btn")
  deleteButton.classList.add("btn-danger")
  deleteButton.classList.add("btn-sm")
  deleteButton.setAttribute("id", "tooltip")
  deleteButton.appendChild(hoverSpan)
  li.setAttribute("translation-id", translation.id)
  li.innerText = translation.source_text + " - " + translation.output_text
  li.appendChild(emptySpan)
  li.appendChild(deleteButton)
  translationList.appendChild(li)
  deleteButton.addEventListener("click", ()=>{

    if (confirm('Are you sure you want to delete this translation?')){
      clickAudio("delete");
    fetch(baseURL + "/translations/" + translation.id , {
      method: "DELETE"
    })
    li.remove()
  }
  })
}

function createTranslation(json){
  translation.innerText = ""
  let sourceSpan = document.createElement("span")
  sourceSpan.setAttribute("id", "source")
  let outputSpan = document.createElement("span")
  outputSpan.setAttribute("id", "output")
  let spacingSpan = document.createElement("span")
  let spacingSpanSave = document.createElement("span")
  spacingSpanSave.innerText = "  "
  let saveButton = document.createElement("button")
  saveButton.classList.add("btn")
  saveButton.classList.add("btn-info")
  saveButton.innerText = "Save Translation to Trip"
  spacingSpan.innerText = " - "
  sourceSpan.innerText = translateText.value
  outputSpan.innerText = json.translation
  translation.appendChild(sourceSpan)
  translation.appendChild(spacingSpan)
  translation.appendChild(outputSpan)
  translation.appendChild(spacingSpanSave)
  translation.appendChild(saveButton)
  translateText.value = ''
  saveButton.addEventListener("click", (ev) => {
    clickAudio("save");
    fetch(baseURL + '/trips/' + selectedTrip.getAttribute("trip-id") + "/translations", {
      method: "POST",
      headers:{ "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
         source_text: sourceSpan.innerText,
         output_text: outputSpan.innerText
      })
    })
    .then(resp => resp.json())
    .then(json => {
      renderTranslation(json)
      translation.innerText = ''
    })
  })
}

function validateUserForm(){
  if(userName.value == ''){
    clickAudio("error");
    alert('Username must be filled out.');
    return false;
  }
  else {
    return true;
  }
}

function validateTripForm(){
  if(tripName.value == ''){
    clickAudio("error");
    alert('Trip name must be filled out.');
    return false;
  }
  else {
    return true;
  }
}

function validateTranslateForm(){
  if(translateText.value == ''){
    clickAudio("error");
    alert('Translate text must be filled out.');
    return false;
  }
  else {
    return true;
  }
}

//clock starts
function clock(){

    let d, h, m, s;
    d = new Date;
    h = 30 * ((d.getHours() % 12) + d.getMinutes() / 60);
    m = 6 * d.getMinutes();
    s = 6 * d.getSeconds();

    setAttr('h-hand', h);
    setAttr('m-hand', m);
    setAttr('s-hand', s);
    setAttr('s-tail', s+180);

    h = d.getHours();
    m = d.getMinutes();
    s = d.getSeconds();
    if(h >= 12){
        setText('suffix', 'PM');
    }else{
        setText('suffix', 'AM');
    }
    if(h != 12){
        h %= 12;
    }
    setText('sec', s);
    setText('min', m);
    setText('hr', h);
    setTimeout(clock, 1000);
};

function setAttr(id,val){
    let v = 'rotate(' + val + ', 70, 70)';
    document.getElementById(id).setAttribute('transform', v);
};

function setText(id,val){
    if(val < 10){
        val = '0' + val;
    }
    document.getElementById(id).innerHTML = val;
};
clock();
//clock ends

//currency converter start
currencyForm.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  clickAudio("click");
  fetch(CURRENCY_URL + baseCurrency.value + '&symbols=' + convertCurrency.value)
  .then(resp => resp.json())
  .then(json =>{
    baseSpan.innerText = '1 ' + json.base + ' = ';
    convertSpan.innerText = Object.values(json.rates)[0].toFixed(2) + ' ' + convertCurrency.value;
    // currencyDate.innerText = 'Date: ' + json.date;
  })
})
//currency converter ends

//clicking sounds start
function clickAudio(play) {
  let click = document.getElementById("click-audio");
  let logoutAudio = document.getElementById("logout-audio");
  let errorAudio = document.getElementById('error-audio');
  let deleteAudio = document.getElementById('delete-audio');
  let saveAudio = document.getElementById('save-audio');
  let listAudio = document.getElementById("list-audio");
  switch(play){
    case "click":
      click.play();
      break;
    case "error":
      errorAudio.play();
      break;
    case "logout":
      logoutAudio.play();
      break;
    case "delete":
      deleteAudio.play();
      break;
    case "save":
      saveAudio.play();
      break;
    case "list":
      listAudio.play();
      break;
  }
}
//clicking sounds ends
