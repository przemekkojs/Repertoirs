const students = [];
const assistants = [];
const pieces = [];
const pieceParts = {}; 

function getIdOfList(l) {
    return l.length == 0 ? 0 : l[l.length - 1] + 1;
}

function addAssistant() {
    const parent = document.getElementById('assistants-container');
    const container = document.createElement('div');
    const id = getIdOfList(assistants);
    container.id = `assistant-${id}`;

    container.innerHTML = `
        <div>
            <label for="assistant-name-${id}">Imię i nazwisko:</label>
            <input type="text" id="assistant-name-${id}" name="assistant-name-${id}" placeholder="np. Jan Kowalski" required />
        </div>

        <div>
            <label for="assistant-title-${id}">Tytuł naukowy:</label>

            <div style="display: flex; align-items: center; gap: 12px;">
                <select id="assistant-title-${id}">
                    <option value="prof.">prof.</option>
                    <option value="dr hab.">dr hab.</option>
                    <option value="dr">dr</option>
                    <option value="mgr">mgr</option>
                    <option value="lic">lic</option>
                </select>

                <label style="display: flex; align-items: center; gap: 4px;">
                    <input type="checkbox" id="assistant-university-professor-${id}" />
                    prof. uczelni
                </label>
            </div>
        </div>

        <button type="button" class="btn-danger" onclick="removeAssistant(${id})">Usuń</button>
    `;


    parent.appendChild(container);
    assistants.push(id);
}

function addStudent() {
    const id = getIdOfList(students);
    const parent = document.getElementById('students-container');
    const container = document.createElement('div');
    container.id = `student-${id}`;

    container.innerHTML = `
        <div>
            <div>
                <label for="student-name-${id}">Imię i nazwisko:</label>
                <input type="text" id="student-name-${id}" name="student-name-${id}" placeholder="np. Jan Kowalski" required/>
            </div>

            <div>
                <label for="student-index-${id}">Numer indeksu:</label>
                <input type="text" id="student-index-${id}" name="student-index-${id}" placeholder="np. 1234" required/>
            </div>

            <div>
                <label for="student-year-${id}">Rok studiów:</label>
                <input type="number" id="student-year-${id}" name="student-year-${id}" min="1" max="5" placeholder="1" required/>
            </div>

            <div>
                <label for="student-instrument-${id}">Instrument:</label>
                <input type="text" id="student-instrument-${id}" name="student-instrument-${id}" placeholder="np. Organy" required/>
            </div>

            <button type="button" class="btn-danger" onclick="removeStudent(${id})">Usuń</button>
        </div>
    `;

    parent.appendChild(container);
    students.push(id);
}

function addPiece() {
    const id = getIdOfList(pieces);
    const parent = document.getElementById('pieces-container');
    const container = document.createElement('div');
    container.id = `piece-${id}`;

    pieceParts[id] = [];

    container.innerHTML = `
        <div>
            <div>
                <label for="piece-title-${id}">Tytuł utworu:</label>
                <input type="text" id="piece-title-${id}" required placeholder="np. Sonata C-dur"/>

                <label for="piece-numbers-${id}">Numer katalogowy (jeśli dotyczy):</label>
                <input type="text" id="piece-numbers-${id}" placeholder="np. BWV 529"/>
            </div>

            <div>
                <label for="piece-composer-${id}">Imię i nazwisko kompozytora:</label>
                <input type="text" id="piece-composer-${id}" required placeholder="np. Johann Sebastian Bach"/>

                <label for="composer-birthyear-${id}">Rok urodzenia:</label>
                <input type="number" id="composer-birthyear-${id}" required placeholder="np. 1685"/>

                <label for="composer-deathyear-${id}">Rok śmierci (jeśli dotyczy):</label>
                <input type="number" id="composer-deathyear-${id}" placeholder="np. 1750"/>
            </div>

            <div>
                <h4>Części utworu</h4>
                <div id="parts-container-${id}"></div>
                <button type="button" onclick="addPart(${id})">Dodaj część</button>
            </div>

            <button type="button" class="btn-danger" onclick="removePiece(${id})">
                Usuń utwór
            </button>
        </div>
    `;

    parent.appendChild(container);
    pieces.push(id);
}

function addPart(pieceId) {
    if (!pieceParts[pieceId]) {
        pieceParts[pieceId] = [];
    }

    const id = getIdOfList(pieceParts[pieceId]);
    const parent = document.getElementById(`parts-container-${pieceId}`);
    const container = document.createElement("div");
    container.id = `part-${pieceId}-${id}`;

    container.innerHTML = `
        <div class="part-row">
            <div>
                <label for="part-number-${pieceId}-${id}">Numer części:</label>
                <input type="text" id="part-number-${pieceId}-${id}" placeholder="np. 1" required/>
            </div>

            <div>
                <label for="part-name-${pieceId}-${id}">Nazwa części:</label>
                <input type="text" id="part-name-${pieceId}-${id}" placeholder="np. Allegro"/>
            </div>

            <button type="button" class="btn-danger" onclick="removePart(${pieceId}, ${id})">
                Usuń
            </button>
        </div>
    `;

    parent.appendChild(container);
    pieceParts[pieceId].push(id);
}

function removePart(pieceId, partId) {
    showConfirm("Czy na pewno chcesz usunąć tę część?", () => {
        document.getElementById(`part-${pieceId}-${partId}`)?.remove();
        pieceParts[pieceId].splice(pieceParts[pieceId].indexOf(partId), 1);
    });
}

function removeAssistant(id) {
    showConfirm("Czy na pewno chcesz usunąć tego asystenta?", () => {
        document.getElementById(`assistant-${id}`)?.remove();
        assistants.splice(assistants.indexOf(id), 1);
    });
}

function removeStudent(id) {
    showConfirm("Czy na pewno chcesz usunąć tego studenta?", () => {
        document.getElementById(`student-${id}`)?.remove();
        students.splice(students.indexOf(id), 1);
    });
}

function removePiece(id) {
    showConfirm("Czy na pewno chcesz usunąć ten utwór?", () => {
        document.getElementById(`piece-${id}`)?.remove();
        pieces.splice(pieces.indexOf(id), 1);
    });
}

document.querySelectorAll("h3").forEach(h3 => {
    h3.style.cursor = "pointer";

    h3.addEventListener("click", () => {
        const section = h3.parentElement.nextElementSibling;
        if (!section) return;

        section.style.display =
            section.style.display === "none" ? "block" : "none";
    });
});

function showConfirm(message, onConfirm, confirmText = "OK", cancelText = "Anuluj") {
    const modal = document.getElementById("confirm-modal");
    const msg = document.getElementById("confirm-message");
    const okBtn = document.getElementById("confirm-ok");
    const cancelBtn = document.getElementById("confirm-cancel");

    msg.textContent = message;
    modal.classList.remove("hidden");

    const cleanup = () => {
        modal.classList.add("hidden");
        okBtn.onclick = null;
        cancelBtn.onclick = null;
    };

    okBtn.textContent = confirmText;
    cancelBtn.textContent = cancelText;

    okBtn.onclick = () => {
        cleanup();
        onConfirm();
    };

    cancelBtn.onclick = cleanup;
}

function showInfo(message, onConfirm, confirmText = "OK") {
    const modal = document.getElementById("info-modal");
    const msg = document.getElementById("info-message");
    const okBtn = document.getElementById("info-ok");

    msg.textContent = message;
    modal.classList.remove("hidden");

    const cleanup = () => {
        modal.classList.add("hidden");
        okBtn.onclick = null;
    };

    okBtn.textContent = confirmText;

    okBtn.onclick = () => {
        cleanup();
        onConfirm();
    };
}

function generate(event) {
    if (event)
        event.preventDefault();

    if (students.length === 0) {
        showInfo("Dodaj przynajmniej jednego studenta!", () => {});
        return;
    }

    if (pieces.length === 0) {
        showInfo("Dodaj przynajmniej jeden utwór!", () => {});
        return;
    }

    const data = {
        unit: {
            university: document.getElementById("university-name").value,
            faculty: document.getElementById("faculty-name").value,
            department: document.getElementById("department-name").value,
            class_name: document.getElementById("class-name").value,
            course_name: document.getElementById("course-name").value
        },

        event_info: {
            event_name: document.getElementById('event-name').value,
            event_date: document.getElementById('event-date').value
        },

        students: students.map(id => ({
            name: document.getElementById(`student-name-${id}`)?.value,
            index: document.getElementById(`student-index-${id}`)?.value,
            year: document.getElementById(`student-year-${id}`)?.value,
            instrument: document.getElementById(`student-instrument-${id}`)?.value
        })),

        teachers: {
            main: {
                name: document.getElementById("main-teacher-name").value,
                title: document.getElementById("main-teacher-title").value,
                add_title: document.getElementById("main-teacher-university-professor").checked ? "prof. uczelni" : ""
            },
            assistants: assistants.map(id => ({
                name: document.getElementById(`assistant-name-${id}`)?.value,
                title: document.getElementById(`assistant-title-${id}`)?.value,
                add_title: document.getElementById(`assistant-university-professor-${id}`).checked ? "prof. uczelni" : ""
            }))
        },

        repertoire: pieces.map(id => ({
            title: document.getElementById(`piece-title-${id}`)?.value,
            catalogNumber: document.getElementById(`piece-numbers-${id}`)?.value,
            composer: {
                name: document.getElementById(`piece-composer-${id}`)?.value,
                birthYear: document.getElementById(`composer-birthyear-${id}`)?.value,
                deathYear: document.getElementById(`composer-deathyear-${id}`)?.value
            },
            parts: (pieceParts[id] || []).map(partId => ({
                number: document.getElementById(`part-number-${id}-${partId}`)?.value,
                name: document.getElementById(`part-name-${id}-${partId}`)?.value
            }))
        }))
    };

    console.log("Wysyłanie danych:", data);

    fetch("/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.blob())
    .then(blob => {
        try {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "repertuar.pdf";
            a.click();
        }
        catch (err) {
            throw new Error("Błąd podczas pobierania pliku PDF.");
        }
    })
    .catch(err => {
        console.error(err);
    });
}
