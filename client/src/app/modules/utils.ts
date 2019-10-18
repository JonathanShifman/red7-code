export function getLocalStorage() {
  return JSON.parse(localStorage.getItem('red7'));
}

export function setLocalStorage(data) {
  return localStorage.setItem('red7', JSON.stringify(data));
}

