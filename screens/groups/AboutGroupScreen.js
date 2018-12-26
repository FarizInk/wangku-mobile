import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  AsyncStorage,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import {
  Button,
  Text,
  View,
  getTheme,
  Image,
  Lightbox,
  Icon,
  Row,
  Subtitle,
  Caption,
  Title
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';
import axios from 'axios';

let theme = _.merge(getTheme(), {
  'shoutem.ui.Row': {
    '.container': {
      marginTop: 2
    },
    'shoutem.ui.Button': {
      '.btn-custom': {
        marginRight: 20,
      }
    }
  },
  'shoutem.ui.Icon': {
    '.profile-icon': {
      color: '#FFDE03',
      padding: 12,
      borderRadius: 3,
      backgroundColor: '#311B92',
    }
  }
});


export default class AboutGroupScreen extends Component {
  state = { token: "", refreshing: false, isLoading: true }

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')
    const userid = await AsyncStorage.getItem('id')
    const groupId = await AsyncStorage.getItem('groupId')

    this.setState({ token: apiToken, userid: userid, groupid: groupId })
  }

  async getGroup() {
    await this.loadApp()
    var config = {
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': "Bearer " + this.state.token
      }
    }

    await axios.get('http://wangku.herokuapp.com/api/group/' + this.state.groupid, config)
      .then(response => this.setState({
        name: response.data.data.name,
        description: response.data.data.description,
        region: response.data.data.region,
        photo: response.data.data.photo,
        owner: response.data.data.owner,
        isLoading: false
      }))
      .catch(error => console.log(error.response.data));
  }

  async componentWillMount() {
    this.setState({ isLoading: true })
    await this.getGroup();
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getProfile().then(() => {
      this.setState({refreshing: false});
    });
  }

  renderProfile() {
    let photo = this.state.photo;
    if (this.state.photo == undefined || this.state.photo == null) {
      photo = 'http://wangku.herokuapp.com/img/avatar/default.jpg';
    } else {
      photo = 'http://wangku.herokuapp.com/images/profile/' + this.state.photo;
    }
    return (
      <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }>
        <View styleName="vertical h-center">
          <Row styleName="container" style={{ backgroundColor: 'transparent' }}>
            <Image
              style={{ borderWidth: 10, borderColor: 'white', width: 150, height: 150, borderRadius: 99, marginLeft: 20 }}
              source={{ uri: photo }}
            />
            <View styleName="vertical">
              <Title>{ this.state.name }</Title>
              <Subtitle>{ this.state.description }</Subtitle>
            </View>
          </Row>

          <View styleName="vertical" style={{ marginBottom: 20 }}>
            {
              (this.state.userid == this.state.owner) ? (
                <Button
                onPress={() => this.props.navigation.navigate('UpdateProfileScreen',
                  { refresh: this._onRefresh.bind(this) }
                )}>
                  <Icon style={{ color: '#311B92' }} name="plus-button" />
                  <Text style={{ color: '#311B92', fontWeight: 'normal' }}>Member</Text>
                </Button>
              ) : (
                <Button styleName="secondary" onPress={this.logout} style={{ marginTop: 25, backgroundColor: '#D32F2F', borderWidth: 0 }}>
                  <Icon name="exit-to-app" />
                  <Text style={{ fontWeight: 'normal' }}>Leave Group</Text>
                </Button>
              )
            }
          </View>

          <Row styleName="container" style={{ marginTop: 2 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 4 }}
              source={{ uri: photo }}
            />
            <View styleName="vertical space-between content">
              <Subtitle>{ this.state.name }</Subtitle>
              <Caption>Admin</Caption>
            </View>
          </Row>
        </View>
      </ScrollView>
    );
  }

  render() {
    return (
      <StyleProvider style={theme}>
        <ViewReact style={{ flex: 1, backgroundColor: '#E8EAF6' }}>
          {this.state.isLoading ? (
            <ViewReact style={styles.container}>
              <ActivityIndicator
                animating
                size="large"
                style={styles.activityIndicator}
              />
            </ViewReact>
          ) : this.renderProfile()}
        </ViewReact>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
