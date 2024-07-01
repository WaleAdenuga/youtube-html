import { renderHeaderCases } from "./general-layout/header.js";


try {
    renderHeaderCases();
    const url = new URL(window.location.href);
    let displayValue;
    if (url.searchParams.has('id')) {
        displayValue = url.searchParams.get('id');
    } else {
        displayValue = '';
    }

    console.log(displayValue);
    renderDisplayPage(displayValue);
} catch (error) {
    console.log(error);
}


function renderDisplayPage(displayValue) {

    const displayContainer = document.querySelector('.js-display-container');

    // Primary display - video, video statistics and comments
    let primaryDisplay = document.createElement('div');
    primaryDisplay.classList.add('primary-display');
    primaryDisplay.classList.add('js-primary-display');

    primaryDisplay.innerHTML = `
    <div class="video-display-container">
        <iframe class="video-iframe-container" src="https://www.youtube.com/embed/${displayValue}?mute=1">
        </iframe>

        <!-- youtube data api doesn't allow you embed like this, they want control -->
        <!-- <video width="320" height="240" controls>
        <source src="480.mp4" type="video/mp4">
        Your browser does not support the video tag.
        </source>
        </video> -->
    </div>

    <div class="below-video-container">
        <div class="video-information-container">
            <h3 class="display-title-container">
                Talking Tech and AI with Google CEO Sundar Pichai!
            </h3>

            <div class="video-stats-container">
                <div class="video-stats-left-section">
                    <div>
                        <img class="author-pic" src="channel-pictures/channel-1.jpeg">
                    </div>
                    <div class="author-youtube-info">
                        <div class="author-name">
                            Marques Brownlee
                        </div>
                        <div class="author-sub-count">
                            19M subscribers
                        </div>
                    </div>
                    <button class="author-subscribe-button">
                        Subscribe
                    </button>
                </div>

                <div class="video-stats-right-section">
                    <div class="video-interactions-container">
                        <div class="video-interactions">
                            <button class="video-like-button" >
                                <img class="video-like-pic" src="icons/like-icon.svg">

                                202K
                            </button>
                            <button class="video-dislike-button">
                                <img class="video-dislike-pic" src="icons/dislike-icon.svg">
                                2.8K
                            </button>
                        </div>
                        <div class="like-dislike-ratio">

                        </div>

                    </div>
                    <button class="video-share-button">
                        <img class="video-share-pic" src="icons/share-arrows.svg">
                        Share
                    </button>
                    <button class="video-options-button">
                        <img class="video-options-pic" src="icons/dots-horizontal.svg">
                    </button>
                </div>
            </div>

            <div class="video-description-container">
                <div class="current-video-stats-basic">
                    4.2M views 3 years ago
                </div>
                <div class="video-description text">
                    <p class="video-description-text">
                        Talking tech and AI on the heels of Google I/O. Also a daily driver phone reveal from Google's CEO. Shoutout to Sundar!
                    </p>
                </div>
            </div>

        </div>

        <div class="video-comments-container">
            <div class="video-comments-count">
                9,783 Comments

                <button class="sortby-button">
                    <img class="sort-by-pic" src="icons/sort-by.svg">
                    Sort by
                    <div class="tooltip">Sort Comments</div>
                </button>
            </div>
            <div class="video-comments-input-container">
                <img class="video-comment-user-avatar" src="channel-pictures/channel-1.jpeg">
                <div class="comment-input-container">
                    <input class="video-comment-input" type="text" placeholder="Add a comment...">

                    <div class="beneath-input-container">
                        <button class="smiley-button">
                            <img class="smiley-input" src="icons/smiley.svg">
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
                    <img class="commenter-avatar" src="channel-pictures/channel-3.jpeg">

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
                                <img class="comment-like-pic" src="icons/like-icon.svg">
                            </button>
                            <div class="comment-like-count">5.9K</div>
                            <button class="comment-dislike-button">
                                <img class="comment-dislike-pic" src="icons/dislike-icon.svg">
                            </button>
                            <button class="comment-reply-button">
                                Reply
                            </button>
                        </div>

                        <button class="reply-interaction-button">
                            <img class="reply-pic" src="icons/nav-arrow-down.svg">
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
                <img class="thumbnail" src="thumbnails/thumbnail-1.webp">
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
                <img class="thumbnail" src="thumbnails/thumbnail-1.webp">
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
                <img class="thumbnail" src="thumbnails/thumbnail-1.webp">
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
                <img class="thumbnail" src="thumbnails/thumbnail-1.webp">
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
                <img class="thumbnail" src="thumbnails/thumbnail-1.webp">
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
                <img class="thumbnail" src="thumbnails/thumbnail-1.webp">
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
                <img class="thumbnail" src="thumbnails/thumbnail-1.webp">
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
}
