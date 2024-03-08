
import firebaseConfig from "./firebaseConfig";

import {initializeApp} from "firebase/app";
import {getFirestore, collection, addDoc, onSnapshot, doc, deleteDoc, query, orderBy, serverTimestamp} from "firebase/firestore"

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
const subsContainer = document.querySelector('.subs-container');
const addPlayerForm = document.querySelector('form');

addPlayerForm.addEventListener("submit", (event) =>{
	event.preventDefault()
	const newPlayer = {
		firstname: firstname.value,
		lastname: lastname.value,
		jersey: Number(jersey.value),
		isSub: subscheck.checked,
		serverTimestamp: serverTimestamp()
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
	subsContainer.textContent = "",
	playerlist.forEach((player, index)=> {
		const playerDiv = document.createElement("div");
		playerDiv.dataset.id = player.id;
		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Delete"

		let subsIndex = 0
		let playerIndex = 0

		playerDiv.append(deleteButton)

		if (player.isSub) {
			subsIndex++
			playerDiv.textContent = `${index+1} ${player.firstname} ${player.lastname} -- ${player.jersey}`
			subsContainer.append(playerDiv)
		} else {
			playerIndex++
			playerDiv.textContent = `${index+1} ${player.firstname} ${player.lastname} -- ${player.jersey}`
			startingXiContainer.append(playerDiv)
		}

		deleteButton.addEventListener("click", (event)=> {
			event.preventDefault();
			const idToDelete = event.currentTarget.parentElement.dataset.id
			const docToDelete = doc(database, "matchday1", idToDelete)
			deleteDoc(docToDelete)
		})
	});
}

function fetchData(){
	const sortedXi = query(matchdayCollection, orderBy("serverTimestamp", "asc"))
	onSnapshot(sortedXi, (snapshot)=>{
		const currentXi = [];
		snapshot.forEach((doc)=>{
			currentXi.push({id: doc.id, ...doc.data()})
			console.log(currentXi);
		})
		renderXi(currentXi)
	})
}

fetchData();