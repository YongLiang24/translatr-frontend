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

userForm.addEventListener('submit', (ev)=> {
  ev.preventDefault()
  fetch('http://localhost:3000/api/v1/users', {
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
  })
})

tripForm.addEventListener('submit', (ev)=> {
  ev.preventDefault()
  fetch('http://localhost:3000/api/v1/trips', {
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
    let li = document.createElement("li")
    li.innerText = json.name
    tripList.appendChild(li)
    tripName.value = ''
  })
})

translateForm.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  fetch('http://localhost:3000/api/v1/translate', {
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
