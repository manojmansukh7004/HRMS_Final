/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable quotes */
import React, { Component } from 'react';
import {
  Text, View, Image, ScrollView, Dimensions, StyleSheet, TouchableOpacity, StatusBar, FlatList, Alert, PermissionsAndroid, AppState, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { SvgXml } from 'react-native-svg';
import Moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import { Card, Divider } from 'react-native-paper';
import { setPrimaryColor, setSecondaryColor } from '../redux/actions/theme';
import RulesItem from '../components/RulesPolicyItem';
import PunchComponent from '../components/HomePunchComponent';
import { fetchNotifications } from '../services/FetchNotificationsService';
import {
  ic_sundry, ic_sundry_history, ic_hr_policy, ic_it_policy,
  ic_leave_application, ic_leave_history, ic_leave_rules, ic_punch_record_history,
  ic_travel_rules, ic_view_calendar
} from '../assets/svg/svg';
import Modal from '../components/ModalPunchIn';
import {
  setPunchOut, setSkip, setNotifications, setDashboardData, setUnreadNotifications
} from '../redux/actions/user';
import { getDashboardData } from '../services/GetDashBoardData';

const RNFS = require('react-native-fs');

const styles = StyleSheet.create({
  imageTop: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width / 1.84,
  },
  textHeading: {
    fontSize: 17,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  textLink: {
    fontSize: 14,
    marginBottom: 10,
    marginTop: 10,
  },
  containerTransparentIcon: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  card: {
    borderRadius: 30,
    height: 50,
    width: 50,
    borderWidth: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  img: {
    height: 25,
    width: 25,
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10
  },
  cardExpenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 0.2,
    // flex: 1,
    margin: 10,
    width: '45%'
  },
  iconExspense: {
    borderRadius: 30,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textClock: {
    fontSize: 36,
  },
  containerClock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  container: {
    // justifyContent: 'center',
    // alignContent: 'center',
  },
  cardTopList: {
    borderRadius: 30,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  imgTopList: {
    height: 22,
    width: 22,
  },
  titleTopList: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10
  },
  horizontalSpacing: { flexGrow: 1, justifyContent: 'space-between' },
  topListItemHolder: {
    paddingStart: 14,
    paddingEnd: 14
  },
  panelContainer: { marginStart: 16, marginEnd: 16, marginTop: 20 },
  cardBirthday: {
    height: 150,
    width: 250,
    borderRadius: 10,
    margin: 10,
    padding: 10
  },
  scrollViewBirthday: {
    marginTop: 20,
  },
  textHappyBirthday: {
    color: 'white',
    fontSize: 18
  },
  textHappyBirthday2: {
    color: 'white',
    fontSize: 14,
    padding: 4
  },
  icBirthday: {
    height: 65,
    width: 65,
    marginLeft: 10
  },
  containerBirthday: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '80%'
  },
  containerJoinee: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 2,
    marginBottom: 2
  }
});

const topRowItems = [{
  id: 'LeaveApp',
  title: 'Leave\nApplication',
  svg: ic_leave_application,
  textColor: "white",
  icon: 'event'
},
{
  id: 'ViewCalendar',
  title: 'View\nCalendar',
  svg: ic_view_calendar,
  textColor: "white",
  icon: 'calendar'
},
{
  id: 'LeaveHistory',
  title: 'Leave\nHistory',
  svg: ic_leave_history,
  textColor: "white",
  icon: ''
},
{
  id: 'PunchRecord',
  title: 'Punch\nRecord',
  svg: ic_punch_record_history,
  textColor: "white",
  icon: 'location-pin'
}];

class HomeScreen extends Component {
  state={
    isModalVisible: false,
    punchInTimeSeconds: 0,
  };

  constructor(props) {
    super(props);
    this.timer = null;
    this.isTimerRunning = false;
  }

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    if (this.props.punchInTime && this.props.punchOutTime) {
      let punchOutTime = Moment(`${this.props.punchOutTime.substring(0, 10)} ${this.props.punchOutTime.substring(11, 19)}`, "DD-MM-YYYY HH:mm:ss");
      punchOutTime = Moment(punchOutTime, 'HH:mm:ss');
      let punchInTime = Moment(`${this.props.punchInTime.substring(0, 10)} ${this.props.punchInTime.substring(11, 19)}`, "DD-MM-YYYY HH:mm:ss");
      punchInTime = Moment(punchInTime, 'HH:mm:ss');
      const diff = punchOutTime.diff(punchInTime, 'seconds');
      this.setState({
        punchInTimeSeconds: diff,
      });
    } else if (this.props.punchInTime) {
      try {
        let now = new Date();
        now = Moment(now);
        let punchInTime = Moment(`${this.props.punchInTime.substring(0, 10)} ${this.props.punchInTime.substring(11, 19)}`, "DD-MM-YYYY HH:mm:ss");
        punchInTime = Moment(punchInTime);
        const diff = now.diff(punchInTime, 'seconds');
        this.isTimerRunning = true;
        this.setState({
          punchInTimeSeconds: diff,
        }, () => {
          this.timer = setInterval(() => {
            this.setState(prevState => ({
              punchInTimeSeconds: prevState.punchInTimeSeconds + 1
            }));
          }, 1000);
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
    if (!this.props.skip && !this.props.isPunched) {
      this.setState({
        isModalVisible: true
      });
    }
    try {
      const response = await fetchNotifications(this.props.user);
      if (response) {
        this.props.setNotifications(response.Notifications[0]);
        const notifications = response.Notifications[0];
        const unReadNotifications = notifications.filter(element => element.IsRead === false);
        this.props.setUnreadNotifications(unReadNotifications.length);
      }
      const dashBoardData = await getDashboardData(this.props.user);
      if (dashBoardData) {
        this.props.setDashboardData(dashBoardData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.punchOutTime !== this.props.punchOutTime) {
      clearInterval(this.timer);
    } else if (prevProps.punchInTime !== this.props.punchInTime && this.props.punchInTime !== null) {
      this.startTimer();
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      if (!this.isTimerRunning) {
        this.startTimer();
      }
    } else if (nextAppState === 'background') {
      clearInterval(this.timer);
      this.isTimerRunning = false;
    }
  };

  startTimer = () => {
    if (this.props.punchInTime && !this.props.isPunchOut) {
      let now = new Date();
      now = Moment(now);
      let punchInTime = Moment(`${this.props.punchInTime.substring(0, 10)} ${this.props.punchInTime.substring(11, 19)}`, "DD-MM-YYYY HH:mm:ss");
      punchInTime = Moment(punchInTime);
      const diff = now.diff(punchInTime, 'seconds');
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        punchInTimeSeconds: diff,
      }, () => {
        this.timer = setInterval(() => {
          this.setState(prevState => ({
            punchInTimeSeconds: prevState.punchInTimeSeconds + 1
          }));
        }, 1000);
      });
    }
  }

  onPressGridItem =async (item) => {
    if (item.id === 'ViewCalendar') {
      this.props.navigation.navigate('MyCalender');
    } else if (item.id === 'LeaveApp') {
      this.props.navigation.navigate('MyCalender');
    } else if (item.id === 'LeaveHistory') {
      this.props.navigation.navigate('LeaveHistory');
    } else {
      const { rulesLinks } = this.props;
      let link = null;
      rulesLinks.forEach(element => {
        if (element.DocType === item) {
          link = element;
        }
      });
      if (link) {
        if (Platform.OS === 'android') {
          const { android } = RNFetchBlob;
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'App need Storage Permission',
                message:
                  'App needs access to your Storage ',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              const downloadDest = `${RNFS.ExternalStorageDirectoryPath}/Download/${link.DocType}`;
              const { FilePath } = link;
              RNFetchBlob
                .config({
                  addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    title: link.DocType,
                    path: downloadDest,
                    mime: link.FileType,
                    description: 'File downloaded successfully.',
                    mediaScannable: true,
                  }
                })
                .fetch('GET', FilePath)
              // eslint-disable-next-line no-console
                .catch(e => console.log(e))
                .then((resp) => {
                  Alert.alert(
                    'File downloaded',
                    `${link.DocType} downloaded successfully.`,
                    [
                      {
                        text: 'OPEN',
                        onPress: () => {
                          android.actionViewIntent(resp.path(), link.FileType);
                        }
                      },
                      {
                        text: 'CANCEL',
                        onPress: () => {},
                        style: 'cancel',
                      },
                    ],
                    { cancelable: false },
                  );
                  resp.path();
                });
            } else {
              console.log('Storage permission denied');
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          const { FilePath } = link;
          const spiltStr = FilePath.split('/');
          const downloadDest = `${RNFS.DocumentDirectoryPath}/${spiltStr[spiltStr.length - 1]}`;
          RNFetchBlob.config({
            fileCache: true,
            path: downloadDest,
          })
            .fetch('GET', FilePath, {},)
            .then(res => {
              console.log('The file saved to ', res.path());
              Alert.alert(
                'File downloaded',
                `${link.DocType} downloaded successfully.`,
                [
                  {
                    text: 'OPEN',
                    onPress: () => {
                      RNFetchBlob.ios.openDocument(downloadDest);
                    }
                  },
                  {
                    text: 'CANCEL',
                    onPress: () => {},
                    style: 'cancel',
                  },
                ],
                { cancelable: false },
              );
            });
        }
      }
    }
  }

  hideModal= () => {
    this.setState({ isModalVisible: false });
  }

  onCancelPunch = () => {
    this.hideModal();
    this.props.setSkip(true);
  }

  onPressPunchIn =() => {
    this.hideModal();
    this.props.navigation.navigate('PunchIn');
  }

  render() {
    const { punchInTimeSeconds } = this.state;
    return (
      <ScrollView
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={[styles.container, { paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar barStyle="light-content" backgroundColor={this.props.primaryColor} />
        <Modal
          hideModal={() => this.hideModal()}
          isVisible={this.state.isModalVisible}
          onCancelPunch={() => this.onCancelPunch()}
          onPressPunchIn={() => this.onPressPunchIn()}
        />
        <View style={[styles.containerClock, { backgroundColor: this.props.primaryColor }]}>
          <Text style={[styles.textClock, { color: 'white' }]}>{`${Moment.utc(punchInTimeSeconds * 1000).format('HH:mm:ss')}`}</Text>
          <PunchComponent navigate={this.props.navigation.navigate} />
        </View>
        <View style={{
          height: 30, width: '100%', backgroundColor: this.props.primaryColor, flexDirection: 'row', alignItems: 'center'
        }}
        >
          <View style={{
            height: 0.5, flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.50)', marginTop: 27, marginLeft: 20, marginRight: 20
          }}
          />
        </View>
        <View style={{
          flexDirection: 'row', flex: 1, paddingStart: 16, paddingEnd: 16, justifyContent: 'space-evenly', paddingTop: 27, paddingBottom: 27, backgroundColor: this.props.primaryColor
        }}
        >
          <FlatList
            data={topRowItems}
            contentContainerStyle={styles.horizontalSpacing}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => this.onPressGridItem(item)}>
                <View style={[styles.cardTopList, { backgroundColor: this.props.secondaryColor }]} activeOpacity={0.5}>
                  {
                    item.icon
                      ? <SimpleLineIcon name={item.icon} color="white" size={20} />
                      : (
                        <SvgXml
                          width="45%"
                          height="45%"
                          xml={item.svg}
                        />
                      )
                  }

                </View>
                <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.titleTopList, { color: item.textColor }]}>{item.title}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(index) => index}
            horizontal
          />
        </View>

        <View style={styles.panelContainer}>
          <Text style={styles.textHeading}>
            Attendance
          </Text>

          <View style={{
            flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginTop: 10, flexGrow: 1
          }}
          >

            <TouchableOpacity style={styles.container}>
              <View style={[styles.card, { borderColor: this.props.primaryColor }]} onPress={() => this.onPressGridItem} activeOpacity={0.5}>
                <AntIcon name="staro" size={25} color={this.props.primaryColor} />
              </View>
              <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>Marking</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.container} onPress={() => this.props.navigation.navigate('MyCalender')}>
              <View style={[styles.card, { color: this.props.primaryColor }]} activeOpacity={0.5}>
                <FeatherIcon name="check-square" size={25} color={this.props.primaryColor} />
              </View>
              <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>Regularization</Text>

            </TouchableOpacity>

            <TouchableOpacity style={styles.container} onPress={() => this.props.navigation.navigate('AttendanceHistory')}>
              <View style={[styles.card, { color: this.props.primaryColor }]} activeOpacity={0.5}>
                <FontAwesome name="history" size={25} color={this.props.primaryColor} />
              </View>
              <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{`Attendance\nHistory`}</Text>

            </TouchableOpacity>

            <TouchableOpacity style={styles.container}>
              <View style={[styles.card, { color: this.props.primaryColor }]} onPress={() => this.onPressGridItem} activeOpacity={0.5}>
                {/* <FeatherIcon name="chevron-right" size={30} color={this.props.primaryColor} /> */}
                <AntIcon name="staro" size={25} color={this.props.primaryColor} />
              </View>
              <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>Empty Menu</Text>

            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.panelContainer}>
          <Text style={styles.textHeading}>
            Expense Claim
          </Text>

          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', marginTop: 10
          }}
          >
            <TouchableOpacity style={styles.cardExpenseItem} onPress={() => this.props.navigation.navigate('SandryList')}>
              <View style={[styles.iconExspense, { backgroundColor: this.props.secondaryColor }]}>
                <SvgXml
                  width="40%"
                  height="40%"
                  xml={ic_sundry}
                />
              </View>
              <Text style={{ marginLeft: 10, fontSize: 12 }}>{`Sundry\nExpense`}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardExpenseItem} onPress={() => this.props.navigation.navigate('SandryHistory')}>
              <View style={[styles.iconExspense, { backgroundColor: this.props.secondaryColor }]}>
                <SvgXml
                  width="40%"
                  height="40%"
                  xml={ic_sundry_history}
                />
              </View>
              <Text style={{ marginLeft: 10, fontSize: 12 }}>{`Sundry \nExpense\nHistory`}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={styles.panelContainer}>
            <Text style={styles.textHeading}>Rules And Policies</Text>

            <View style={{
              flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, flexGrow: 1
            }}
            >
              <RulesItem
                title="Leave Rules"
                svg={ic_leave_rules}
                icon="note"
                onPress={() => this.onPressGridItem('Leave Rules')}
              />
              <RulesItem
                title="Travel Rules"
                svg={ic_travel_rules}
                onPress={() => this.onPressGridItem('Travel Rules')}
                icon="plane"
              />
              <RulesItem
                title="IT Policy"
                svg={ic_it_policy}
                onPress={() => this.onPressGridItem('IT Policy')}
                icon="screen-desktop"
              />
              <RulesItem
                title="HR Policy"
                svg={ic_hr_policy}
                onPress={() => this.onPressGridItem('HR Policy')}
                icon="user"
              />
            </View>
          </View>

          {
  this.props.dashBoardData && (
    <ScrollView
      horizontal
      nestedScrollEnabled
      snapToAlignment="start"
      snapToInterval={250}
      contentContainerStyle={styles.scrollViewBirthday}
      showsHorizontalScrollIndicator={false}
    >

      {
        this.props.dashBoardData.BirthdayList[0].length !== 0 && (
          <Card style={[styles.cardBirthday, { backgroundColor: '#46CCB9' }]}>
            <Text style={styles.textHappyBirthday}>Happy Birthday!</Text>

            <View style={styles.containerBirthday}>
              <Image
                style={styles.icBirthday}
                source={require('../assets/images/birthday.png')}
              />
              <View style={{
                flexDirection: 'column', margin: 8, flex: 1, marginLeft: 12
              }}
              >
                <FlatList
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  snapToAlignment=""
                  data={this.props.dashBoardData.BirthdayList[0]}
                  renderItem={({ item }) => <Text style={styles.textHappyBirthday2} ellipsizeMode="tail" numberOfLines={1}>{item.EmpName}</Text>}
                  keyExtractor={item => item.EmpName}
                />

              </View>

            </View>
          </Card>
        )
      }

      <Card style={[styles.cardBirthday, { backgroundColor: '#DB8D8F' }]}>
        <View style={styles.containerJoinee}>
          <SimpleLineIcon name="people" color="white" size={20} />
          <Text style={[styles.textHappyBirthday2, { marginLeft: 5 }]} ellipsizeMode="tail" numberOfLines={1}>{`Head Count: ${this.props.dashBoardData.HeadCount[0][0].HeadCount}`}</Text>
        </View>

        <View style={styles.containerJoinee}>
          <SimpleLineIcon name="user-follow" color="white" size={20} />
          <Text style={[styles.textHappyBirthday2, { marginLeft: 5 }]} ellipsizeMode="tail" numberOfLines={1}>{`New Joinees: ${this.props.dashBoardData.NewJoinee[0][0].NewJoinee}`}</Text>
        </View>

        <View style={styles.containerJoinee}>
          <SimpleLineIcon name="user-unfollow" color="white" size={20} />
          <Text style={[styles.textHappyBirthday2, { marginLeft: 5 }]} ellipsizeMode="tail" numberOfLines={1}>{`Exit Employees: ${this.props.dashBoardData.ExitEmployee[0][0].ExitEmployee}`}</Text>
        </View>

        <View style={styles.containerJoinee}>
          <SimpleLineIcon name="basket" color="white" size={20} />
          <Text style={[styles.textHappyBirthday2, { marginLeft: 5 }]} ellipsizeMode="tail" numberOfLines={1}>{`Vacant Positions: ${this.props.dashBoardData.vacantPosition[0][0].vacantPosition}`}</Text>
        </View>
      </Card>
      {/* <Card style={[styles.cardBirthday, { backgroundColor: '#8f90e5' }]}>
      <Text>aaaaaaa</Text>
    </Card> */}
    </ScrollView>
  )
}
          <Card elevation={2} style={{ margin: 16, borderRadius: 12 }}>
            <Card.Content>
              <Text style={styles.textHeading}>Quick Links</Text>
              <Divider />
              <TouchableOpacity onPress={() => this.props.navigation.navigate('QuickLinks', { uri: 'http://itm.orgtix.com', title: 'Career Pathways' })}>
                <Text style={styles.textLink}>Career Pathways</Text>
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity onPress={() => this.props.navigation.navigate('QuickLinks', { uri: 'http://itm.orgtix.com', title: 'Succession Planning' })}>
                <Text style={styles.textLink}>Succession Planning</Text>
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity onPress={() => this.props.navigation.navigate('QuickLinks', { uri: 'http://itm.orgtix.com', title: 'Competency Management' })}>
                <Text style={styles.textLink}>Competency Management</Text>
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity onPress={() => this.props.navigation.navigate('QuickLinks', { uri: 'http://itm.orgtix.com', title: 'Performance Management' })}>
                <Text style={styles.textLink}>Performance Management</Text>
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity onPress={() => this.props.navigation.navigate('QuickLinks', { uri: 'http://uae.orgtix.com/', title: 'Talent Program Management' })}>
                <Text style={styles.textLink}>Talent Program Management</Text>
              </TouchableOpacity>
            </Card.Content>

          </Card>
        </View>
      </ScrollView>
    );
  }
}
const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  isPunchOut: state.user.isPunchOut,
  isPunched: state.user.isPunched,
  skip: state.user.skip,
  punchInTime: state.user.punchInTime,
  punchOutTime: state.user.punchOutTime,
  serverTime: state.user.serverTime,
  user: state.user.user,
  dashBoardData: state.user.dashBoardData,
  rulesLinks: state.user.rulesLinks,
});

const mapDispatchToProps = dispatch => ({
  setPrimary: color => {
    dispatch(setPrimaryColor(color));
  },
  setSecondary: color => {
    dispatch(setSecondaryColor(color));
  },
  setSkip: skip => {
    dispatch(setSkip(skip));
  },
  setPunchOut: isPunchOut => {
    dispatch(setPunchOut(isPunchOut));
  },
  setNotifications: notifications => {
    dispatch(setNotifications(notifications));
  },
  setDashboardData: dashBoardData => {
    dispatch(setDashboardData(dashBoardData));
  },
  setUnreadNotifications: count => {
    dispatch(setUnreadNotifications(count));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreen);
