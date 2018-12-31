import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Font, AppLoading } from "expo";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import {
  Icon
} from '@shoutem/ui';

import AuthLoadingScreen from './screens/AuthLoadingScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import SearchScreen from './screens/SearchScreen';
import GroupScreen from './screens/GroupScreen';
import AddTransaction from './screens/transactions/AddTransactionScreen';
import DetailTransaction from './screens/transactions/DetailTransactionScreen';
import EditTransaction from './screens/transactions/EditTransactionScreen';
import UpdateProfileScreen from './screens/ProfileUpdateScreen';
import AllTransactionsScreen from './screens/transactions/AllTransactionsScreen';
import AddGroupScreen from './screens/groups/AddGroupScreen';
import IndexGroupScreen from './screens/groups/IndexGroupScreen';
import UpdateGroupScreen from './screens/groups/UpdateGroupScreen';
import SearchGroupScreen from './screens/groups/SearchGroupScreen';

const AuthStackNavigator = createStackNavigator({
  Welcome: WelcomeScreen,
  SignIn: SignInScreen,
  SignUp: SignUpScreen
}, {

});

const AppTabNavigator = createMaterialTopTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({tintColor}) => (
        <Icon name='equalizer' style={{color: tintColor}} size={24} />
      )
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({tintColor}) => (
        <Icon name="user-profile" style={{color: tintColor}} size={24}/>
      )
    }
  },
  Today: {
    screen: TransactionsScreen,
    navigationOptions: {
      tabBarLabel: 'Today',
      tabBarIcon: ({tintColor}) => (
        <Icon name="receipt" style={{color: tintColor}} size={24}/>
      )
    }
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      tabBarLabel: 'Search',
      tabBarIcon: ({tintColor}) => (
        <Icon name="search" style={{color: tintColor}} size={24}/>
      )
    }
  },
  Group: {
    screen: GroupScreen,
    navigationOptions: {
      tabBarLabel: 'Groups',
      tabBarIcon: ({tintColor}) => (
        <Icon name="users" style={{color: tintColor}} size={24}/>
      )
    }
  },
}, {
  initialRouteName: 'Home',
  order: ['Today', 'Group', 'Home', 'Search', 'Profile'],
  swipeEnabled: false,
  shifting: false,
  animationEnabled: false,
  tabBarPosition: 'bottom',
  navigationOptions: {
    tabBarVisible: true,
  },
  tabBarOptions: {
    activeTintColor: '#311B92',
    inactiveTintColor: 'grey',
    style: {
      backgroundColor: 'white',
      // marginBottom: -7 //comment this for label false
    },
    indicatorStyle: {
      height: 0,
      backgroundColor: '#311B92'
    },
    showIcon: true,
    showLabel: false,
  }
});

const AppStackNavigator = createStackNavigator({
  AppTabNavigator: {
    screen: AppTabNavigator,
    navigationOptions: ({ navigation }) => ({
      header: null,
      title: 'Wangku',
    })
  },
  AddTransaction: AddTransaction,
  DetailTransaction: DetailTransaction,
  EditTransaction: EditTransaction,
  UpdateProfileScreen: UpdateProfileScreen,
  AllTransactionsScreen: AllTransactionsScreen,
  AddGroupScreen: AddGroupScreen,
  IndexGroupScreen: IndexGroupScreen,
  UpdateGroupScreen: UpdateGroupScreen,
  SearchGroupScreen: SearchGroupScreen
});

// const AppDrawerNavigator = createDrawerNavigator({
//   Home: AppStackNavigator
// });

const AppNavigator = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Auth: AuthStackNavigator,
  App: AppStackNavigator
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentWillMount() {
    await Font.loadAsync({
      "rubicon-icon-font" : require('@shoutem/ui/fonts/rubicon-icon-font.ttf'),
      "Rubik-Regular" : require('@shoutem/ui/fonts/Rubik-Regular.ttf'),
    });
    this.setState({ loading: false });
  }

 render() {
   if (this.state.loading) {
      return (
        <AppLoading />
      );
    }
    return (
        <AppNavigator />
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
