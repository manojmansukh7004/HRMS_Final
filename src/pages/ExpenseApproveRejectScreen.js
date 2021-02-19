/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import {
  Text, StyleSheet, View, ActivityIndicator, FlatList, RefreshControl, Alert
} from 'react-native';
import { Card, Button, TextInput } from 'react-native-paper';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';
import { submitApprovalRejection } from '../services/SubmitApprovalRejection';
import { getSundryInboxData } from '../services/SundryInboxDataService';
import ListItem from '../components/ExpenseAppRejItem';

const styles = StyleSheet.create({
  list: { marginBottom: 10, },
  listContainer: { paddingBottom: 20, marginBottom: 30, flex: 1 },
  emptyContainer: {
    justifyContent: 'center', height: '100%', width: '100%', marginTop: 20
  },
  emptyListItem: { alignSelf: 'center', fontSize: 16 },
  indicator: { height: '100%', width: '100%', justifyContent: 'center' },
  buttonContainer: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 20
  },
  button: {
    width: '48%',
    height: 45,
    borderRadius: 12,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center'
  },
  buttonContent: { height: 45 },
  cards: {
    elevation: 3,
    borderRadius: 5,
    marginTop: 15
  },
  longText: { backgroundColor: 'white', fontSize: 16, marginEnd: 10 },
  reasonView: { paddingStart: 3, paddingTop: 10, paddingBottom: 10 },
  reasonLabel: { paddingStart: 12, fontSize: 14 },
  requiredMessage: { color: 'red', textAlign: 'right', paddingEnd: 5 }
});

class ExpenseApproveRejectScreen extends Component {
  constructor(props) {
    super(props);
    this.uwlId = this.props.navigation.getParam('item').UWLID;
    this.item = this.props.navigation.getParam('item');
    this.state = {
      isLoading: true,
      refreshing: false,
      listData: [],
      requesting: false,
      isModalVisible: false,
      modalMessage: '',
      modalType: '',
      isRemark: true
    };
    this.expenseList = [];
    this.attachments = [];
  }

  async componentDidMount() {
    this.getExpenseData();
  }

  getExpenseData=async () => {
    const response = await getSundryInboxData(this.props.user, this.uwlId);
    // console.log(response);
    if (response) {
      this.expenseList = response.ExpenseData[0];
      this.attachments = response.Attachments[0];
      const listData = response.ExpenseData[0];
      listData.forEach((data, i) => {
        const files = [];
        response.Attachments[0].forEach(attachment => {
          if (data.SundryID === attachment.SundryID) {
            files.push(attachment);
          }
          listData[i].attachments = files;
        });
      });
      this.setState({
        // expenseList: response.ExpenseData[0],
        // attachments: response.Attachments[0],
        refreshing: false,
        isLoading: false,
        listData
      });
    } else {
      this.setState({ refreshing: false, isLoading: false });
    }
  }

  refresh=() => {
    this.setState({ refreshing: true });
    this.getExpenseData();
  }

  onPressApprove=async () => {
    if (!this.state.loadingApprove) {
      this.setState({ loadingApprove: true, isRemark: true });
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
        if (response.SuccessList) {
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
          Alert.alert('', 'Failed to reject. Please try again...');
          this.setState({ loadingReject: false });
        }
      }
    } else {
      this.setState({
        isModalVisible: true,
        modalMessage: 'Please enter remark',
        modalType: 'E',
        isRemark: false
      });
    }
  }


  onModalHide = () => {
    if (this.state.modalType === 'S') {
      this.props.navigation.goBack();
      this.props.navigation.state.params.shouldRefresh({ refresh: true }, this.props.navigation.getParam('index'));
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color={this.props.secondaryColor} />
        </View>
      );
    }

    return (
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="always"
      >

        <MessageModal
          isVisible={this.state.isModalVisible}
          message={this.state.modalMessage}
          type={this.state.modalType}
          hideModal={() => this.setState({ isModalVisible: false })}
          onModalHide={() => this.onModalHide()}
        />

        <FlatList
          data={this.state.listData}
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          refreshControl={(
            <RefreshControl
              colors={[this.props.secondaryColor]}
              refreshing={this.state.refreshing}
              onRefresh={() => this.refresh()}
            />
            )}
          renderItem={({ item, index }) => (
            <ListItem
              item={item}
              index={index}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyListItem}>No Records Found.</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
        <View style={{ margin: 10, bottom: 0 }}>
          <Card style={styles.cards}>
            <View style={styles.reasonView}>
              <Text style={[styles.reasonLabel, { color: this.props.secondaryColor }]}>
                Remark
              </Text>
              <TextInput
                mode="flat"
                underlineColor="transparent"
                multiline
                textAlignVertical="top"
                placeholder="250/250"
                underlineColorAndroid="transparent"
                autoFocus={false}
                maxLength={250}
                dense
                value={this.state.remark}
                selectionColor={this.props.secondaryColor}
                onChangeText={(text) => this.setState({ remark: text, isRemark: true })}
                numberOfLines={2}
                includeFontPadding={false}
                style={styles.longText}
              />
            </View>
          </Card>
          {this.state.isRemark ? null
            : <Text style={styles.requiredMessage}>*Required</Text>}

          <View style={styles.buttonContainer}>
            <Button
              contentStyle={styles.buttonContent}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              mode="contained"
              uppercase
              color={this.props.primaryColor}
              loading={this.state.loadingApprove}
              disabled={this.state.loadingApprove || this.state.loadingReject}
              onPress={() => this.onPressApprove()}
            >
              Approve
            </Button>
            <Button
              contentStyle={styles.buttonContent}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              mode="contained"
              loading={this.state.loadingReject}
              uppercase
              disabled={this.state.loadingApprove || this.state.loadingReject}
              color={this.props.secondaryColor}
              onPress={() => this.onPressReject()}
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
)(ExpenseApproveRejectScreen);
