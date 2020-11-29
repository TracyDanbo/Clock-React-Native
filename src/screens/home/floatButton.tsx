import {Theme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {interpolate} from 'react-native-reanimated';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface FloatButtonProps {
  goToSearch: () => void;
  theme: Theme;
  dvWidth: number;
  dvHeight: number;
  orientation: 'landscape' | 'portrait';
  value: Animated.Value<number>;
}

export const FloatButton: React.FC<FloatButtonProps> = ({
  goToSearch,
  dvWidth,
  dvHeight,
  orientation,
  theme,
  value,
}) => {
  const floatButtonScale = interpolate(value, {
    inputRange: [-dvHeight, 0],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.floatButton,
        {
          backgroundColor: theme.colors.primary,
          transform: [{scale: floatButtonScale}],
        },
        orientation === 'portrait'
          ? null
          : // eslint-disable-next-line react-native/no-inline-styles
            {
              left: 0,
              transform: [{translateX: dvWidth * 0.225}, {translateX: -28}],
            },
      ]}>
      <TouchableNativeFeedback onPress={goToSearch}>
        <View style={styles.icon}>
          <Icon
            size={30}
            name={'web'}
            color={theme.dark ? theme.colors.text : theme.colors.background}
          />
        </View>
      </TouchableNativeFeedback>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatButton: {
    position: 'absolute',
    bottom: 15,
    overflow: 'hidden',
    borderRadius: 28,
    elevation: 10,
  },
  icon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
