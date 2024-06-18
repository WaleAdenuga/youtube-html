export let searchVideos = [];

class Video {
    kind; // kind can be search result or possibly trending, we'll figure that out later
    etag;
    id; // contains kind and videoId
    snippet; // contains info on the video

    constructor(videoDetails) {
        this.kind = videoDetails.kind;
        this.etag = videoDetails.etag;
        this.id = videoDetails.id;
        this.snippet = videoDetails.snippet;
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

/* await loadSearchedVideos();
console.log(searchVideos); */
