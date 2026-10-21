'use strict';
// KAN-116 pure task logic. No DOM, no mutation of inputs, no id state (AD-7, AD-9).
(function (root) {
  var MAX_LENGTH = 200;

  function createTask(id, text) {
    if (typeof text !== 'string') return null;
    var trimmed = text.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_LENGTH) return null;
    return { id: id, text: trimmed, completed: false };
  }

  function addTask(tasks, text, nextId) {
    var task = createTask(nextId, text);
    if (task === null) return { tasks: tasks, added: false };
    return { tasks: [task].concat(tasks), added: true };
  }

  function toggleTask(tasks, id) {
    return tasks.map(function (t) {
      return t.id === id ? { id: t.id, text: t.text, completed: !t.completed } : t;
    });
  }

  function deleteTask(tasks, id) {
    return tasks.filter(function (t) {
      return t.id !== id;
    });
  }

  var api = {
    MAX_LENGTH: MAX_LENGTH,
    createTask: createTask,
    addTask: addTask,
    toggleTask: toggleTask,
    deleteTask: deleteTask
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.Tasks = api;
  }
})(globalThis);
