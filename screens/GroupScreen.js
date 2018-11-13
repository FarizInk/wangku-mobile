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
  ImageBackground
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
        <ViewReact style={{ flex: 1, backgroundColor: '#E8EAF6' }}>
          <ViewReact style={{ height: 23.7, backgroundColor: '#311B92' }}>
          </ViewReact>
          <ViewReact>
            <ImageBackground
              style={{ height: 70, backgroundColor: '#311B92', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.8, elevation: 5 }}
            >
            <NavigationBar
              styleName="clear"
              leftComponent={(
                <Button>
                  <Text style={{ marginLeft: 15, color: '#FFDE03' }}>All</Text>
                </Button>
              )}
              centerComponent={<Title style={{ fontSize: 17 }}>Groups</Title>}
              rightComponent={(
                <Button
                  style={{ marginRight: 15, backgroundColor: '#FFDE03', borderRadius: 5 }}
                  onPress={() => this.props.navigation.navigate('AddTransaction',
                    { getTransactions: this._onRefresh.bind(this) }
                  )}
                >
                  <Icon name="plus-button" style={{ color: 'black' }} />
                </Button>
              )}
            />
            </ImageBackground>
          </ViewReact>
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View styleName="vertical" style={{ marginTop: 12 }}>
              { this.renderGroups() }
            </View>
          </ScrollView>
        </ViewReact>
      </StyleProvider>
    );
  }
}
