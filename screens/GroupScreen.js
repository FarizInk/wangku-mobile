import React, { Component } from 'react';
import {
  StyleSheet,
  View as ViewReact,
  ScrollView,
  RefreshControl,
  AsyncStorage,
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
  Heading,
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';
import axios from 'axios';

let theme = _.merge(getTheme(), {
  'shoutem.ui.Row': {
    '.container': {
      marginTop: 7,
      backgroundColor: '#EEEEEE',
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 4,
    }
  },
  'shoutem.ui.Heading': {
    '.header': {
      marginTop: 35,
      textAlign: 'center',
    }
  }
});


export default class GroupScreen extends Component {
  state = { refreshing: false, groups: [] }

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')

    this.setState({token: apiToken})
  }

  async getGroups() {
    await this.loadApp()
    var config = {
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': "Bearer " + this.state.token
      }
    }

    axios.get('http://wangku.herokuapp.com/api/groups', config)
      .then(response => this.setState({ groups: response.data.data }))
      .catch(error => console.warn(error.response.data));
  }

  async componentWillMount() {
    await this.getGroups();
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getGroups().then(() => {
      this.setState({refreshing: false});
    });
  }

  renderGroups() {
    if (this.state.groups == "") {
      return (
        <Text style={{ textAlign: 'center'}}>You Have No Group.</Text>
      );
    } else {
      return this.state.groups.map( group =>
        <TouchableOpacity
          key={ group.id }
        >
          <Row styleName="container">
            <View styleName="vertical space-between">
              <Subtitle>{ group.name }</Subtitle>
              <Caption>June 21  ·  20:00</Caption>
            </View>
          </Row>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <StyleProvider style={theme}>
        <ViewReact style={{ flex: 1, backgroundColor: 'white' }}>
          <Heading styleName="header">Groups</Heading>
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View styleName="vertical">
              { this.renderGroups() }
            </View>
          </ScrollView>
        </ViewReact>
      </StyleProvider>
    );
  }
}
