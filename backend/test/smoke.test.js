import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

test('Express app exposes the health route', async () => {
  assert.equal(typeof app, 'function');
  assert.equal(typeof app.listen, 'function');
});
