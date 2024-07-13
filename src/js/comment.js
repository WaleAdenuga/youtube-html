import { YOUTUBE_API_KEY } from "./videos.js";
let videoComments = [];
let videoCommentReplies = [];
let nextPageToken;
let nextPageTokenReplies;

let obj = [];
let objReplies = [];

class Comment {
    kind;
    etag;
    id;
    snippet;

    constructor(commentDetails)  {
        this.kind = commentDetails.kind;
        this.etag = commentDetails.etag;
        this.id = commentDetails.id;
        this.snippet = commentDetails.snippet;
    }

    loadCommentId() {
        return this.id;
    }

    loadRepliesNumber() {
        return Number (this.snippet.totalReplyCount);
    }

    loadCommentTextDisplay() {
        return (this.kind === 'youtube#commentThread') ? this.snippet.topLevelComment.snippet.textDisplay : this.snippet.textDisplay;
    }

    loadCommentAuthorChannelId() {
        return (this.kind === 'youtube#commentThread') ? this.snippet.topLevelComment.snippet.authorChannelId.value : this.snippet.authorChannelId.value;
    }

    loadCommentAuthorChannelUrl() {
        return (this.kind === 'youtube#commentThread') ? this.snippet.topLevelComment.snippet.authorChannelUrl : this.snippet.authorChannelUrl;
    }

    loadCommentAuthorProfileImageUrl() {
        return (this.kind === 'youtube#commentThread') ? this.snippet.topLevelComment.snippet.authorProfileImageUrl : this.snippet.authorProfileImageUrl;
    }

    loadCommentAuthorChannelDisplayName() {
        return (this.kind === 'youtube#commentThread') ? this.snippet.topLevelComment.snippet.authorDisplayName : this.snippet.authorDisplayName;
    }

    loadCommentPublishedAt() {
        return (this.kind === 'youtube#commentThread') ? this.#formatDatePosted(this.snippet.topLevelComment.snippet.publishedAt) : this.#formatDatePosted(this.snippet.publishedAt);
    }

    loadCommentLikeCount() {
        return (this.kind === 'youtube#commentThread') ? this.#formatCount(this.snippet.topLevelComment.snippet.likeCount) : this.#formatCount(this.snippet.likeCount);
    }

    checkIfEdited() {
        return (this.kind === 'youtube#commentThread') ? this.snippet.topLevelComment.snippet.updatedAt !== this.snippet.topLevelComment.snippet.publishedAt : this.snippet.updatedAt !== this.snippet.publishedAt;
    }

    #formatCount(count) {
        let viewCounts = parseInt(count, 10) || 0;
        if (viewCounts) {
            if (viewCounts < 1000) {
                return viewCounts;
            } else if (viewCounts < 1000000) {
                return (viewCounts / 1000).toFixed(1) + "K";
            } else if (viewCounts < 1000000000) {
                return (viewCounts / 1000000).toFixed(1) + "M";
            } else if (viewCounts < 1000000000000) {
                return (viewCounts / 1000000000).toFixed(1) + "B";
            }
        } else console.error("Invalid view count");
    }

    #formatDatePosted(datePosted) {
        let at = moment(datePosted);
        let now = moment();
    
        let duration = moment.duration(now.diff(at));
        if (duration.asMilliseconds() > 0) {
            if (duration.years() > 0) {
                return `${duration.years()} years ago`;
            } else if (duration.months() > 0)  {
                return `${duration.months()} months ago`;
            } else if (duration.days() > 0) {
                return `${duration.days()} days ago`;
            } else if (duration.minutes() > 0) {
                return `${duration.minutes()} minutes ago`;
            } else if (duration.seconds() > 0) {
                return `${duration.seconds()} seconds ago`;
            }
        }
    }
}

class CommentReplies extends Comment {
    constructor(commentDetails) {
        super(commentDetails);
    }
}

export async function loadVideoComments(videoId, token) {
    let promise;
    if(!token) {
        promise = fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=id%2C%20snippet&maxResults=25&order=relevance&textFormat=html&videoId=${videoId}&key=${YOUTUBE_API_KEY}`)
        .then((response) => {
            return response.json();
        }).then ((data) => {
            videoComments = data.items.map((commentDetails) => {
                return new Comment(commentDetails);
            });
            if (data.nextPageToken) {
                nextPageToken = data.nextPageToken;
                obj = {nextPageToken, videoComments};
            } else {
                obj = {videoComments};
            }
            return obj;
        }).catch((error) => {
            console.log(error);
        });
    } else {
        // load the rest of the comments at the end of the page
        promise = fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=id%2C%20snippet&maxResults=25&order=relevance&pageToken=${token}&textFormat=html&videoId=${videoId}&key=${YOUTUBE_API_KEY}`)
        .then((response) => {
            return response.json();
        }).then ((data) => {
            data.items.forEach((commentDetails) => {
                videoComments.push(new Comment(commentDetails));
            });
            if (data.nextPageToken) {
                nextPageToken = data.nextPageToken;
                obj = {nextPageToken, videoComments};
            } else {
                obj = {videoComments};
            }
            return obj;
        }).catch((error) => {
            console.log(error);
        });
    }
    
    return promise;
}

export async function getCommentReplies(commentId, token) {
    console.log('inside getCommentReplies');
    let promise;
    if (!token) {
        promise = fetch(`https://youtube.googleapis.com/youtube/v3/comments?part=snippet%2C%20id&maxResults=10&parentId=${commentId}&textFormat=html&key=${YOUTUBE_API_KEY}`)
            .then((response) => {
                return response.json();
            }).then((data) => {
                videoCommentReplies = data.items.map((commentDetails) => {
                    return new CommentReplies(commentDetails);
                });
                if (data.nextPageToken) {
                    nextPageTokenReplies = data.nextPageToken;
                    objReplies = { nextPageTokenReplies, videoCommentReplies };
                } else {
                    objReplies = { videoCommentReplies };
                }
                return objReplies;
            }).catch((error) => {
                console.log(error);
            });
    } else {
        promise = fetch(`https://youtube.googleapis.com/youtube/v3/comments?part=snippet%2C%20id&maxResults=15&pageToken=${token}&parentId=${commentId}&textFormat=html&key=${YOUTUBE_API_KEY}`)
        .then((response) => {
            return response.json();
        }).then((data) => {
            data.items.map((commentDetails) => {
                videoCommentReplies.push(new CommentReplies(commentDetails));
            });
            if (data.nextPageToken) {
                nextPageTokenReplies = data.nextPageToken;
                objReplies = { nextPageTokenReplies, videoCommentReplies };
            } else {
                objReplies = { videoCommentReplies };
            }
            return objReplies;
        }).catch((error) => {
            console.log(error);
        });
    }
    return promise;
}