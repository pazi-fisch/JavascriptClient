
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



export function setup() {

    const api_path = "http://localhost:8000/api/notes";

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

    document.getElementById('reloadFromServer').addEventListener('click', () => getAllNotes());
}

setup();


