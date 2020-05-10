import { Utils } from '../utils/Utils.js';

let testWrapper;

const initEvents = () => {
  testWrapper = document.querySelector('#main-test');
  executeTest();
};

document.addEventListener('DOMContentLoaded', initEvents);

const executeTest = () => {

  assertTest(Utils.convertToMinutes(45.23), 'Seconds with milliseconds', '45.2');
  assertTest(Utils.convertToMinutes(67), 'Seconds with forward zero', '1:07.0');
  assertTest(Utils.convertToMinutes(300), 'Five minutes', '5:00.0');
  assertTest(Utils.convertToMinutes(3600 / 2), '30 minutes', '30:00.0');
  assertTest(Utils.convertToMinutes(3900), 'Minutes with forward zero', '1:05:00.0');
  assertTest(Utils.convertToMinutes(3600), 'One hour', '1:00:00.0');
  assertTest(Utils.convertToMinutes(5524), 'Average time with hours', '1:32:04.0');

}

const assertTest = (value, desc, expectedValue) => {
  const el = document.createElement('div');

  if (value === expectedValue) {
    el.innerHTML = `<span class="test-passed">${desc} is ${expectedValue} </span>`;
  } else {
    el.innerHTML = `<span class="test-failed"> ${desc} is not ${expectedValue} instead got ${value} </span>`;
  }
  testWrapper.appendChild(el);
}