
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
                    content: noteContentDialog.value
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
                // create note to edit
                const editNote = {
                    id: noteIdDialog.textContent,
                    title: noteTitleDialog.value,
                    content: noteContentDialog.value
                };
                // perform PUT request
                fetch(api_path + '/' + noteIdDialog.textContent, {
                    method: 'PUT',
                    body: JSON.stringify(editNote)
                })
                    .then(response => {
                        // log response
                        console.log(response.status + ": " + response.statusText)
                    });
            }
            // done, refresh list
            // delayed in order to allow server to handle data manipulation
            setTimeout(() => {
                getAllNotes();
            }, 200);
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
                if (data.result) {
                    // notes found
                    // get the list and remove all current notes
                    const noteList = document.getElementById('notesList');
                    noteList.replaceChildren();
                    // populate list with fetched notes
                    data.result.forEach(note => {
                        // button to edit note
                        const editButton = document.createElement('button');
                        editButton.textContent = 'edit';
                        editButton.addEventListener('click', () => editNote(note));
                        // button to delete note
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'delete';
                        deleteButton.addEventListener('click', () => deleteNote(note));
                        // create list item title, content and button
                        const li = document.createElement('li');
                        li.innerHTML = note.title + "<br>" + note.content + "<br>";
                        li.appendChild(editButton);
                        li.appendChild(deleteButton);
                        noteList.appendChild(li);
                    });
                    // show list
                    document.getElementById('notesList').style.display = 'block';
                    document.getElementById('noNotesLabel').style.display = 'none';
                } else {
                    // no notes found
                    document.getElementById('notesList').style.display = 'none';
                    document.getElementById('noNotesLabel').style.display = 'block';
                }
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

    function editNote(note) {
        mode = 'edit';
        // show the dialog to edit an existing note, with ID and timestamp
        noteIdLabelDialog.style.display = 'block';
        noteTimestampLabelDialog.style.display = 'block';
        noteIdDialog.textContent  = note.id;
        noteTimestampDialog.textContent  = note.timestamp;
        noteTitleDialog.value = note.title;
        noteContentDialog.value = note.content;
        noteDialog.showModal();
    }

    function deleteNote(note) {
        // perform DELETE request
        fetch(api_path + '/' + note.id, {
            method: 'DELETE'
        })
            .then(response => {
                // log response
                console.log(response.status + ": " + response.statusText)
            });
        // done, refresh list
        // delayed in order to allow server to handle data manipulation
        setTimeout(() => {
            getAllNotes();
        }, 200);
    }

    // set listener for all buttons
    document.getElementById('reloadFromServer').addEventListener('click', () => getAllNotes());
    document.getElementById('addNewNote').addEventListener('click', () => addNewNote());
    // done setting up, default load and show all notes
    getAllNotes();
}

// perform initial setup
setup();

