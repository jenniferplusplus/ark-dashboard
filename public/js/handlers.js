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
        var status = document.getElementById('status');
        var name = document.getElementById('name');
        var players = document.getElementById('players');
        if(xhr.response.error || !xhr.response.status){
          console.error(xhr.response);
          status.innerText = 'error';
          name.innerText = 'error';
          players.innerText = 'error';
          return;
        }
        else {
          status.innerText = xhr.response.status;
          name.innerText = xhr.response.serverName;
          players.innerText = xhr.response.numberOfPlayers;
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
  var sid = cookie.slice(cookie.indexOf('connect.sid='));
  sid = sid.slice(0, sid.indexOf(';'));
  var password = document.getElementById('password').value;
  var payload = hex_sha1(sid + password);
  xhr.send(JSON.stringify({authKey:payload}));
}
