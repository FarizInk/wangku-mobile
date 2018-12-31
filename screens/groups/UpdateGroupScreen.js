import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  AsyncStorage,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  Button,
  Text,
  View,
  getTheme,
  TextInput,
  DropDownMenu,
  Subtitle,
  Row,
  Image
} from '@shoutem/ui';
import { StyleProvider } from '@shoutem/theme';
import _ from 'lodash';
import axios from 'axios';
import { ImagePicker } from 'expo';

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
      '.delete': {
        marginTop: 35,
        backgroundColor: '#D32F2F',
        borderWidth: 0
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

export default class AddGroupScreen extends Component {
  static navigationOptions = {
    title: 'Update Group',
  }

  constructor(props){
  super(props);
  this.loadApp()
  this.state = {
    optionRegion: [
        {
          name: "West Indonesia",
          value: "west"
        },
        {
          name: "Middle Indonesia",
          value: "middle"
        },
        {
          name: "East Indonesia",
          value: "east"
        },
      ],
    }
  }

  state = { id: '', name: '', description: '', balance: '', selectedRegion: '', token: '', success: '', error: [], isLoading: '' };

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')
    const id = await AsyncStorage.getItem('id')
    const { params } = this.props.navigation.state;
    this.setState({ token: apiToken, id: params.id, userid: id })
  }

  async onButtonPress() {
    const { name, description, balance, selectedRegion } = this.state;

    var config = {
        headers: {
          'Accept': "application/json",
          'Content-Type' : "application/json",
          'Authorization' : "Bearer " + this.state.token,
        }
    };

    if (this.checkInput(name, description, balance, selectedRegion)) {

      await axios.put('http://wangku.herokuapp.com/api/group/' + this.state.id, {
        name: name,
        description: description,
        balance: balance.replace(/[^,\d]/g, "").toString(),
        region: selectedRegion.value
      }, config)
        .then(response => this.setState({
          success: response.data.data.id
        }))
        .catch(error => this.setState({
          error: error.response.data.errors
        }));

      if (this.state.error !== undefined) {
        (this.state.error['name'] != null) ? ToastAndroid.show(this.state.error['name'][0], ToastAndroid.SHORT) : '';
        (this.state.error['description'] != null) ? ToastAndroid.show(this.state.error['description'][0], ToastAndroid.SHORT) : '';
        (this.state.error['balance'] != null) ? ToastAndroid.show(this.state.error['balance'][0], ToastAndroid.SHORT) : '';
        (this.state.error['region'] != null) ? ToastAndroid.show(this.state.error['region'][0], ToastAndroid.SHORT) : '';
      } else if (this.state.success != null || this.state.success != '' || this.state.success != undefined) {
        ToastAndroid.show('Successfully Create Group', ToastAndroid.SHORT);
        this.props.navigation.goBack();
      }

      this.setState({
        success: '',
        error: []
      });

    } else {
      ToastAndroid.show('All Filled Cannot Empty.', ToastAndroid.SHORT);
    }
  }

  checkInput(name, description, balance, selectedRegion) {
    let successInput = false;

    if (name !== undefined && description !== undefined && balance !== undefined && selectedRegion !== undefined) {
      if (selectedRegion.value !== '') {
        successInput = true;
      }
    }

    return successInput;
  }

  async delete() {
    var config = {
        headers: {
          'Accept': "application/json",
          'Content-Type' : "application/json",
          'Authorization' : "Bearer " + this.state.token,
        }
    };

    await axios.delete('http://wangku.herokuapp.com/api/group/' + this.state.id, config)
      .then(response => this.setState({
        success: true
      }))
      .catch(error => console.log("error : " + error.response.data));

    if (this.state.success == true) {
      ToastAndroid.show('Successfully Delete Group', ToastAndroid.SHORT);
      this.props.navigation.goBack();
    }

    this.setState({
      success: '',
      error: []
    });
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

    await axios.get('http://wangku.herokuapp.com/api/group/' + this.state.id, config)
      .then(response => this.setState({
        name: response.data.data.name,
        description: response.data.data.description,
        balance: response.data.data.balance,
        oldRegion: response.data.data.region,
        photo: response.data.data.photo,
        owner: response.data.data.owner,
        isLoading: false
      }))
      .catch(error => console.log(error.response.data));
      this.formatRupiah(this.state.balance.toString());

      (this.state.oldRegion == "west") ? (this.setState({ selectedRegion: this.state.optionRegion[0] })) : ((this.state.oldRegion == "middle") ? (this.setState({ selectedRegion: this.state.optionRegion[1] })) : (this.setState({ selectedRegion: this.state.optionRegion[2] })));
  }

  _pickImage = async () => {
    var config = {
      headers: {
        'Accept': "application/json",
        'Content-Type': "multipart/form-data",
        'Authorization': "Bearer " + this.state.token
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ isLoading: true });
      ToastAndroid.show("Please wait a minute.", ToastAndroid.SHORT)
      const form = new FormData();
      form.append('photo', {
        uri: result.uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      await axios.post('http://wangku.herokuapp.com/api/group/' + this.state.id + '/photo', form, config)
        .then(response => ToastAndroid.show(response.data.message, ToastAndroid.SHORT))
        .catch(error => this.setState({
          error: error.response.data
        }));

      if (this.state.error !== undefined) {
        (this.state.error['photo'] != null) ? ToastAndroid.show(this.state.error['status'][0], ToastAndroid.SHORT) : '';
      }
      this.setState({ error: '' });
      this.props.navigation.goBack();
    }
  }

  async leave() {
    var config = {
        headers: {
          'Accept': "application/json",
          'Content-Type' : "application/json",
          'Authorization' : "Bearer " + this.state.token,
        }
    };
    await axios.get('http://wangku.herokuapp.com/api/search/user/' + this.state.userid, config)
      .then(response => this.setState({
        usermail: response.data.email
      }))
      .catch(error => console.log(error.response.data));
    await axios.post('http://wangku.herokuapp.com/api/group/' + this.state.id + '/leave', {
      email: this.state.usermail
    }, config)
      .then(response => this.setState({
        message: response.data.message
      }))
      .catch(error => console.log(error.response.data));

    if (this.state.message !== undefined) {
      (this.state.message != null) ? ToastAndroid.show(this.state.message, ToastAndroid.SHORT) : '';
      this.props.navigation.goBack();
    }
  }

  componentWillUnmount() {
    const {params} = this.props.navigation.state;
    // console.warn(params.refresh);
    params.getGroups();
  }

  async componentWillMount() {
    this.setState({isLoading: true});
    this.setState({ selectedRegion: this.state.optionRegion[0] });
    await this.getGroup();
  }

  formatRupiah(angka, prefix){
  	var number_string = angka.replace(/[^,\d]/g, "").toString(),
  	split   		= number_string.split(','),
  	sisa     		= split[0].length % 3,
  	rupiah     		= split[0].substr(0, sisa),
  	ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

  	// tambahkan titik jika yang di input sudah menjadi angka ribuan
  	if(ribuan){
  		separator = sisa ? '.' : '';
  		rupiah += separator + ribuan.join('.');
  	}

  	rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
  	hasil = prefix == undefined ? rupiah : (rupiah ? '' + rupiah : '');
    this.setState({ balance: hasil })
  }

  renderUpdateGroup() {
    const selectedRegion = this.state.selectedRegion || this.state.optionRegion[0];
    let photo = this.state.photo;
    if (this.state.photo == undefined || this.state.photo == null) {
      photo = 'http://wangku.herokuapp.com/img/avatar/default.jpg';
    } else {
      photo = 'http://wangku.herokuapp.com/images/group/' + this.state.photo;
    }
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
          <View styleName="vertical h-center content" style={{ marginBottom: 20 }}>
            {
              (this.state.owner == this.state.userid) ? (
                <View>
                  <Row styleName="container" style={{ backgroundColor: 'transparent' }}>
                    <Image
                      style={{ borderWidth: 10, borderColor: 'white', width: 150, height: 150, borderRadius: 99, marginLeft: 20 }}
                      source={{ uri: photo }}
                    />
                    <View styleName="horizontal" style={{ marginLeft: 10 }}>
                      <Button styleName="secondary register" onPress={ this._pickImage }>
                        <Text style={{ fontWeight: '100' }}>Change Photo</Text>
                      </Button>
                    </View>
                  </Row>
                  <Subtitle styleName="label">Name</Subtitle>
                  <TextInput
                    placeholder={'Enter Group Name here...'}
                    styleName="textInput"
                    value={this.state.name}
                    onChangeText={ name => this.setState({ name }) }
                  />
                  <Subtitle styleName="label">Description</Subtitle>
                  <TextInput
                    placeholder={'Enter Group Description here...'}
                    styleName="textInput"
                    value={this.state.description}
                    onChangeText={ description => this.setState({ description }) }
                  />
                  <Subtitle styleName="label">Balance</Subtitle>
                  <TextInput
                    placeholder={'Enter Group Balance here...'}
                    styleName="textInput"
                    keyboardType="numeric"
                    value={`${this.state.balance}`}
                    onChangeText={ balance => this.formatRupiah(balance) }
                  />
                  <Subtitle styleName="label">Region</Subtitle>
                  <View styleName="selectDropdown">
                    <DropDownMenu
                      styleName="horizontal"
                      options={this.state.optionRegion}
                      selectedOption={selectedRegion ? selectedRegion : this.state.optionRegion[0]}
                      onOptionSelected={(region) => this.setState({ selectedRegion: region })}
                      titleProperty="name"
                      valueProperty="optionRegion.value"
                    />
                  </View>
                  <Button styleName="secondary register" onPress={this.onButtonPress.bind(this)}>
                    <Text>Update</Text>
                  </Button>
                  <Button styleName="secondary delete" onPress={this.delete.bind(this)}>
                    <Text>Delete Group</Text>
                  </Button>
                </View>
              ) : (
                <View>
                  <Button styleName="secondary delete" onPress={this.leave.bind(this)}>
                    <Text>Leave Group</Text>
                  </Button>
                </View>
              )
            }
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    )
  }

  render() {
    return (
      <StyleProvider style={theme}>
        {this.state.isLoading ? (
          <ViewReact style={styles.container}>
            <ActivityIndicator
              animating
              size="large"
              style={styles.activityIndicator}
            />
          </ViewReact>
        ) : this.renderUpdateGroup()}
      </StyleProvider>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
