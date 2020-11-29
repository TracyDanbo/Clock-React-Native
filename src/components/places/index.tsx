import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated} from 'react-native';
import Place from '../place';
import {City} from '../../type';

interface PlacesProps {
  places: City[];
}

const Places: React.FC<PlacesProps> = (props) => {
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
      data={props.places}
      renderItem={({item}) => <Place place={item} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default Places;
