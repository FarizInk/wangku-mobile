import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  AsyncStorage,
  ToastAndroid,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import {
  Button,
  Text,
  View,
  getTheme,
  TextInput,
  Subtitle,
  DropDownMenu,
  Divider,
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
  'shoutem.ui.Divider': {
    '.custom': {
      margin: 20
    }
  }
});

var DismissKeyboard = require('dismissKeyboard');

export default class AddTransactionScreen extends Component {
  static navigationOptions = {
    title: 'Update Profile',
  }

  constructor(props){
  super(props);
  this.loadApp()
  this.state = {
    optionGender: [
        {
          name: "-",
          value: ""
        },
        {
          name: "Male",
          value: "male"
        },
        {
          name: "Female",
          value: "female"
        },
      ],
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

  async loadApp() {
    const apiToken = await AsyncStorage.getItem('apiToken')

    this.setState({token: apiToken})
  }

  async changeProfile() {
    const { name, balance, selectedGender, selectedRegion, token } = this.state;
    var config = {
        headers: {
          'Accept': "application/json",
          'Content-Type' : "application/json",
          'Authorization' : "Bearer " + this.state.token,
        }
    };

    if (this.checkInput(name, balance, selectedGender, selectedRegion)) {

      await axios.put('http://wangku.herokuapp.com/api/profile/update', {
        name: name,
        balance: balance,
        gender: selectedGender.value,
        region: selectedRegion.value
      }, config)
        .then(response => console.warn(response.data))
        .catch(error => console.warn(error.response.data));

      if (this.state.error !== undefined) {
        (this.state.error['name'] != null) ? ToastAndroid.show(this.state.error['name'][0], ToastAndroid.SHORT) : '';
        (this.state.error['balance'] != null) ? ToastAndroid.show(this.state.error['balance'][0], ToastAndroid.SHORT) : '';
        (this.state.error['gender'] != null) ? ToastAndroid.show(this.state.error['gender'][0], ToastAndroid.SHORT) : '';
        (this.state.error['region'] != null) ? ToastAndroid.show(this.state.error['region'][0], ToastAndroid.SHORT) : '';
      } else if (this.state.success != null || this.state.success != '' || this.state.success != undefined) {
        ToastAndroid.show('Successfully Update Profile', ToastAndroid.SHORT);
        this.props.navigation.goBack();
      }

      this.setState({
        success: '',
        error: []
      });

    } else {
      ToastAndroid.show('Name, Balance, Gender Cannot Empty.', ToastAndroid.SHORT);
    }
  }

  checkInput(name, balance, selectedGender, selectedRegion) {
    let successInput = false;

    if (name !== undefined && balance !== undefined) {
      if (selectedGender.value !== '' && selectedRegion.value !== '') {
        successInput = true;
      }
    }

    return successInput;
  }

  async getProfile() {
    await this.loadApp();
    var config = {
        headers: {
          'Accept': "application/json",
          'Content-Type' : "application/json",
          'Authorization' : "Bearer " + this.state.token,
        }
    };
    await axios.get('http://wangku.herokuapp.com/api/profile', config)
      .then(response => this.setState({
        name: response.data.data.name,
        balance: response.data.data.balance,
        gender: response.data.meta.gender,
        region: response.data.meta.region,
        isLoading: false
      }))
      .catch(error => console.log(error.data));

      (this.state.gender == null) ? (this.setState({ selectedGender: this.state.optionGender[0] })) : ( (this.state.gender == 'male') ? (this.setState({ selectedGender: this.state.optionGender[1] })) : (this.setState({ selectedGender: this.state.optionGender[2] })) );

      (this.state.region == "west") ? (this.setState({ selectedRegion: this.state.optionRegion[0] })) : ( (this.state.region == "middle") ? (this.setState({ selectedRegion: this.state.optionRegion[1] })) : (this.setState({ selectedRegion: this.state.optionRegion[2] })) );
  }

  async componentWillMount() {
    this.setState({ isLoading: true, });
    await this.getProfile();
  }

  componentWillUnmount() {
    const {params} = this.props.navigation.state;
    params.refresh();
  }

  renderUpdateProfile() {
    const selectedGender = this.state.selectedGender || this.state.optionGender[0];
    const selectedRegion = this.state.selectedRegion || this.state.optionRegion[0];
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <TouchableWithoutFeedback onPress={ () => { DismissKeyboard() } }>
          <View styleName="vertical h-center content" >
            <Subtitle styleName="label">Name</Subtitle>
            <TextInput
              placeholder={'Your Name Here'}
              styleName="textInput"
              value={this.state.name}
              onChangeText={ name => this.setState({ name }) }
            />
            <Subtitle styleName="label">Balance</Subtitle>
            <TextInput
              placeholder={'Your Current Money'}
              styleName="textInput"
              keyboardType="numeric"
              value={`${this.state.balance}`}
              onChangeText={ balance => this.setState({ balance }) }
            />
            <Subtitle styleName="label">Gender</Subtitle>
            <View styleName="selectDropdown">
              <DropDownMenu
                styleName="horizontal"
                options={this.state.optionGender}
                selectedOption={selectedGender ? selectedGender : this.state.optionGender[0]}
                onOptionSelected={(gender) => this.setState({ selectedGender: gender })}
                titleProperty="name"
                valueProperty="optionGender.value"
              />
            </View>
            <Subtitle styleName="label">Region</Subtitle>
            <View styleName="selectDropdown">
              <DropDownMenu
                styleName="horizontal selectDropdown"
                options={this.state.optionRegion}
                selectedOption={selectedRegion ? selectedRegion : this.state.optionRegion[0]}
                onOptionSelected={(region) => this.setState({ selectedRegion: region })}
                titleProperty="name"
                valueProperty="optionRegion.value"
              />
            </View>
            <Button styleName="secondary register" onPress={this.changeProfile.bind(this)}>
              <Text>Change</Text>
            </Button>
          </View>
        </TouchableWithoutFeedback>
        <Divider styleName="line custom"/>
      </ScrollView>
    );
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
        ) : this.renderUpdateProfile()}
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
