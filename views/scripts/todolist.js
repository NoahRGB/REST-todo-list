var container = document.getElementById("todolist-container");
var retrievedItems = [];

//function to send https requests using XMLHttpRequesst
function sendHttpRequest(method, url, data) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.responseType = "json";
    if (data) {
      xhr.setRequestHeader("Content-Type", "application/json");
    }



    xhr.send(JSON.stringify(data));

    xhr.onload = function() {
      resolve(xhr.response);
    }
  });
  return promise;
}

//uses function sendHttpRequest() to GET all the items in the todolist and add them to the container
function renderTodoItems(deletedId) {
  sendHttpRequest("GET", "http://localhost:3000/todo-items").then(response => {
    retrievedItems = [];
    for (var i = 0; i < response.length; i++) {
      retrievedItems.push([response[i].id, response[i].description]);
    }
    var toExclude;
    if (deletedId) {
      for (var item of retrievedItems) {
        if (item[0] == deletedId) toExclude = item;
      }
    }
    while (container.firstChild) {
      container.firstChild.remove();
    }
    console.log("Clearing container and adding new items");
    for (var item of retrievedItems) {
      if (item != toExclude) {
        var pEl = document.createElement("p");
        pEl.innerHTML = item[1];
        pEl.setAttribute("id", "list-item");
        pEl.setAttribute("onclick", "getClickedItem(this)");
        container.appendChild(pEl);
      }
    }
  });
}

renderTodoItems();

function getClickedItem(el) {
  // console.log(el.innerHTML);
  var clickedId;
  for (var item of retrievedItems) {
    if (item[1] == el.innerHTML) {
      clickedId = item[0].toString()
    }
  }
  sendHttpRequest("POST", "http://localhost:3000/remove-item", {
    id:clickedId
  }).then(response => {
    renderTodoItems(clickedId);
  });

}
