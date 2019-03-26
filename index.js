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

const baseURL = "http://localhost:3000/api/v1"

userForm.addEventListener('submit', (ev)=> {
  ev.preventDefault()
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
    userDisplay.setAttribute("user-id", json.id)
    userForm.classList.add('hidden')
    for (let i = 0; i < json.trips.length; i++){
      addTripToList(json.trips[i])
    }
  })
})

tripForm.addEventListener('submit', (ev)=> {
  ev.preventDefault()
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
})

translateForm.addEventListener('submit', (ev)=>{
  ev.preventDefault();
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
})

function addTripToList(trip) {
  let li = document.createElement("li")
  let deleteButton = document.createElement("button")
  li.innerText = trip.name
  li.setAttribute("trip-id", trip.id)
  deleteButton.innerText = "Delete"
  li.appendChild(deleteButton)
  tripList.appendChild(li)
  li.addEventListener("click", ()=> {
    selectedTrip.innerText = trip.name
    selectedTrip.setAttribute("trip-id", trip.id)
    fetch(baseURL + "/trips/" + trip.id,{
      method: "GET"
    })
    .then(resp => resp.json())
    .then(json => {
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
    }
  })
}

function renderTranslation(translation){
  let li = document.createElement("li")
  li.innerText = translation.source_text + " - " + translation.output_text
  translationList.appendChild(li)
}

function createTranslation(json){
  let sourceSpan = document.createElement("span")
  sourceSpan.setAttribute("id", "source")
  let outputSpan = document.createElement("span")
  outputSpan.setAttribute("id", "output")
  let spacingSpan = document.createElement("span")
  let saveButton = document.createElement("button")
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
    })
  })
}
