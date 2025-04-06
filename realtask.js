function changeTheme() {
    const themebutton = document.getElementById('theme');
    const body = document.body;

    // Get the current theme state from the data attribute
    const currentTheme = themebutton.dataset.theme;
    const image = themebutton.querySelector('img');
    const p = document.querySelector('p');
    const title = document.getElementById('todo');

    if (currentTheme === 'sun') {
        p.style.color = 'var(--lightmode)';
        title.style.color = 'var(--titlecolor)';
        image.src = 'sun.svg';
        image.style.transform = 'rotate(360deg)';
        image.style.filter = 'brightness(90%)';
        body.style.backgroundColor = 'var(--darkmode)';
        themebutton.dataset.theme = 'moon'; // Update the data attribute
    } else {
        title.style.color = 'var(--btncolor)';
        p.style.color = 'var(--textcolor)';
        image.style.transform = 'rotate(0deg)';
        image.style.filter = 'brightness(100%)';
        image.src = 'moon.svg';
        body.style.backgroundColor = 'var(--lightmode)';
        themebutton.dataset.theme = 'sun';
    }
}

// Initial setup: set the initial theme state AND apply initial styles
document.addEventListener('DOMContentLoaded', function() {
    const themebutton = document.getElementById('theme');
    const image = themebutton.querySelector('img');
    const body = document.body;
    const p = document.querySelector('p');
    const title = document.getElementById('todo');

    themebutton.dataset.theme = 'moon'; 

    if (themebutton.dataset.theme === 'sun') {
        image.src = 'moon.svg';
        image.style.transform = 'rotate(0deg)';
        image.style.filter = 'brightness(100%)';
        body.style.backgroundColor = 'var(--lightmode)';
        title.style.color = 'var(--btncolor)';
        p.style.color = 'var(--textcolor)';
    } else {
        image.src = 'sun.svg';
        image.style.transform = 'rotate(360deg)';
        image.style.filter = 'brightness(90%)';
        body.style.backgroundColor = 'var(--darkmode)';
        title.style.color = 'var(--titlecolor)';
        p.style.color = 'var(--lightmode)';
    }
});



function addTask() {
    const taskInput = document.getElementById("taskInput").value;
    
    if (taskInput) {
        const div = document.createElement("div");
        div.id = "test";
        div.classList.add("task", "task-added");

        const checkcheck = document.createElement("input");
        checkcheck.type = "checkbox";
        div.appendChild(checkcheck);

        const taskText = document.createElement("div");
        taskText.classList.add("task-text");
        taskText.textContent = taskInput;

        // Click to edit functionality
        taskText.onclick = function () {
            editTask(taskText);
        };

        div.appendChild(taskText);

        checkcheck.onclick = function() {
            if (checkcheck.checked) {
                taskText.style.textDecoration = "line-through"; 
                taskText.style.color = "var(--checked)";
            } else {
                taskText.style.textDecoration = "none";
                taskText.style.color = 'var(--textcolor)';
            }

            saveTasks();
        };

        const removeBtn = document.createElement('button');
        removeBtn.id = 'remove'
        removeBtn.onclick = function() {
            removeTask(div);
            saveTasks();
        };

        const imagee = document.createElement('img');
        imagee.src = 'trash.png';
        removeBtn.appendChild(imagee);

        div.appendChild(removeBtn);

        document.getElementById("taskContainer").appendChild(div);
        document.getElementById("taskInput").value = "";

        saveTasks();
    }
}

function removeTask(taskDiv) {
    taskDiv.classList.add("removing"); // Add transition class for fade-out

    // Wait for the transition duration before actually removing the element
    setTimeout(() => {
        taskDiv.remove(); // Now remove the task after the transition
        saveTasks(); // Save to localStorage after removal
    }, 300); // Time should match the CSS transition time
}



function clearAll() {
    const container = document.getElementById('taskContainer');
    container.innerHTML = ''; // Removes all children
    saveTasks();
}



function editTask(taskText) {
    const oldText = taskText.textContent;

    // Create input field
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = oldText;
    inputField.classList.add("edit-input");

    taskText.replaceWith(inputField);
    inputField.focus();

    function saveEdit() {
        const newText = inputField.value.trim() || oldText; // Keep old text if empty
        taskText.textContent = newText;

        // Re-enable editing
        taskText.onclick = function () {
            editTask(taskText);
        };

        inputField.replaceWith(taskText);
        saveTasks();
    }

    inputField.addEventListener("blur", saveEdit);
    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            saveEdit();
        }
    });
}



// Function to save the edited task
function saveEditedTask(inputField, taskElement) {
    taskElement.textContent = inputField.value;
    inputField.replaceWith(taskElement);

    taskElement.onclick = function () {
        editTask(taskElement);
    };

    saveTasks();
}

function saveTasks() {
    const tasks = [];
    const taskContainer = document.getElementById("taskContainer").children;

    for (let i = 0; i < taskContainer.length; i++) {
        const taskDiv = taskContainer[i];
        const taskText = taskDiv.querySelector('.task-text')?.textContent || ""; // Get updated text
        const isChecked = taskDiv.querySelector('input[type="checkbox"]').checked;

        tasks.push({ taskText, isChecked });
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));

    if (savedTasks) {
        savedTasks.forEach(task => {
            const div = document.createElement("div");
            div.id = "test";

            const checkcheck = document.createElement("input");
            checkcheck.type = "checkbox";
            checkcheck.checked = task.isChecked;
            div.appendChild(checkcheck);

            const taskText = document.createElement("div");
            taskText.classList.add("task-text");
            taskText.textContent = task.taskText;

            if (task.isChecked) {
                taskText.style.textDecoration = "line-through";
                taskText.style.color = "var(--checked)";
            }

            // Make tasks editable on click
            taskText.onclick = function() {
                editTask(taskText);
            };

            div.appendChild(taskText);

            checkcheck.onclick = function() {
                if (checkcheck.checked) {
                    taskText.style.textDecoration = "line-through"; 
                    taskText.style.color = "var(--checked)";
                } else {
                    taskText.style.textDecoration = "none";
                    taskText.style.color = 'var(--textcolor)';
                }
                saveTasks();
            };

            const removeBtn = document.createElement('button');
            removeBtn.id = 'remove';
            removeBtn.onclick = function() {
                removeTask(div);
                saveTasks();
            };

            const imagee = document.createElement('img');
            imagee.src = 'trash.png';
            removeBtn.appendChild(imagee);

            div.appendChild(removeBtn);

            document.getElementById("taskContainer").appendChild(div);
        });
    }
}

window.onload = function() {
    loadTasks();
};