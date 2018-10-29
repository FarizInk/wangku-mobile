import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Button,
  Text,
  View as ShoutemView,
  getTheme,
  TextInput,
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';

let theme = _.merge(getTheme(), {
  'shoutem.ui.View': {
      '.content': {
        backgroundColor: 'white',
        flex: 1,
      },
  },
  'shoutem.ui.Button': {
      '.register': {
        marginTop: 35,
        backgroundColor: '#311B92'
      },
  },
  'shoutem.ui.TextInput': {
      '.textInput': {
        backgroundColor: '#fff',
        color: 'black',
        width: 300,
        marginTop: 20,
        borderColor: '#EEEEEE',
        borderWidth: 2,
        borderRadius: 3,
      },
  },
});

var DismissKeyboard = require('dismissKeyboard');

export default class AddTransactionScreen extends Component {
  static navigationOptions = {
    title: 'Tambah Transaksi',
  }

  render() {
    return (
      <StyleProvider style={theme}>
          <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
            <ShoutemView styleName="vertical h-center content" >
              <TextInput
                placeholder={'Username'}
                styleName="textInput"
                autoFocus={true}
              />
              <TextInput
                placeholder={'Email'}
                styleName="textInput"
                keyboardType="email-address"
              />
              <TextInput
                placeholder={'Password'}
                secureTextEntry
                styleName="textInput"
              />
              <Button styleName="secondary register">
                <Text>Tambah</Text>
              </Button>
            </ShoutemView>
          </TouchableWithoutFeedback>
      </StyleProvider>
    );
  }
}
