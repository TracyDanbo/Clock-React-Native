import {Theme} from '@react-navigation/native';
import {Moment} from 'moment';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LocalTimeProps {
  theme: Theme;
  localDate: Moment;
  timeZone: string;
  refresh: () => void;
  openClock: (date: Moment, tZone: string) => void;
}

export const LocalTime: React.FC<LocalTimeProps> = ({
  theme,
  localDate,
  timeZone,
  refresh,
  openClock,
}) => {
  return (
    <View style={[styles.localTime]}>
      <View style={styles.timeContainer}>
        <TouchableNativeFeedback
          onPress={() => {
            openClock(localDate, timeZone);
          }}>
          <Text
            style={[
              styles.time,
              {color: theme.colors.primary},
            ]}>{`${localDate.format('HH')}:${localDate.format('mm')}`}</Text>
        </TouchableNativeFeedback>
      </View>
      <View style={styles.box}>
        <Text style={[styles.date, {color: theme.colors.text}]}>
          {localDate.format('ddd, MMM DD')}
        </Text>
        <View style={styles.refresh}>
          <TouchableOpacity onPress={refresh}>
            <Icon
              size={25}
              name={'refresh'}
              color={theme.colors.text}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  localTime: {
    width: '45%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
    paddingTop: 30,
  },
  timeContainer: {
    overflow: 'hidden',
    borderRadius: 10,
  },
  time: {
    fontSize: 50,
    padding: 10,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 15,
  },
  refresh: {
    position: 'absolute',
    right: -40,
  },
  icon: {
    opacity: 0.4,
  },
});
