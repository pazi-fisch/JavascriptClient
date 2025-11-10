
export function setupCounter(element) {
    let counter = 0;

    const adjustCounterValue = value => {
        if (value >= 100) return value - 100;
        if (value <= -100) return value + 100;
        return value;
    };

    const setCounter = value => {
        counter = adjustCounterValue(value);
        element.innerHTML = `${counter}`;
    };

    document.getElementById('increaseByOne').addEventListener('click', () => setCounter(counter + 1));
    document.getElementById('decreaseByOne').addEventListener('click', () => setCounter(counter - 1));
    document.getElementById('increaseByTwo').addEventListener('click', () => setCounter(counter + 2));
    document.getElementById('decreaseByTwo').addEventListener('click', () => setCounter(counter - 2));

    setCounter(0);
}

setupCounter(document.getElementById('counter-value'));


/**
 * Configure the logic and behaviour of the page.
 * Sets the listeners for all buttons and loads all notes from the server.
 */
export function setup() {

    // API path
    const api_path = "http://localhost:8000/api/notes";

    // dialog which is used to add/edit notes, 'mode' defines dialog behaviour
    let mode = ''
    const noteDialog = document.getElementById('noteDialog');
    const noteIdLabelDialog = document.getElementById('noteIdLabelDialog');
    const noteIdDialog = document.getElementById('noteIdDialog');
    const noteTimestampLabelDialog = document.getElementById('noteTimestampLabelDialog');
    const noteTimestampDialog = document.getElementById('noteTimestampDialog');
    const noteTitleDialog = document.getElementById('noteTitleDialog');
    const noteContentDialog = document.getElementById('noteContentDialog');
    // set listener to perform operation when dialog is closed/confirmed
    noteDialog.addEventListener('close', () => {
        if (noteDialog.returnValue === 'ok') {
            if (mode === 'add') {
                // create new note to add
                const newNote = {
                    title: noteTitleDialog.value,
                    content: noteContentDialog.value,
                };
                // perform POST request
                fetch(api_path, {
                    method: 'POST',
                    body: JSON.stringify(newNote)
                })
                    .then(response => {
                        // log response
                        console.log(response.status + ": " + response.statusText)
                    });
            } else if (mode === 'edit') {

            }
            // done, refresh list
            getAllNotes();
        }
    });

    /**
     * Get all notes from the server and display them in a list.
     */
    function getAllNotes() {
        // perform the GET request
        fetch(api_path, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                // log data
                console.log(data);
                // get the list and remove all current notes
                const noteList = document.getElementById('notesList');
                noteList.replaceChildren();
                // populate list with fetched notes
                data.result.forEach(note => {
                    const li = document.createElement('li');
                    li.innerHTML = note.title + "<br>" + note.content;
                    noteList.appendChild(li);
                });
            })
            .catch(error => {
                // something went wrong
                console.log(error);
            });
    }

    function addNewNote() {
        mode = 'add';
        // show empty dialog to add new note, without ID and timestamp
        noteIdLabelDialog.style.display = 'none';
        noteTimestampLabelDialog.style.display = 'none';
        noteTitleDialog.value = '';
        noteContentDialog.value = '';
        noteDialog.showModal();
    }

    // set listener for all buttons
    document.getElementById('reloadFromServer').addEventListener('click', () => getAllNotes());
    document.getElementById('addNewNote').addEventListener('click', () => addNewNote());
    // done setting up, default load and show all notes
    getAllNotes();
}

setup();


