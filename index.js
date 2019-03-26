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
const mainTranslate = document.querySelector('main');
const userLogin = document.getElementById('user-login')

const baseURL = "http://localhost:3000/api/v1"

const clockDiv = document.getElementById("analog-clock")

userForm.addEventListener('submit', (ev)=> {
  ev.preventDefault()
  if(validateUserForm()){
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
      window.location.reload()
    })

    userDisplay.setAttribute("user-id", json.id)
    userForm.classList.add('hidden')
    clockDiv.classList.add('hidden')
    for (let i = 0; i < json.trips.length; i++){
      addTripToList(json.trips[i])
    }
  })
}
})

tripForm.addEventListener('submit', (ev)=> {
  ev.preventDefault()
if(validateTripForm()){
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
  emptySpan.innerText = "  "
  deleteButton.classList.add("btn")
  deleteButton.classList.add("btn-danger")
  deleteButton.classList.add("btn-sm")

  tripSpan.innerText = trip.name
  li.setAttribute("trip-id", trip.id)
  deleteButton.innerText = "X"
  li.appendChild(tripSpan)
  li.appendChild(emptySpan)
  li.appendChild(deleteButton)
  tripList.appendChild(li)
  tripSpan.addEventListener("click", ()=> {
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
  emptySpan.innerText = "  "
  deleteButton.innerText = "X"
  deleteButton.classList.add("btn")
  deleteButton.classList.add("btn-danger")
  deleteButton.classList.add("btn-sm")
  li.setAttribute("translation-id", translation.id)
  li.innerText = translation.source_text + " - " + translation.output_text
  li.appendChild(emptySpan)
  li.appendChild(deleteButton)
  translationList.appendChild(li)
  deleteButton.addEventListener("click", ()=>{
    if (confirm('Are you sure you want to delete this translation?')){
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
  translation.appendChild(saveButton)
  translateText.value = ''
  saveButton.addEventListener("click", (ev) => {
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
    alert('Username must be filled out.');
    return false;
  }
  else {
    return true;
  }
}

function validateTripForm(){
  if(tripName.value == ''){
    alert('Trip name must be filled out.');
    return false;
  }
  else {
    return true;
  }
}

function validateTranslateForm(){
  if(translateText.value == ''){
    alert('Translate text must be filled out.');
    return false;
  }
  else {
    return true;
  }
}

//clock starts
function clock(){
    //calculate angle
    let d, h, m, s;
    d = new Date;
    h = 30 * ((d.getHours() % 12) + d.getMinutes() / 60);
    m = 6 * d.getMinutes();
    s = 6 * d.getSeconds();
    //move hands
    setAttr('h-hand', h);
    setAttr('m-hand', m);
    setAttr('s-hand', s);
    setAttr('s-tail', s+180);
    //display time
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
    //call every second
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
