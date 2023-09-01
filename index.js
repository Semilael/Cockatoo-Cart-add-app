import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-cart-list-default-rtdb.europe-west1.firebasedatabase.app/"
}

window.addEventListener("load", function () {
    showLoader()
    this.setTimeout(() => {hideLoader()}, 600)
});

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value.trim();

    if (inputValue !== ""){
        push(shoppingListInDB, inputValue)
    } else {
        errorBtnColor(this)
    }

    clearInputFieldEl()
})

onValue(shoppingListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        clearShoppingListEl()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]

            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")
    newEl.textContent = itemValue

    let checkIcon = document.createElement("span");
    checkIcon.innerHTML = "✓";
    checkIcon.className = "check-icon";

    let deleteIcon = document.createElement("span")
    deleteIcon.innerHTML = "✕"
    deleteIcon.className = "delete-icon"

    newEl.appendChild(checkIcon)
    newEl.appendChild(deleteIcon)

    newEl.addEventListener("click", function (event) {
        if (event.target === checkIcon) {
            newEl.classList.toggle("checked")
        } else if (event.target === deleteIcon) {
            let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
            remove(exactLocationOfItemInDB)
        }
    });

    shoppingListEl.append(newEl)

}

function showLoader() {
    const loader = document.querySelector(".loader")
    loader.style.display = "flex"
}

function hideLoader() {
    const loader = document.querySelector(".loader")
    loader.style.display = "none"
}

function errorBtnColor(btn){
    btn.addEventListener("click", function() {
        this.classList.add("color-change");
        setTimeout(function() {
          btn.classList.remove("color-change");
        }, 1000);
      });
}