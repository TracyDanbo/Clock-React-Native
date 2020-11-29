import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import moment from 'moment-timezone';
import {City} from '../../type';
import {useNavigation, useTheme} from '@react-navigation/native';
interface PlaceProps {
  place: City;
}

const Place: React.FC<PlaceProps> = (props) => {
  // const {
  //   themeCt: {theme},
  // } = useContext(themeContext);
  const theme = useTheme();
  const time = moment(props.place.date_time);
  const navigation = useNavigation();
  return (
    <TouchableNativeFeedback
      onPress={() => {
        navigation.navigate('home', {
          place: props.place,
        });
      }}>
      <View style={styles.container}>
        <View style={styles.placebox}>
          <Text style={[styles.place, {color: theme.colors.text}]}>
            {props.place.place_name}
          </Text>
        </View>
        <View>
          <Text style={[styles.time, {color: theme.colors.text}]}>
            {time.format('HH:mm')}
          </Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 25,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placebox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '65%',
  },
  place: {
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.8,
  },

  time: {
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.4,
  },
});

export default Place;
