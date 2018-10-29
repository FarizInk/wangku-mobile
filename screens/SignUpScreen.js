import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
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
import axios from 'axios';

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

export default class SignUpScreen extends Component {
  static navigationOptions = {
    title: 'Sign Up',
  }

  render() {
    return (
      <StyleProvider style={theme}>
          <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
            <ShoutemView styleName="vertical h-center content" >
              <TextInput
                placeholder={'Name'}
                styleName="textInput"
                autoFocus={true}
                onChangeText={ TextInputValue => this.setState({ name : TextInputValue }) }
              />
              <TextInput
                placeholder={'Email'}
                styleName="textInput"
                keyboardType="email-address"
                onChangeText={ TextInputValue => this.setState({ email : TextInputValue }) }
              />
              <TextInput
                placeholder={'Password'}
                secureTextEntry
                styleName="textInput"
                onChangeText={ TextInputValue => this.setState({ password : TextInputValue }) }
              />
              <Button styleName="secondary register" onPress={this.AddUser}>
                <Text>REGISTER</Text>
              </Button>
            </ShoutemView>
          </TouchableWithoutFeedback>
      </StyleProvider>
    );
  }
}
