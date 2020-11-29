import {Theme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {diffClamp, interpolate, sub} from 'react-native-reanimated';
import {HourPanel, MinutePanel} from './panel';

const WIDTH = 250;
const RADIUS = WIDTH / 2;

interface ClockPanelProps {
  theme: Theme;
  radian: Animated.Adaptable<number>;
  radius: Animated.Node<number>;
  progress: Animated.Adaptable<number>;
}

export const ClockPanel: React.FC<ClockPanelProps> = ({
  theme,
  radian,
  progress,
  radius,
}) => {
  const rotate = interpolate(radian, {
    inputRange: [-180, -90, 0, 90, 180],
    outputRange: ['270deg', '180deg', '90deg', '0deg', '-90deg'],
  });
  const opacity = interpolate(radian, {
    inputRange: [...Array(61).keys()].map((_, i) => -180 + i * 6),
    outputRange: [...Array(61).keys()].map((_, i) =>
      (-180 + i * 6) % 30 ? 1 : 0,
    ),
  });

  const clampProgress = diffClamp(progress, 0, 0.5);
  const panelOpacity = interpolate(clampProgress, {
    inputRange: [0, 0.5],
    outputRange: [1, 0],
  });

  return (
    <View style={styles.clockPanel}>
      <Animated.View
        pointerEvents={'none'}
        style={[styles.pointer, {transform: [{rotate}]}]}>
        <Animated.View
          style={[
            styles.body,
            {backgroundColor: theme.colors.primary},
            {height: radius},
          ]}>
          <View style={[styles.head, {backgroundColor: theme.colors.primary}]}>
            <Animated.View
              style={[
                styles.dot,
                {
                  backgroundColor: theme.dark
                    ? theme.colors.text
                    : theme.colors.background,
                  opacity,
                },
              ]}
            />
          </View>
        </Animated.View>
      </Animated.View>
      <Animated.View
        style={[styles.numPanel, {opacity: panelOpacity}]}
        pointerEvents={'none'}>
        <HourPanel theme={theme} min={1} max={12} />
      </Animated.View>
      <Animated.View
        style={[
          styles.numPanel,
          {opacity: panelOpacity, transform: [{scale: 0.6}]},
        ]}>
        <HourPanel theme={theme} min={13} max={24} />
      </Animated.View>
      <Animated.View
        style={[styles.numPanel, {opacity: sub(1, panelOpacity)}]}
        pointerEvents={'none'}>
        <MinutePanel theme={theme} />
      </Animated.View>
      <View style={[styles.center, {backgroundColor: theme.colors.primary}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  clockPanel: {
    width: WIDTH,
    height: WIDTH,
    borderRadius: RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numPanel: {
    width: WIDTH,
    height: WIDTH,
    borderRadius: RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },

  center: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    position: 'absolute',
  },
  pointer: {
    position: 'absolute',
    width: 3,
    height: 250,
  },
  body: {
    width: '100%',
    height: 120,
    position: 'absolute',
    bottom: 125,
  },
  head: {
    position: 'absolute',
    left: -19,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});
