import axios, {AxiosInstance, AxiosPromise} from 'axios';
import {MAPBOX_KEY} from '@env';
export interface Geo {
  latitude: number;
  longitude: number;
}

interface MapboxAPI {
  engine: AxiosInstance;
  searchPlace: (query: string) => AxiosPromise;
}

class Mapbox implements MapboxAPI {
  engine: AxiosInstance;
  private key: string = MAPBOX_KEY;
  constructor() {
    this.engine = axios.create({
      baseURL: 'https://api.mapbox.com',
    });
  }
  searchPlace(query: string) {
    return this.engine(`/geocoding/v5/mapbox.places/${query}.json`, {
      params: {
        access_token: this.key,
        language: 'en,zh-Hans',
        types: 'place',
      },
    });
  }
  getPlace(query: Geo) {
    return this.engine(
      `/geocoding/v5/mapbox.places/${query.longitude},${query.latitude}.json`,
      {
        params: {
          access_token: this.key,
          language: 'en,zh-Hans',
          types: 'place',
        },
      },
    );
  }
}

export default Mapbox;
