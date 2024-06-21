import { loadSearchedVideos, searchVideos, loadPopularVideos, homeVideos } from "./videos.js";
import { loadChannelInfo } from "./channel.js";
import { renderHeader } from "./general-layout/header.js"
import { renderSidebar } from "./general-layout/sidebar.js";

let queryString;

try {
    await loadPopularVideos();
    renderHeader();
    document.querySelector('.sidebar').innerHTML = renderSidebar();
    renderHomePage();
    
} catch (error) {
    console.log(error);
}

function renderHomePage() {
    const videoContainer = document.querySelector('.js-video-grid');

    homeVideos.forEach(async (video) => {

        const channelInfo = await loadChannelInfo(video.snippet.channelId);

        let videoInGrid = document.createElement('div');
        // videoInGrid.classList.add('video-preview');
        // videoInGrid.classList.add('js-video-preview');

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
                            <img class="profile-picture" src="${channelInfo.loadChannelProfilePicCustomUrl()}">
                        </a>
                        <div class="channel-tooltip">
                            <img class="tooltip-pic" src="${channelInfo.loadChannelProfilePicCustomUrl()}">
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