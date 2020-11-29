import {Moment} from 'moment';
import React from 'react';
import {StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import Clock from '../../components/clock';

interface ModalProps {
  isShow: boolean;
  value: Animated.Value<number>;
  dvHeight: number;
  changeTime: (date: Moment) => void;
  orientation: 'landscape' | 'portrait';
  closeClock: () => void;
  time: Moment;
  timeZone: string;
}

export const Modal: React.FC<ModalProps> = ({
  isShow,
  value,
  dvHeight,
  orientation,
  changeTime,
  closeClock,
  time,
  timeZone,
}) => {
  const opacity = value.interpolate({
    inputRange: [-dvHeight, 0],
    outputRange: [1, 0],
  });
  const scale = value.interpolate({
    inputRange: [-dvHeight, 0],
    outputRange: [1, 0],
  });
  return (
    <Animated.View
      style={[
        styles.modal,
        {
          opacity,
          transform: [{translateY: dvHeight}, {translateY: value}, {scale}],
        },
      ]}>
      {isShow ? (
        <Clock
          {...{time, timeZone, changeTime, orientation}}
          onCancel={closeClock}
        />
      ) : null}
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    elevation: 10,
  },
});
