import {Theme} from '@react-navigation/native';
import React from 'react';
import {View, Pressable, Text, StyleSheet} from 'react-native';
import Animated, {concat, cond, lessOrEq} from 'react-native-reanimated';
import {ReText, interpolateColor} from 'react-native-redash/lib/module/v1';

interface HeaderProps {
  orientation: 'landscape' | 'portrait';
  theme: Theme;
  hour: Animated.Node<number>;
  minute: Animated.Node<number>;
  activePanel: Animated.Value<1 | 0>;
}

export const Header: React.FC<HeaderProps> = ({
  orientation,
  theme,
  hour,
  minute,
  activePanel,
}) => {
  return (
    <View
      style={[
        styles.header,
        orientation === 'portrait' ? null : styles.landscapeHeader,
      ]}>
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            activePanel.setValue(1);
          }}>
          <ReText
            text={cond(
              lessOrEq(hour, 9),
              [concat('0', hour)],
              [concat('', hour)],
            )}
            style={[
              styles.timeText,
              {
                color: interpolateColor(activePanel, {
                  inputRange: [0, 1],
                  outputRange: [theme.colors.text, theme.colors.primary],
                }),
                opacity: cond(activePanel, 1, 0.4),
              },
            ]}
          />
        </Pressable>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.timeText, {color: theme.colors.text, opacity: 0.2}]}>
          :
        </Text>
        <Pressable
          onPress={() => {
            activePanel.setValue(0);
          }}>
          <ReText
            text={cond(
              lessOrEq(minute, 9),
              [concat('0', minute)],
              [concat('', minute)],
            )}
            style={[
              styles.timeText,
              {
                color: interpolateColor(activePanel, {
                  inputRange: [0, 1],
                  outputRange: [theme.colors.primary, theme.colors.text],
                }),
                opacity: cond(activePanel, 0.4, 1),
              },
            ]}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  landscapeHeader: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 50,
  },
});
