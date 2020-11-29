import {Theme} from '@react-navigation/native';
import {Moment} from 'moment';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';

interface FooterProps {
  onCancel: () => void;
  changeTime: (time: Moment, timeZone: string) => void;
  theme: Theme;
  orientation: 'landscape' | 'portrait';
  time: Moment;
  timeZone: string;
}

export const Footer: React.FC<FooterProps> = ({
  changeTime,
  onCancel,
  orientation,
  theme,
  time,
  timeZone,
}) => {
  return (
    <View
      style={[
        styles.actions,
        orientation === 'portrait' ? null : styles.landscapeActions,
      ]}>
      <View style={styles.actionContainer}>
        <TouchableNativeFeedback onPress={onCancel}>
          <Text style={[styles.action, {color: theme.colors.text}]}>
            Cancel
          </Text>
        </TouchableNativeFeedback>
      </View>

      <View style={styles.actionContainer}>
        <TouchableNativeFeedback onPress={() => changeTime(time, timeZone)}>
          <Text style={[styles.action, {color: theme.colors.primary}]}>OK</Text>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  landscapeActions: {
    position: 'absolute',
    left: 20,
    bottom: 0,
  },
  actionContainer: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  action: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
