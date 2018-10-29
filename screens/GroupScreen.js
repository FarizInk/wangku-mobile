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
  Subtitle,
  Caption,
  Icon,
  NavigationBar,
  Title,
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';

let theme = _.merge(getTheme(), {
  'shoutem.ui.Row': {
    '.container': {
      marginTop: 7,
      backgroundColor: '#EEEEEE',
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 4,
    }
  }
});


export default class GroupScreen extends Component {
  render() {
    return (
      <StyleProvider style={theme}>
        <ViewReact style={{ flex: 1, backgroundColor: 'white' }}>
          <View styleName="vertical">
            <Row styleName="container">
              <View styleName="vertical space-between">
                <Subtitle>INFINITE DEVSIGN</Subtitle>
                <Caption>June 21  ·  20:00</Caption>
              </View>
            </Row>
          </View>
        </ViewReact>
      </StyleProvider>
    );
  }
}
