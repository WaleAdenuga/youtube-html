class Channel {
    kind;
    etag;
    id;
    snippet;
    statistics;

    constructor(channelDetails) {
        this.kind = channelDetails.kind;
        this.etag = channelDetails.etag;
        this.id = channelDetails.id;
        this.snippet = channelDetails.snippet;
        this.statistics = channelDetails.statistics;
    };

    formatTooltipSubscriberCount() {
        let count = parseInt(this.statistics.subscriberCount, 10);
        if (count >= 1000000) {
            return (count / 1000000).toFixed(0) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(0) + 'K';
        } else {
            return count.toString();
        }
    }

    loadChannelProfilePicCustomUrl() {
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

    loadChannelCustomUrl() {
        return this.snippet.customUrl;
    }

}

export async function loadChannelInfo(channelId) {
    const promise = fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2C%20statistics&id=${channelId}&key=AIzaSyAkuaLdNIusoCt62EVFVEx8l4n2-xRFtJc`).then((response) => {
        // response is a json object
        return response.json();
    }).then((data) => {
        return new Channel(data.items[0]);
    }).catch((error) => {
        console.log(error);
    });
    return promise;
}
