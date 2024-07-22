export let searchVideos = [];
export let homeVideos = [];

let relatedVideos = [];

export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

class Video {
    kind; // kind can be search result or possibly trending, we'll figure that out later
    etag;
    id; // contains kind and videoId
    snippet; // contains info on the video
    contentDetails;
    statistics; // contains viewCount, likeCount, dislikeCount, favoriteCount, commentCount
    status;
    player;

    // constructor for only id provided

    constructor(videoDetails) {
        this.kind = videoDetails.kind;
        this.etag = videoDetails.etag;
        this.id = videoDetails.id;
        this.snippet = videoDetails.snippet;
        this.contentDetails = videoDetails.contentDetails;
        this.statistics = videoDetails.statistics;
        this.status = videoDetails.status;
        this.player = videoDetails.player;
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
        try {
            const momentDuration = moment.duration(this.contentDetails.duration);
            const hours = Math.floor(momentDuration.asHours());
            const minutes = momentDuration.minutes();
            const seconds = momentDuration.seconds();

            let formattedDuration;
            if (hours >= 24) {
                const days = Math.floor(hours / 24);
                const remainingHours = hours % 24;
                const totalHours = (days * 24) + remainingHours;
                formattedDuration = `${totalHours}:${minutes}:${seconds}`;
            } else if (hours > 0) {
                formattedDuration = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            } else {
                formattedDuration = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }

            return formattedDuration;
        } catch (error) {
            console.log(error);
        }

    }

    formatViewCounts() {
        try {
            return this.#formatCount(this.statistics.viewCount);
        } catch (error) {
            console.error('No view count from data api' + error);
        }
    }

    formatLikeCount() {
        return this.#formatCount(this.statistics.likeCount);
    }

    formatCommentCount() {
        return parseInt(this.statistics.commentCount).toLocaleString();
    }

    formatDisplayViewCount() {
        return parseInt(this.statistics.viewCount).toLocaleString();
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

    formatDescription(displayFull) {
        const paragraphs = this.snippet.description.split(/\n\n+/);

        const sentences = [];
        paragraphs.forEach((paragraph) => {
            paragraph.split(/\n+/).map((line) => {
                sentences.push(line);
            })
        });

        let description = '';

        if (this.snippet.description.length > 180) {
            if (displayFull) {
                description = this.snippet.description;
            } else {
                if(sentences.length > 2) {
                    description = sentences.slice(0, 2).join('\n');
                } else {
                    description = this.snippet.description.substring(0, 180);
                }
                
            }
        } else {
            description = this.snippet.description;
        }
        return description.replace(/\n/g, '<br>');
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

    loadStatistics() {
        try {
            return fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=${this.getId()}&maxResults=5&key=${YOUTUBE_API_KEY}`).then((response) => {
                return response.json();
            }).then((data) => {
                this.statistics = data.items[0].statistics;
            })
        } catch (error) {
            console.log(error);
        }
        
    }

    loadContentDetails() {
        try {
            return fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${this.getId()}&maxResults=1&key=${YOUTUBE_API_KEY}`).then((response) => {
                return response.json();
            }).then((data) => {
                this.contentDetails = data.items[0].contentDetails;
            })
        } catch (error) {
            console.log(error);
        } 
    }

    async ensureLoaded() {
        if (!this.contentDetails ||!this.statistics) {
            await this.loadContentDetails();
            await this.loadStatistics();
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

export async function loadSearchedVideos(queryString, regionCode) {
    if (!regionCode) {
        console.log('no default region code');
        regionCode = 'BE'; // default to Belgium if no regionCode is provided
    }
    const promise = fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=49&order=relevance&q=${queryString}&type=video&regionCode=${regionCode}&videoCaption=any&videoDefinition=any&key=${YOUTUBE_API_KEY}`).then((response) => {
        // response is a json object
        return response.json();
    }).then(async (data) => {
        searchVideos = data.items.map((details) => {
            return new Video(details);
        });
        // Ensure all videos are fully loaded with content details and statistics before returning them
        await Promise.all(searchVideos.map((video) => video.ensureLoaded()));
    }).catch((error) => {
        console.log(error);
    });
    return promise;    
}

export async function loadPopularVideos() {
    const promise = fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails%2C%20snippet%2C%20statistics&chart=mostPopular&maxResults=49&regionCode=BE&key=${YOUTUBE_API_KEY}`).then((response) => {
        // response is a json object
        return response.json();
    }).then((data) => {
        homeVideos = data.items.map((details) => {
            return new Video(details);
        });
    }).catch((error) => {
        console.log(error);
    });
    return promise;
}

export async function loadFromVideoId(videoId) {
    const promise = fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails%2C%20snippet%2C%20statistics%2C%20player%2C%20status&id=${videoId}&key=${YOUTUBE_API_KEY}`)
        .then((response) => {
            return response.json();
        }).then((data) => {
            return new Video(data.items[0]);
        }).catch((error) => {
            console.log(error);
        });

    return promise;
}

// Load a couple from the channel (use the search apparently), load a couple with the tags of the video, maybe have a limit like 20
// Parameters is video type
export async function loadRelatedVideos(video) {
    // First load 10 videos (but there are shorts etc) from the channel
    // Then load 10 videos with the same tags as the current video or search for the title
    const videoId = video.getId();
    const channelId = video.loadChannelId();

    const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=relevance&regionCode=BE&key=${YOUTUBE_API_KEY}`).then((response) => {return response.json()});

    // Make sure search result displayed in related video doesn't contain the current video being displayed + not a playlist (TODO: add support for playlist)
    // Map each item to a Video type for easy access
    relatedVideos = response.items.filter((item) => {
        return (item.id.videoId!== videoId) && (item.id.kind === 'youtube#video');
    }).map((details) => {
        return new Video(details);
    });
    let remainingLength = 20 - relatedVideos.length;
    // Load the remaining videos with the same tags as the current video or search for the title
    // If there are no more videos to load, just return the current list
    if (remainingLength > 0) {
        const searchResponse = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${video.loadTitle()}&type=video &regionCode=BE&maxResults=${remainingLength+1}&key=${YOUTUBE_API_KEY}`).then((response) => {
            return response.json()
        });
        searchResponse.items.filter((item) => {
            return (item.id.kind === 'youtube#video') && (item.id.videoId!== videoId);
        }).map((details) => {
            relatedVideos.push(new Video(details));
        });
    }
    // Ensure all related videos are fully loaded with statistics and content details before returning them
    await Promise.all(relatedVideos.map((video) => video.ensureLoaded()));
    return relatedVideos;
}

/* await loadSearchedVideos();
console.log(searchVideos); */
