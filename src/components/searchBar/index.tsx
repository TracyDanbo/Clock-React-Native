import React, {useRef, useState} from 'react';
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import {theme} from '../../Context';
import {useNavigation, useTheme} from '@react-navigation/native';
interface Props {
  onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onSubmit: () => void;
  clearText: () => void;
  value: string;
}

const SearchBar: React.FC<Props> = (props) => {
  const navigation = useNavigation();
  const inputRef = useRef<TextInput>(null);
  const [name, setName] = useState('close');
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Icon
        name="arrow-back"
        size={24}
        // color="#ffffff"
        color={theme.colors.text}
        style={[styles.action]}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <TextInput
        ref={inputRef}
        style={[styles.input, {color: theme.colors.text}]}
        // autoFocus
        clearButtonMode="while-editing"
        blurOnSubmit
        placeholder="Search..."
        placeholderTextColor={theme.colors.text}
        returnKeyType="search"
        importantForAutofill="no"
        keyboardType="web-search"
        value={props.value}
        onChange={props.onChange}
        onSubmitEditing={props.onSubmit}
        disableFullscreenUI
      />

      <Icon
        name={name}
        size={24}
        color={theme.colors.text}
        style={[styles.action]}
        onPress={() => {
          if (props.value && name === 'close') {
            props.clearText();
          } else if (props.value && name === 'search') {
            props.onSubmit();
            setName('close');
          } else {
            if (inputRef?.current) {
              inputRef.current.blur();
              setName('search');
            }
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 60,
  },
  action: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    marginHorizontal: 20,
    fontSize: 16,
    letterSpacing: 1,
    paddingVertical: 15,
  },
});

export default SearchBar;
