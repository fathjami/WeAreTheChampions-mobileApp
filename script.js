const endorInput = document.getElementById('endor-input');
const fromInput = document.getElementById('from-input');
const toInput = document.getElementById('to-input');
const publishBtn = document.getElementById('publish');
const endorConatainer = document.querySelector('.endorsements-container');
const endorDiv = document.getElementsByClassName('endorsement');
const endorList = document.querySelector('.endor-list');

//dataBase

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

import { getDatabase ,ref , push, onValue} from  "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://we-are-the-champions-c400f-default-rtdb.firebaseio.com/"
}

// initialize firebase using appSettings
const app = initializeApp(appSettings);

// get the database reference using the getDatabase mehtod
const dataBase = getDatabase(app);

// specify a path (endorsements) to the location in the database 
const endorsementsInDb = ref(dataBase, "endorsements");

// create an endorsement object to store all the data needed
const endor = {
    text : "",
    from: "",
    to: "",
    likesCount: 0,
};

onValue(endorsementsInDb, function(snapshot){

    let objArray = Object.values(snapshot.val());

    clearList();

    for(let i = 0; i < objArray.length; i++){
        createAndAppendListItem(objArray[i]);
    }
})

publishBtn.addEventListener('click', function(){

    fillEndorsementObject(endorInput.value, fromInput.value ,toInput.value);

    push(endorsementsInDb, endor);

    clearInputs();

    // createAndAppendListItem(endor);
})


function fillEndorsementObject(input, from, to){
    if (input != "" && from != "" && to != ""){
        endor.text = input;
        endor.from = from;
        endor.to = to;
    }
}

function clearInputs() {
    endorInput.value = "";
    fromInput.value = "";
    toInput.value = "";
}


function createAndAppendListItem(obj) {
    let li = document.createElement('li');
    li.classList.add('endorsement');
    let pTo = document.createElement('p');
    pTo.classList.add('endor-to');
    let pFrom = document.createElement('p');
    pFrom.classList.add('endor-from');
    let pText = document.createElement('p');
    pText.classList.add('endor-text');
    let fromLikesDiv = document.createElement('div');
    fromLikesDiv.classList.add('from-likes');
    let pLikes = document.createElement('p');
    pLikes.classList.add('likes-count');

    pTo.textContent = "To " + obj.to;
    pFrom.textContent = "From " + obj.from;
    pText.textContent = obj.text;
    pLikes.textContent =  "♥︎ " + obj.likesCount;

    fromLikesDiv.appendChild(pFrom);
    fromLikesDiv.appendChild(pLikes);

    li.appendChild(pTo);
    li.appendChild(pText);
    li.appendChild(fromLikesDiv);

    endorList.appendChild(li);
}

function clearList(){
    endorList.innerHTML = "";
}