import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  AsyncStorage,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid
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
  constructor(props) {
    super(props);
    this.removeMember = this.removeMember.bind(this);
  }

  state = { token: "", refreshing: false, isLoading: true }

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')
    const userid = await AsyncStorage.getItem('id')
    const groupId = await AsyncStorage.getItem('groupId')

    this.setState({ token: apiToken, userid: userid, groupid: groupId, members: [] })
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
    await axios.get('http://wangku.herokuapp.com/api/group/member/' + this.state.groupid, config)
      .then(response => this.setState({
        members: response.data.data,
      }))
      .catch(error => console.log(error.response.data));
  }

  async removeMember(email) {
    var config = {
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        'Authorization': "Bearer " + this.state.token
      }
    }
    let usermail = email;
    await axios.post('http://wangku.herokuapp.com/api/group/' + this.state.groupid + '/removemember', {
      email: usermail
    }, config)
      .then(response => this.setState({
        message: response.data.message,
      }))
      .catch(error => console.log(error.response.data));

      if (this.state.message !== undefined) {
        (this.state.message != null) ? ToastAndroid.show(this.state.message, ToastAndroid.SHORT) : '';
      }

      this._onRefresh();
  }

  async componentWillMount() {
    this.setState({ isLoading: true })
    await this.getGroup();
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getGroup().then(() => {
      this.setState({refreshing: false});
    });
  }

  renderMembers() {
    return this.state.members.map(member =>
      <Row styleName="container" style={{ marginTop: 10, marginLeft: 20, marginRight: 20, borderRadius: 4 }} key={ member.id }>
        {
          (member.photo == null) ? (<Image style={{ width: 50, height: 50, borderRadius: 4 }} source={{ uri: 'http://wangku.herokuapp.com/img/avatar/default.jpg' }} />) : (<Image style={{ width: 50, height: 50, borderRadius: 4 }} source={{ uri: 'http://wangku.herokuapp.com/images/profile/' + member.photo }} />)
        }
        <View styleName="vertical space-between content">
          <Subtitle>{ member.name }</Subtitle>
          <Caption>{ member.email }</Caption>
        </View>
        {
          (member.id == this.state.owner) ? (
            <Button
              styleName="right-icon"
              >
              <Icon name="add-to-favorites-on" style={{ color: '#FFD600' }} />
            </Button>
          ) : ((this.state.userid == this.state.owner) ? (
            <Button
              styleName="right-icon"
              onPress={ () => {this.removeMember(member.email)} }
              >
              <Icon name="close" style={{ color: '#D32F2F' }} />
            </Button>
          ) : null)
        }
      </Row>
    );
  }

  renderGroup() {
    let photo = this.state.photo;
    if (this.state.photo == undefined || this.state.photo == null) {
      photo = 'http://wangku.herokuapp.com/img/avatar/default.jpg';
    } else {
      photo = 'http://wangku.herokuapp.com/images/group/' + this.state.photo;
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
              style={{ borderWidth: 5, borderColor: 'white', width: 110, height: 110, borderRadius: 99, marginLeft: 20 }}
              source={{ uri: photo }}
            />
            <View styleName="vertical">
              <Title>{ this.state.name }</Title>
              <Subtitle>{ this.state.description }</Subtitle>
            </View>
          </Row>

          <View styleName="vertical" style={{ marginBottom: 10 }}>
            {
              (this.state.userid == this.state.owner) ? (
                <Button
                onPress={() => this.props.navigation.navigate('AddMemberScreen',
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

          { this.renderMembers() }
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
          ) : this.renderGroup()}
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
