const planningForm = document.getElementById('planning-form');
const langSelect = document.getElementById('lang-select');
const translateText = document.getElementById('translate-text')

planningForm.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  console.log('click');
  console.log(langSelect.value)
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
})
