export let searchVideos = [];
export let homeVideos = [];

class Video {
    kind; // kind can be search result or possibly trending, we'll figure that out later
    etag;
    id; // contains kind and videoId
    snippet; // contains info on the video
    contentDetails;
    statistics; // contains viewCount, likeCount, dislikeCount, favoriteCount, commentCount

    constructor(videoDetails) {
        this.kind = videoDetails.kind;
        this.etag = videoDetails.etag;
        this.id = videoDetails.id;
        this.snippet = videoDetails.snippet;
        this.contentDetails = videoDetails.contentDetails;
        this.statistics = videoDetails.statistics;
    }

    getSnippet() {
        return this.snippet;
    }
}

export async function loadSearchedVideos(queryString) {
    const promise = fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&order=relevance&q=${queryString}&type=video&videoCaption=any&videoDefinition=any&videoEmbeddable=any&key=AIzaSyAkuaLdNIusoCt62EVFVEx8l4n2-xRFtJc`).then((response) => {
        // response is a json object
        return response.json();
    }).then((data) => {
        searchVideos = data.items.map((details) => {
            return new Video(details);
        });
    }).catch((error) => {
        console.log(error);
    });
    return promise;
}

export async function loadPopularVideos() {
    const promise = fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails%2C%20snippet%2C%20statistics&chart=mostPopular&maxResults=30&regionCode=BE&key=AIzaSyAkuaLdNIusoCt62EVFVEx8l4n2-xRFtJc`).then((response) => {
        // response is a json object
        return response.json();
    }).then((data) => {
        console.log(data);
        homeVideos = data.items.map((details) => {
            return new Video(details);
        });
    }).catch((error) => {
        console.log(error);
    });
    return promise;
}

export function formatViewCounts(viewCounts) {
    if (viewCounts < 1000) {
        return viewCounts;
    } else if (viewCounts < 1000000) {
        return (viewCounts / 1000).toFixed(1) + "K";
    } else if (viewCounts < 1000000000) {
        return (viewCounts / 1000000).toFixed(1) + "M";
    } else if (viewCounts < 1000000000000) {
        return (viewCounts / 1000000000).toFixed(1) + "B";
    }
}

export function formatDatePosted(publishedAt){
    let at = moment(publishedAt);
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

/* await loadSearchedVideos();
console.log(searchVideos); */
