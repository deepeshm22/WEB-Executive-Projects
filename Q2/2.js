const API_URL = 'https://swapi.dev/api/planets/1/';
const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

function fetchData() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            displayData(data);
            cacheData(data);
        });
}

function displayData(data) {
    let table = '<table>';
    for (const key in data) {
        if (typeof data[key] !== 'object') {
            table += `<tr><td>${key}</td><td>${data[key]}</td></tr>`;
        }
    }
    table += '</table>';
    document.getElementById('data').innerHTML = table;
}

function cacheData(data) {
    const dataToCache = {
        data: data,
        timestamp: Date.now()
    };
    localStorage.setItem('apiData', JSON.stringify(dataToCache));
}

function getCachedData() {
    const cachedData = JSON.parse(localStorage.getItem('apiData'));
    if (cachedData && Date.now() - cachedData.timestamp < EXPIRATION_TIME) {
        return cachedData.data;
    }
    return null;
}

const data = getCachedData();
if (data) {
    displayData(data);
} else {
    fetchData();
}