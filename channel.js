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

export async function loadOwnChannelInfo(access_token) {
    const promise = fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails%2C%20status%2C%20contentOwnerDetails%2C%20id%2C%20localizations%2C%20snippet%2C%20statistics&mine=true&key=AIzaSyAkuaLdNIusoCt62EVFVEx8l4n2-xRFtJc`, {
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
    const clientId = '207479931415-f6b8ueau28chlg0vruli2vufqnq6bfg6.apps.googleusercontent.com';
    const redirectUrl = 'http://127.0.0.1:5500/youtube.html';
    const scope = 'https://www.googleapis.com/auth/youtube.readonly';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}&response_type=token`;

    // set the current url in sessionStorage
    sessionStorage.setItem('url_before_login', window.location.href);

    window.location.href = url;
}
