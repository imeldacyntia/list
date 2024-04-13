// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const darkerTheme = document.querySelector('.darker-theme');

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : changeTheme(localStorage.getItem('savedTheme'));

// Functions;

function addToDo(event) {
    // Prevents form from submitting / Prevents form from reloading;
    event.preventDefault();

    // toDo DIV;
    const toDoDiv = document.createElement("div");
    const todoId = generateTodoId(); // Generate a unique ID for the todo item
    toDoDiv.dataset.id = todoId; // Set the dataset id attribute
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    // Create LI
    const newToDo = document.createElement('li');
    if (toDoInput.value === '') {
        alert("You must write something!");
    } else {
        newToDo.innerText = toDoInput.value;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        // Adding to local storage;
        savelocal(toDoInput.value, todoId); // Pass the todoId to the savelocal function

        // check btn;
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add('check-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        // Edit btn;
        const edit = document.createElement('button');
        edit.innerHTML = '<i class="fas fa-edit"></i>';
        edit.classList.add('edit-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(edit);

        // delete btn;
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add('delete-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        // Append to list;
        toDoList.appendChild(toDoDiv);

        // Clearing the input;
        toDoInput.value = '';
    }
}

function deletecheck(event){
    const item = event.target;

    // delete
    if(item.classList[0] === 'delete-btn')
    {
        item.parentElement.classList.add("fall");
        removeLocalTodos(item.parentElement);
        item.parentElement.addEventListener('transitionend', function(){
            item.parentElement.remove();
        })
    }

    // check
    if(item.classList[0] === 'check-btn')
    {
        item.parentElement.classList.toggle("completed");
    }

    // edit
    if(item.classList[0] === 'edit-btn')
    {
        const parentItem = item.parentElement; // Mendapatkan elemen item terdekat yang mengandung tombol edit
        const input_item = parentItem.querySelector('.todo-item'); // Mendapatkan input teks di dalam item
        if (item.innerText.toLowerCase() == "edit") {
            item.innerText = "Save";
            input_item.contentEditable = "true";
            input_item.focus();
        } else {
            item.innerText = "Edit";
            input_item.contentEditable = "false";
        }
    } 
}

// Saving to local storage:
function savelocal(todo, todoId){
    let todos = [];
    if(localStorage.getItem('todos') !== null) {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    // Cek apakah teks todo kosong atau dihapus
    if (todo.trim() === '') {
        // Jika teks todo kosong atau dihapus, hapus todo dari penyimpanan lokal
        const existingTodoIndex = todos.findIndex(item => item.id === todoId);
        if (existingTodoIndex !== -1) {
            todos.splice(existingTodoIndex, 1);
        }
    } else {
        // Jika teks todo tidak kosong, perbarui atau tambahkan ke penyimpanan lokal
        const existingTodoIndex = todos.findIndex(item => item.id === todoId);
        if (existingTodoIndex !== -1) {
            // Jika todo dengan todoId sudah ada, perbarui teksnya
            todos[existingTodoIndex].text = todo;
        } else {
            // Jika tidak ada, tambahkan todo baru
            todos.push({ text: todo, id: todoId });
        }
    }

    // Simpan kembali daftar todos ke dalam penyimpanan lokal
    localStorage.setItem('todos', JSON.stringify(todos));

    // Update text content of the todo item in the DOM
    const todoItem = document.querySelector(`[data-id="${todoId}"] .todo-item`);
    if (todoItem) {
        todoItem.innerText = todo;
    }
}
function getTodos() {
    let todos = [];
    if(localStorage.getItem('todos') !== null) {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.forEach(function(todo) {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);

        const newToDo = document.createElement('li');
        newToDo.innerText = todo.text; // Menggunakan properti text dari objek todo
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        const edit = document.createElement('button');
        edit.innerHTML = '<i class="fas fa-edit"></i>';
        edit.classList.add("edit-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(edit);

        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        toDoList.appendChild(toDoDiv);
    });
}

function removeLocalTodos(todo){
    let todos = [];
    if(localStorage.getItem('todos') !== null) {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    // Get the dataset id of the todo to be removed
    const todoId = todo.dataset.id;

    // Find the index of the todo item using its dataset id
    const todoIndex = todos.findIndex(todo => todo.id === todoId);

    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
    } else {
        console.error('Todo not found in local storage.');
    }
}

function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    // Change blinking cursor for darker theme:
    color === 'darker' ? 
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    // Change todo color without changing their status (completed or not):
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // Change buttons color according to their type (todo, check, delete, edit):
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;  
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`; 
            } else if (item === 'edit-btn') {
                button.className = `edit-btn ${color}-button`;
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
// Mengubah selector dan event listener untuk tombol edit yang telah ada
const edit_items = document.querySelectorAll('.edit-btn');
edit_items.forEach(edit_item => {
    // Simpan ikon Edit
    const originalIcon = edit_item.innerHTML;

    edit_item.addEventListener('click', (e) => {
        const parentItem = e.target.parentElement; // Mendapatkan elemen item terdekat yang mengandung tombol edit
        const input_item = parentItem.querySelector('.todo-item'); // Mendapatkan input teks di dalam item
        if (edit_item.innerHTML === originalIcon) {
            edit_item.innerHTML = '<i class="fas fa-save"></i>';
            input_item.contentEditable = "true";
            input_item.focus();
        } else {
            edit_item.innerHTML = originalIcon;
            input_item.contentEditable = "false";
        }
    });
});

}
