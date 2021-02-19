/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {
  Text, View, ScrollView, StyleSheet, Alert, FlatList, ActivityIndicator,
} from 'react-native';
import { Card } from 'react-native-paper';
import { connect } from 'react-redux';
import Moment from 'moment';
import GestureRecognizer from 'react-native-swipe-gestures';
import { ProgressCircle } from 'react-native-svg-charts';
import Colors from '../config/Colors';
import Calender from '../components/Calender';
import Modal from '../components/CalenderModal';
import { pulloutLeave } from '../services/LeavePulloutService';
import { getAttendenceAnalytics } from '../services/AttendanceAnalytics';
import { cancelPullOutAtt } from '../services/AttCancelPullOutService';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';

const styles = StyleSheet.create({
  container: {

  },
  linearGradient: {
    // flex: 1,
    borderRadius: 12,
    height: 26,
    width: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerCalender: {
    backgroundColor: 'white'
  },
  containerType: {
    flexDirection: 'row',
  },
  gradientType: {
    flex: 1,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  card: {
    margin: 5,
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 15
  },
  textCardTitle: {
    // color: Colors.accentBlue,
    fontSize: 20,
    marginBottom: 10,
  },
  textItemHoliday: {
    fontSize: 16,
  },
  textItemHolidayFirst: {
    fontSize: 22,
    marginRight: 10,
  },
  containerListItem: {
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
    flexDirection: 'row'
  }
});


class MyCalenderScreen extends Component {
  state={
    isModalVisible: false,
    selectedItem: {},
    holidays: [],
    loading: true,
    leave: 0.0,
    present: 0.0,
    absent: 0.0,
    holiday: 0.0,
    weeklyOff: 0.0,
    missingPunchs: 0.0,
    leaveDays: 0,
    presentDays: 0,
    absentDays: 0,
    holidayDays: 0,
    weeklyOffDays: 0,
    missingPunchsDays: 0,
    isMessageModalVisible: false,
    modalMessage: '',
    modalType: '',
    reqesting: false
  };

  constructor(props) {
    super(props);
    this.calenderRef = React.createRef();
    this.isHolidaysUpdated = false;
  }

  async componentDidMount() {
    try {
      const response = await getAttendenceAnalytics(this.props.user);
      if (response) {
        this.setState({ holidays: response.UpcomingLeaveHoliday[0], loading: false });
      }
    // eslint-disable-next-line no-empty
    } catch (error) {
    }
  }

  pulloutLeave =async (item) => {
    Alert.alert(
      'Leave Pullout',
      'Are you sure you want to proceed?',
      [
        {
          text: 'NO',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
            this.setState({ reqesting: true });
            const response = await pulloutLeave(item.UwlId, item.LeaveCode, this.props.user);
            this.setState({ reqesting: false });
            if (response.SuccessList) {
              const msg = getMessage(response.SuccessList.toString(), this.props.messages);
              if (msg) {
                this.setState({
                  isMessageModalVisible: true,
                  modalMessage: msg.message,
                  modalType: msg.type
                });
              } else if (response.SuccessList) {
                Alert.alert('', response.SuccessList.toString());
              } else {
                Alert.alert('Success', 'Successfully pulled out leave');
              }
              this.calenderRef.refreshCalender();
            } else if (response.ErrorList) {
              const msg = getMessage(response.ErrorList.toString(), this.props.messages);
              if (msg) {
                this.setState({
                  isMessageModalVisible: true,
                  modalMessage: msg.message,
                  modalType: msg.type
                });
              } else if (response.ErrorList) {
                Alert.alert('Error', response.ErrorList.toString());
              } else {
                Alert.alert('Error', 'Failed to pull out');
              }
            }
          }
        },
      ],
      { cancelable: false },
    );
  }

  pulloutAttendance=async (item) => {
    Alert.alert(
      'Attendance pullout',
      'Are you sure you want to proceed?',
      [
        {
          text: 'NO',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
            this.setState({ reqesting: true });
            const date = this.item ? `${this.item.Date.substring(0, 4)}-${this.item.Date.substring(4, 6)}-${this.item.Date.substring(6, 8)}` : '';
            const response = await cancelPullOutAtt(this.props.user, item.UwlId, date);
            this.setState({ reqesting: false });
            if (response.SuccessList) {
              const msg = getMessage(response.SuccessList.toString(), this.props.messages);
              if (msg) {
                this.setState({
                  isMessageModalVisible: true,
                  modalMessage: msg.message,
                  modalType: msg.type,
                });
              } else if (response.SuccessList) {
                Alert.alert('', response.SuccessList.toString());
              } else {
                Alert.alert('Success', 'Successfully pulled out Attendance');
              }
              this.calenderRef.refreshCalender();
            } else if (response.ErrorList) {
              const msg = getMessage(response.ErrorList.toString(), this.props.messages);
              if (msg) {
                this.setState({
                  isMessageModalVisible: true,
                  modalMessage: msg.message,
                  modalType: msg.type
                });
              } else if (response.ErrorList) {
                Alert.alert('Error', response.ErrorList.toString());
              } else {
                Alert.alert('Error', 'Failed to pull out');
              }
            }
          }
        },
      ],
      { cancelable: false },
    );
  }

  onMoalOptionSelected = (text, item) => {
    this.setState({ isModalVisible: false });
    setTimeout(() => {
      if (text === 'Cancel Leave') {
        this.props.navigation.navigate('CancelLeave', { item, shouldRefresh: this.shouldCalenerRefresh });
      } else if (text === 'Attendance Regularization') {
        this.props.navigation.navigate('AttendenceRegularization', { item, shouldRefresh: this.shouldCalenerRefresh });
      } else if (text === 'Leave Application') {
        this.props.navigation.navigate('LeaveApplication', { item, shouldRefresh: this.shouldCalenerRefresh });
      } else if (text === 'Cancel Attendance') {
        this.props.navigation.navigate('CancelAttendance', { item, shouldRefresh: this.shouldCalenerRefresh });
      } else if (text === 'PullOut Attendance') {
        this.pulloutAttendance(item);
      } else if (text === 'PullOut Leave') {
        this.pulloutLeave(item);
      }
    }, 1000);
  }

  shouldCalenerRefresh =async (refresh) => {
    if (refresh && refresh.refresh) {
      this.calenderRef.refreshCalender();
      const response = await getAttendenceAnalytics(this.props.user);
      if (response) {
        this.setState({ holidays: response.UpcomingLeaveHoliday[0], loading: false });
      }
    }
  }

  onSwipeLeft = (gestureState) => {
    this.calenderRef.changeMonth(+1);
  }

  onSwipeRight = (gestureState) => {
    this.calenderRef.changeMonth(-1);
  }

  onSwipeDown = () => {
    this.calenderRef.refreshCalender();
  }

  onData = data => {
    const totalDays = data.length;
    let leaves = 0;
    let present = 0;
    let absent = 0;
    let holiday = 0;
    let weeklyOff = 0;
    let missingPunchs = 0;
    if (totalDays) {
    // eslint-disable-next-line no-plusplus
      for (let i = 0; i < data.length; i++) {
        if (data[i].Leave === 'YES') {
          leaves += 1;
        } else if (data[i].AttStatus === 'Absent') {
          absent += 1;
        } else if (data[i].AttStatus === 'Offsite' || data[i].AttStatus === 'Work From Home' || data[i].AttStatus === 'Outstation Business Tour') {
          present += 1;
        } else if (data[i].AttStatus === 'Holiday') {
          holiday += 1;
        } else if (data[i].AttStatus === 'Weekly Off') {
          weeklyOff += 1;
        } else if (data[i].AttStatus === 'MissingPunches') {
          missingPunchs += 1;
        }
      }

      this.setState({
        leaveDays: leaves,
        presentDays: present,
        absentDays: absent,
        holidayDays: holiday,
        weeklyOffDays: weeklyOff,
        missingPunchsDays: missingPunchs
      }, () => {
        leaves = (100 * leaves) / (totalDays);
        present = (100 * present) / (totalDays);
        absent = (100 * absent) / (totalDays);
        holiday = (100 * holiday) / (totalDays);
        weeklyOff = (100 * weeklyOff) / (totalDays);
        missingPunchs = (100 * missingPunchs) / (totalDays);

        this.setState({
          leave: leaves.toFixed(2),
          present: present.toFixed(2),
          absent: absent.toFixed(2),
          holiday: holiday.toFixed(2),
          weeklyOff: weeklyOff.toFixed(2),
          missingPunchs: missingPunchs.toFixed(2)
        });
      });
    }
  }

  updateHolidays = data => {
  }

  onModalHide = () => {
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (

      this.state.loading
        ? (
          <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={this.props.secondaryColor} />
          </View>
        )
        : (
          <ScrollView contentContainerStyle={{ backgroundColor: this.props.primaryColor }} showsVerticalScrollIndicator={false}>

            <Modal
              isVisible={this.state.isModalVisible}
              item={this.state.selectedItem.item}
              navigation={this.props.navigation}
              hideModal={() => this.setState({ isModalVisible: false })}
              onOptionSelected={(action, item) => this.onMoalOptionSelected(action, item)}
            />

            <MessageModal
              isVisible={this.state.isMessageModalVisible}
              message={this.state.modalMessage}
              type={this.state.modalType}
              hideModal={() => this.setState({ isMessageModalVisible: false })}
              onModalHide={() => this.onModalHide()}
            />

            <GestureRecognizer
              onSwipeLeft={this.onSwipeLeft}
              onSwipeRight={this.onSwipeRight}
              onSwipeDown={this.onSwipeDown}
              config={config}
              style={styles.containerCalender}
            >
              <Calender
                ref={component => {
                  this.calenderRef = component;
                }}
                onPressDay={item => this.setState({ selectedItem: item, isModalVisible: true })}
                onData={data => this.onData(data)}
              />
            </GestureRecognizer>
            {
              this.state.reqesting
                ? (
                  <View style={{
                    height: 350,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    width: '100%'
                  }}
                  >
                    <ActivityIndicator size="large" color={this.props.secondaryColor} />
                  </View>
                )
                : null
            }


            <View style={{ flexDirection: 'row', backgroundColor: 'white', paddingTop: 5 }}>
              <View
                style={[styles.gradientType, { backgroundColor: this.props.presentColor }]}
              >
                <Text style={{ padding: 5, color: 'white', fontSize: 14 }}>PRESENT</Text>
              </View>
              <View
                style={[styles.gradientType, { backgroundColor: this.props.leaveColor }]}
              >
                <Text style={{ padding: 5, color: 'white', fontSize: 14 }}>LEAVE</Text>
              </View>
              <View
                style={[styles.gradientType, { backgroundColor: this.props.absentColor }]}
              >
                <Text style={{ padding: 5, color: 'white', fontSize: 14 }}>ABSENT</Text>
              </View>
            </View>

            <View style={{
              flexDirection: 'row', backgroundColor: 'white', marginBottom: 10, paddingBottom: 20
            }}
            >
              <View
                style={[styles.gradientType, { backgroundColor: this.props.holidayColor }]}
              >
                <Text style={{ padding: 5, color: 'white', fontSize: 14 }}>HOLIDAY</Text>
              </View>
              <View
                style={[styles.gradientType, { backgroundColor: this.props.weeklyOffColor }]}
              >
                <Text style={{ padding: 5, color: 'white', fontSize: 14 }}>WEEKLY OFF</Text>
              </View>
              <View
                style={[styles.gradientType, { backgroundColor: this.props.missingPunchColor }]}
              >
                <Text style={{ padding: 5, color: 'white', fontSize: 14 }}>MISSING</Text>
              </View>
            </View>

            <Card style={[styles.card, { height: 250 }]}>
              <Card.Content>
                <Text style={styles.textCardTitle}>Attendance Of The Month</Text>


                <View style={{ flexDirection: 'row', marginTop: 20, }}>

                  <View style={{ flex: 1, }}>

                    <View style={{ flexDirection: 'row', }}>

                      <View>

                        <Text>{`Leave: ${this.state.leaveDays}`}</Text>
                        <Text>{`Present: ${this.state.presentDays}`}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 3 }}>

                      <View>

                        <Text>{`Absent: ${this.state.absentDays}`}</Text>
                        <Text>{`Holiday: ${this.state.holidayDays}`}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 3 }}>

                      <View>

                        <Text>{`Weekly off: ${this.state.weeklyOffDays}`}</Text>
                        <Text>{`Missing punches: ${this.state.missingPunchsDays}`}</Text>
                      </View>
                    </View>
                  </View>


                  <View style={{
                    justifyContent: 'center', alignItems: 'center', width: 200, marginTop: 40, marginBottom: 20
                  }}
                  >
                    <View style={{
                      position: 'absolute', height: 180, width: 180,
                    }}
                    >
                      <ProgressCircle strokeWidth={5} style={{ height: 180 }} progress={this.state.leave / 100} progressColor={this.props.leaveColor} />

                    </View>

                    <View style={{
                      position: 'absolute', height: 150, width: 150,
                    }}
                    >
                      <ProgressCircle strokeWidth={5} style={{ height: 150 }} progress={this.state.present / 100} progressColor={this.props.presentColor} />

                    </View>

                    <View style={{
                      position: 'absolute', height: 120, width: 120,
                    }}
                    >
                      <ProgressCircle strokeWidth={5} style={{ height: 120 }} progress={this.state.absent / 100} progressColor={this.props.absentColor} />

                    </View>


                    <View style={{
                      position: 'absolute', height: 90, width: 90,
                    }}
                    >
                      <ProgressCircle strokeWidth={5} style={{ height: 90 }} progress={this.state.holiday / 100} progressColor={this.props.holidayColor} />

                    </View>

                    <View style={{
                      position: 'absolute', height: 60, width: 60,
                    }}
                    >
                      <ProgressCircle strokeWidth={5} style={{ height: 60 }} progress={this.state.weeklyOff / 100} progressColor={this.props.weeklyOffColor} />

                    </View>

                    <View style={{
                      position: 'absolute', height: 30, width: 30,
                    }}
                    >
                      <ProgressCircle strokeWidth={5} style={{ height: 30 }} progress={this.state.missingPunchs / 100} progressColor={this.props.missingPunchColor} />

                    </View>
                  </View>
                </View>

              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.textCardTitle}>Upcoming Holidays And Leaves</Text>

                <FlatList
                  data={this.state.holidays}
                  keyExtractor={item => item.Id}
                  renderItem={({ item }) => (
                    <View style={styles.containerListItem}>
                      <Text style={styles.textItemHolidayFirst}>{item.LeaveType ? item.LeaveType.substring(0, 1) : item.HolidayName.substring(0, 1)}</Text>
                      <Text style={styles.textItemHoliday}>{`${Moment(item.DATE).format('D MMM')}, `}</Text>
                      <Text style={styles.textItemHoliday}>{item.LeaveType ? item.LeaveType.substring(3, item.LeaveType.length) : item.HolidayName.substring(3, item.HolidayName.length)}</Text>
                    </View>
                  )}
                />

              </Card.Content>
            </Card>

          </ScrollView>
        )
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  presentColor: state.theme.presentColor,
  absentColor: state.theme.absentColor,
  holidayColor: state.theme.holidayColor,
  weeklyOffColor: state.theme.weeklyOffColor,
  leaveColor: state.theme.leaveColor,
  missingPunchColor: state.theme.missingPunchColor,
  user: state.user.user,
  messages: state.messageData.messages,
});

export default connect(
  mapStateToProps,
)(MyCalenderScreen);
