import {Theme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text} from 'react-native';

interface HourPanelProps {
  theme: Theme;
  min: number;
  max: number;
}

export const HourPanel: React.FC<HourPanelProps> = ({theme, min, max}) => {
  const range = max - min + 1;
  return (
    <>
      {[...Array(range).keys()].map((i) => {
        let num = i + min;
        let key = num < 13 ? `num${num}` : `num${num - 12}`;
        if (num < 10) {
          return (
            <Text
              style={[styles.num, styles[key], {color: theme.colors.text}]}
              key={num}>
              {`0${num}`}
            </Text>
          );
        } else {
          return (
            <Text
              style={[styles.num, styles[key], {color: theme.colors.text}]}
              key={num}>
              {num === 24 ? '00' : num}
            </Text>
          );
        }
      })}
    </>
  );
};
interface MinutePanelProps {
  theme: Theme;
}

export const MinutePanel: React.FC<MinutePanelProps> = ({theme}) => {
  return (
    <>
      {[...Array(12).keys()].map((i) => {
        let num = i + 1;
        let key = `num${num}`;
        if (num === 1) {
          return (
            <Text
              key={num}
              style={[styles.num, styles[key], {color: theme.colors.text}]}>
              05
            </Text>
          );
        } else if (num === 12) {
          return (
            <Text
              key={num}
              style={[styles.num, styles[key], {color: theme.colors.text}]}>
              00
            </Text>
          );
        } else {
          return (
            <Text
              key={num}
              style={[styles.num, styles[key], {color: theme.colors.text}]}>
              {num * 5}
            </Text>
          );
        }
      })}
    </>
  );
};

const styles = StyleSheet.create({
  num: {
    zIndex: 1,
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    position: 'absolute',
    borderRadius: 20,
  },
  num12: {
    top: 5,
    left: 120,
    transform: [{translateX: -14.5}],
  },
  num6: {
    left: 120,
    bottom: 5,
    transform: [{translateX: -14.5}],
  },
  num3: {
    right: 5,
    top: 120,
    transform: [{translateY: -15.5}, {translateX: 0.5}],
  },
  num9: {
    left: 5,
    top: 120,
    transform: [{translateY: -15.5}, {translateX: 0.5}],
  },
  num1: {
    right: 60,
    top: 35,
    transform: [{translateY: -16.5}, {translateX: 5.5}],
  },
  num2: {
    right: 20,
    top: 70,
    transform: [{translateY: -15}, {translateX: 2}],
  },
  num4: {
    right: 20,
    bottom: 70,
    transform: [{translateY: 15}, {translateX: 2}],
  },
  num5: {
    right: 60,
    bottom: 35,
    transform: [{translateY: 16.5}, {translateX: 5.5}],
  },
  num7: {
    left: 60,
    bottom: 35,
    transform: [{translateY: 16.5}, {translateX: -5.5}],
  },
  num8: {
    left: 20,
    bottom: 70,
    transform: [{translateY: 15}, {translateX: -2}],
  },
  num10: {
    left: 20,
    top: 70,
    transform: [{translateY: -15}, {translateX: -2}],
  },
  num11: {
    left: 60,
    top: 35,
    transform: [{translateY: -16.5}, {translateX: -5.5}],
  },
});
