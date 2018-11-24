import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  AsyncStorage,
  TouchableWithoutFeedback,
  ToastAndroid
} from 'react-native';
import {
  Button,
  Text,
  View,
  getTheme,
  TextInput,
  Heading,
  Subtitle
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
        borderColor: '#EEEEEE',
        borderWidth: 2,
        borderRadius: 3,
      },
  },
  'shoutem.ui.Subtitle': {
    '.label': {
      marginTop: 20,
      width: 300,
      marginBottom: 10,
    }
  },
});

var DismissKeyboard = require('dismissKeyboard');

export default class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Sign In',
  }

  state = { id: '', email: '', password: '', name: '', meta: '', error: [] };

  async onButtonPress() {
    const { email, password } = this.state;

    const data = {
      email,
      password
    };

    if (this.checkInput(email, password)) {
      await axios.post('http://wangku.herokuapp.com/api/login', data)
        .then(response => this.setState({
          id: response.data.data.id,
          name: response.data.data.name,
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
    await AsyncStorage.setItem('apiToken', this.state.meta)
    await AsyncStorage.setItem('id', this.state.id.toString())

    this.props.navigation.navigate('AuthLoading')
  }

  render() {
    return (
      <StyleProvider style={theme}>
          <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
            <View styleName="vertical h-center content" >
              <Subtitle styleName="label">Email</Subtitle>
              <TextInput
                placeholder={'Your email here...'}
                styleName="textInput"
                keyboardType="email-address"
                autoFocus={true}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />
              <Subtitle styleName="label">Password</Subtitle>
              <TextInput
                placeholder={'Your password here...'}
                secureTextEntry
                styleName="textInput"
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
              <Button styleName="secondary register" onPress={this.onButtonPress.bind(this)}>
                <Text>LOGIN</Text>
              </Button>
            </View>
          </TouchableWithoutFeedback>
      </StyleProvider>
    );
  }
}
