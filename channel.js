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
