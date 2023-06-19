const endorInput = document.getElementById('endor-input');
const fromInput = document.getElementById('from-input');
const toInput = document.getElementById('to-input');
const publishBtn = document.getElementById('publish');
const endorList = document.querySelector('.endor-list');

//dataBase

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

import { getDatabase ,ref , push, onValue, runTransaction, set} from  "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

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

let likes = [];
let likesArr = JSON.parse(localStorage.getItem("likesArr"));

if (likesArr){
    likes.push(...likesArr);
}

onValue(endorsementsInDb, function(snapshot){

    //get obj as an array from dataBase
    let objArray = Object.entries(snapshot.val());

    clearList();

    for(let i = 0; i < objArray.length; i++){

        createAndAppendListItem(objArray[i]);
    }
})

publishBtn.addEventListener('click', function(){

    fillEndorsementObject(endorInput.value, fromInput.value ,toInput.value);

    if (!isObjEmpty(endor))
        push(endorsementsInDb, endor);

    clearInputs();

})


function isObjEmpty(obj){
    return(obj.text === "" || obj.from === "" || obj.to === "");
}

function fillEndorsementObject(input, from, to){

        endor.text = input;
        endor.from = from;
        endor.to = to;
}

function clearInputs() {
    endorInput.value = "";
    fromInput.value = "";
    toInput.value = "";
}

function clearList(){
    endorList.innerHTML = "";
}

function createAndAppendListItem(item) {

    let obj = item[1];
    let objId = item[0];

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
    pLikes.id = objId;

    if (likes.find(like => like === objId)){
        pLikes.classList.add('liked');
    }

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


endorList.addEventListener('click', function(e){
    if (e.target.classList.contains('likes-count'))
    {  console.log(localStorage.getItem('liked'));
        let id = e.target.id;
        CheckIfLiked(id);
    }
})


function CheckIfLiked(id ){

    //use the id to store if the user liked a specific post in his localstorage
    if (likes.find(like => like === id) === undefined){
        likes.push(id);
        localStorage.setItem('likesArr', JSON.stringify(likes));
        incrementLikesCount(id);
    }else {
        likes.splice(likes.indexOf(id), 1);
        localStorage.setItem('likesArr', JSON.stringify(likes));
        decrementLikesCount(id);
    }
}


function incrementLikesCount(id){
    let exactLocationOfItemInDB = ref(dataBase, `endorsements/${id}/likesCount`);
    
    /* The runTransaction() function in Firebase Realtime Database allows you
    to perform a transactional update on a specific data location.*/
    
    runTransaction(exactLocationOfItemInDB, (likesCount) => {
        if (likesCount === null) {
          return 1; 
        } else {
            return likesCount + 1; 
        }
      })
        .then(() => {
        //   console.log('Likes count incremented successfully!');
        })
        .catch((error) => {
            console.log('Error incrementing likes count: ' + error.message);
        });
}

    function decrementLikesCount(id){
        let exactLocationOfItemInDB = ref(dataBase, `endorsements/${id}/likesCount`);
    
        runTransaction(exactLocationOfItemInDB, (likesCount) => {
            if (likesCount === null || likesCount === 0) {
              return 0; 
            } else {
              return likesCount - 1; 
            }
          })
            .then(() => {
            //   console.log('Likes count incremented successfully!');
            })
            .catch((error) => {
              console.log('Error incrementing likes count: ' + error.message);
            });
    }
    