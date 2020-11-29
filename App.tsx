import 'react-native-gesture-handler';
import React from 'react';
import {useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Home from './src/screens/home';
import Search from './src/screens/search';
import {Dark, Light} from './src/theme';
import {RootStackParamList} from './src/type';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={colorScheme === 'dark' ? Dark : Light}>
        <Stack.Navigator
          headerMode="screen"
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: ({current, next, layouts}) => ({
              //current.progress: for the search page will from 0 to 1;for the home page will stay at 1;
              //next.progress: for the search page will stay at 1;for the home page will from 0 to 1;

              cardStyle: {
                opacity: current.progress,
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },

                  {
                    translateY: next
                      ? next.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, layouts.screen.height],
                        })
                      : 0,
                  },
                  {
                    scale: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                  {
                    scale: next
                      ? next.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0],
                        })
                      : 1,
                  },
                ],
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            }),
          }}>
          <Stack.Screen name="home" component={Home} />
          <Stack.Screen name="search" component={Search} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
