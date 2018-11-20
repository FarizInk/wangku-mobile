import React, { Component } from 'react';
import {
  StyleSheet,
  View as ViewReact,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
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


export default class ProfileScreen extends Component {

logout = async() => {
  await AsyncStorage.clear()
  this.props.navigation.navigate('AuthLoading')
}

async loadApp() {
  const apiToken = await AsyncStorage.getItem('apiToken')

  this.setState({token: apiToken})
}

async getProfile() {
  await this.loadApp()
  var config = {
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/json",
      'Authorization': "Bearer " + this.state.token
    }
  }

  await axios.get('http://wangku.herokuapp.com/api/profile', config)
    .then(response => this.setState({
      name: response.data.data.name,
      email: response.data.data.email,
      balance: response.data.data.balance,
      gender: response.data.meta.gender,
      region: response.data.meta.region,
      verified: response.data.data.verified,
      isLoading: false
    }))
    .catch(error => console.log(error.response.data));
  }

  async componentWillMount() {
    this.setState({ isLoading: true })
    await this.getProfile();
  }

  renderProfile() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <View styleName="vertical h-center">
          <Row styleName="container" style={{ backgroundColor: 'transparent' }}>
            <Image
              style={{ borderWidth: 10, borderColor: 'white', width: 150, height: 150, borderRadius: 99, marginLeft: 20 }}
              source={{ uri: 'http://wangku.herokuapp.com/img/avatar/default.jpg'}}
            />
            <View styleName="vertical space-between content" style={{ marginLeft: 10, padding: 16, backgroundColor: 'white', borderRadius: 4, marginRight: 20 }}>
              <Caption>Your Balance:</Caption>
              <Subtitle>Rp { this.state.balance }</Subtitle>
            </View>
          </Row>

          <View styleName="horizontal" style={{ marginBottom: 20 }}>
            {
              (this.state.verified == null) ? (
                <Button style={{ borderWidth: 0 }}>
                  <Icon name="clear-text" style={{ color: '#D32F2F' }}/>
                  <Text style={{ color: '#D32F2F' }}>Unverified User!</Text>
                </Button>
              ) : (
                <Button style={{ borderWidth: 0 }}>
                  <Icon name="clear-text" style={{ color: '#D32F2F' }}/>
                  <Text style={{ color: '#D32F2F' }}>Unverified User!</Text>
                </Button>
              )
            }
            { (this.state.verified == null) ? (
              <Button style={{ marginLeft: 10, backgroundColor: '#FFDE03', borderWidth: 0 }}>
                <Text style={{ color: '#311B92', fontWeight: 'bold' }}>Send Verification!</Text>
              </Button>
            ) :  null }
          </View>

          <Row styleName="container" style={{ marginTop: 20 }}>
            <Icon name="user-profile" styleName="profile-icon" />
            <View styleName="vertical space-between content">
              <Caption>Name</Caption>
              <Subtitle>{ this.state.name }</Subtitle>
            </View>
          </Row>
          <Row styleName="container" style={{ marginTop: 2 }}>
            <Icon name="email" styleName="profile-icon" />
            <View styleName="vertical space-between content">
              <Caption>Email</Caption>
              <Subtitle>{ this.state.email }</Subtitle>
            </View>
          </Row>
          <Row styleName="container" style={{ marginTop: 1 }}>
            <Icon name="about" styleName="profile-icon" />
            <View styleName="vertical space-between content">
              <Caption>Gender</Caption>
              <Subtitle>{ (this.state.gender == null) ? '-' : ((this.state.gender == 'male') ? 'Male' : 'Female') }</Subtitle>
            </View>
          </Row>
          <Row styleName="container" style={{ marginTop: 2 }}>
            <Icon name="web" styleName="profile-icon" />
            <View styleName="vertical space-between content">
              <Caption>Region</Caption>
              <Subtitle>{ this.state.region }</Subtitle>
            </View>
          </Row>

          <View styleName="horizontal" style={{ marginBottom: 20 }}>
            <Button styleName="confirmation"
            onPress={() => this.props.navigation.navigate('UpdateProfileScreen',
              { refresh: this.componentWillMount.bind(this) }
            )}>
              <Icon style={{ color: '#311B92' }} name="settings" />
              <Text style={{ color: '#311B92' }}>Update</Text>
            </Button>

            <Button styleName="confirmation secondary" onPress={this.logout} style={{ marginTop: 25, backgroundColor: '#D32F2F', borderWidth: 0 }}>
              <Icon name="exit-to-app" />
              <Text>Logout</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  render() {
    return (
      <StyleProvider style={theme}>
        <ViewReact style={{ flex: 1, backgroundColor: '#E8EAF6' }}>
          <ViewReact style={{ height: 23.7, backgroundColor: '#000' }}>
          </ViewReact>
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
