import "../styles/general.css";
import "../styles/header.css";
import "../styles/video.css";
import "../styles/sidebar.css";
import "../styles/results.css";

import { renderHeaderCases } from "./general-layout/header.js";
import { renderSidebar } from "./general-layout/sidebar.js";
import { loadChannelInfo } from "./channel.js";

try {
    const url = new URL(window.location.href);
    let searchValue;
    if (url.searchParams.has('search-query')) {
        searchValue = url.searchParams.get('search-query');
    } else {
        searchValue = '';
    }

    renderHeaderCases(searchValue);

    renderSidebar();
    // await loadSearchedVideos(checkAndReplace(searchValue));
    renderResultsPage();

} catch (error) {
    console.log(error);
}

function checkAndReplace(searchString) {
    if (searchString.includes('+')) {
        return searchString.replace(/ /g, '%20'); // use regex to remove whitespace globally
    } else return searchString;
}



function renderResultsPage() {
    const container = document.querySelector('.js-result-video-container');

    searchVideos.forEach(async (video) => {

        const channelInfo = await loadChannelInfo(video.loadChannelId());

        let resultVideo = document.createElement('div');
        resultVideo.classList.add('result-video-preview');
        resultVideo.innerHTML = `
        <div class="result-video-thumbnail">
            <img class="result-thumbnail" src=${video.loadThumbnailUrl()}>

            <div class="video-overlay-container">
                <div class="video-overlay">
                    <a href="https://www.youtube.com/watch?v=${video.getId()}">
                        <button class="redirect js-redirect-youtube">GO TO YOUTUBE</button>
                    </a>
                    <a href="display.html?id=${video.getId()}">
                        <button class="redirect js-redirect-display">WATCH HERE</button>
                    </a>
                </div>
            </div>
        </div>

        <div class="search-video-info">
            <div class="search-video-title">
                <a href="https://www.youtube.com/watch?v=${video.getId()}">
                    <h3>
                        ${video.loadTitle()}
                    </h3>
                </a>

            </div>
            <div class="search-video-stats">
                <a href="https://www.youtube.com/watch?v=${video.getId()}">
                    <p>${video.formatViewCounts()} views &#183; ${video.formatDatePosted()}</p>
                </a>

            </div>
            <div>
                <a href="https://www.youtube.com/${channelInfo.loadChannelCustomUrl()}" class="search-video-channel-info">
                    <img class="search-video-channel-profile-pic" src="${channelInfo.loadChannelProfilePicCustomUrl()}">

                    <div class="search-video-channel-name">
                        <p>${video.loadChannelTitle()}</p>
                        <div class="tooltip">${video.loadChannelTitle()}</div>
                    </div>
                </a>

            </div>
            <div>

                <a href="https://www.youtube.com/watch?v=${video.getId()}" class="search-video-description">
                    <p>${video.loadVideoDescription()}</p>
                    <div class="tooltip">From the video description</div>
                </a>

            </div>
        </div>
        `;

        container.appendChild(resultVideo);
    });
}