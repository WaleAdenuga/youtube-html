import { makeAuthenticationRequest, accessParameters, handleAuthResponse, loadOwnChannelInfo } from "../channel.js";


export function renderHeaderCases(searchValue) {
    if (window.location.hash) {
        // we just received the access token, handle accordingly
        handleAuthResponse();
        renderHeader(searchValue);
    } else {
        renderHeader(searchValue);
    }
}

function renderHeader(searchValue) {
    let headerHTML = `
    <div class="left-section">
        <img class="hamburger-menu" src="icons/hamburger-menu.svg">
        <img src="icons/youtube-logo.svg" class="youtube-logo">
    </div>

    <div class="middle-section">
        <!-- to create a textbox -->
        <input class="search-bar js-search-bar" type="text" placeholder="Search">

        <!-- put position absolute inside position tooltip to create tooltip -->
        <button class="search-button js-search-button">
            <img class="search-icon" src="icons/search.svg">
            <div class="tooltip">Search</div>
        </button>

        <button class="voice-search-button">
            <img class="voice-search-icon" src="icons/voice-search-icon.svg">
            <div class="tooltip">Search with your voice</div>
        </button>

    </div>

    <div class="right-section js-right-section">
        
    </div>

    `;

    const headerElement = document.querySelector('.js-header');
    headerElement.innerHTML = headerHTML;

    const searchBar = document.querySelector('.js-search-bar');

    if (searchValue) {
        searchBar.value = searchValue;
        searchBar.style.display = 'block';
    }

    const searchButton = document.querySelector('.js-search-button');

    searchButton.addEventListener('click', () => {
        sendRequest(searchBar.value);
    });
    searchBar.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && searchBar.value) {
            sendRequest(searchBar.value);
        }
    });

    const access_token = localStorage.getItem('access_token');
    console.log(access_token);
    if (access_token) {
        renderSignedIn(access_token);
    } else {
        console.log('In signed out portion of page');
        renderSignedOut();
        const signInElement = document.querySelector('.js-sign-button');
        signInElement.addEventListener('click', () => {
            makeAuthenticationRequest();
        });
    }
}

async function renderSignedIn(accessToken) {

    const myChannel = await loadOwnChannelInfo(accessToken);
    console.log(myChannel);

    const rightSection = document.querySelector('.js-right-section');

    let content = document.createElement('div');
    content.classList.add('upon-sign-in-container');

    content.innerHTML = `
    <div class="upload-icon-container">
        <img class="upload-icon" src="icons/upload.svg">
        <div class="tooltip">Create</div>
    </div>

    <div class="notifications-icon-container">
        <img class="notifications-icon" src="icons/notifications.svg">
        <div class="notification-count">
            3
        </div>
        <div class="tooltip">Notifications</div>
    </div>
    
    <img class="current-user-picture" src=${myChannel.loadChannelProfilePicCustomUrl()}>
    `;

    rightSection.appendChild(content);
}

function renderSignedOut() {

    const rightSection = document.querySelector('.js-right-section');

    let content = document.createElement('div');
    content.classList.add('sign-in-settings-container');

    content.innerHTML = `
        <div class="settings-icon-container">
            <img class="settings-icon" src="icons/three-dots-vertical.svg">
            <div class="tooltip">Settings</div>
        </div>

        <button class="sign-in-btn js-sign-button">
            <img class="sign-in-icon" src="icons/person-circle.svg">
           <div class="sign-in-text">Sign in</div>
        </button>
    `;

    rightSection.appendChild(content);

}

async function sendRequest(value) {
    window.location.href = `results.html?search-query=${checkAndReplaceWhitespace(value)}`;
}

function checkAndReplaceWhitespace(searchString) {
    if (searchString.includes(' ')) {
        return searchString.replace(/ /g, '+'); // use regex to remove whitespace globally
    } else return searchString;
} 

