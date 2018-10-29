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

  constructor(props) {
   super(props)

   this.state = {
     name: '',
     username: '',
     email: '',
     password: '',
   }
  }

  AddUser = () =>{
     fetch('192.168.43.7:8000/api/register', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         name : this.state.name,
         username : this.state.username,
         email : this.state.email,
         password: this.state.password
       })
     }).then((response) => response.json())
         .then((responseJson) => {

           // Showing response message coming from server after inserting records.
           Alert.alert(responseJson);

         }).catch((error) => {
           console.error(error);
         });
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
                placeholder={'Username'}
                styleName="textInput"
                onChangeText={ TextInputValue => this.setState({ username : TextInputValue }) }
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
