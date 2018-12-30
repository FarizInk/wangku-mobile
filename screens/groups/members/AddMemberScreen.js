import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  AsyncStorage,
  ToastAndroid,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import {
  Button,
  Text,
  View,
  getTheme,
  TextInput,
  DropDownMenu,
  Subtitle,
  NavigationBar,
  Title,
  Icon,
  Row,
  Image
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';
import axios from 'axios';

let theme = _.merge(getTheme(), {
  'shoutem.ui.View': {
      '.content': {
        backgroundColor: 'white',
        flex: 1,
      },
      '.selectDropdown': {
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
      }
  },
  'shoutem.ui.Button': {
      '.register': {
        marginTop: 35,
        backgroundColor: '#311B92'
      },
  },
  'shoutem.ui.TextInput': {
      '.textInput': {
        backgroundColor: '#fff',
        color: 'black',
        width: 300,
        borderColor: '#EEEEEE',
        borderWidth: 2,
        borderRadius: 3,
      },
  },
  'shoutem.ui.Subtitle': {
    '.label': {
      marginTop: 20,
      width: 300,
      marginBottom: 10,
    }
  },
});

var DismissKeyboard = require('dismissKeyboard');

export default class AddMemberScreen extends Component {
  static navigationOptions = {
    header: null,
  }

  state = {email: '', success: '', error: []};

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')
    const groupId = await AsyncStorage.getItem('groupId')

    this.setState({ token: apiToken, groupId: groupId })
  }

  async onButtonPress() {
    this.setState({
      isLoading: true
    });
    const { emailsave, token } = this.state;

    var config = {
        headers: {
          'Accept': "application/json",
          'Content-Type' : "application/json",
          'Authorization' : "Bearer " + this.state.token,
        }
    };

    await axios.post('http://wangku.herokuapp.com/api/group/' + this.state.groupId + "/addmember", {
      email: emailsave
    }, config)
      .then(response => this.setState({
        message: response.data.message
      }))
      .catch(error => this.setState({
        error: error.response.data.errors
      }));

    if (this.state.error !== undefined) {
      (this.state.error['email'] != null) ? ToastAndroid.show(this.state.error['email'][0], ToastAndroid.SHORT) : '';
    }
    if (this.state.message !== undefined) {
      (this.state.message != null) ? ToastAndroid.show(this.state.message, ToastAndroid.SHORT) : '';
    }

    this.setState({
      error: [],
      isLoading: false
    });
    this.props.navigation.goBack();
  }

  async search() {
    this.setState({
      isLoading: true,
      photo: null
    });

    var config = {
        headers: {
          'Accept': "application/json",
          'Content-Type' : "application/json",
          'Authorization' : "Bearer " + this.state.token,
        }
    };

    await axios.post('http://wangku.herokuapp.com/api/search/user', {
      email: this.state.email
    }, config)
      .then(response => this.setState({
        name: response.data.name,
        emailsave: response.data.email,
        photo: response.data.photo,
        search: true
      }))
      .catch(error => this.setState({
        error: error.response.data.errors,
        message: error.response.data.message,
        search: false
      }));

    if (this.state.error !== undefined) {
      (this.state.error['email'] != null) ? ToastAndroid.show(this.state.error['email'][0], ToastAndroid.SHORT) : '';
    } else if (this.state.message !== undefined) {
      (this.state.message != null) ? ToastAndroid.show('User not found!', ToastAndroid.SHORT) : '';
    }

    this.setState({
      error: [],
      message: '',
      isLoading: false
    });
  }

  async componentWillMount() {
    this.loadApp();
  }

  componentWillUnmount() {
    const {params} = this.props.navigation.state;
    params.refresh();
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getProfile().then(() => {
      this.setState({refreshing: false});
    });
  }

  renderSearch() {
    if (this.state.search == true) {
      let photo = this.state.photo;
      if (this.state.photo == undefined || this.state.photo == null) {
        photo = 'http://wangku.herokuapp.com/img/avatar/default.jpg';
      } else {
        photo = 'http://wangku.herokuapp.com/images/profile/' + this.state.photo;
      }
      return (
        <View styleName="vertical h-center" style={{ backgroundColor: '#E8EAF6', marginTop: 20, borderRadius: 4 }}>
          <Row styleName="container" style={{ backgroundColor: 'transparent' }}>
            <Image
              styleName="small rounded-corners"
              style={{ borderWidth: 1, borderColor: 'white' }}
              source={{ uri: photo }}
            />
            <View styleName="vertical stretch">
              <Title>{ this.state.name }</Title>
              <Subtitle>{ this.state.email }</Subtitle>
            </View>
          </Row>
          <View styleName="vertical" style={{ marginBottom: 20 }}>
            <Button
            onPress={ this.onButtonPress.bind(this) }>
              <Icon style={{ color: '#311B92' }} name="plus-button" />
              <Text style={{ color: '#311B92', fontWeight: 'normal' }}>Member</Text>
            </Button>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  renderForm() {
    return (
      <View styleName="vertical h-center content" >
        <NavigationBar
          centerComponent={<Title>Add Member</Title>}
        />
        <ScrollView style={{ flex: 1 }}>
          <Subtitle styleName="label" style={{ marginTop: 100 }}>Email</Subtitle>
          <TextInput
            placeholder={'Who do you want to add?'}
            styleName="textInput"
            value={this.state.email}
            onChangeText={ email => this.setState({ email }) }
          />
          <View styleName="horizontal" style={{ marginTop: 20 }}>
            <Button styleName="confirmation" onPress={ () => { this.props.navigation.goBack() } }>
              <Icon name="back" />
              <Text>Back</Text>
            </Button>

            <Button styleName="confirmation secondary register" onPress={ this.search.bind(this) }>
              <Icon name="search" />
              <Text >Search</Text>
            </Button>
          </View>
          { this.renderSearch() }
        </ScrollView>
      </View>
    );
  }

  render() {
    return (
      <StyleProvider style={theme}>
          <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
            {this.state.isLoading ? (
              <ViewReact style={styles.container}>
                <ActivityIndicator
                  animating
                  size="large"
                  style={styles.activityIndicator}
                />
              </ViewReact>
            ) : this.renderForm()}
          </TouchableWithoutFeedback>
      </StyleProvider>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
