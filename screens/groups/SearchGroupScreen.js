import React, { Component } from 'react';
import {
  StyleSheet,
  View as ViewReact,
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
      marginBottom: 20,
    },
    'shoutem.ui.Button': {
      '.btn-custom': {
        marginRight: 20,
      }
    }
  }
});


export default class SearchGroupScreen extends Component {
  static navigationOptions = {
    title: 'Search Transactions',
  }
  render() {
    return (
      <StyleProvider style={theme}>
        <ViewReact style={{ flex: 1, backgroundColor: '#E8EAF6' }}>
          <View styleName="vertical">
            <Row styleName="container">
              <View styleName="vertical space-between">
                <TextInput
                  placeholder={'Search Here...'}
                />
              </View>
              <Button styleName="right-icon btn-custom"><Icon name="search" style={{ color: '#311B92' }} /></Button>
            </Row>
          </View>
        </ViewReact>
      </StyleProvider>
    );
  }
}
