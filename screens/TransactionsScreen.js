import React, { Component } from 'react';
import {
  StyleSheet,
  View as ViewReact,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {
  Button,
  Text,
  View,
  getTheme,
  Row,
  Subtitle,
  Caption,
  Icon,
  NavigationBar,
  Title,
  Heading
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';

let theme = _.merge(getTheme(), {
  'shoutem.ui.Row': {
      '.container': {
        borderWidth: 2,
        borderColor: "#EEEEEE",
        borderRadius: 10,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15,
      },
  },
  'shoutem.ui.Text': {
    '.plus': {
      color: 'green'
    },
    '.minus': {
      color: 'red'
    },
  },
  'shoutem.ui.Heading': {
    '.header': {
      marginTop: 35,
      textAlign: 'center',
    }
  }
});


export default class TransactionsScreen extends Component {
  state = { email: '', password: '', name: '', usermail: '', meta: '', error: '' };

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
        .catch(error => console.warn(error));
      if (this.state.error != null) {
        ToastAndroid.show(this.state.error, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Welcome ' + this.state.name, ToastAndroid.SHORT);
        this.login();
      }
    } else {
      ToastAndroid.show('Email & Password Cannot Empty.', ToastAndroid.SHORT);
    }
  }

  render() {
    return (
      <StyleProvider style={theme}>
        <ViewReact style={{ flex: 1, backgroundColor: 'white' }}>
          <Heading styleName="header">Wangku</Heading>
          <ScrollView style={{ flex: 1 }}>
            <View styleName="vertical">
              <TouchableOpacity>
                <Row styleName="container">
                  <View styleName="vertical space-between content">
                    <Subtitle>Sangu dari Orang Tua </Subtitle>
                    <Caption>June 21  ·  04:00</Caption>
                  </View>
                  <Button styleName="right-icon"><Icon name="plus-button" style={{ color: 'green' }} /><Text styleName="plus">10.000</Text></Button>
                </Row>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <ActionButton
            buttonColor="rgba(231,76,60,1)"
            verticalOrientation="up"
            onPress={() => this.props.navigation.navigate('AddTransaction')}
          />
        </ViewReact>
      </StyleProvider>
    );
  }
}
