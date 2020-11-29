import moment, {Moment} from 'moment';
import React, {useRef} from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {City} from '../../type';
import {useTheme} from '@react-navigation/native';

const ITEM_HEIGHT = 80;

interface TimeProps {
  place: City;
  localDate: string;
  onPress: (date: Moment, timeZone: string) => void;
  onSwipeRight: (place: City) => void;
}

const Time: React.FC<TimeProps> = (props) => {
  const theme = useTheme();
  const swipeableRef = useRef<Swipeable>(null);
  const date = moment(props.localDate).tz(props.place.timezone);
  const leftAction = (progress: Animated.AnimatedInterpolation) => {
    const opacity = progress.interpolate({
      inputRange: [0, 0.9, 1],
      outputRange: [1, 0.9, 0],
    });
    return (
      <Animated.View
        style={[
          styles.leftAction,
          {
            backgroundColor: theme.colors.notification,
            opacity,
          },
        ]}>
        <Icon
          name="delete"
          size={24}
          color={theme.dark ? theme.colors.text : theme.colors.background}
        />
      </Animated.View>
    );
  };
  const rightAction = () => {
    return (
      <Animated.View
        style={[
          styles.rightAction,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}>
        <Icon
          name="edit"
          size={24}
          color={theme.dark ? theme.colors.text : theme.colors.background}
        />
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={leftAction}
      renderRightActions={rightAction}
      onSwipeableLeftOpen={() => {
        props.onSwipeRight(props.place);
      }}
      onSwipeableRightOpen={() => {
        swipeableRef.current?.close();
        props.onPress(date, props.place.timezone);
      }}>
      <TouchableNativeFeedback
        onPress={() => {
          props.onPress(date, props.place.timezone);
        }}
        style={[styles.item, {backgroundColor: theme.colors.background}]}>
        <View style={styles.box}>
          <Text
            ellipsizeMode={'tail'}
            numberOfLines={1}
            style={[styles.place, {color: theme.colors.text}]}>
            {props.place.text}
          </Text>
          <View style={styles.optionText}>
            <Text style={[styles.day, {color: theme.colors.text}]}>
              {date.format('MM-DD')}
            </Text>
            <Text
              style={[
                styles.timeZone,
                {color: theme.colors.text},
              ]}>{` , ${date.format('zz')}`}</Text>
          </View>
        </View>
        <View>
          <Text style={[styles.time, {color: theme.colors.text}]}>
            {date.format('HH:mm')}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  item: {
    height: ITEM_HEIGHT,
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  place: {
    fontSize: 20,
    opacity: 0.9,
  },
  box: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    maxWidth: '60%',
  },
  optionText: {
    flexDirection: 'row',
  },
  timeZone: {
    fontSize: 16,
    opacity: 0.4,
  },
  day: {
    fontSize: 16,
    letterSpacing: 1,
    opacity: 0.4,
  },
  time: {
    fontSize: 36,
    opacity: 0.9,
  },

  leftAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    height: '100%',
    width: '100%',
  },
  rightAction: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    height: '100%',
    width: '100%',
  },
});

export default Time;
