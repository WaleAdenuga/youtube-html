export function renderHeader() {
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

    <div class="right-section">

        <div class="upload-icon-container">
            <img class="upload-icon" src="icons/upload.svg">
            <div class="tooltip">Create</div>
        </div>

        <div class="youtube-apps-container">
            <img class="youtube-apps-icon" src="icons/youtube-apps.svg">
            <div class="tooltip">YouTube Apps</div>
        </div>


        <div class="notifications-icon-container">
            <img class="notifications-icon" src="icons/notifications.svg">
            <div class="notification-count">
                3
            </div>
            <div class="tooltip">Notifications</div>
        </div>
        <img class="current-user-picture" src="channel-pictures/my-channel.jpeg">
    </div>

    `;

    

    return headerHTML;
}

