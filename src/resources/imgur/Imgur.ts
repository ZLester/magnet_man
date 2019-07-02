import axios, { AxiosInstance } from 'axios';
import { Config } from '../../';

const call = (promise: Promise<any>) => promise
    .then(result => [ null, result ])
    .catch(err => [ err, null ]);

const handleResponse = (response: any, message: string) => {
    if (response) {
        console.log(message);
        console.log(response);
    }
};

type Account = {
    access_token: string,
    expires_in: number,
    token_type: string,
    scope: null,
    refresh_token: string,
    account_id: number,
    account_username: string,
};

class Imgur {
    account: Account | null;
    client: AxiosInstance;
    config: Config;

    constructor (config: Config) {
        this.config = config;
        this.account = null;

        this.client = axios.create({
            baseURL: 'https://api.imgur.com',
        });

        this.setAccessToken();
    }

    async setAccessToken () {
        console.log('Imgur Get Account: Request');

        const [ accountError, account ] = await call(this.getAccount());

        handleResponse(accountError, 'Imgur Get Account: Error');
        handleResponse(account, 'Imgur Get Account: Success');

        this.account = account;

        this.client.defaults.headers.common['Authorization'] = `Bearer ${this.account.access_token}`;
    }

    async getAccount () {
        return this.client.post('/oauth2/token', {
            refresh_token: this.config.refreshToken,
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            grant_type: 'refresh_token',
        }).then(response => response.data);
    }

    async getAlbums () {
        return this.client.get(`/3/account/${this.account.account_username}/albums`)
            .then(response => response.data.data);
    }

    async getAlbum (id: string) {
        return this.client.get(`/3/album/${id}`)
            .then(response => response.data.data);
    }

    async createAlbum (title: string) {
        return this.client.post('/3/album', {
            title,
            description: `${title}: Magnet Man Image Album`,
            privacy: 'public',
        }).then(response => response.data.data);
    }

    async uploadImageToAlbum (image: string, album: string) {
        return this.client.post('/3/upload', {
            image,
            album,
        }).then(response => response.data.data);
    }
}

export default Imgur;
