import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  AsyncStorage,
  TouchableWithoutFeedback
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
        padding:0,
        margin: 0,
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

export default class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Sign In',
  }

  login = async() => {
    await AsyncStorage.setItem('userToken', 'farizink')

    this.props.navigation.navigate('AuthLoading')
  }

  render() {
    return (
      <StyleProvider style={theme}>
          <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
            <ShoutemView styleName="vertical h-center content" >
              <TextInput
                placeholder={'Email'}
                styleName="textInput"
                keyboardType="email-address"
                autoFocus={true}
              />
              <TextInput
                placeholder={'Password'}
                secureTextEntry
                styleName="textInput"
              />
              <Button styleName="secondary register" onPress={this.login}>
                <Text>LOGIN</Text>
              </Button>
            </ShoutemView>
          </TouchableWithoutFeedback>
      </StyleProvider>
    );
  }
}
