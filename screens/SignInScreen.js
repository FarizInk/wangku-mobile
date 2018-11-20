import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  AsyncStorage,
  TouchableWithoutFeedback,
  ToastAndroid
} from 'react-native';
import {
  Button,
  Text,
  View as ShoutemView,
  getTheme,
  TextInput,
  Heading
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';
import axios from 'axios';

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

  state = { email: '', password: '', name: '', usermail: '', meta: '', error: [] };

  async onButtonPress() {
    const { email, password } = this.state;

    const data = {
      email,
      password
    };

    if (this.checkInput(email, password)) {
      await axios.post('http://wangku.herokuapp.com/api/login', data)
        .then(response => this.setState({
          name: response.data.data.name,
          usermail: response.data.data.email,
          meta: response.data.meta.token,
          error: response.data.error
        }))
        .catch(error => this.setState({
          error: error.response.data
        }));
      if (this.state.error != null) {
        ToastAndroid.show(this.state.error['message'], ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Welcome ' + this.state.name, ToastAndroid.SHORT);
        this.login();
      }
    } else {
      ToastAndroid.show('Email & Password Cannot Empty.', ToastAndroid.SHORT);
    }
  }

  checkInput(email, password) {
    let successInput = false;

    if (email !== '' && password !== '') {
      successInput = true;
    }

    return successInput;
  }

  async login() {
    await AsyncStorage.setItem('name', this.state.name)
    await AsyncStorage.setItem('email', this.state.usermail)
    await AsyncStorage.setItem('apiToken', this.state.meta)

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
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />
              <TextInput
                placeholder={'Password'}
                secureTextEntry
                styleName="textInput"
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
              <Button styleName="secondary register" onPress={this.onButtonPress.bind(this)}>
                <Text>LOGIN</Text>
              </Button>
            </ShoutemView>
          </TouchableWithoutFeedback>
      </StyleProvider>
    );
  }
}
