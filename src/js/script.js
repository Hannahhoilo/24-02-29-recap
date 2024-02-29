
import firebaseConfig from "./firebaseConfig";

import {initializeApp} from "firebase/app";
import {getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc} from "firebase/firestore"

initializeApp(firebaseConfig)

const database = getFirestore();
const matchdayCollection = collection(database, "matchday1")


// DOM ELEMENTS
const firstname = document.querySelector('.firstname');
const lastname = document.querySelector('.lastname');
const jersey = document.querySelector('.jersey');
const subscheck = document.querySelector('.subs');
const addPlayerButton = document.querySelector('.add-player');
const startingXiContainer = document.querySelector('.starting-xi-container');
const subsContainer = document.querySelector('.sub-container');
const addPlayerForm = document.querySelector('form');

addPlayerForm.addEventListener("submit", (event) =>{
	event.preventDefault()
	const newPlayer = {
		firstname: firstname.value,
		lastname: lastname.value,
		jersey: jersey.value,
		isSub: subscheck.checked,
	}
	addDoc(matchdayCollection, newPlayer)
	.then(()=> {
		console.log("Player added!");
		addPlayerForm.reset();
	})
	.catch((error)=> console.log(error.message))
})

function renderXi(playerlist){
	startingXiContainer.textContent = "",
	playerlist.forEach((player, index)=> {
		const playerDiv = document.createElement("div");
		playerDiv.textContent = `${index+1} ${player.firstname} ${player.lastname}`
		playerDiv.dataset.id = player.id;
		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Delete"

		playerDiv.append(deleteButton)
		startingXiContainer.append(playerDiv)

		deleteButton.addEventListener("click", (event)=> {
			event.preventDefault();
			const idToDelete = event.currentTarget.parentElement.dataset.id
			const docToDelete = doc(database, "matchday1", idToDelete)
			deleteDoc(docToDelete)
		})
	});
}


onSnapshot(matchdayCollection, (snapshot)=>{
	const currentXi = [];
	snapshot.forEach((doc)=>{
		currentXi.push({id: doc.id, ...doc.data()})
		console.log(currentXi);
	})
	renderXi(currentXi)
})