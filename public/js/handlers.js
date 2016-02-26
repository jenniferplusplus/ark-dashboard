function getStatus(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', basepath + '/status');
  xhr.onreadystatechange = function (){
    switch (xhr.readyState){
      case 0: //UNSENT
            break;
      case 1: //OPENED
            break;
      case 2: //HEADERS_RECEIVED
            break;
      case 3: //LOADING
            break;
      case 4: //DONE
        var response = JSON.parse(xhr.response);
        var status = document.getElementById('status');
        var name = document.getElementById('name');
        var players = document.getElementById('players');
        status.innerText  = response.status          || 'error';
        name.innerText    = response.serverName      || 'error';
        players.innerText = response.numberOfPlayers || 'error';
        if(response.error){
          console.log(response.error);
        }
        break;
      default: //ERROR
            break;
    }
  };
  xhr.send();
}

function postRestart(endpoint){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', basepath + '/' + endpoint);
  xhr.setRequestHeader('content-type', 'application/json');
  var cookie = document.cookie;
  var cookieName = 'connect.sid=s%3A';
  var sid = cookie.slice(cookie.indexOf(cookieName) + cookieName.length);
  sid = sid.slice(0, sid.indexOf('.'));
  var password = document.getElementById('password').value;
  var payload = hex_sha1(sid + password);
  xhr.send(JSON.stringify({authKey:payload}));
}
