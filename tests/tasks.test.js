'use strict';
// KAN-116 unit tests for app/tasks.js (node:test + node:assert).
const test = require('node:test');
const assert = require('node:assert');
const Tasks = require('../app/tasks.js');

const { MAX_LENGTH, createTask, addTask, toggleTask, deleteTask } = Tasks;

test('MAX_LENGTH is 200', () => {
  assert.strictEqual(MAX_LENGTH, 200);
});

test('createTask returns active task with trimmed text', () => {
  assert.deepStrictEqual(createTask(1, '  Buy milk  '), { id: 1, text: 'Buy milk', completed: false });
});

test('createTask returns null for empty, whitespace-only, and non-string text', () => {
  assert.strictEqual(createTask(1, ''), null);
  assert.strictEqual(createTask(1, '   \t\n '), null);
  assert.strictEqual(createTask(1, undefined), null);
  assert.strictEqual(createTask(1, null), null);
});

// ---- add ----
test('add: trims text and places new task at index 0 as active', () => {
  const start = [{ id: 1, text: 'old', completed: false }];
  const r = addTask(start, '  new  ', 2);
  assert.strictEqual(r.added, true);
  assert.strictEqual(r.tasks.length, 2);
  assert.deepStrictEqual(r.tasks[0], { id: 2, text: 'new', completed: false });
  assert.strictEqual(r.tasks[1].id, 1);
});

test('add: empty input is rejected and array returned unchanged', () => {
  const start = [{ id: 1, text: 'old', completed: false }];
  const r = addTask(start, '', 2);
  assert.strictEqual(r.added, false);
  assert.strictEqual(r.tasks, start);
});

test('add: whitespace-only input is rejected', () => {
  const start = [];
  const r = addTask(start, '    ', 1);
  assert.strictEqual(r.added, false);
  assert.strictEqual(r.tasks, start);
  assert.strictEqual(r.tasks.length, 0);
});

test('add: exactly 200 characters is accepted', () => {
  const r = addTask([], 'a'.repeat(200), 1);
  assert.strictEqual(r.added, true);
  assert.strictEqual(r.tasks[0].text.length, 200);
});

test('add: 201 characters is rejected', () => {
  const start = [];
  const r = addTask(start, 'a'.repeat(201), 1);
  assert.strictEqual(r.added, false);
  assert.strictEqual(r.tasks, start);
});

test('add: padded input is trimmed before length is measured', () => {
  const ok = addTask([], '  ' + 'a'.repeat(200) + '  ', 1);
  assert.strictEqual(ok.added, true);
  assert.strictEqual(ok.tasks[0].text.length, 200);
  const bad = addTask([], '  ' + 'a'.repeat(201) + '  ', 1);
  assert.strictEqual(bad.added, false);
});

test('add: does not mutate the input array', () => {
  const start = Object.freeze([Object.freeze({ id: 1, text: 'old', completed: false })]);
  const r = addTask(start, 'new', 2);
  assert.strictEqual(start.length, 1);
  assert.notStrictEqual(r.tasks, start);
});

test('add: markup-like text is kept literally', () => {
  const r = addTask([], '<b>x</b>', 1);
  assert.strictEqual(r.tasks[0].text, '<b>x</b>');
});

// ---- toggle (derived from AD-4, not a Jira AC) ----
test('toggle: completes an active task (derived from AD-4, not a Jira AC)', () => {
  const r = toggleTask([{ id: 1, text: 'a', completed: false }], 1);
  assert.strictEqual(r[0].completed, true);
});

test('toggle: un-completes a completed task (derived from AD-4, not a Jira AC)', () => {
  const r = toggleTask([{ id: 1, text: 'a', completed: true }], 1);
  assert.strictEqual(r[0].completed, false);
});

test('toggle: unknown id leaves list unchanged (derived from AD-4, not a Jira AC)', () => {
  const start = [{ id: 1, text: 'a', completed: false }];
  const r = toggleTask(start, 99);
  assert.deepStrictEqual(r, start);
});

test('toggle: does not mutate input and only affects target (derived from AD-4, not a Jira AC)', () => {
  const start = Object.freeze([
    Object.freeze({ id: 1, text: 'a', completed: false }),
    Object.freeze({ id: 2, text: 'b', completed: false }),
  ]);
  const r = toggleTask(start, 2);
  assert.strictEqual(start[1].completed, false);
  assert.strictEqual(r[0].completed, false);
  assert.strictEqual(r[1].completed, true);
  assert.notStrictEqual(r, start);
});

// ---- delete ----
test('delete: removes the task, keeps others and their order', () => {
  const start = [
    { id: 3, text: 'c', completed: false },
    { id: 2, text: 'b', completed: true },
    { id: 1, text: 'a', completed: false },
  ];
  const r = deleteTask(start, 2);
  assert.deepStrictEqual(r.map((t) => t.id), [3, 1]);
  assert.strictEqual(r[0], start[0]);
  assert.strictEqual(start.length, 3);
});

test('delete: unknown id leaves list unchanged', () => {
  const start = [{ id: 1, text: 'a', completed: false }];
  assert.deepStrictEqual(deleteTask(start, 42), start);
});

test('delete: deleting the last task yields an empty array', () => {
  assert.deepStrictEqual(deleteTask([{ id: 1, text: 'a', completed: false }], 1), []);
});

// ---- id uniqueness (app.js-style counter, incremented only on added:true) ----
test('ids stay unique over several adds, rejected adds, and deletes', () => {
  let tasks = [];
  let nextId = 1;
  const add = (text) => {
    const r = addTask(tasks, text, nextId);
    tasks = r.tasks;
    if (r.added) nextId += 1;
  };
  add('one');
  add('two');
  add('   ');
  add('three');
  tasks = deleteTask(tasks, 2);
  add('four');
  add('a'.repeat(201));
  add('five');
  const ids = tasks.map((t) => t.id);
  assert.strictEqual(new Set(ids).size, ids.length);
  assert.deepStrictEqual(ids, [5, 4, 3, 1]);
  assert.strictEqual(nextId, 6);
});
