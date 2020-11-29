import axios, {AxiosInstance, AxiosPromise} from 'axios';
import {IPGEO_KEY} from '@env';
import {Geo} from '../mapbox';

interface IpgeoAPI {
  engine: AxiosInstance;
  getTimezoneFromAddress: (query: string) => AxiosPromise;
}

class Ipgeo implements IpgeoAPI {
  engine: AxiosInstance;
  private KEY: string = IPGEO_KEY;
  constructor() {
    this.engine = axios.create({
      baseURL: 'https://api.ipgeolocation.io',
    });
  }
  getTimezoneFromAddress(query: string) {
    return this.engine.get('timezone', {
      params: {
        apiKey: this.KEY,
        location: query,
      },
    });
  }
  getTimezoneFromCoordinates(Coordinates: Geo) {
    return this.engine.get('timezone', {
      params: {
        apiKey: this.KEY,
        long: Coordinates.longitude,
        lat: Coordinates.latitude,
      },
    });
  }
}

export default Ipgeo;
