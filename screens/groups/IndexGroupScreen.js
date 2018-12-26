import React, { Component } from 'react';
import {
  View as ViewReact,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import {
  Text,
  View,
  Icon,
  Button
} from '@shoutem/ui';
import { createStackNavigator, createDrawerNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import HomeGroupScreen from './HomeGroupScreen';
import TransactionsGroupScreen from './TransactionsGroupScreen';
import AboutGroupScreen from './AboutGroupScreen';
import AddTransactionScreen from './transactions/AddTransactionScreen';

const GroupTabNavigator = createMaterialTopTabNavigator({
  Home: {
    screen: HomeGroupScreen,
    navigationOptions: {
      tabBarLabel: 'Home'
    }
  },
  Transactions: {
    screen: TransactionsGroupScreen,
    navigationOptions: {
      tabBarLabel: 'Transactions'
    }
  },
  About: {
    screen: AboutGroupScreen,
    navigationOptions: {
      tabBarLabel: 'About'
    }
  }
}, {
  initialRouteName: 'Home',
  order: ['Home', 'Transactions', 'About'],
  swipeEnabled: true,
  shifting: false,
  animationEnabled: true,
  tabBarPosition: 'top',
  navigationOptions: {
    tabBarVisible: true,
  },
  tabBarOptions: {
    activeTintColor: '#311B92',
    inactiveTintColor: 'grey',
    style: {
      backgroundColor: 'white'
    },
    indicatorStyle: {
      height: 2,
      backgroundColor: '#311B92'
    },
    showIcon: false,
    showLabel: true,
  }
});

const GroupStackNavigator = createStackNavigator({
  GroupTabNavigator: {
    screen: GroupTabNavigator,
    navigationOptions: ({ navigation }) => ({
      header: null,
      title: 'Group',
    })
  }
});

export default class IndexGroupScreen extends Component {
  static navigationOptions = ({navigation}) => {
      const { params = {} } = navigation.state;
      return {
          title: params.name,
          headerTitleStyle :{color:'#fff'},
          headerStyle: {backgroundColor:'#311B92'},
          headerLeftStyle: {color:'#fff'},
          headerLeft: (
            <Button styleName="clear" onPress={ () => { navigation.goBack() } }>
              <Icon name="back" style={{ color: "white" }} />
            </Button>
          ),
          headerRight: (
            <Button styleName="clear" onPress={ () => { navigation.navigate("AddGroupTransaction",
              { gid: params.id }) } }>
              <Icon name="plus-button" style={{ color: "#FFDE03" }} />
            </Button>
          )
      };
  };

  async componentWillMount() {
    const { params } = await this.props.navigation.state;
    await this.setState({ groupId: params.id })
    await AsyncStorage.setItem('groupId', this.state.groupId.toString())
  }

  render() {
    return (
      <GroupStackNavigator />
    );
  }

}
