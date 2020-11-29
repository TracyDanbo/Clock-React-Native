import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
export interface City {
  id: string;
  text: string;
  place_name: string;
  timezone: string;
  date_time: string;
}

export type RootStackParamList = {
  home: {place: City};
  search: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'home'
>;

export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'home'>;
