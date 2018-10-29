import React, { Component } from 'react';
import {
  StyleSheet,
  View as ViewReact,
  TouchableOpacity
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
  }
});


export default class TransactionsScreen extends Component {
  render() {
    return (
      <StyleProvider style={theme}>
        <ViewReact style={{ flex: 1, backgroundColor: 'white' }}>
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
        </ViewReact>
      </StyleProvider>
    );
  }
}
