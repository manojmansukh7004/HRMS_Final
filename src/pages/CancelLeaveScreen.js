/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import {
  StyleSheet, Text, Alert, View, ScrollView, ActivityIndicator
} from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { connect } from 'react-redux';
import Moment from 'moment';
import { getDynamicFieldsValues } from '../services/GetDynamicFieldsValues';
import { cancelLeave } from '../services/LeaveCancel';
import { getDynamicFieldsData } from '../services/GetDynamicFieldsData';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#F9F9F9',
    flexGrow: 1
  },
  textInput: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white'
  },
  button: {
    height: 45,
    borderRadius: 12,
    width: '48%'
  },
  containerHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cards: {
    elevation: 3,
    borderRadius: 5,
    marginTop: 15
  },
  twoCards: {
    width: '48%',
    borderRadius: 5,
    elevation: 3,
    marginTop: 15
  },
  cardMenuSpasing: {
    flexDirection: 'column', paddingTop: 10, paddingBottom: 10, paddingStart: 5
  },
  cardContainer: { paddingStart: 9, fontSize: 16, color: 'gray' },
  cardLabel: {
    fontSize: 14,
    // color: '#F2721C',
    paddingStart: 9,
  },
  reasonLabel: { paddingStart: 12, fontSize: 14 },
  buttonLabel: { color: 'white', fontSize: 14, textAlign: 'center' },
  scrollView: { flex: 1, backgroundColor: '#FFD1B1' },
  horizontalContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  buttonContainer: { marginTop: 10, marginBottom: 20 },
  buttonContent: { height: 45 },
  inputBackground: { backgroundColor: 'white', marginEnd: 10, fontSize: 16 },
  requiredMsg: { color: 'red', textAlign: 'right', marginEnd: 5 },
  longText: {
    color: 'gray', fontSize: 16, paddingStart: 8, paddingEnd: 12
  },
  flexColumn: { flexDirection: 'column' },
  reasonView: { paddingStart: 3, paddingTop: 10, paddingBottom: 10 }
});

class CancelLeaveScreen extends Component {
  constructor(props) {
    super(props);
    this.item = this.props.navigation.getParam('item');
    this.state = {
      loading: true,
      cancelReason: '',
      leaveReason: '',
      errorMsg: '',
      isModalVisible: false,
      leaveType: '',
      fromDate: '',
      toDate: '',
      absenceDays: '',
      modalMessage: '',
      modalType: '',
      reqesting: false,
    };
  }

  async componentDidMount() {
    const { user } = this.props;
    try {
      const res = await getDynamicFieldsValues('4', '549', 'ESS_Leave_Cancellation$[2001AbsenceData]', user);
      const resData = await getDynamicFieldsData('5', this.item.ProcessIdFromTable, 'ESS_Leave_Cancellation$[2001AbsenceData]', this.props.user);
      const leaveCancelData = resData.controlDataValues[0];
      for (let i = 0; i < leaveCancelData.length; i++) {
        if (leaveCancelData[i].fieldDB === 'LeaveCode') {
          this.setState({ leaveType: leaveCancelData[i].fieldValue });
        } else if (leaveCancelData[i].fieldDB === 'StartDate') {
          this.setState({ fromDate: leaveCancelData[i].fieldValue });
        } else if (leaveCancelData[i].fieldDB === 'EndDate') {
          this.setState({ toDate: leaveCancelData[i].fieldValue });
        } else if (leaveCancelData[i].fieldDB === 'AbsenceDays') {
          this.setState({ absenceDays: leaveCancelData[i].fieldValue });
        } else if (leaveCancelData[i].fieldDB === 'Remarks') {
          this.setState({ leaveReason: leaveCancelData[i].fieldValue });
        }
      }
      const data = res.controlDataValues[0];
      for (let i = 0; i < data.length; i++) {
        if (data[i].Value === this.item.LeaveCode) {
          this.setState({
            leaveType: data[i].Text,
          });
        }
      }
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  }


  onModalHide = () => {
    if (this.state.modalType === 'S') {
      this.props.navigation.goBack();
      this.props.navigation.state.params.shouldRefresh({ refresh: true }, this.props.navigation.getParam('index'));
    }
  }

  onPressSubmit =async () => {
    const { cancelReason } = this.state;
    if (cancelReason.length) {
      this.setState({
        errorMsg: '',
        reqesting: true,
      });
      cancelLeave(this.item.UwlId, this.item.leaveType, cancelReason, this.props.user)
        .then(response => {
          console.log(response);
          if (response.SuccessList) {
            const msg = getMessage(response.SuccessList.toString(), this.props.messages);
            if (msg) {
              this.setState({
                isModalVisible: true,
                modalMessage: msg.message,
                modalType: msg.type,
                reqesting: false
              });
            } else if (response.SuccessList) {
              Alert.alert('', response.SuccessList.toString());
            } else {
              Alert.alert('Success', 'Action completed successfully.');
            }
          } else if (response.ErrorList) {
            const msg = getMessage(response.ErrorList.toString(), this.props.messages);
            if (msg) {
              this.setState({
                isModalVisible: true,
                modalMessage: msg.message,
                modalType: msg.type,
                reqesting: false
              });
            } else if (response.ErrorList) {
              Alert.alert('Error', response.ErrorList.toString());
            } else {
              Alert.alert('Error', 'Request failed.');
            }
          }
        }).catch(e => {
          console.log(e);
        });
    } else {
      this.setState({
        errorMsg: '*Required',
        isModalVisible: true,
        modalMessage: 'Please enter reason for cancellation',
        modalType: 'E'
      });
    }
  }

  render() {
    const { fromDate, toDate } = this.state;
    const {secondaryColor}=this.props;
    Moment.locale('en');
    if (this.state.loading) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color={this.props.secondaryColor} />
        </View>
      );
    }
    return (
      <ScrollView style={{ flex: 1, }} contentContainerStyle={styles.container}>

        <MessageModal
          isVisible={this.state.isModalVisible}
          message={this.state.modalMessage}
          type={this.state.modalType}
          hideModal={() => this.setState({ isModalVisible: false })}
          onModalHide={() => this.onModalHide()}
        />
        <View style={styles.flexColumn}>
          {/* Leave Type */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel,{color:secondaryColor}]}>
                Leave Type
              </Text>
              <Text style={styles.cardContainer}>{this.state.leaveType}</Text>
            </View>
          </Card>

          <View style={styles.horizontalContainer}>
            <Card style={styles.twoCards} onPress={this.fromDatepicker}>
              <View style={styles.cardMenuSpasing}>
                <Text includeFontPadding={false} style={[styles.cardLabel,{color:secondaryColor}]}>
                  Leave From
                </Text>
                <Text style={styles.cardContainer}>{fromDate ? Moment(fromDate).format('DD-MMM-YYYY') : ''}</Text>
              </View>
            </Card>

            {/* To Date */}
            <Card style={styles.twoCards} onPress={this.toDatepicker}>
              <View style={styles.cardMenuSpasing}>
                <Text includeFontPadding={false} style={[styles.cardLabel,{color:secondaryColor}]}>
                  Leave To
                </Text>
                <Text style={styles.cardContainer}>{toDate ? Moment(toDate).format('DD-MMM-YYYY') : ''}</Text>
              </View>
            </Card>
          </View>

          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text includeFontPadding={false} style={[styles.cardLabel,{color:secondaryColor}]}>Total No. Of Days</Text>
              <Text style={styles.cardContainer}>{this.state.absenceDays}</Text>
            </View>
          </Card>

          {/* Leave Reason  */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text includeFontPadding={false} style={[styles.cardLabel,{color:secondaryColor}]}>Reason for Leave</Text>
              <Text
                multiline
                includeFontPadding={false}
                style={styles.longText}
              >
                {this.state.leaveReason}
              </Text>
            </View>
          </Card>

          {/* Reason of Cancellation  */}
          <Card style={styles.cards}>
            <View style={styles.reasonView}>
              <Text style={[styles.reasonLabel,{color:secondaryColor}]}>Reason for Cancellation</Text>
              <TextInput
                mode="flat"
                underlineColor="transparent"
                multiline
                placeholder="Enter Cancellation Reason"
                maxLength={250}
                numberOfLines={5}
                textAlignVertical="top"
                keyboardType="default"
                scrollEnabled
                dense
                selectionColor={this.props.secondaryColor}
                includeFontPadding={false}
                underlineColorAndroid="transparent"
                value={this.state.cancelReason}
                onChangeText={cancelReason => this.setState({ cancelReason })}
                style={styles.inputBackground}
              />
            </View>
          </Card>

          <Text style={styles.requiredMsg}>{this.state.errorMsg}</Text>
          <View style={[styles.horizontalContainer, styles.buttonContainer]}>
            <Button
              loading={this.state.reqesting}
              disabled={this.state.reqesting}
              contentStyle={styles.buttonContent}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              mode="contained"
              color={this.props.primaryColor}
              uppercase
              onPress={() => this.onPressSubmit()}
            >
              Submit
            </Button>
            <Button
              color={this.props.secondaryColor}
              contentStyle={styles.buttonContent}
              style={styles.button}
              disabled={this.state.reqesting}
              labelStyle={styles.buttonLabel}
              mode="contained"
              uppercase
              onPress={() => this.props.navigation.goBack()}
            >
              Discard
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  messages: state.messageData.messages,
});

export default connect(
  mapStateToProps,
)(CancelLeaveScreen);
