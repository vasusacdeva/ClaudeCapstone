'use strict';
// KAN-116 UI controller. State lives here; logic is in tasks.js (loaded first).
(function () {
  var Tasks = globalThis.Tasks;
  var tasks = [];
  var nextId = 1;

  var form = document.getElementById('task-form');
  var input = document.getElementById('task-input');
  var list = document.getElementById('task-list');
  var emptyState = document.getElementById('empty-state');
  var status = document.getElementById('status');

  function announce(message) {
    status.textContent = message;
  }

  function render() {
    list.textContent = '';
    emptyState.hidden = tasks.length > 0;

    tasks.forEach(function (task) {
      var li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'task-' + task.id;
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', function () {
        tasks = Tasks.toggleTask(tasks, task.id);
        var nowCompleted = !task.completed;
        render();
        announce(nowCompleted ? 'Task completed' : 'Task reopened');
        var again = document.getElementById('task-' + task.id);
        if (again) again.focus();
      });

      var label = document.createElement('label');
      label.setAttribute('for', checkbox.id);
      label.textContent = task.text;

      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'delete-btn';
      del.setAttribute('aria-label', 'Delete task: ' + task.text);
      var icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '🗑';
      del.appendChild(icon);
      del.addEventListener('click', function () {
        tasks = Tasks.deleteTask(tasks, task.id);
        render();
        announce('Task deleted');
        input.focus();
      });

      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var result = Tasks.addTask(tasks, input.value, nextId);
    if (result.added) {
      nextId += 1;
      tasks = result.tasks;
      input.value = '';
      render();
      announce('Task added');
    }
    input.focus();
  });

  render();
})();
