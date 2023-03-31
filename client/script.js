import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

// write ...
//why element?
function loader(element){
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += "."
    if (element.textContent === "..."){
      element.textContent= ""
    }
  }, 300)
}

//write one letter at a time
//text is the message response (user or ai)?
function typeText(element, text){
  let index = 0;
  let interval = setInterval(() => {
    //we are still typing`
    if (index < text.length) {
      element.innerHTML += text.charAt(index)
      index++
    }
    else{
      clearInterval(interval)
    }
  }, 20)
}

//unique id for each message response
function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16)

  return `id-${timestamp}-${hexadecimalString}`;
}

//stripe effect between user and ai response
function chatStripe(isAI, value, uniqueId){
  return (
    `
      <div class="wrapper ${isAI && 'ai'}">
        <div class="chat">
            <div class="profile">
              <img 
                src="${isAI ? bot : user}"
                alt="${isAI ? 'bot' : 'user'}">
            </div>
            <div class="message" id=${uniqueId}>
              ${value}
            </div>
        </div>
      </div>
    `
  )
}

//submitting the form
const handleSubmit = async (e) => {
  e.preventDefault();

  //user chat stripe
  //what is FormData
  const data = new FormData(form);

  //where is this prompt coming from -  user submitted questions
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset()

  //bot chat stripe

  const uniqueId = generateUniqueId()

  chatContainer.innerHTML += chatStripe(true, " ", uniqueId)
  chatContainer.scrollTop = chatContainer.scrollHeight;

  //fetch this newly created div
  const messageDiv = document.getElementById(uniqueId)

  loader(messageDiv)

  //send post response to server
  const response = await fetch ('http://localhost:5000/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval)
  messageDiv.innerHTML = ''

  //get server response
  if (response.ok){
      const data = await response.json();
      //bot is prop we sent in server
      const parseData = data.bot.trim();
      typeText(messageDiv, parseData);
    }
  else{
    console.log(response)
    const err = await response.text()
    messageDiv.innerHTML = "somwthinf not quite right"

  }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
  if (e.keycode === 13){
    handleSubmit(e);
  }
})
