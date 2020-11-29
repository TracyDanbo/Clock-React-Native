import React, {useState, useEffect, useRef, useCallback} from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlacesTime from '../../components/placesTime';
import moment, {Moment} from 'moment';
import 'moment-timezone';
import {useOrientation} from '../../Hook';
import {City, HomeScreenNavigationProp, HomeScreenRouteProp} from '../../type';
import {useTheme} from '@react-navigation/native';
import {FloatButton} from './floatButton';
import {Modal} from './modal';
import {LocalTime} from './localTime';
import Undo from '../../components/undo';
import {
  Transition,
  Transitioning,
  TransitioningView,
  Easing,
  timing,
  useValue,
} from 'react-native-reanimated';

//
interface HomeProps {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
}

const initZone = moment.tz.guess();
const transition = (
  <Transition.Sequence>
    <Transition.Change
      durationMs={200}
      interpolation="easeOut"
      propagation="bottom"
    />
    <Transition.Together>
      <Transition.In
        type="slide-bottom"
        durationMs={400}
        interpolation="easeOut"
        propagation="bottom"
      />
      <Transition.In type="fade" durationMs={200} delayMs={200} />
    </Transition.Together>
  </Transition.Sequence>
);

const Home: React.FC<HomeProps> = ({route, navigation}) => {
  const theme = useTheme();
  const {orientation, dvWidth, dvHeight} = useOrientation();
  const [places, setPlaces] = useState<City[]>([]);
  const [tmpPlace, setTmpPlace] = useState<City>();
  const [localDate, setLocalDate] = useState<Moment>(moment());
  const [targetDate, setTargetDate] = useState({
    time: moment(),
    tZone: initZone,
  });
  const [isShow, setIsShow] = useState(false);
  const timer = useRef<NodeJS.Timeout>();
  const cleanTmpTimer = useRef<NodeJS.Timeout>();
  const timeZone = useRef(moment.tz.guess()).current;
  const transitionViewRef = useRef<TransitioningView>(null);

  const value = useValue<number>(0);
  const fadeIn = timing(value, {
    duration: 500,
    toValue: -dvHeight,
    easing: Easing.inOut(Easing.ease),
  });
  const fadeOut = timing(value, {
    duration: 400,
    toValue: 0,
    easing: Easing.inOut(Easing.ease),
  });

  const openClock = (date: Moment, tZone: string) => {
    setTargetDate({time: date, tZone});
    setIsShow(true);
    fadeIn.start();
  };
  const closeClock = () => {
    fadeOut.start(() => {
      setIsShow(false);
    });
  };

  const changeTime = (date: Moment) => {
    setLocalDate(date.tz(timeZone));
    fadeOut.start(() => {
      setIsShow(false);
    });
  };
  const refresh = () => {
    setLocalDate(moment());
  };

  const goToSearch = () => {
    navigation.navigate('search');
  };

  const storePlaces = useCallback(async (p) => {
    try {
      await AsyncStorage.setItem('places', JSON.stringify(p));
    } catch (error) {
      console.error(error);
    }
  }, []);
  const deletePlace = (place: City) => {
    setTmpPlace(places.filter((p) => p.id === place.id)[0]);
    setPlaces((state) => state.filter((p) => p.id !== place.id));
    transitionViewRef.current.animateNextTransition();
  };

  const undo = () => {
    setPlaces([...places, tmpPlace]);
    setTmpPlace(undefined);
    transitionViewRef.current.animateNextTransition();
  };
  // update place list
  useEffect(() => {
    if (route.params?.place) {
      const filtedPlace = places.filter(
        (place) => place.id === route.params.place.id,
      );
      if (filtedPlace.length === 0) {
        setPlaces((state) => state.concat(route.params.place));
      }
      navigation.setParams({
        place: undefined,
      });
    }
  }, [route.params, places, timeZone, navigation]);

  // update time per second
  useEffect(() => {
    const AutoUpdateTime: () => void = () => {
      setLocalDate((state) => moment(state).add(1, 'minute'));
      timer.current = setTimeout(AutoUpdateTime, 60000);
    };

    timer.current = setTimeout(
      AutoUpdateTime,
      (60 - moment().seconds()) * 1000,
    );
    return () => {
      if (timer.current) {
        clearTimeout(timer.current as NodeJS.Timeout);
      }
    };
  });

  // read places from  storage
  useEffect(() => {
    const readPlaces = async () => {
      try {
        let p = await AsyncStorage.getItem('places');
        if (p !== null) {
          setPlaces(JSON.parse(p));
        }
      } catch (error) {
        console.error(error);
      }
    };
    readPlaces();
  }, []);
  // store places to  storage
  useEffect(() => {
    storePlaces(places);
  }, [places, storePlaces]);
  useEffect(() => {
    if (tmpPlace) {
      cleanTmpTimer.current = setTimeout(() => {
        setTmpPlace(undefined);
      }, 4000);
    }
    return () => {
      if (cleanTmpTimer.current) {
        clearTimeout(cleanTmpTimer.current);
      }
    };
  }, [tmpPlace]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background},
        orientation === 'portrait' ? null : styles.landscape,
      ]}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <LocalTime {...{theme, localDate, timeZone, refresh, openClock}} />
      <Transitioning.View
        style={styles.places}
        transition={transition}
        ref={transitionViewRef}>
        <PlacesTime
          places={places}
          onPress={openClock}
          onSwipeRight={deletePlace}
          localDate={localDate.format()}
        />
      </Transitioning.View>

      <FloatButton
        {...{goToSearch, dvWidth, dvHeight, orientation, theme, value}}
      />

      {tmpPlace ? <Undo {...{undo}} /> : null}

      <Modal
        {...{
          isShow,
          value,
          dvHeight,
          orientation,
          changeTime,
          closeClock,
        }}
        timeZone={targetDate.tZone}
        time={targetDate.time}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  landscape: {
    flexDirection: 'row',
  },
  places: {
    flex: 1,
    width: '100%',
  },
});

export default Home;
