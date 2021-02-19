/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, ActivityIndicator, Alert
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, Button, Card } from 'react-native-paper';
import { getDynamicFieldsData } from '../services/GetDynamicFieldsData';
import { submitApprovalRejection } from '../services/SubmitApprovalRejection';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';

const constantPadding = 10;
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F9F9F9'
  },
  contentContainer: {
    alignItems: 'stretch',
    paddingLeft: constantPadding,
    paddingRight: constantPadding,
    paddingBottom: constantPadding,
    flexGrow: 1
  },
  mainContainer: {
    flexDirection: 'column',
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  valueHolder: {
    color: 'gray',
    fontSize: 14
  },
  itemContainer: {
    flexDirection: 'column',
    width: '45%',
  },
  labels: {
    fontSize: 14,
    color: '#F2721C',
    includeFontPadding: true,
  },
  cards: {
    elevation: 3,
    borderRadius: 5,
    marginTop: 15,
  },
  button: {
    width: '48%',
    height: 45,
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 20
  },
  buttonLabels: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center'
  },

  twoCards: {
    width: '48%',
    borderRadius: 5,
    elevation: 3,
    marginTop: 15
  },
  cardMenuSpasing: {
    flexDirection: 'column', paddingTop: 10, paddingBottom: 10, paddingStart: 3
  },
  cardContainer: {
    backgroundColor: 'white', height: 20, fontSize: 16, paddingStart: 12, color: 'gray'
  },
  cardLabel: {
    fontSize: 14,
    // color: '#F2721C',
    paddingStart: 12,
  },
  buttonContent: { height: 45 },
  inputBackground: { backgroundColor: 'white', marginEnd: 10, fontSize: 16 },
  requiredMsg: { color: 'red', textAlign: 'right', marginEnd: 5 },
  longText: {
    color: 'gray', fontSize: 16, paddingStart: 12, paddingEnd: 12
  },
  flexColumn: { flexDirection: 'column' }
});

class AttCancelApprovalRejectScreen extends Component {
  constructor(props) {
    super(props);
    this.item = this.props.navigation.getParam('item');
    this.state = {
      empName: this.item.NAME,
      regularizationType: '',
      fromDate: '',
      toDate: '',
      startTime: '',
      endTime: '',
      punchInTime: '',
      punchOutTime: '',
      noOfDays: '',
      reasonOfCancellation: '',
      remark: '',
      loading: true,
      loadingApprove: false,
      loadingReject: false,
      isModalVisible: false,
      modalMessage: '',
      modalType: '',
    };
  }

  async componentDidMount() {
    const response = await getDynamicFieldsData('5',
      this.item.ProcessIDFromTable,
      'ESS_Inbox_AttendanceCancel$[2002AttendanceData]',
      this.props.user);
    const data = response.controlDataValues[0];
    if (response) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].fieldDB === 'StartDate') {
          this.setState({ fromDate: data[i].fieldValue });
        } else if (data[i].fieldDB === 'EndDate') {
          this.setState({ toDate: data[i].fieldValue });
        } else if (data[i].fieldDB === 'AbsenceDays') {
          this.setState({ noOfDays: data[i].fieldValue });
        } else if (data[i].fieldDB === 'CancelReason') {
          this.setState({ reasonOfCancellation: data[i].fieldValue });
        } else if (data[i].fieldDB === 'PunchInTime') {
          this.setState({ punchInTime: data[i].fieldValue.substring(0, 5) });
        } else if (data[i].fieldDB === 'PunchOutTime') {
          this.setState({ punchOutTime: data[i].fieldValue.substring(0, 5) });
        } else if (data[i].fieldDB === 'StartTime') {
          this.setState({ startTime: data[i].fieldValue.substring(0, 5) });
        } else if (data[i].fieldDB === 'EndTime') {
          this.setState({ endTime: data[i].fieldValue.substring(0, 5) });
        } else if (data[i].fieldDB === 'AttendanceCode') {
          this.setState({ regularizationType: data[i].fieldValue });
        }
      }
      this.setState({ loading: false });
    }
  }

  onPressApprove=async () => {
    if (!this.state.loadingApprove) {
      this.setState({ loadingApprove: true });
      try {
        const response = await submitApprovalRejection(
          this.props.user,
          this.item.UWLID,
          this.item.ProcessId,
          this.item.ProcessIDFromTable,
          this.item.EmployeeId,
          this.item.Process,
          this.state.remark,
          'Approved'
        );
        console.log(response);
        if (response.SuccessList) {
          this.setState({ loadingApprove: false });
          const msg = getMessage(response.SuccessList.toString(), this.props.messages);
          if (msg) {
            this.setState({
              isModalVisible: true,
              modalMessage: msg.message,
              modalType: msg.type,
              loadingApprove: false
            });
          } else if (response.SuccessList) {
            Alert.alert('', response.SuccessList.toString());
          } else {
            Alert.alert('', 'Approved successfully.');
          }
        } else if (response.ErrorList) {
          this.setState({ loadingApprove: false });
          const msg = getMessage(response.ErrorList.toString(), this.props.messages);
          if (msg) {
            this.setState({
              isModalVisible: true,
              modalMessage: msg.message,
              modalType: msg.type
            });
          } else if (response.ErrorList) {
            Alert.alert('Error', response.ErrorList.toString());
          } else {
            Alert.alert('', 'Failed to Approved. Please try again...');
          }
        } else if (response.ExceptionList) {
          this.setState({ loadingApprove: false });
          const msg = getMessage(response.ExceptionList.toString(), this.props.messages);
          if (msg) {
            this.setState({
              isModalVisible: true,
              modalMessage: msg.message,
              modalType: msg.type
            });
          } else if (response.ExceptionList) {
            Alert.alert('Error', response.ExceptionList.toString());
          } else {
            Alert.alert('', 'Failed to reject. Please try again...');
          }
        }
      } catch (error) {
        console.log(error);
        Alert.alert('', 'Failed to Approved. Please try again...');
        this.setState({ loadingApprove: false });
      }
    }
  }

  onPressReject=async () => {
    if (this.state.remark && this.state.remark.length > 0) {
      if (!this.state.loadingReject) {
        this.setState({ loadingReject: true });
        try {
          const response = await submitApprovalRejection(
            this.props.user,
            this.item.UWLID,
            this.item.ProcessId,
            this.item.ProcessIDFromTable,
            this.item.EmployeeId,
            this.item.Process,
            this.state.remark,
            'Rejected'
          );
          console.log(response);
          if (response.SuccessList) {
            this.setState({ loadingReject: false });
            const msg = getMessage(response.SuccessList.toString(), this.props.messages);
            if (msg) {
              this.setState({
                isModalVisible: true,
                modalMessage: msg.message,
                modalType: msg.type
              });
            } else if (response.SuccessList) {
              Alert.alert('', response.SuccessList.toString());
            } else {
              Alert.alert('', 'Rejected successfully.');
            }
          } else if (response.ErrorList) {
            this.setState({ loadingReject: false });
            const msg = getMessage(response.ErrorList.toString(), this.props.messages);
            if (msg) {
              this.setState({
                isModalVisible: true,
                modalMessage: msg.message,
                modalType: msg.type
              });
            } else if (response.ErrorList) {
              Alert.alert('Error', response.ErrorList.toString());
            } else {
              Alert.alert('', 'Failed to reject. Please try again...');
            }
          } else if (response.ExceptionList) {
            this.setState({ loadingReject: false });
            const msg = getMessage(response.ExceptionList.toString(), this.props.messages);
            if (msg) {
              this.setState({
                isModalVisible: true,
                modalMessage: msg.message,
                modalType: msg.type
              });
            } else if (response.ExceptionList) {
              Alert.alert('Error', response.ExceptionList.toString());
            } else {
              Alert.alert('', 'Failed to reject. Please try again...');
            }
          }
        } catch (error) {
          console.log(error);
          Alert.alert('', 'Failed to reject. Please try again...');
          this.setState({ loadingReject: false });
        }
      }
    } else {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Please enter remark',
        modalType: 'E'
      });
    }
  }

  onModalHide = () => {
    if (this.state.modalType === 'S') {
      this.props.navigation.goBack();
      this.props.navigation.state.params.shouldRefresh({ refresh: true }, this.props.navigation.getParam('index'));
    }
  }

  tConv24 = (time24) => {
    if (time24) {
      let ts = time24;
      const H = +ts.substr(0, 2);
      let h = (H % 12) || 12;
      h = (h < 10) ? (`0${h}`) : h;
      const ampm = H < 12 ? ' AM' : ' PM';
      ts = h + ts.substr(2, 3) + ampm;
      return ts;
    }
    return '00:00';
  };

  render() {
    const {secondaryColor}=this.props;
    if (this.state.loading) {
      return (
        <View style={{ height: '100%', width: '100%', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={this.props.secondaryColor} />
        </View>
      );
    }
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.mainContainer}>

          <MessageModal
            isVisible={this.state.isModalVisible}
            message={this.state.modalMessage}
            type={this.state.modalType}
            hideModal={() => this.setState({ isModalVisible: false })}
            onModalHide={() => this.onModalHide()}
          />

          {/* Name */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel,{color:secondaryColor}]}>
                  Employee Name
              </Text>
              <Text style={styles.cardContainer}>{this.state.empName}</Text>
            </View>
          </Card>

          {/* Type */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel,{color:secondaryColor}]}>
                      Regularization Type
              </Text>
              <Text style={styles.cardContainer}>{this.state.regularizationType}</Text>
            </View>
          </Card>

          <View style={styles.horizontalContainer}>
            <Card style={styles.twoCards}>
              <View style={styles.cardMenuSpasing}>
                <Text style={[styles.cardLabel,{color:secondaryColor}]}>
                      From Date
                </Text>
                <Text style={styles.cardContainer}>{this.state.fromDate}</Text>
              </View>
            </Card>

            {/* To Date */}
            <Card style={styles.twoCards}>
              <View style={styles.cardMenuSpasing}>
                <Text style={[styles.cardLabel,{color:secondaryColor}]}>
                      To Date
                </Text>
                <Text style={styles.cardContainer}>{this.state.toDate}</Text>
              </View>
            </Card>
          </View>
          
         {/* Punch In Time */}
          <View style={styles.horizontalContainer}>
            <Card style={styles.twoCards}>
              <View style={styles.cardMenuSpasing}>
                <Text style={[styles.cardLabel,{color:secondaryColor}]}>
                    Punch In Time
                </Text>
                <Text style={styles.cardContainer}>{this.state.punchInTime ? this.tConv24(this.state.punchInTime) : '00:00'}</Text>
              </View>
            </Card>

            {/* Punch Out Time */}
            <Card style={styles.twoCards}>
              <View style={styles.cardMenuSpasing}>
                <Text style={[styles.cardLabel,{color:secondaryColor}]}>
                    Punch Out Time
                </Text>
                <Text style={styles.cardContainer}>{this.state.punchOutTime ? this.tConv24(this.state.punchOutTime) : '00:00'}</Text>
              </View>
            </Card>
          </View>

          {/* Start Time */}
          <View style={styles.horizontalContainer}>
            <Card style={styles.twoCards}>
              <View style={styles.cardMenuSpasing}>
                <Text style={[styles.cardLabel,{color:secondaryColor}]}>
                    Start Time
                </Text>
                <Text style={styles.cardContainer}>{this.state.startTime ? this.tConv24(this.state.startTime) : '00:00'}</Text>
              </View>
            </Card>

            {/* End Time */}
            <Card style={styles.twoCards}>
              <View style={styles.cardMenuSpasing}>
                <Text style={[styles.cardLabel,{color:secondaryColor}]}>
                    End Time
                </Text>
                <Text style={styles.cardContainer}>{this.state.endTime ? this.tConv24(this.state.endTime) : '00:00'}</Text>
              </View>
            </Card>
          </View>

          {/* No.of days */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel,{color:secondaryColor}]}>Number of Days</Text>
              <Text style={styles.cardContainer}>{this.state.noOfDays}</Text>
            </View>
          </Card>

          {/* Reason of Cancellation  */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel,{color:secondaryColor}]}>Reason of Cancellation</Text>
              <Text multiline style={styles.longText}>{this.state.reasonOfCancellation}</Text>
            </View>
          </Card>

          {/* Remark */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel,{color:secondaryColor}]}>Remark</Text>
              <TextInput
                mode="flat"
                underlineColor="transparent"
                multiline
                textAlignVertical="top"
                placeholder="Enter Remark"
                underlineColorAndroid="transparent"
                editable
                dense
                maxLength={250}
                selectionColor={this.props.secondaryColor}
                numberOfLines={5}
                value={this.state.remark}
                onChangeText={(text) => this.setState({ remark: text })}
                style={styles.inputBackground}
              />
            </View>
          </Card>

          {/* Submit/Discard */}
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 20
          }}
          >
            <Button
              contentStyle={styles.buttonContent}
              style={styles.button}
              labelStyle={styles.buttonLabels}
              mode="contained"
              uppercase
              color={this.props.primaryColor}
              loading={this.state.loadingApprove}
              disabled={this.state.loadingApprove || this.state.loadingReject}
              onPress={this.onPressApprove}
            >
              Approve
            </Button>
            <Button
              contentStyle={styles.buttonContent}
              style={styles.button}
              labelStyle={styles.buttonLabels}
              mode="contained"
              uppercase
              color={this.props.secondaryColor}
              loading={this.state.loadingReject}
              disabled={this.state.loadingReject || this.state.loadingApprove}
              onPress={this.onPressReject}
            >
                Reject
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn,
  messages: state.messageData.messages,
});


export default connect(
  mapStateToProps,
)(AttCancelApprovalRejectScreen);
