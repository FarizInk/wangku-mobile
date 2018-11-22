import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ToastAndroid,
} from 'react-native';
import {
  Button,
  Text,
  View,
  getTheme,
  TextInput,
  Subtitle
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

export default class SignUpScreen extends Component {
  static navigationOptions = {
    title: 'Sign Up',
  }

  state = { name: '', email: '', password: '', error: [], registered: ''};

  async onButtonPress() {
    const { name, email, password } = this.state;

    const data = {
      name,
      email,
      password
    };

    var config = {
        headers: {
          'Accept': "application/json",
          'Content-Type' : "application/json"
        }
   };

    if (this.checkInput(name, email, password)) {

      await axios.post('http://wangku.herokuapp.com/api/register', data)
        .then(response => this.setState({
          registered: response.data.data.registered
        }))
        .catch(error => this.setState({
          error: error.response.data.errors
        }));

      if (this.state.error != '') {
        (this.state.error['email'] != null) ? ToastAndroid.show(this.state.error['email'][0], ToastAndroid.SHORT) : '';
        (this.state.error['password'] != null) ? ToastAndroid.show(this.state.error['password'][0], ToastAndroid.SHORT) : '';
      } else if (this.state.registered != null || this.state.registered != '' || this.state.registered != 'undefined') {
        ToastAndroid.show('Successfully Registered', ToastAndroid.SHORT);
        ToastAndroid.show('Please check your email to verify your account.', ToastAndroid.LONG);
        this.props.navigation.navigate('SignIn');
      }

      this.setState({
        registered: '',
        error: []
      });

    } else {
      ToastAndroid.show('Email & Password Cannot Empty.', ToastAndroid.SHORT);
    }
  }

  checkInput(name, email, password) {
    let successInput = false;

    if (name !== '' && email !== '' && password !== '') {
      successInput = true;
    }

    return successInput;
  }

  render() {
    return (
      <StyleProvider style={theme}>
          <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
            <View styleName="vertical h-center content">
              <Subtitle styleName="label">Name</Subtitle>
              <TextInput
                placeholder={'Enter name here...'}
                styleName="textInput"
                autoFocus={true}
                value={this.state.name}
                onChangeText={ name => this.setState({ name }) }
              />
              <Subtitle styleName="label">Email</Subtitle>
              <TextInput
                placeholder={'Enter email here...'}
                styleName="textInput"
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={ email => this.setState({ email }) }
              />
              <Subtitle styleName="label">Password</Subtitle>
              <TextInput
                placeholder={'Enter password here...'}
                secureTextEntry
                styleName="textInput"
                value={this.state.password}
                onChangeText={ password => this.setState({ password }) }
              />
              <Button styleName="secondary register" onPress={this.onButtonPress.bind(this)}>
                <Text>REGISTER</Text>
              </Button>
            </View>
          </TouchableWithoutFeedback>
      </StyleProvider>
    );
  }
}
