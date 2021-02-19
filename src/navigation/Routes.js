/* eslint-disable max-len */
import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import SplashScreen from '../pages/SplashScreen';
import LoginScreen from '../pages/LoginScreen';
import HomeScreen from '../pages/HomeScreen';
import OrgChartScreen from '../pages/OrgChartScreen';
import MyActivitiesScreen from '../pages/MyActivitiesScreen';
import PendingTasksScreen from '../pages/PendingTasksScreen';
import CompletedTasksScreen from '../pages/CompletedTasksScreen';
import SideDrawer from '../components/SideDrawer';
import HamburgerIcon from '../components/HamburgerIcon';
import PunchInScreen from '../pages/PunchInScreen';
import MyCalenderScreen from '../pages/MyCalenderScreen';
import HomeToolbarRight from '../components/HomeToolbarRight';
import OrgAnalyticsScreen from '../pages/OrgAnalyticsScreen';
import CancelLeaveSceen from '../pages/CancelLeaveScreen';
import Profile from '../pages/Profile';
import Detail from '../pages/Detail';
import Bankdetail from '../pages/Bankdetail';
import Bankdetailedit from '../pages/Bankdetailedit';
import Personaldetail from '../pages/Personaldetail';
import Familydetail from '../pages/Familydetail';
import Previousemploymentdetail from '../pages/Previousemploymentdetail';
import Identitydetail from '../pages/Identitydetail';
import Mydocumentscreen from '../pages/Mydocumentscreen';
import Addressdetail from '../pages/Addressdetail';
import Academicdetail from '../pages/Academicdetail';
import Colors from '../config/Colors';
import AttendenceRegularizationScreen from '../pages/AttendenceRegularizationScreen';
import LeaveApplicationScreen from '../pages/LeaveApplicationScreen';
import AttCancelApprovalRejectScreen from '../pages/AttCancelApprovalRejectScreen';
import AttRegApprovalRejectScreen from '../pages/AttRegApprovalRejectScreen';
import LeaveApprovalRejectScreen from '../pages/LeaveApprovalRejectScreen';
import LeaveCancelApprovalRejectScreen from '../pages/LeaveCancelApprovalRejectScreen';
import AttendanceCancelScreen from '../pages/AttendanceCancelScreen';
import NotificationScreen from '../pages/NotificationsScreen';
import ForgotPasswordScreen from '../pages/ForgotPasswordScreen';
import Toolbar from '../components/Toolbar';
import BackArrow from '../components/HeaderBack';
import BottomBarIcon from '../components/BottomBarIcon';
import TopTab from '../components/TopTab';
import LeaveHistoryScreen from '../pages/LeaveHistoryScreen';
import AttendanceHistoryScreen from '../pages/AttendanceHistoryScreen';
import QuickLinksScreen from '../pages/QuickLinksScreen';
import Personaldetailedit from '../pages/Personaldetailedit';
import ExpenseHistoryScreen from '../pages/ExpenseHistoryScreen';
import Familydetailedit from '../pages/Familydetailedit';
import Identitydetailedit from '../pages/Identitydetailedit';
import Addressdetailview from '../pages/Addressdetailview';
import Addressdetailedit from '../pages/Addressdetailedit';
import Previousemploymentedit from '../pages/Previousemploymentedit';
import PreviousEmploymentDetailView from '../pages/PreviousEmploymentDetailView';
import Academicdetailview from '../pages/Academicdetailview';
import Academicdetailedit from '../pages/Academicdetailedit';
import Mydocumentedit from '../pages/Mydocumentedit';
import SandryExpenseListScreen from '../pages/SandryExpenseListScreen';
import CreateSandryExpenseScreen from '../pages/CreateSandryExpenseScreen';
import ExpenseApproveRejectScreen from '../pages/ExpenseApproveRejectScreen';
import IconMarkAllRead from '../components/IconReadAll';

const styles = StyleSheet.create({
  toolbarTitle: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 22
  },
  headerStyle: {
    backgroundColor: Colors.accentBlue,
    elevation: 0,
  },
  toolbarTitleMargin: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    marginLeft: -50,
    fontSize: 22
  },
});

const homeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title=""
        headerLeft={<HamburgerIcon color="white" navigation={navigation} />}
        headerRight={<HomeToolbarRight color="white" navigation={navigation} />}
      />,
    }),
  },
  PunchIn: {
    screen: PunchInScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Punch-In"
        headerLeft={<BackArrow navigation={navigation} />}
      />,
      tabBarVisible: false
    }),
  },

  Notifications: {
    screen: NotificationScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Notifications"
        headerLeft={<BackArrow navigation={navigation} />}
        headerRight={<IconMarkAllRead color="white" navigation={navigation} />}
      />,
    }),
  },
  AttCancelApprovalReject: {
    screen: AttCancelApprovalRejectScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Cancel Attendance"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  AttRegApprovalReject: {
    screen: AttRegApprovalRejectScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Attendance Regularization"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })

  },
  LeaveApprovalReject: {
    screen: LeaveApprovalRejectScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Leave Application"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  LeaveCancelApprovalReject: {
    screen: LeaveCancelApprovalRejectScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Leave Cancellation"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },

  ExpenseApprovalReject: {
    screen: ExpenseApproveRejectScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Sundry Expense"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  LeaveHistory: {
    screen: LeaveHistoryScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Leave History"
        headerLeft={<BackArrow navigation={navigation} />}
      />,
    }),
  },
  AttendanceHistory: {
    screen: AttendanceHistoryScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Attendance History"
        headerLeft={<BackArrow navigation={navigation} />}
      />,
    }),
  },

  QuickLinks: {
    screen: QuickLinksScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title={navigation.getParam('title')}
        headerLeft={<BackArrow navigation={navigation} />}
      />,
    }),
  },

  ExpenseHistory: {
    screen: ExpenseHistoryScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Sundry Expense History"
        headerLeft={<BackArrow navigation={navigation} />}
      />,
    }),
  },
  OrgAnalytics: {
    screen: SandryExpenseListScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Sundry Expense"
        headerLeft={<HamburgerIcon color="white" navigation={navigation} />}
        headerRight={<HomeToolbarRight color="white" navigation={navigation} />}
      />,
    }),
  },
  SandryList: {
    screen: SandryExpenseListScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Sundry Expense"
        headerLeft={<BackArrow navigation={navigation} />}
      />,
    }),
  },

  CreateSandry: {
    screen: CreateSandryExpenseScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Sundry Expense"
        headerLeft={<BackArrow navigation={navigation} />}
      />,
    }),
  },
});

homeStack.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});

const inboxTabs = createMaterialTopTabNavigator(
  {
    PendingTasks: {
      screen: PendingTasksScreen,
      navigationOptions: {
        title: 'PENDING TASKS',
        headerTitleStyle: styles.toolbarTitle,
      }
    },
    CompletedTasks: {
      screen: CompletedTasksScreen,
      navigationOptions: {
        title: 'COMPLETED TASKS',
        headerTitleStyle: styles.toolbarTitle,
      }
    },
  },
  {
    tabBarPosition: 'top',
    tabBarComponent: TopTab,
    swipeEnabled: true,
    lazy: false,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#635E49',
      inactiveTintColor: '#F8F8F8',
      style: {
        backgroundColor: Colors.accentBlue,
      },
      labelStyle: {
        textAlign: 'center',
        color: 'white',
      },
      indicatorStyle: {
        borderBottomColor: Colors.accentOrange1,
        borderBottomWidth: 4,
      },
    },
  }
);

const inboxStack = createStackNavigator({
  tabs: {
    screen: inboxTabs,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Inbox"
        headerLeft={<HamburgerIcon color="white" navigation={navigation} />}
        headerRight={<HomeToolbarRight color="white" navigation={navigation} />}
      />,
    }),
  },
  AttCancelApprovalReject: {
    screen: AttCancelApprovalRejectScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Cancel Attendance"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  AttRegApprovalReject: {
    screen: AttRegApprovalRejectScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Attendance Regularization"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })

  },
  LeaveApprovalReject: {
    screen: LeaveApprovalRejectScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Leave Application"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  LeaveCancelApprovalReject: {
    screen: LeaveCancelApprovalRejectScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Leave Cancellation"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },

  ExpenseApprovalReject: {
    screen: ExpenseApproveRejectScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Sundry Expense"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
});

inboxStack.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});

const orgAnalyticStack = createStackNavigator({
  OrgAnalytics: {
    screen: OrgAnalyticsScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Org Analytics"
        headerLeft={<HamburgerIcon color="white" navigation={navigation} />}
        headerRight={<HomeToolbarRight color="white" navigation={navigation} />}
      />,
    }),
  }
});

const paySilpStack = createStackNavigator({
  OrgAnalytics: {
    screen: SandryExpenseListScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Sundry Expense"
        headerLeft={<HamburgerIcon color="white" navigation={navigation} />}
        headerRight={<HomeToolbarRight color="white" navigation={navigation} />}
      />,
    }),
  },
  SandryExpenseList: {
    screen: SandryExpenseListScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Sundry Expense"
        headerLeft={<BackArrow navigation={navigation} />}
      />,
    }),
  },

  CreateSandryExpense: {
    screen: CreateSandryExpenseScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Sundry Expense"
        headerLeft={<BackArrow navigation={navigation} />}
      />,
    }),
  },
});

paySilpStack.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});

const homeTabs = createMaterialBottomTabNavigator(
  {
    Home: { screen: homeStack },
    OrgAnalytics: {
      screen: orgAnalyticStack,
    },
    Expense: {
      screen: paySilpStack,
    },
    Inbox: { screen: inboxStack },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        const IconComponent = BottomBarIcon;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'home';
        } else if (routeName === 'OrgAnalytics') {
          iconName = 'bar-chart';
        } else if (routeName === 'Expense') {
          iconName = 'bookmark';
        } else if (routeName === 'Inbox') {
          iconName = 'mail';
        }
        return <IconComponent name={iconName} focused={focused} size={20} color={focused ? Colors.accentOrange1 : Colors.accentBlue} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: Colors.accentOrange1,
      inactiveTintColor: Colors.accentBlue,
      keyboardHidesTabBar: true,
    },
    barStyle: {
      backgroundColor: 'white',
      borderTopWidth: 1.2,
      borderTopColor: 'lightgray',
      height: 55
    },
    shifting: false,
  },
);


const myCalenderStack = createStackNavigator({
  MyCalender: {
    screen: MyCalenderScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="My Calendar"
        headerLeft={<HamburgerIcon color="white" navigation={navigation} />}
      />,
    }),
  },
  CancelLeave: {
    screen: CancelLeaveSceen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Cancel Leave"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })

    // navigationOptions: () => ({
    //   // headerLeft: <HamburgerIcon navigation={navigation} />,
    //   headerStyle: styles.headerStyle,
    //   headerTintColor: 'white',
    //   title: 'Cancel Leave',
    //   headerTitleStyle: styles.toolbarTitleMargin,
    // }),
  },
  AttendenceRegularization: {
    screen: AttendenceRegularizationScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Attendance Regularization"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
    // navigationOptions: () => ({
    //   // headerLeft: <HamburgerIcon navigation={navigation} />,
    //   headerStyle: styles.headerStyle,
    //   headerTintColor: 'white',
    //   title: 'Attendance Regularization',
    //   headerTitleStyle: styles.toolbarTitleMargin,
    // }),
  },
  LeaveApplication: {
    screen: LeaveApplicationScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Leave Application"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
    // navigationOptions: () => ({
    //   // headerLeft: <HamburgerIcon navigation={navigation} />,
    //   headerStyle: styles.headerStyle,
    //   headerTintColor: 'white',
    //   title: 'Leave Application',
    //   headerTitleStyle: styles.toolbarTitleMargin,
    // }),
  },
  CancelAttendance: {
    screen: AttendanceCancelScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Cancel Attendance"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
    // navigationOptions: () => ({
    //   headerStyle: styles.headerStyle,
    //   headerTintColor: 'white',
    //   title: 'Cancel Attendance',
    //   headerTitleStyle: styles.toolbarTitleMargin,
    // }),
  }
});

const Profiletab = createMaterialTopTabNavigator(
  {
    ProfileTasks: {
      screen: Profile,
      navigationOptions: {
        title: 'PROFILE',
        headerTitleStyle: styles.toolbarTitle,
      }
    },
    DetailTasks: {
      screen: Detail,
      navigationOptions: {
        title: 'Details',
        headerTitleStyle: styles.toolbarTitle,
      }
    },
  },
  {
    tabBarPosition: 'top',
    tabBarComponent: TopTab,
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#635E49',
      inactiveTintColor: '#F8F8F8',
      style: {
        backgroundColor: Colors.accentBlue,
      },
      labelStyle: {
        textAlign: 'center',
        color: 'white',
      },
      indicatorStyle: {
        borderBottomColor: Colors.accentOrange1,
        borderBottomWidth: 4,
      },
    },
  }
);
const profileStack = createStackNavigator({
  tabs: {
    screen: Profiletab,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="My Profile"
        headerLeft={<HamburgerIcon color="white" navigation={navigation} />}
        headerRight={<HomeToolbarRight color="white" navigation={navigation} />}
      />,
    }),
  },
  Bankdetail: {
    screen: Bankdetail,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Bank Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Bankdetailedit: {
    screen: Bankdetailedit,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Bank Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Personaldetail: {
    screen: Personaldetail,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Personal Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Personaldetailedit: {
    screen: Personaldetailedit,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Personal Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Familydetail: {
    screen: Familydetail,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Family Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Familydetailedit: {
    screen: Familydetailedit,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Family Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Previousemploymentdetail: {
    screen: Previousemploymentdetail,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Previous Employment Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Previousemploymentedit: {
    screen: Previousemploymentedit,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Previous Employment Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  PreviousEmploymentDetailView: {
    screen: PreviousEmploymentDetailView,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Previous Employment Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Identitydetail: {
    screen: Identitydetail,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Identity Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Identitydetailedit: {
    screen: Identitydetailedit,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Identity Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Mydocumentscreen: {
    screen: Mydocumentscreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="My Documents"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Mydocumentedit: {
    screen: Mydocumentedit,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="My Documents"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Addressdetail: {
    screen: Addressdetail,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Address Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Addressdetailview: {
    screen: Addressdetailview,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Address Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Addressdetailedit: {
    screen: Addressdetailedit,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Address Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Academicdetail: {
    screen: Academicdetail,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Academic Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Academicdetailview: {
    screen: Academicdetailview,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Academic Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
  Academicdetailedit: {
    screen: Academicdetailedit,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Academic Details"
        headerLeft={<BackArrow navigation={navigation} />}
      />
    })
  },
});
profileStack.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});
const org = createStackNavigator({
  tabs: {
    screen: OrgAnalyticsScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Toolbar
        title="Org Analytics"
        headerLeft={<HamburgerIcon color="white" navigation={navigation} />}
        headerRight={<HomeToolbarRight color="white" navigation={navigation} />}
      />,
    }),
  },
});
org.navigationOptions = ({ navigation }) => ({
  tabBarVisible: navigation.state.index === 0,
});

const drawerStack = createDrawerNavigator({
  Home: homeTabs,
  MyCalender: myCalenderStack,
  OrgChart: {
    screen: org,
  },
  MyProfile: {
    screen: profileStack,
  },
  MyActivities: {
    screen: MyActivitiesScreen,
  },
}, {
  contentComponent: SideDrawer,
  drawerWidth: (Dimensions.get('window').width),
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  drawerType: 'slide'
});

const loginStack = createStackNavigator({
  Login: LoginScreen,
  ForgotPassword: ForgotPasswordScreen,
});

export default createAppContainer(createSwitchNavigator({
  Splash: SplashScreen,
  Login: loginStack,
  App: drawerStack,
}, {
  initialRouteName: 'Splash',
}));
