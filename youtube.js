import { loadSearchedVideos, searchVideos, loadPopularVideos, homeVideos, formatViewCounts, formatDatePosted } from "./videos.js";
import { loadChannelInfo } from "./channel.js";

const searchButton = document.querySelector('.js-search-button');
const searchInput = document.querySelector('.js-search-bar');

let queryString;
searchButton.addEventListener('click', () => {
    sendRequest();
});
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendRequest();
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

try {
    await loadPopularVideos();
    renderHomePage();
    
} catch (error) {
    console.log(error);
}

function formatDuration(duration) {
    const momentDuration = moment.duration(duration);
    const hours = Math.floor(momentDuration.asHours());
    const minutes = momentDuration.minutes();
    const seconds = momentDuration.seconds();
    
    let formattedDuration;
    if (hours >= 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        const totalHours = (days*24) + remainingHours;
        formattedDuration = `${totalHours}:${minutes}:${seconds}`;
    } else if (hours > 0) {
        formattedDuration = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else {
        formattedDuration = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    
    return formattedDuration;
}

function formatTooltipSubscriberCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(0) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(0) + 'K';
    } else {
        return count.toString();
    }
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
                <a href="https://www.youtube.com/watch?v=${video.id}">
                    <img class="thumbnail" src=${video.snippet.thumbnails.standard.url}>
                </a>
                <div class="video-time">
                    ${formatDuration(video.contentDetails.duration)}
                </div>
            </div>
    
            <div class="video-info-grid">
                <div class="channel-picture">
                    <div class="profile-pic-container">
                        <a href="https://www.youtube.com/${channelInfo.snippet.customUrl}" target="_blank">
                            <img class="profile-picture" src="${channelInfo.snippet.thumbnails["default"].url}">
                        </a>
                        <div class="channel-tooltip">
                            <img class="tooltip-pic" src="${channelInfo.snippet.thumbnails["high"].url}">
                            <div>
                                <div class="tooltip-channel-name">${video.snippet.channelTitle}</div>
                                <div class="tooltip-sub-count">${formatTooltipSubscriberCount(parseInt(channelInfo.statistics.subscriberCount, 10))} subscribers</div>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div class="video-info">
                    <a href="https://www.youtube.com/watch?v=${video.id}" class="video-title-link">
                        <p class="video-title">
                            ${video.snippet.localized.title}
                        </p>
                    </a>
                    <p class="video-author">
                        ${video.snippet.channelTitle}
                    </p>
                    <p class="video-stats">
                        ${formatViewCounts(parseInt(video.statistics.viewCount, 10))} views &#183; ${formatDatePosted(video.snippet.publishedAt)}
                    </p>
                </div>
            </div>
        `
        videoContainer.appendChild(videoInGrid);
    });


}