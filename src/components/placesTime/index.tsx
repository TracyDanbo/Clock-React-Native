import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated} from 'react-native';
import Time from '../time';
import {City} from '../../type';
import {Moment} from 'moment';

interface Props {
  places: City[];
  onPress: (date: Moment, timeZone: string) => void;
  onSwipeRight: (place: City) => void;
  localDate: string;
}

const PlacesTime: React.FC<Props> = ({
  places,
  onPress,
  onSwipeRight,
  localDate,
}) => {
  const dynamicValue = useRef(new Animated.Value(0)).current;
  const animation = Animated.timing(dynamicValue, {
    toValue: 1,
    duration: 500,
    useNativeDriver: false,
  });
  const opacity = dynamicValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const translateY = dynamicValue.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });
  useEffect(() => {
    animation.start();
  });
  return (
    <Animated.FlatList
      style={[styles.container, {opacity, transform: [{translateY}]}]}
      keyExtractor={(item) => item.id}
      data={places}
      renderItem={({item}) => (
        <Time
          place={item}
          onPress={onPress}
          onSwipeRight={onSwipeRight}
          localDate={localDate}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default PlacesTime;
