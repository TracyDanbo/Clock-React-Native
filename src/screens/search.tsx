import React, {useState} from 'react';
import {
  TextInputChangeEventData,
  NativeSyntheticEvent,
  StatusBar,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SearchBar from '../components/searchBar';
import Places from '../components/places';
import Loading from '../components/loading';
import MapBox from '../API/mapbox';
import Ipgeo from '../API/ipgeo';
import {City} from '../type';
import {AxiosError, AxiosResponse} from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Theme, useTheme} from '@react-navigation/native';

interface DescriptionProps {
  theme: Theme;
}

interface FailedProps {
  theme: Theme;
  error: string;
}
const ipgeo = new Ipgeo();
const mapbox = new MapBox();

const Description: React.FC<DescriptionProps> = ({theme}) => {
  return (
    <View style={styles.description}>
      <Icon name="search" color={theme.colors.text} size={100} />
      <Text style={[styles.descriptionText, {color: theme.colors.text}]}>
        Search for a City
      </Text>
    </View>
  );
};
const Failed: React.FC<FailedProps> = ({theme, error}) => {
  return (
    <View style={styles.failed}>
      <Text style={[styles.failedText, {color: theme.colors.text}]}>
        {error}
      </Text>
    </View>
  );
};

const Search: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isSearched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [value, setValue] = useState('');
  const [preSearch, setPreSearch] = useState('');
  const [places, setPlaces] = useState<City[]>([]);
  const onSubmit: () => void = async () => {
    if (preSearch === value.trim().toLowerCase() && places.length > 0) {
      return;
    } else {
      setPreSearch(value.trim().toLowerCase());
    }
    setIsLoading(true);

    try {
      let {
        data: {features},
      } = await mapbox.searchPlace(value);
      let placeList: City[] = [];

      if (!features.length) {
        setIsFailed(true);
        setError('Can not find any data');
        return;
      }
      const jobs = features.map(function (place: City): Promise<AxiosResponse> {
        placeList.push({
          place_name: place.place_name,
          id: place.id,
          text: place.text,
          timezone: '',
          date_time: '',
        });
        return ipgeo.getTimezoneFromAddress(place.place_name);
      });
      const jobsPromise: {
        status: string;
        result: {timezone: string; date_time: string};
      }[] = await Promise.all(
        jobs.map((job: Promise<AxiosResponse>) =>
          Promise.resolve(job)
            .then((res: AxiosResponse) => ({status: 'ok', result: res.data}))
            .catch((e: AxiosError) => {
              setError(e.message);
              return {status: 'failed', result: e};
            }),
        ),
      );
      let filtedList = jobsPromise.map((item, index) => {
        if (item.status === 'ok') {
          placeList[index].timezone = item.result.timezone;
          placeList[index].date_time = item.result.date_time;
        }
        return placeList[index];
      });
      filtedList = filtedList.filter((i) => Boolean(i.date_time));
      setSearched(true);
      setPlaces(filtedList);
      if (filtedList.length === 0) {
        setIsFailed(true);
      } else {
        setIsFailed(false);
      }
      setIsLoading(false);
    } catch (e) {
      setError(e.message);
      // console.error(e);
    }
  };
  const onChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setValue(event.nativeEvent.text);
    if (!event.nativeEvent.text) {
      setPlaces([]);
    }
  };

  const clearText = () => {
    setValue('');
    setError('');
    setIsFailed(false);
    setSearched(false);
  };
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar backgroundColor={theme.colors.background} />
      <SearchBar
        onChange={onChange}
        onSubmit={onSubmit}
        clearText={clearText}
        value={value}
      />

      <View style={styles.content}>
        {isLoading ? (
          <View style={StyleSheet.absoluteFillObject}>
            <Loading />
          </View>
        ) : isFailed ? (
          <Failed theme={theme} error={error} />
        ) : isSearched ? (
          <Places places={places} />
        ) : (
          <Description theme={theme} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  descriptionText: {
    fontSize: 28,
  },
  failed: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    opacity: 0.5,
  },
  failedText: {
    fontSize: 20,
  },
});

export default Search;
