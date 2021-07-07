// Display the current version
let version = window.location.hash.substring(1);
document.getElementById('version').innerText = version;

function setMessages(text) {
  var container = document.getElementById('messages');
  var message = document.createElement('div');
  message.innerHTML = text;
  container.appendChild(message);  
}

window.bridge.receive("fromMain", (data) => {
    setMessages(data);
    //console.log(`Received ${data} from main process`);
})
//window.bridge.send("toMain", "some data")
