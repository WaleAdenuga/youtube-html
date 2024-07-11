import "../styles/header.css";
import "../styles/video.css";
import "../styles/display.css";

import { renderHeaderCases } from "./general-layout/header.js";
import { returnSVGS } from "./general-layout/imports.js";
import { loadFromVideoId } from "./videos.js";
import { loadChannelInfo } from "./channel.js";


try {
    renderHeaderCases();
    const url = new URL(window.location.href);
    let displayValue;
    if (url.searchParams.has('id')) {
        displayValue = url.searchParams.get('id');
    } else {
        displayValue = '';
    }

    renderDisplayPage(displayValue);

} catch (error) {
    console.log(error);
}
let fullDescription = '';
function formatTextDescription(video, displayValue) {
    return video.formatDescription(displayValue);
}

async function renderDisplayPage(displayValue) {

    const displayContainer = document.querySelector('.js-display-container');

    const svgs = returnSVGS();
    const video = await loadFromVideoId(displayValue);

    const channelInfo = await loadChannelInfo(video.loadChannelId());

    // Primary display - video, video statistics and comments
    let primaryDisplay = document.createElement('div');
    primaryDisplay.classList.add('primary-display');
    primaryDisplay.classList.add('js-primary-display');

    primaryDisplay.innerHTML = `
    <div class="video-display-container">
        <iframe class="video-iframe-container" src="https://www.youtube.com/embed/${video.getId()}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
        </iframe>
    </div>

    <div class="below-video-container">
        <div class="video-information-container">
            <h3 class="display-title-container">
                ${video.loadTitle()}
            </h3>

            <div class="video-stats-container">
                <div class="video-stats-left-section">
                    <div>
                        <a href="https://www.youtube.com/${channelInfo.loadChannelCustomUrl()}" target="_blank">
                            <img class="author-pic" src="${channelInfo.loadChannelProfilePicCustomUrl()}">
                        </a>
                    </div>
                    <div class="author-youtube-info">
                        <a href="https://www.youtube.com/${channelInfo.loadChannelCustomUrl()}" target="_blank">
                            <div class="author-name">
                                ${video.loadChannelTitle()}
                            </div>
                            <div class="author-sub-count">
                                ${channelInfo.formatTooltipSubscriberCount()} subscribers
                            </div>
                        </a>
                    </div>
                    <button class="author-subscribe-button">
                        Subscribe
                    </button>
                </div>

                <div class="video-stats-right-section">
                    <div class="video-interactions-container">
                        <div class="video-interactions">
                            <button class="video-like-button" >
                                <img class="video-like-pic" src="${svgs['like-icon.svg']}">

                                ${video.formatLikeCount()}
                            </button>
                            <button class="video-dislike-button">
                                <img class="video-dislike-pic" src="${svgs['dislike-icon.svg']}">
                            </button>
                        </div>
                        <div class="like-dislike-ratio">

                        </div>

                    </div>
                    <button class="video-share-button">
                        <img class="video-share-pic" src="${svgs['share-arrows.svg']}">
                        Share
                    </button>
                    <button class="video-options-button">
                        <img class="video-options-pic" src="${svgs['dots-horizontal.svg']}">
                    </button>
                </div>
            </div>

            <div class="video-description-container">
                <div class="current-video-stats-basic">
                    ${video.formatDisplayViewCount()} views &nbsp; ${video.formatDatePosted()}
                </div>
                <div class="video-description text">
                    <p class="video-description-text js-video-description-text">
                        ${formatTextDescription(video, false)}                  
                    </p>
                    <button class="show-more-button js-show-more-button">
                        ...more
                    </button>
                    
                    
                </div>
            </div>

        </div>

        <div class="video-comments-container">
            <div class="video-comments-count">
                ${video.formatCommentCount()} Comments

                <button class="sortby-button">
                    <img class="sort-by-pic" src="${svgs['sort-by.svg']}">
                    Sort by
                    <div class="tooltip">Sort Comments</div>
                </button>
            </div>
            <div class="video-comments-input-container">
                <img class="video-comment-user-avatar" src="${svgs['unnamed.jpg']}">
                <div class="comment-input-container">
                    <input class="video-comment-input" type="text" placeholder="Add a comment...">

                    <div class="beneath-input-container">
                        <button class="smiley-button">
                            <img class="smiley-input" src="${svgs['smiley.svg']}">
                        </button>
                        <div class="input-interaction-btns">
                            <button class="cancel-button">Cancel</button>
                            <button class="post-comment-btn">
                                Comment
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <div class="video-comments-list-container">
                <div class="video-comment">
                    <img class="commenter-avatar" src="../../downloaded_images/channel-pictures/channel-3.jpeg">

                    <div class="comment-information">

                        <div class="comment-info">
                            <div class="commenter-username">
                                @ThyWillBeDone001
                            </div>
                            <div class="comment-date">
                                3 years ago
                            </div>
                        </div>

                        <div class="comment-text">
                            This guy is collecting tech CEO interviews like Thanos collected the infinity stones.
                        </div>

                        <div class="comment-interactions">
                            <button class="comment-like-button" >
                                <img class="comment-like-pic" src="${svgs['like-icon.svg']}">
                            </button>
                            <div class="comment-like-count">5.9K</div>
                            <button class="comment-dislike-button">
                                <img class="comment-dislike-pic" src="${svgs['dislike-icon.svg']}">
                            </button>
                            <button class="comment-reply-button">
                                Reply
                            </button>
                        </div>

                        <button class="reply-interaction-button">
                            <img class="reply-pic" src="${svgs['nav-arrow-down.svg']}">
                            34 replies
                        </button>
                    </div>

                </div>

            </div>
        </div>

    </div>
    `;

    displayContainer.appendChild(primaryDisplay);

    // Secondary display - contains related videos to the one shown
    let secondaryDisplay = document.createElement('div');
    // secondaryDisplay.classList.add('secondary-display');
    // secondaryDisplay.classList.add('js-secondary-display');

    secondaryDisplay.innerHTML = `
    <div class="related-video-preview">
        <div class="related-thumbnail-row">
            <!-- img is a void element, no closing tag required -->
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY">
                <img class="thumbnail" src="../../downloaded_images/thumbnails/thumbnail-1.webp">
            </a>
            <div class="related-video-time">
                14:20
            </div>

        </div>

        <div class="related-video-info">
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY" class="related-video-title-link">
                <p class="video-title">
                    Talking Tech and AI with Google CEO Sundar Pichai!
                </p>
            </a>

            <p class="video-author">
                Marques Brownlee
            </p>
            <p class="video-stats">
                3.4M views &#183; 6 months ago
            </p>
        </div>

    </div>


    <div class="related-video-preview">
        <div class="related-thumbnail-row">
            <!-- img is a void element, no closing tag required -->
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY">
                <img class="thumbnail" src="../../downloaded_images/thumbnails/thumbnail-1.webp">
            </a>
            <div class="related-video-time">
                14:20
            </div>

        </div>

        <div class="related-video-info">
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY" class="related-video-title-link">
                <p class="video-title">
                    Talking Tech and AI with Google CEO Sundar Pichai!
                </p>
            </a>

            <p class="video-author">
                Marques Brownlee
            </p>
            <p class="video-stats">
                3.4M views &#183; 6 months ago
            </p>
        </div>

    </div>


    <div class="related-video-preview">
        <div class="related-thumbnail-row">
            <!-- img is a void element, no closing tag required -->
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY">
                <img class="thumbnail" src="../../downloaded_images/thumbnails/thumbnail-1.webp">
            </a>
            <div class="related-video-time">
                14:20
            </div>

        </div>

        <div class="related-video-info">
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY" class="related-video-title-link">
                <p class="video-title">
                    Talking Tech and AI with Google CEO Sundar Pichai!
                </p>
            </a>

            <p class="video-author">
                Marques Brownlee
            </p>
            <p class="video-stats">
                3.4M views &#183; 6 months ago
            </p>
        </div>

    </div>



    <div class="related-video-preview">
        <div class="related-thumbnail-row">
            <!-- img is a void element, no closing tag required -->
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY">
                <img class="thumbnail" src="../../downloaded_images/thumbnails/thumbnail-1.webp">
            </a>
            <div class="related-video-time">
                14:20
            </div>

        </div>

        <div class="related-video-info">
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY" class="related-video-title-link">
                <p class="video-title">
                    Talking Tech and AI with Google CEO Sundar Pichai!
                </p>
            </a>

            <p class="video-author">
                Marques Brownlee
            </p>
            <p class="video-stats">
                3.4M views &#183; 6 months ago
            </p>
        </div>

    </div>



    <div class="related-video-preview">
        <div class="related-thumbnail-row">
            <!-- img is a void element, no closing tag required -->
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY">
                <img class="thumbnail" src="../../downloaded_images/thumbnails/thumbnail-1.webp">
            </a>
            <div class="related-video-time">
                14:20
            </div>

        </div>

        <div class="related-video-info">
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY" class="related-video-title-link">
                <p class="video-title">
                    Talking Tech and AI with Google CEO Sundar Pichai!
                </p>
            </a>

            <p class="video-author">
                Marques Brownlee
            </p>
            <p class="video-stats">
                3.4M views &#183; 6 months ago
            </p>
        </div>

    </div>



    <div class="related-video-preview">
        <div class="related-thumbnail-row">
            <!-- img is a void element, no closing tag required -->
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY">
                <img class="thumbnail" src="../../downloaded_images/thumbnails/thumbnail-1.webp">
            </a>
            <div class="related-video-time">
                14:20
            </div>

        </div>

        <div class="related-video-info">
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY" class="related-video-title-link">
                <p class="video-title">
                    Talking Tech and AI with Google CEO Sundar Pichai!
                </p>
            </a>

            <p class="video-author">
                Marques Brownlee
            </p>
            <p class="video-stats">
                3.4M views &#183; 6 months ago
            </p>
        </div>

    </div>

    <div class="related-video-preview">
        <div class="related-thumbnail-row">
            <!-- img is a void element, no closing tag required -->
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY">
                <img class="thumbnail" src="../../downloaded_images/thumbnails/thumbnail-1.webp">
            </a>
            <div class="related-video-time">
                14:20
            </div>

        </div>

        <div class="related-video-info">
            <a href="https://www.youtube.com/watch?v=n2RNcPRtAiY" class="related-video-title-link">
                <p class="video-title">
                    Talking Tech and AI with Google CEO Sundar Pichai!
                </p>
            </a>

            <p class="video-author">
                Marques Brownlee
            </p>
            <p class="video-stats">
                3.4M views &#183; 6 months ago
            </p>
        </div>

    </div>
    `;

    displayContainer.appendChild(secondaryDisplay);

    // display the rest of the video description on click
    const showMoreButton = document.querySelector('.js-show-more-button');
    showMoreButton.addEventListener('click', () => {
        const videoDescriptionText = document.querySelector('.js-video-description-text');
        
        if (showMoreButton.textContent.includes('more')) {
            showMoreButton.textContent = 'Show less';
            videoDescriptionText.innerHTML = formatTextDescription(video, true);
        } else {
            showMoreButton.textContent = '...more';
            videoDescriptionText.innerHTML = formatTextDescription(video, false);
        }
        
    });

    if (video.snippet.description.length < 180) {
        showMoreButton.style.display = 'none';
    }
}
