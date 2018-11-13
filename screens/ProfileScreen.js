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
  Image,
  Lightbox,
  Icon
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
          <View styleName="vertical h-center" style={{ marginTop: 35 }}>
            <Lightbox>
              <Image
                styleName="medium-avatar"
                source={{ uri: 'http://wangku.herokuapp.com/img/avatar/default.jpg'}}
              />
            </Lightbox>
            <View styleName="horizontal">
              <Button styleName="confirmation">
                <Icon name="edit" />
                <Text>Update</Text>
              </Button>

              <Button styleName="confirmation secondary" onPress={this.logout} style={{ marginTop: 25 }}>
                <Icon name="exit-to-app" />
                <Text>Logout</Text>
              </Button>
            </View>
          </View>
        </ViewReact>
      </StyleProvider>
    );
  }
}
