export let searchVideos = [];
export let homeVideos = [];

class Video {
    kind; // kind can be search result or possibly trending, we'll figure that out later
    etag;
    id; // contains kind and videoId
    snippet; // contains info on the video
    contentDetails;
    statistics; // contains viewCount, likeCount, dislikeCount, favoriteCount, commentCount

    // constructor for only id provided

    constructor(videoDetails) {
        this.kind = videoDetails.kind;
        this.etag = videoDetails.etag;
        this.id = videoDetails.id;
        this.snippet = videoDetails.snippet;
        this.contentDetails = videoDetails.contentDetails;
        if (videoDetails.statistics) {
            this.statistics = videoDetails.statistics;
        } else { 
            this.loadStatistics().then((response) => {
                this.statistics = response;
            })    
        }
    }

    getId() {
        if (this.kind === 'youtube#searchResult') return this.id.videoId;
        else return this.id;
    }

    formatDatePosted(){
        let at = moment(this.snippet.publishedAt);
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

    formatDuration() {
        const momentDuration = moment.duration(this.contentDetails.duration);
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

    formatViewCounts() {
        let viewCounts = parseInt(this.statistics.viewCount, 10) || 0;
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

    loadThumbnailUrl() {
        if (this.snippet.thumbnails.high) {
            return this.snippet.thumbnails.high.url;
        } else if (this.snippet.thumbnails.medium) {
            return this.snippet.thumbnails.medium.url;
        } else if (this.snippet.thumbnails.default) {
            return this.snippet.thumbnails.default.url;
        } else if (this.snippet.thumbnails.standard) {
            return this.snippet.thumbnails.standard.url;
        } else if (this.snippet.thumbnails.maxres) {
            return this.snippet.thumbnails.maxres.url;
        }
    }

    async loadStatistics() {
        try {
            const response = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=${this.getId()}&maxResults=5&regionCode=BE&key=AIzaSyAkuaLdNIusoCt62EVFVEx8l4n2-xRFtJc`);
            const data = await response.json();
            return data.items[0].statistics;
        } catch (error) {
            console.log(error);
        }
        
    }

    loadTitle() {
        return this.snippet.title;
    }

    loadChannelTitle() {
        return this.snippet.channelTitle;
    }

    loadChannelId () {
        return this.snippet.channelId;
    }

    loadVideoDescription() {
        return this.snippet.description;
    }
}

export async function loadSearchedVideos(queryString) {
    const promise = fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=49&order=relevance&q=${queryString}&type=video&videoCaption=any&videoDefinition=any&videoEmbeddable=any&key=AIzaSyAkuaLdNIusoCt62EVFVEx8l4n2-xRFtJc`).then((response) => {
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
    const promise = fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails%2C%20snippet%2C%20statistics&chart=mostPopular&maxResults=49&regionCode=BE&key=AIzaSyAkuaLdNIusoCt62EVFVEx8l4n2-xRFtJc`).then((response) => {
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

/* await loadSearchedVideos();
console.log(searchVideos); */
