import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import moment, {Moment} from 'moment';
import 'moment-timezone';
import {useTheme} from '@react-navigation/native';
import {Footer} from './footer';
import {Header} from './header';
import {ClockPanel} from './clockPanel';
import Animated, {
  abs,
  add,
  and,
  call,
  cond,
  diff,
  eq,
  event,
  greaterThan,
  interpolate,
  lessThan,
  multiply,
  Clock as reClock,
  or,
  set,
  sub,
  useCode,
  useValue,
  Easing,
  stopClock,
  not,
  onChange,
} from 'react-native-reanimated';
import {
  cartesian2Polar,
  canvas2Cartesian,
  canvas2Polar,
  timing,
} from 'react-native-redash/lib/module/v1';

const snapPoint = (
  fromValue: Animated.Adaptable<number>,
  snapPoints: Animated.Adaptable<number>[],
) => {
  return snapPoints.reduce((acc, cur) => {
    const distFromSnap = abs(sub(cur, fromValue));
    return cond(lessThan(distFromSnap, abs(sub(acc, fromValue))), cur, acc);
  });
};
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const center = {
  x: 125,
  y: 125,
};
const hSnap = [...Array(13).keys()].map((_, i) => -180 + i * 30);
const mSnap = [...Array(60).keys()].map((_, i) => -180 + i * 6);
const fullPointer = 120;
const halfPointer = 120 * 0.66;
const duration = 800;

interface ClockProps {
  time: Moment;
  timeZone: string;
  changeTime: (time: Moment, timeZone: string) => void;
  onCancel: () => void;
  orientation: 'landscape' | 'portrait';
}

const Clock: React.FC<ClockProps> = ({
  time: TIME,
  timeZone,
  changeTime,
  onCancel,
  orientation,
}) => {
  const theme = useTheme();
  const time = useRef(moment(TIME).tz(timeZone));

  const clock = useRef(new reClock());
  const x = useValue<number>(0);
  const y = useValue<number>(0);
  const state = useValue(State.UNDETERMINED);

  const panHandler = event([
    {
      nativeEvent: {
        x,
        y,
        state,
      },
    },
  ]);
  const timingConfig = {
    duration,
    easing: Easing.linear,
  };

  const radianTimingConfig = {
    ...timingConfig,
    clock: clock.current,
  };
  const initHour =
    time.current.hour() > 12 ? time.current.hour() - 12 : time.current.hour();
  const initMintue = time.current.minute();
  const activePanel = useValue<0 | 1>(1);
  const progress = useValue<number>(0);

  const theta = useValue<number>(0);
  const radian = useValue<number>(90);
  const hRadian = useValue<number>(90 - initHour * 30);
  const mRadian = useValue<number>(90 - initMintue * 6);
  const CartesianX = useValue<number>(0);
  const CartesianY = useValue<number>(0);
  const r = useValue<number>(
    time.current.hour() > 12 ? halfPointer : fullPointer,
  );
  const radius = useValue<number>(
    time.current.hour() > 12 ? halfPointer : fullPointer,
  );

  const h = interpolate(hRadian, {
    inputRange: [...Array(13).keys()].map((_, i) => -180 + i * 30),
    outputRange: [9, 8, 7, 6, 5, 4, 3, 2, 1, 12, 11, 10, 9],
  });
  const hour = useValue<number>(time.current.hour());
  const minuteArray = [
    ...[...Array(46).keys()].map((_, i) => 45 - i),
    ...[...Array(15).keys()].map((_, i) => 59 - i),
  ];
  const minute = interpolate(mRadian, {
    inputRange: [...Array(61).keys()].map((_, i) => -180 + i * 6),
    outputRange: minuteArray,
  });

  useCode(
    () => [
      onChange(hour, [
        call([], () => {
          ReactNativeHapticFeedback.trigger('selection', options);
        }),
      ]),
      onChange(minute, [
        call([minute], (args) => {
          if (minuteArray.includes(args[0])) {
            ReactNativeHapticFeedback.trigger('selection', options);
          }
        }),
      ]),
      cond(and(not(eq(radian, hRadian)), eq(activePanel, 1)), [
        set(progress, timing({from: 1, to: 0, ...timingConfig})),
        set(radian, timing({from: radian, to: hRadian, ...radianTimingConfig})),
        cond(
          or(greaterThan(hour, 12), eq(hour, 0)),
          [set(radius, timing({from: radius, to: halfPointer, duration}))],
          [set(radius, timing({from: radius, to: fullPointer, duration}))],
        ),
      ]),
      cond(and(not(eq(radian, mRadian)), eq(activePanel, 0)), [
        set(progress, timing({from: 0, to: 1, ...timingConfig})),
        set(radian, timing({from: radian, to: mRadian, ...radianTimingConfig})),
        set(radius, timing({from: radius, to: fullPointer, duration})),
      ]),

      cond(eq(state, State.END), [
        cond(
          activePanel,
          [
            cond(
              or(greaterThan(hour, 12), eq(hour, 0)),
              [set(radius, timing({from: radius, to: halfPointer, duration}))],
              [set(radius, timing({from: radius, to: fullPointer, duration}))],
            ),
          ],
          [set(radius, timing({from: radius, to: fullPointer, duration}))],
        ),
      ]),

      cond(or(eq(state, State.BEGAN), eq(state, State.ACTIVE)), [
        stopClock(clock.current),
        set(CartesianX, canvas2Cartesian({x, y}, center).x),
        set(CartesianY, canvas2Cartesian({x, y}, center).y),
        set(r, cartesian2Polar({x: CartesianX, y: CartesianY}).radius),
        cond(
          activePanel,
          [
            set(
              radius,
              cond(greaterThan(r, halfPointer), fullPointer, halfPointer),
            ),
          ],
          set(radius, fullPointer),
        ),
        set(theta, canvas2Polar({x, y}, center).theta),
        cond(
          activePanel,
          [
            set(hRadian, snapPoint(multiply(theta, 180, 1 / Math.PI), hSnap)),
            set(radian, hRadian),
            set(
              hour,
              cond(
                eq(radius, fullPointer),
                h,
                cond(eq(add(h, 12), 24), 0, add(h, 12)),
              ),
            ),
          ],
          [
            set(mRadian, snapPoint(multiply(theta, 180, 1 / Math.PI), mSnap)),
            set(radian, mRadian),
          ],
        ),
      ]),
      cond(eq(diff(state), sub(State.END, State.ACTIVE)), [
        cond(
          activePanel,
          [
            set(activePanel, 0),
            call([hour], (args) => {
              time.current.hour(args[0]);
            }),
          ],
          [
            call([minute], (args) => {
              time.current.minute(args[0]);
            }),
          ],
        ),
      ]),
    ],
    [],
  );

  return (
    <View
      style={[
        styles.clock,
        {backgroundColor: theme.colors.border},
        orientation === 'portrait' ? null : styles.landscapeClock,
      ]}>
      <Header {...{theme, orientation, hour, minute, activePanel}} />
      <PanGestureHandler
        maxPointers={1}
        shouldCancelWhenOutside
        onGestureEvent={panHandler}
        onHandlerStateChange={panHandler}>
        <Animated.View>
          <ClockPanel {...{theme, radian, radius, progress}} />
        </Animated.View>
      </PanGestureHandler>
      <Footer
        {...{orientation, onCancel, theme, changeTime, timeZone}}
        time={time.current}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  clock: {
    width: 300,
    height: 450,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 20,
  },
  landscapeClock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: 420,
    height: 300,
  },
});

export default Clock;
