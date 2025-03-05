function addNoteOption() {
    // Observe DOM changes to detect when GitHub's line menu appears
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if(node.nodeType === 1){
                        for(let i = 0; i < node.childNodes.length; i++){
                            
                                if(node.childNodes[i].ELEMENT_NODE && node.childNodes[i].matches(".dGfxNc")){
                                    // This node is a div, we will need to traverse to "ul" and add the option "add note"
                                    let ul = node.childNodes[i].childNodes[1].childNodes[0];
                                    injectNoteButton(node, ul)
                                }
                            
                        }
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function injectNoteButton(parentNode, menu) {

    const addNotes = document.createElement("li");
    // addNotes.textContent = "Add note";
    addNotes.classList.add("add-note-btn");
    addNotes.classList.add("Item__LiBox-sc-yeql7o-0");
    addNotes.classList.add("itAoNO");
    const span = document.createElement("span");
    span.textContent = "Add note";
    span.classList.add("Box-sc-g0xbh4-0");
    span.classList.add("cQdyWD");
    span.classList.add("prc-Link-Link-85e08");
    span.id=":r1c:--label";
    addNotes.appendChild(span);

    addNotes.addEventListener("click", () => {
        console.log("Okay click is registered!");
        const height = parentNode.childNodes[0].offsetTop - 25; // Height of the 3 dot sandwich
        // const noteId = Date.now();
        // const noteText = prompt("Enter your note:");

        createStickyNote(height);
    });

    menu.appendChild(addNotes);
}

function createStickyNotePerm(title, comment, startHeight) {
    const noteHTML = `
        <div>
            <p><b>${title}</b></p>
            <div>
                <p>${comment}</p>
            </div>
        </div>
    `;

    const note = document.createElement("div");
    note.className = "sticky-note";
    note.innerHTML = noteHTML;
    note.style.top = `${startHeight}px`;
    note.style.right = "10px";

    document.body.appendChild(note);
}

function createStickyNote(startHeight) {

    const noteId = Date.now();

    const noteHTML = `
        <div class="sticky-note-div">
            <div>
                <label for="label">Title </label>
                <input id="sticky-note-title" name="title" type="text" />
            </div>
            <label>Comment</label>
            <div>
                <textarea id="sticky-note-comment">
                </textarea>
            </div>
            <div>
                <button id="save">Save</button>
                <button id="cancel">Cancel</button>
            </div>
        </div>
    `;
    const note = document.createElement("div");
    note.id = noteId;
    note.className = "sticky-note";
    note.innerHTML = noteHTML;

    note.style.top = `${startHeight}px`;
    note.style.right = "10px";
    note.style.height = "125px";
    note.style.width = "200px";

    document.body.appendChild(note);

    let title = "";
    document.getElementById("sticky-note-title").addEventListener("input", (e) => {
        title = e.target.value;
    });

    let comment = "";
    document.getElementById("sticky-note-comment").addEventListener("input", (e) => {
        comment = e.target.value;
    });
    
    document.getElementById("save").addEventListener("click", () => {
        const rnote = document.getElementById(noteId.toString());
        rnote.getElementsByClassName("sticky-note-div")[0].remove();


        const newNote = document.createElement("div");
        newNote.className = `sticky-note-div-${noteId}`;
        newNote.innerHTML = `
                    <div style="display: flex; justify-content: space-between; width:100%;">
                        <button id="minimize-comment-${noteId}" style="padding: 0; margin: 0; border:none; background: none; font-size: 14px; color: red; font-weight:900;"> > </button>
                        <button id="maximize-comment-${noteId}" style="padding: 0; margin: 0; border:none; background: none; display:none; font-size: 14px; color: red; font-weight:900;"> < </button>
                        <button id="close-comment-${noteId}" style="padding: 0; margin: 0; border:none; background: none; font-size: 9px;">❌</button>
                    </div>
                    <p><b>${title}</b></p>
                    <div>
                        <p>${comment}</p>
                    </div>
                    <div>
                        <button id="edit-note-${noteId}" style="padding: 0; margin: 0; border:none; background: none; font-size: 12px;">✏️</button>
                    </div>
        `;

        rnote.appendChild(newNote);

        document.getElementById(`close-comment-${noteId}`).addEventListener("click", () => {
            
            const rnote = document.getElementById(noteId.toString());
            rnote.remove();

            // Remove from storage!

        });

        document.getElementById(`minimize-comment-${noteId}`).addEventListener("click", () => {

            const rnote = document.getElementById(noteId.toString());

            rnote.style.height = "50px";
            rnote.style.width = "150px";
            rnote.style.overflow = "clip";
            
            document.getElementById(`minimize-comment-${noteId}`).style.display = "none";
            document.getElementById(`maximize-comment-${noteId}`).style.display = "inline";

            document.getElementById(`maximize-comment-${noteId}`).addEventListener("click", () => {

                const rnote = document.getElementById(noteId.toString());

                rnote.style.height = "125px";
                rnote.style.width = "200px";
                rnote.style.overflow = "auto";
                // rnote.style.display = "none";
                document.getElementById(`maximize-comment-${noteId}`).style.display = "none";
                document.getElementById(`minimize-comment-${noteId}`).style.display = "inline";
            });

        });

        document.getElementById(`edit-note-${noteId}`).addEventListener("click", () => {
            
            document.getElementsByClassName(`sticky-note-div-${noteId}`).remove();
            
        });

    });

    document.getElementById("cancel").addEventListener("click", () => {
        const rnote = document.getElementById(noteId.toString());
        rnote.remove();
    });

}

// Save notes to Chrome storage
function saveNote(line, note) {
    chrome.storage.local.get("notes", (data) => {
        const notes = data.notes || {};
        notes[line] = note;
        chrome.storage.local.set({ notes });
    });
}

addNoteOption();
