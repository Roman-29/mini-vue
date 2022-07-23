/*
 * @Author: luojw
 * @Date: 2022-07-23 18:24:34
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-23 19:30:33
 * @Description:
 */
const queue: any[] = [];
const p = Promise.resolve();
let isFlushPending = false;

export function queueJobs(job) {
  // 存入微任务
  if (!queue.includes(job)) {
    queue.push(job);
  }

  queueFlush();
}

export function nextTick(fn) {
  return fn ? p.then(fn) : p;
}

export function queueFlush() {
  if (isFlushPending) {
    return;
  }

  // 创建一个promise, 异步执行微任务
  isFlushPending = true;
  nextTick(flushJobs);
}

function flushJobs() {
  isFlushPending = false;
  let job;
  while ((job = queue.shift())) {
    job && job();
  }
}
