const translateForm = document.getElementById('translate-form');
const langSelect = document.getElementById('lang-select');
const translateText = document.getElementById('translate-text')
const translation = document.getElementById("translation")
const userForm = document.getElementById('user-form')
const userName = document.getElementById('user-name')
const tripForm = document.getElementById('trip-form')
const tripName = document.getElementById('trip-name')

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
    console.log(json)
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
