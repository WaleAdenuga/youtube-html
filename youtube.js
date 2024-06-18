import { loadSearchedVideos, searchVideos } from "./videos.js";

const searchButton = document.querySelector('.js-search-button');
const searchInput = document.querySelector('.js-search-bar');

let queryString;
searchButton.addEventListener('click', () => {
    // sendRequest();
});
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // sendRequest();
    }
});

async function sendRequest() {
    queryString = checkAndReplaceWhitespace(searchInput.value);  
    console.log(queryString);
    try {
        await loadSearchedVideos(queryString);
    } catch (error) {
        console.log(error);
    }
    console.log(searchVideos);
}

function checkAndReplaceWhitespace(searchString) {
    if (searchString.includes(' ')) {
        return searchString.replace(/ /g, '%20'); // use regex to remove whitespace globally
    } else return searchString;
}

