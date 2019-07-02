import axios, { AxiosInstance } from 'axios';

type Config = {
    clientId: string,
};

class Imgur {
    config: Config;
    client: AxiosInstance;

    constructor (config: Config) {
        this.config = config;

        this.client = axios.create({
            baseURL: 'https://api.imgur.com',
        });
    }
}

export default Imgur;
