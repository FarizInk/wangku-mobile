import React, { Component } from 'react';
import {
  StyleSheet,
  View as ViewReact,
  ScrollView,
  RefreshControl,
  AsyncStorage,
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
  Heading,
  ImageBackground,
  Image
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';
import axios from 'axios';

let theme = _.merge(getTheme(), {
  'shoutem.ui.Row': {
    '.container': {
      borderRadius: 3,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 8,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 5,
      elevation: 2
    },
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
    const id = await AsyncStorage.getItem('id')

    this.setState({token: apiToken})
    this.setState({userid: id})
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
      .catch(error => console.log(error.response.data));
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
        <Row styleName="container" key={ group.id }>
          <Image style={{width:50, height:50}} source={{ uri: 'http://wangku.herokuapp.com/img/avatar/default.jpg' }} />
          <View styleName="vertical space-between content">
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('IndexGroupScreen',
                { id: group.id, name: group.name }
              )}
            >
              <Subtitle>{ group.name }</Subtitle>
            </TouchableOpacity>
            <Caption>{ group.description }</Caption>
          </View>
          <Button
          styleName="right-icon"
          onPress={() => this.props.navigation.navigate('UpdateGroupScreen',
            { id: group.id, getGroups: this._onRefresh.bind(this) }
          )}><Icon name="settings" style={{ color: '#311B92' }} /></Button>
        </Row>
      );
    }
  }

  render() {
    return (
      <StyleProvider style={theme}>
        <ViewReact style={{ flex: 1, backgroundColor: '#E8EAF6' }}>
          <ViewReact style={{ height: 23.7, backgroundColor: '#000' }}>
          </ViewReact>
          <ViewReact>
            <ImageBackground
              style={{ height: 70, backgroundColor: '#311B92', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.8, elevation: 5 }}
            >
            <NavigationBar
              styleName="clear"
              centerComponent={<Title style={{ fontSize: 17 }}>Groups</Title>}
              rightComponent={(
                <Button
                  style={{ marginRight: 15, backgroundColor: '#FFDE03', borderRadius: 5 }}
                  onPress={() => this.props.navigation.navigate('AddGroupScreen',
                    { getGroups: this._onRefresh.bind(this) }
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
