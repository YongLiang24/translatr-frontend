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
<<<<<<< HEAD
<<<<<<< HEAD
  //console.log('click');
  //console.log(langSelect.value)
=======
>>>>>>> 4a1911542ac5c94ea0bc74153535811bcb7659eb
  fetch('http://localhost:3000/api/v1/translate', {
=======
  fetch(baseURL + '/translate', {
>>>>>>> f18833fab8ef309d875035c8ddbae415bf3bb9b9
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
    translation.innerText = json.translation
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
  deleteButton.addEventListener("click", ()=> {
    fetch(baseURL + /trips/ + `${li.getAttribute("trip-id")}`, {
      method: "DELETE"})
      li.remove()
  })
}
