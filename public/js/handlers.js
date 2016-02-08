function getStatus(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', basepath + '/status');
  xhr.onreadystatechange = function (state){
    switch (state){
      case 0: //UNSENT
            break;
      case 1: //OPENED
            break;
      case 2: //HEADERS_RECEIVED
            break;
      case 3: //LOADING
            break;
      case 4: //DONE
        if(xhr.response.error){
          console.error(xhr.response);
          document.getElementById('status').getElementsByTagName('p').text = 'error';
          document.getElementById('name').getElementsByTagName('p').text = 'error';
          document.getElementById('players').getElementsByTagName('p').text = 'error';
          return;
        }
        document.getElementById('status').getElementsByTagName('p').text = xhr.response.status;
        document.getElementById('name').getElementsByTagName('p').text = xhr.response.serverName;
        document.getElementById('players').getElementsByTagName('p').text = xhr.response.numberOfPlayers;
        break;
      default: //ERROR
            break;
    }
  };
  xhr.send();
}

function postRestart(endpoint){
  var xhr = XMLHttpRequest();
}
