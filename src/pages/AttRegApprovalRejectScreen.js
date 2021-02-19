/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, ActivityIndicator, Alert, Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { BarChart } from 'react-native-chart-kit';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, Button, Card } from 'react-native-paper';
import { getDynamicFieldsData } from '../services/GetDynamicFieldsData';
import { submitApprovalRejection } from '../services/SubmitApprovalRejection';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';
import { getAttendenceRegAnalytics } from '../services/AttRegAnalytics';


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
    color: '#a9a9a9',
    fontSize: 16
  },
  itemContainer: {
    flexDirection: 'column',
    width: '45%',
  },
  labels: {
    fontSize: 14,
    color: '#F2721C',
    includeFontPadding: false,
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
  flexColumn: { flexDirection: 'column' },
  graphStyle: {
    marginBottom: 50,
    marginTop: 30
  },
});


class AttRegApprovalRejectScreen extends Component {
  constructor(props) {
    super(props);
    this.item = this.props.navigation.getParam('item');
    this.state = {
      loading: true,
      empName: this.item.NAME,
      regularizationType: '',
      fromDate: '',
      toDate: '',
      startTime: '',
      endTime: '',
      punchInTime: '',
      punchOutTime: '',
      noOfDays: '',
      reasonOfRegularization: '',
      remark: '',
      loadingApprove: false,
      loadingReject: false,
      isModalVisible: false,
      modalMessage: '',
      modalType: '',
      noOfDays: '',
      graphData: null
    };
  }

  async componentDidMount() {
    const response = await getDynamicFieldsData('5',
      this.item.ProcessIDFromTable,
      'ESS_Inbox_Attendance$[2002AttendanceData]',
      this.props.user);
    const data = response.controlDataValues[0];
    if (response) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].fieldDB === 'StartDate') {
          this.setState({ fromDate: data[i].fieldValue });
        } else if (data[i].fieldDB === 'EndDate') {
          this.setState({ toDate: data[i].fieldValue });
        } else if (data[i].fieldDB === 'PunchInTime') {
          this.setState({ punchInTime: data[i].fieldValue.substring(0, 5) });
        } else if (data[i].fieldDB === 'PunchOutTime') {
          console.log(data[i].fieldValue);
          this.setState({ punchOutTime: data[i].fieldValue.substring(0, 5) });
        } else if (data[i].fieldDB === 'StartTime') {
          this.setState({ startTime: data[i].fieldValue.substring(0, 5) });
        } else if (data[i].fieldDB === 'EndTime') {
          this.setState({ endTime: data[i].fieldValue.substring(0, 5) });
        } else if (data[i].fieldDB === 'AttendanceCode') {
          this.setState({ regularizationType: data[i].fieldValue });
        } else if (data[i].fieldDB === 'AbsenceDays') {
          this.setState({ noOfDays: data[i].fieldValue });
        } else if (data[i].fieldDB === 'Remarks') {
          this.setState({ reasonOfRegularization: data[i].fieldValue });
        }
      }
      this.setState({ loading: false });
    }
    const attAnalyticsResponse = await getAttendenceRegAnalytics(this.props.user);
    console.log(attAnalyticsResponse);

    const graphData = {
      labels: [],
      datasets: [
        {
        }
      ],
      barColors: [this.props.primaryColor]
    };
    const freq = [];
    attAnalyticsResponse.AttRegAnalytics[0].Table.forEach(element => {
      graphData.labels.push(element.ReportMonth);
      freq.push(element.RegFrequency);
    });
    graphData.datasets[0].data = freq;
    this.setState({ graphData });
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

  onModalHide = () => {
    if (this.state.modalType === 'S') {
      this.props.navigation.goBack();
      this.props.navigation.state.params.shouldRefresh({ refresh: true }, this.props.navigation.getParam('index'));
    }
  }

  render() {
    const chartConfig = {
      backgroundGradientFrom: 'white',
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: 'white',
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => this.props.secondaryColor,
      strokeWidth: 4,
      barPercentage: 1,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      decimalPlaces: 0,
    };

    const { secondaryColor } = this.props;
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
          {/* Name */}
          <MessageModal
            isVisible={this.state.isModalVisible}
            message={this.state.modalMessage}
            type={this.state.modalType}
            hideModal={() => this.setState({ isModalVisible: false })}
            onModalHide={() => this.onModalHide()}
          />

          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                    Employee Name
              </Text>
              <Text multiline style={styles.cardContainer}>{this.state.empName}</Text>
            </View>
          </Card>

          {/* Type */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                    Regularization Type
              </Text>
              <Text multiline style={styles.cardContainer}>{this.state.regularizationType}</Text>
            </View>
          </Card>

          {/* From Date */}
          <View style={styles.horizontalContainer}>
            <Card style={styles.twoCards}>
              <View style={styles.cardMenuSpasing}>
                <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                    From Date
                </Text>
                <Text style={styles.cardContainer}>{this.state.fromDate}</Text>
              </View>
            </Card>

            {/* To Date */}
            <Card style={styles.twoCards}>
              <View style={styles.cardMenuSpasing}>
                <Text style={[styles.cardLabel, { color: secondaryColor }]}>
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
                <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                  Punch In Time
                </Text>
                <Text style={styles.cardContainer}>{this.state.punchInTime === '00:00' ? '00:00' : this.tConv24(this.state.punchInTime)}</Text>
              </View>
            </Card>

            {/* Punch Out Time */}
            <Card style={styles.twoCards}>
              <View style={styles.cardMenuSpasing}>
                <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                  Punch Out Time
                </Text>
                <Text style={styles.cardContainer}>{this.state.punchOutTime === '00:00' || '' ? '00:00' : this.tConv24(this.state.punchOutTime)}</Text>
              </View>
            </Card>
          </View>

          {/* Start Time */}
          <View style={styles.horizontalContainer}>
            <Card style={styles.twoCards}>
              <View style={styles.cardMenuSpasing}>
                <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                  Start Time
                </Text>
                <Text style={styles.cardContainer}>{this.state.startTime === '00:00' ? this.state.startTime : this.tConv24(this.state.startTime)}</Text>
              </View>
            </Card>

            {/* End Time */}
            <Card style={styles.twoCards}>
              <View style={styles.cardMenuSpasing}>
                <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                  End Time
                </Text>
                <Text style={styles.cardContainer}>{this.state.endTime === '00:00' ? this.state.endTime : this.tConv24(this.state.endTime)}</Text>
              </View>
            </Card>
          </View>

          {/* No.of days */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel, { color: secondaryColor }]}>Number of Days</Text>
              <Text style={styles.cardContainer}>{this.state.noOfDays}</Text>
            </View>
          </Card>


          {/* Regularization Reason  */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel, { color: secondaryColor }]}>Reason of Regularization</Text>
              <Text multiline style={styles.longText}>{this.state.reasonOfRegularization}</Text>
            </View>
          </Card>

          {/* Remark,  TODO: Make Remark mendatory on reject */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel, { color: secondaryColor }]}>Remark</Text>
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
                numberOfLines={5}
                value={this.state.remark}
                selectionColor={this.props.secondaryColor}
                onChangeText={(text) => this.setState({ remark: text })}
                style={styles.inputBackground}
              />
            </View>
          </Card>

          {/* Approve/Reject */}
          <View style={styles.buttonContainer}>
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
        {
  this.state.graphData && (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 16, marginTop: 20 }}>Attendance Regularization Analysis</Text>
      <BarChart
        style={styles.graphStyle}
        data={this.state.graphData}
        width={Dimensions.get('window').width}
        height={220}
        fromZero
        chartConfig={chartConfig}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
      />
    </View>
  )
}

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
)(AttRegApprovalRejectScreen);
