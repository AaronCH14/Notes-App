// Import data dari dataNote.js
import { notesData } from './dataNote.js';


// Inisiasi setiap class komponen web
const registerComponent = () => {
  customElements.define('app-header', appHeader);
  customElements.define('note-card', noteCard);
  customElements.define('note-form', noteForm);
  customElements.define('notes-grid', notesGrid);
};

// Inisiasi untuk pembuat elemen note-card dari data note 
const createDataNote = (note) => {
  const elementNote = document.createElement('note-card');
  elementNote.setAttribute('title', note.title);
  elementNote.setAttribute('body', note.body);
  elementNote.setAttribute('createdat', note.createdAt);
  return elementNote;
};

// Inisiasi handler ketika submit form
const handleFormSubmit = (event) => {
  event.preventDefault();
  const form = event.target;
  const titleInputForm = form.querySelector('#title');
  const bodyInputForm = form.querySelector('body');

  // Fungsi membuat note baru
  const newDataNote = {
    id: `notes-${Date.now()}`,
    title: titleInputForm.value,
    body: bodyInputForm.value,
    createdAt: new Date().toISOString(),
    archived: false
  };

  // menampilkan note baru ke array dan UI
  notesData.push(newDataNote);
  document.querySelector('notes-grid').renderDataNotes(notesData);
  form.reset();
}

// Komponen header aplikasi
class appHeader extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  //Render header dengan atribut title
  render() {
    this.innerHTML = `<h1>${this.getAttribute('title')}</h1>`;
  }
}

//Komponen note card
class noteCard extends HTMLElement {
  constructor() {
    super();
    // Inisiasi Shadow DOM
    this.attachShadow({mode: 'open'});
    this.initiateTemplate();
  }

  initiateTemplate () {
    const template = document.getElementById('note-template');
    const content = template.content.cloneNode(true);

    content.querySelector('.note-title').textContent = this.getAttribute('title');
    content.querySelector('.note-body').textContent = this.getAttribute('body');
    content.querySelector('.note-date').textContent =
      new Date(this.getAttribute('createdat')).toLocaleDateString();

      // Styling komponen
      const style = document.createElement('style');
      style.textContent = `
          .note-card {
              background: var(--card-bg);
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .note-header {
              margin-bottom: 15px;
          }
          .note-title {
              color: var(--primary);
              margin-bottom: 5px;
          }
          .note-date {
              color: #666;
          }
          .note-body {
              line-height: 1.6;
              color: #333;
          }
      `;

      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(content);
  }
}

// Komponen note form
class noteForm extends HTMLElement {
  constructor() {
    super();
    // Struktur form HTML 
    this.innerHTML = `
            <div class="form-container">
                <form id="noteForm">
                    <input type="text" id="title" placeholder="Note title" required>
                    <textarea id="body" rows="4" placeholder="Note content" required></textarea>
                    <button type="submit">Add Note</button>
                </form>
            </div>
        `;

        // Fungsi styling form
        const style = document.createElement('style');
        style.textContent = `
            form {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            input, textarea {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
            }
            button {
                background: var(--primary);
                color: white;
                padding: 12px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
            }
            button:hover {
                background:rgb(56, 150, 208);
            }
        `;
        this.prepend(style);

        this.form = this.querySelector('form');
        this.setupValidation();
    }

    setupValidation() {
      const titleInputForm = this.querySelector('#title');
      const bodyInputForm = this.querySelector('#body');
      const buttonForm = this.querySelector('button');

      const noteValidate = () => {
        // Disable button ketika salah satu input kosong
        buttonForm.disabled = !(titleInputForm.value.trim() && bodyInputForm.value.trim());
      };

      titleInputForm.addEventListener('input', noteValidate);
      bodyInputForm.addEventListener('input', noteValidate);
    }
}

class notesGrid extends HTMLElement {
  connectedCallback() {
    this.renderDataNotes(notesData);
  }
  // Render ulang daftar catatan ketika catatan baru ditambahkan
  renderDataNotes(notes) {
    this.innerHTML = notes.map(note => `
        <note-card 
          title="${note.title.replace(/"/g, '&quot;')}"
          body="${note.body.replace(/"/g, '&quot;')}"
          createdat="${note.createdAt}"
        ></note-card>
      `).join('');
    } 
}

// Registrasi semua komponen yang dibuat
customElements.define('app-header', appHeader);
customElements.define('note-card', noteCard);
customElements.define('note-form', noteForm);
customElements.define('notes-grid', notesGrid);

// Event listener untuk submision form
document.querySelector('note-form').querySelector('form').addEventListener('submit', 
  (n) => {
  n.preventDefault();
  // Mengambil input
  const title = n.target.querySelector('#title').value;
  const body = n.target.querySelector('#body').value;

  // Membuat note baru
  const newNote = {
    id: `notes-${Date.now()}`,
    title,
    body,
    createdAt: new Date().toISOString(),
    archived: false
  };

  // Update data dan tampilan UI
  notesData.push(newNote);
  document.querySelector('notes-grid').renderDataNotes(notesData);
  n.target.reset();
});