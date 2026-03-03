//this will be THE list
let MasterList = []

//guest rooms
let rooms = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: []
};

// false = unlocked
// true  = locked
let lockedRooms = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
};

// LOAD DATA FROM LOCAL STORAGE
function loadData() {
    // Get saved room data 
    const savedRooms = localStorage.getItem("hotelRooms");
    // Get saved lock data
    const savedLocks = localStorage.getItem("hotelLocks");
    // If room data exists, convert JSON back into an object
    if (savedRooms) {
        rooms = JSON.parse(savedRooms);
    }
    // If lock data exists, convert JSON back into an object
    if (savedLocks) {
        lockedRooms = JSON.parse(savedLocks);
    }
}

// SAVE DATA TO LOCAL STORAGE
// This saves both guest lists and lock states.
// JSON.stringify converts objects into a string
// because localStorage can only store strings.
function saveData() {
    localStorage.setItem("hotelRooms", JSON.stringify(rooms));
    localStorage.setItem("hotelLocks", JSON.stringify(lockedRooms));
}

// LOCK / UNLOCK ROOM
// This toggles the lock state for a room.
function toggleLock(roomNum) {
    lockedRooms[roomNum] = !lockedRooms[roomNum];

    // Get the lock button for that room
    const btn = document.getElementById(`lockBtn-${roomNum}`);

    // Get the room container div (for styling)
    const roomDiv = btn.closest(".room");

    // If room is now locked
    if (lockedRooms[roomNum]) {
        btn.textContent = "Room Locked";   // Change button text
        roomDiv.classList.add("locked");      // Add visual style
    } else {
        btn.textContent = "Lock Room";
        roomDiv.classList.remove("locked");
    }
    saveData();
}



//add
function addItem(roomNum) {

    // If the room is locked, stop immediately
    if (lockedRooms[roomNum]) {
        document.getElementById(`output-${roomNum}`).innerHTML = "Room is locked!";
        return; // Stop the function
    }

    // Get input field
    const input = document.getElementById(`user-${roomNum}`);

    // Get message output area
    const output = document.getElementById(`output-${roomNum}`);

    // Remove extra spaces from input
    const name = input.value.trim();

    // Clear previous messages
    output.innerHTML = "";

    // Prevent empty names
    if (name === "") {
        output.innerHTML = "Enter a guest name";
        return;
    }

    // Prevent adding more than 5 guests
    if (rooms[roomNum].length >= 5) {
        output.innerHTML = "Room is full";
        return;
    }

    // Create current date/time
    const now = new Date();

    // Format timestamp (Year-Month-Day Time)
    const timestamp =
        now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0") + " " +
        now.toLocaleTimeString();

    // Add guest object into the room array
    rooms[roomNum].push({
        name: name,
        time: timestamp
    });

    // Clear input field after adding
    input.value = "";

    // Refresh the displayed list
    updateList(roomNum);

    // Save updated room data
    saveData();
}



//remove
function removeItem(roomNum) {

    // Stop if locked
    if (lockedRooms[roomNum]) {
        document.getElementById(`output-${roomNum}`).innerHTML = "Room is locked!";
        return;
    }

    // Get delete number input
    const numInput = document.getElementById(`deleteNum-${roomNum}`);

    // Get output message area
    const output = document.getElementById(`output-${roomNum}`);

    // Convert typed value into a number
    const index = parseInt(numInput.value);

    // Clear previous message
    output.innerHTML = "";

    // Check if number is valid
    if (index > 0 && index <= rooms[roomNum].length) {

        // Remove guest from array
        // index - 1 because arrays start at 0
        rooms[roomNum].splice(index - 1, 1);

        // Refresh list display
        updateList(roomNum);

        // Save updated data
        saveData();

    } else {
        output.innerHTML = "Invalid guest number";
    }

    // Clear delete box
    numInput.value = "";
}



//update
function updateList(roomNum) {

    // Get ordered list element
    const listEl = document.getElementById(`guestlist-${roomNum}`);

    // Clear existing list items
    listEl.innerHTML = "";

    // Loop through each guest in that room
    rooms[roomNum].forEach(guest => {

        // Create new <li>
        const li = document.createElement("li");

        // Show guest name + check-in time
        li.textContent = `${guest.name} — Checked in at ${guest.time}`;

        // Add list item to page
        listEl.appendChild(li);
    });
}



//running the page when it loads in
document.addEventListener("DOMContentLoaded", () => {

    // FIRST: Load saved data
    loadData();

    // Loop through all 6 rooms
    for (let i = 1; i <= 6; i++) {

        // Restore guest list display
        updateList(i);

        // Restore lock visual state
        const btn = document.getElementById(`lockBtn-${i}`);
        const roomDiv = btn.closest(".room");

        if (lockedRooms[i]) {
            btn.textContent = "Room Locked";
            roomDiv.classList.add("locked");
        }

        // ENTER KEY = ADD
        const addInput = document.getElementById(`user-${i}`);
        addInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                addItem(i);
            }
        });

        // ENTER KEY = REMOVE
        const removeInput = document.getElementById(`deleteNum-${i}`);
        removeInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                removeItem(i);
            }
        });
    }
});
