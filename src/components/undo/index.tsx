import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface UndoProps {
  undo: () => void;
}

const Undo: React.FC<UndoProps> = ({undo}) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.text}]}>
      <Text style={[styles.message, {color: theme.colors.border}]}>
        1 item deleted
      </Text>
      <TouchableOpacity onPress={undo}>
        <Icon
          name={'undo-variant'}
          size={30}
          style={{color: theme.colors.primary}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    maxWidth: 400,
    width: '95%',
    bottom: 80,
    elevation: 10,
    borderRadius: 5,
  },
  message: {
    fontSize: 20,
  },
});

export default Undo;
