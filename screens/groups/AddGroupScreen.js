import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  AsyncStorage,
  ToastAndroid,
} from 'react-native';
import {
  Button,
  Text,
  View,
  getTheme,
  TextInput,
  DropDownMenu,
  Subtitle
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

export default class AddGroupScreen extends Component {
  static navigationOptions = {
    title: 'Create Group',
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

  state = {name: '', description: '', balance: '', selectedRegion: '', token: '', success: '', error: []};

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')

    this.setState({token: apiToken})
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

      await axios.post('http://wangku.herokuapp.com/api/group', {
        name: name,
        description: description,
        balance: balance.replace(/[^,\d]/g, "").toString(),
        region: selectedRegion.value
      }, config)
        .then(response => this.setState({
          success: response.data.data.created
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

  componentWillUnmount() {
    const {params} = this.props.navigation.state;
    // console.warn(params.refresh);
    params.getGroups();
  }

  componentWillMount() {
    this.setState({ selectedRegion: this.state.optionRegion[0] })
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

  render() {
    const selectedRegion = this.state.selectedRegion || this.state.optionRegion[0];
    return (
      <StyleProvider style={theme}>
          <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
            <View styleName="vertical h-center content" >
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
                value={this.state.balance}
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
                <Text>Create</Text>
              </Button>
            </View>
          </TouchableWithoutFeedback>
      </StyleProvider>
    );
  }

}
