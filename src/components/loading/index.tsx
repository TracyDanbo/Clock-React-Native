import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  add,
  Easing,
  multiply,
  set,
  sub,
  useCode,
  useValue,
} from 'react-native-reanimated';
import {loop} from 'react-native-redash/lib/module/v1';
import {useOrientation} from '../../Hook';

const Loading: React.FC = () => {
  const theme = useTheme();
  const {dvWidth} = useOrientation();
  const value = useValue<number>(0);
  const bar1translateX = useValue<number>(0);
  const bar2translateX = useValue<number>(-dvWidth);
  const bar1Width = useValue<number>(0);
  const bar2Width = useValue<number>(0);
  useCode(
    () => [
      set(
        value,
        loop({
          easing: Easing.linear,
          duration: 2500,
        }),
      ),

      set(bar1Width, multiply(dvWidth, 1.4, sub(1, value))),
      set(bar2Width, multiply(dvWidth, 0.9, sub(1, value))),

      set(bar1translateX, add(-dvWidth * 1.8, multiply(dvWidth, 3, value))),
      set(bar2translateX, add(-dvWidth, multiply(dvWidth, 3.8, value))),
    ],
    [],
  );
  return (
    <Animated.View style={[styles.container, {width: dvWidth}]}>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          // eslint-disable-next-line react-native/no-inline-styles
          {backgroundColor: theme.colors.primary, opacity: 0.2},
        ]}
      />
      <Animated.View
        style={[
          styles.bar,
          {backgroundColor: theme.colors.primary},
          {width: bar1Width},
          {transform: [{translateX: bar1translateX}]},
        ]}
      />
      <Animated.View
        style={[
          styles.bar,
          {backgroundColor: theme.colors.primary},
          {width: bar2Width},
          {transform: [{translateX: bar2translateX}]},
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 3,
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
  },
});

export default Loading;
