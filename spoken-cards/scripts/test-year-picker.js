// Run with: node scripts/test-year-picker.js
// Geometry regression tests; does not read or change saved learning records.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
const source = html.slice(html.indexOf('function positionYearPicker()'), html.indexOf('function chooseProgressYear('));
let rect = { bottom: 400, right: 370, width: 74 };
let open = false;
let focused = false;
const menu = {
  style: { setProperty(name, value) { this[name] = value; } }, clientHeight: 190, scrollTop: 0,
  matches: () => open,
  hidePopover: () => { open = false; },
  showPopover: () => { open = true; },
  contains: () => false,
  querySelector: () => ({ offsetTop: 88, offsetHeight: 38, focus: () => { focused = true; } })
};
const trigger = { getBoundingClientRect: () => rect, setAttribute() {} };
const context = {
  document: { getElementById: id => id === 'yearMenu' ? menu : trigger },
  window: {
    addEventListener() {},
    scrollBy: ({ top }) => { rect.bottom -= top; },
    visualViewport: null
  },
  innerWidth: 390, innerHeight: 600, Node: class {}, getComputedStyle: () => ({ fontSize: '15px' }),
  cancelAnimationFrame() {}, requestAnimationFrame: fn => { fn(); return 1; }
};
vm.createContext(context);
vm.runInContext(source, context);
const call = code => vm.runInContext(code, context);
call('toggleYearPicker()');
assert.equal(menu.style.top, '408px');
assert.equal(menu.style.width, '74px');
assert.equal(menu.style.left, '296px');
assert.equal(menu.style['--year-font-size'], '15px');
assert.equal(menu.style.maxHeight, '180px');
assert.equal(open, true);
assert.equal(focused, true);

// Page scrolling and resizing follow the trigger instead of retaining stale coordinates.
rect.bottom = 330;
rect.width = 68;
call('followYearPicker({target: window})');
assert.equal(menu.style.top, '338px');
assert.equal(menu.style.width, '68px');
assert.equal(menu.style.left, '302px');
context.innerHeight = 460;
call('followYearPicker({target: window})');
assert.equal(menu.style.maxHeight, '110px');
assert.equal(menu.style.top, '338px');

// Reopening near the bottom makes room below, never chooses an above-trigger top.
open = false;
rect.bottom = 440;
call('toggleYearPicker()');
assert.equal(rect.bottom, 344);
assert.equal(menu.style.top, '352px');
assert.equal(menu.style.maxHeight, '96px');

// If the viewport subsequently leaves no usable room, close instead of flipping upward.
context.innerHeight = 380;
call('followYearPicker({target: window})');
assert.equal(open, false);

context.window.visualViewport = { offsetTop: 10, height: 500 };
rect.bottom = 350;
call('positionYearPicker()');
assert.equal(menu.style.top, '358px');
assert.equal(menu.style.maxHeight, '140px');
console.log('Year picker: downward placement, scroll/resize tracking, short viewport and visual viewport checks passed.');
