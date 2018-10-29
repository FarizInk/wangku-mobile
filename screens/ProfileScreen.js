import React, { Component } from 'react';
import {
  StyleSheet,
  View as ViewReact,
  AsyncStorage
} from 'react-native';
import {
  Button,
  Text,
  View,
  getTheme,
  Row,
  TextInput,
  Icon,
  NavigationBar,
  Title,
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';

let theme = _.merge(getTheme(), {
  'shoutem.ui.Row': {
    '.container': {
      paddingTop: 0,
      paddingBottom: 0,
      marginTop: 20,
      marginBottom: 20,
    },
    'shoutem.ui.Button': {
      '.btn-custom': {
        marginRight: 20,
      }
    }
  }
});


export default class ProfileScreen extends Component {

logout = async() => {
  await AsyncStorage.clear()
  this.props.navigation.navigate('AuthLoading')
}

  render() {
    return (
      <StyleProvider style={theme}>
        <ViewReact style={{ flex: 1, backgroundColor: 'white' }}>
        <View styleName="horizontal">
        <Button styleName="full-width secondary" onPress={this.logout}>
          <Text>LOGOUT</Text>
        </Button>
        </View>
        </ViewReact>
      </StyleProvider>
    );
  }
}
