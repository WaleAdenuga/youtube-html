import { loadSearchedVideos, searchVideos, loadPopularVideos, homeVideos } from "./videos.js";
import { loadChannelInfo } from "./channel.js";
import { renderHeader } from "./general-layout/header.js"
import { renderSidebar } from "./general-layout/sidebar.js";

let queryString;

try {
    await loadPopularVideos();
    document.querySelector('.header').innerHTML = renderHeader();
    document.querySelector('.sidebar').innerHTML = renderSidebar();
    renderHomePage();

    const searchButton = document.querySelector('.js-search-button');
    const searchInput = document.querySelector('.js-search-bar');
    
    searchButton.addEventListener('click', () => {
        sendRequest(searchInput.value);
    });
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendRequest(searchInput.value);
        }
    });
    
} catch (error) {
    console.log(error);
}

async function sendRequest(value) {
    queryString = checkAndReplaceWhitespace(value);
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

function renderHomePage() {
    const videoContainer = document.querySelector('.js-video-grid');

    homeVideos.forEach(async (video) => {

        const channelInfo = await loadChannelInfo(video.snippet.channelId);

        let videoInGrid = document.createElement('div');
        videoInGrid.classList.add('video-preview');
        videoInGrid.classList.add('js-video-preview');

        videoInGrid.innerHTML = 
        `
            <div class="thumbnail-row">
                <a href="https://www.youtube.com/watch?v=${video.getId()}">
                    <img class="thumbnail" src=${video.loadThumbnailUrl()}>
                </a>
                <div class="video-time">
                    ${video.formatDuration()}
                </div>
            </div>
    
            <div class="video-info-grid">
                <div class="channel-picture">
                    <div class="profile-pic-container">
                        <a href="https://www.youtube.com/${channelInfo.loadChannelCustomUrl()}" target="_blank">
                            <img class="profile-picture" src="${channelInfo.loadChannelPicture()}">
                        </a>
                        <div class="channel-tooltip">
                            <img class="tooltip-pic" src="${channelInfo.loadChannelPicture()}">
                            <div>
                                <div class="tooltip-channel-name">${video.loadChannelTitle()}</div>
                                <div class="tooltip-sub-count">${channelInfo.formatTooltipSubscriberCount()} subscribers</div>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div class="video-info">
                    <a href="https://www.youtube.com/watch?v=${video.getId()}" class="video-title-link">
                        <p class="video-title">
                            ${video.loadTitle()}
                        </p>
                    </a>
                    <p class="video-author">
                        ${video.loadChannelTitle()}
                    </p>
                    <p class="video-stats">
                        ${video.formatViewCounts()} views &#183; ${video.formatDatePosted()}
                    </p>
                </div>
            </div>
        `
        videoContainer.appendChild(videoInGrid);
    });


}