import { YOUTUBE_API_KEY } from "./videos.js";
export let accessParameters=[];

class Channel {
    kind;
    etag;
    id;
    snippet;
    statistics;
    contentDetails;
    status;
    contentOwnerDetails;

    constructor(channelDetails) {
        this.kind = channelDetails.kind;
        this.etag = channelDetails.etag;
        this.id = channelDetails.id;
        this.snippet = channelDetails.snippet;
        this.statistics = channelDetails.statistics;
        this.contentDetails = channelDetails.contentDetails;
        this.status = channelDetails.status;
        this.contentOwnerDetails = channelDetails.contentOwnerDetails;
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
        return this.snippet.thumbnails.default.url;
    }

    loadChannelCustomUrl() {
        return this.snippet.customUrl;
    }

}

export async function loadChannelInfo(channelId) {
    const promise = fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2C%20statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`).then((response) => {
        // response is a json object
        return response.json();
    }).then((data) => {
        return new Channel(data.items[0]);
    }).catch((error) => {
        console.log(error);
    });
    return promise;
}

export async function loadOwnChannelInfo(access_token) {
    const promise = fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails%2C%20status%2C%20contentOwnerDetails%2C%20id%2C%20localizations%2C%20snippet%2C%20statistics&mine=true&key=${YOUTUBE_API_KEY}`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    }).then((response) => {

        // check that response is valid
        if (response.status === 401) { //access_token expired or invalid
            console.error('Access token is invalid, redirecting to login');
            makeAuthenticationRequest();
        } else {
            // response is a json object
            return response.json();
        }

        
    }).then((data) => {
        return new Channel(data.items[0])
    }).catch((error) => {
        console.error(error);
    });
    return promise;
}


export function handleAuthResponse() {
    const queryString = new URL(window.location.href);
    localStorage.setItem('querystring', JSON.stringify(queryString));
    console.log(queryString);

    queryString.hash.substring(1).split('&').map((value) => {
        const [key, detail] = (value.split('='));
        accessParameters[key] = detail;
    });

    if (accessParameters['access_token']) {
        // save access token in local storage for later use
        localStorage.setItem('access_token', accessParameters.access_token);
        
        const prev_url = sessionStorage.getItem('url_before_login') || 'youtube.html';
        //clean up
        sessionStorage.removeItem('url_before_login');
        // go back home
        window.location.href = prev_url;
    } else {
        console.error('Access token not found in URL fragment');
        // try loging in again?
        // makeAuthenticationRequest();      
    }
    
}

export function makeAuthenticationRequest()  {
    // the request returns the token directly so no need for POST request to oauth server
    const client_id = process.env.client_id;
    const redirect_uri = process.env.redirect_uri;
 
    const scope = 'https://www.googleapis.com/auth/youtube.readonly';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=token`;

    // set the current url in sessionStorage
    sessionStorage.setItem('url_before_login', window.location.href);

    window.location.href = url;
}
