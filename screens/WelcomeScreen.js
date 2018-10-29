import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import {
  Button,
  Text,
  View as ShoutemView,
  getTheme,
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';

let theme = _.merge(getTheme(), {
  'shoutem.ui.Button': {
      '.signUp': {
        backgroundColor: '#311B92',
        borderWidth: 0,
      },
      '.signIn': {
        backgroundColor: 'transparent',
        borderColor: '#311B92',
      }
  }, 'shoutem.ui.View': {
      '.margin': {
        marginBottom: 12,
      }
  },
});

export default class WelcomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
        <StyleProvider style={theme}>
          <View style={styles.container}>
            <Image
              style={styles.image}
              source={require('../assets/icon.png')}
            />
            <View style={styles.content}>
              <ShoutemView styleName="horizontal margin">
                <Button styleName="confirmation secondary signIn" onPress={()=>this.props.navigation.navigate('SignIn')}>
                  <Text style={{color: '#311B92'}}>SIGN IN</Text>
                </Button>


                <Button styleName="confirmation secondary signUp" onPress={()=>this.props.navigation.navigate('SignUp')}>
                  <Text>SIGN UP</Text>
                </Button>
              </ShoutemView>
            </View>
          </View>
        </StyleProvider>

    );
  }
}


var styles = require('../assets/welcome');
