/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, ActivityIndicator, Alert, FlatList, Image, PermissionsAndroid, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, Button, Card } from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import { getDynamicFieldsData } from '../services/GetDynamicFieldsData';
import { submitApprovalRejection } from '../services/SubmitApprovalRejection';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';
import FileItem from '../components/ViewAttachmentItem';
import { fetchSickLeaveAttachment } from '../services/FetchSickLeaveAttachment';

const RNFS = require('react-native-fs');

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
    fontSize: 16
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
  inputBackground: { backgroundColor: 'white', marginEnd: 10 },
  requiredMsg: { color: 'red', textAlign: 'right', marginEnd: 5 },
  longText: {
    color: 'gray', fontSize: 16, paddingStart: 12, paddingEnd: 12
  },
  flexColumn: { flexDirection: 'column' }
});

class LeaveApprovalRejectScreen extends Component {
  constructor(props) {
    super(props);
    this.item = this.props.navigation.getParam('item');
    this.state = {
      empName: this.item.NAME ? this.item.NAME : this.item.EmpName,
      fromDate: '',
      toDate: '',
      noOfDays: '',
      reasonOfLeave: '',
      remark: '',
      leaveType: '',
      loading: true,
      loadingApprove: false,
      loadingReject: false,
      isModalVisible: false,
      modalMessage: '',
      modalType: '',
      attachments: [],
    };
    console.log('item', this.item);
  }

  async componentDidMount() {
    const response = await getDynamicFieldsData('5',
      this.item.ProcessIDFromTable ? this.item.ProcessIDFromTable : this.item.ProcessIdFromTable,
      'ESS_Inbox_Leave$[2001AbsenceData]',
      this.props.user);
    const data = response.controlDataValues[0];
    if (response) {
      console.log('response', response);
      for (let i = 0; i < data.length; i++) {
        if (data[i].fieldDB === 'StartDate') {
          this.setState({ fromDate: data[i].fieldValue });
        } else if (data[i].fieldDB === 'EndDate') {
          this.setState({ toDate: data[i].fieldValue });
        } else if (data[i].fieldDB === 'AbsenceDays') {
          this.setState({ noOfDays: data[i].fieldValue });
        } else if (data[i].fieldDB === 'CancelReason') {
          this.setState({ reasonOfLeave: data[i].fieldValue });
        } else if (data[i].fieldDB === 'LeaveCode') {
          this.setState({ leaveType: data[i].fieldValue }, async () => {
            if (this.state.leaveType === '1003 - Sick Leave (SL)') {
              const resAttachment = await fetchSickLeaveAttachment(this.item.ProcessIDFromTable, this.item.UWLID, this.props.user);
              if (resAttachment) {
                this.setState({
                  attachments: resAttachment.Attachment[0],
                });
              }
            }
          });
        } else if (data[i].fieldDB === 'Remarks') {
          this.setState({ reasonOfLeave: data[i].fieldValue });
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

  onPressAttachment = async (item) => {
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
          const downloadDest = `${RNFS.ExternalStorageDirectoryPath}/Download/${item.FileName}`;
          const baseUrl = this.props.user.baseUrl.replace('/webapi/api', '');
          const filePath = `${baseUrl}${item.FilePath.substr(1)}`;
          RNFetchBlob
            .config({
              addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                title: item.FileName,
                path: downloadDest,
                mime: item.FileType,
                description: 'File downloaded successfully.',
                mediaScannable: true,
              }
            })
            .fetch('GET', filePath)
          // eslint-disable-next-line no-console
            .catch(e => console.log(e))
            .then((resp) => {
              console.log('filepath', resp.path());
              Alert.alert(
                'Attachment downloaded',
                `${item.FileName} downloaded successfully.`,
                [
                  {
                    text: 'OPEN',
                    onPress: () => {
                      android.actionViewIntent(resp.path(), item.FileType);
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
      const { FilePath } = item;
      const spiltStr = FilePath.split('/');
      const downloadDest = `${RNFS.DocumentDirectoryPath}/${spiltStr[spiltStr.length - 1]}`;
      const baseUrl = this.props.user.baseUrl.replace('/webapi/api', '');
      const filePath = `${baseUrl}${FilePath.substr(1)}`;
      RNFetchBlob.config({
        fileCache: true,
        path: downloadDest,
      })
        .fetch('GET', filePath, {},)
        .then(res => {
          console.log('The file saved to ', res.path());
          Alert.alert(
            'File downloaded',
            `${item.FileName} downloaded successfully.`,
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

  render() {
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
              <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                Employee Name
              </Text>
              <Text style={styles.cardContainer}>{this.state.empName}</Text>
            </View>
          </Card>

          {/* Type */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel, { color: secondaryColor }]}>
                Leave Type
              </Text>
              <Text style={styles.cardContainer}>{this.state.leaveType}</Text>
            </View>
          </Card>

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
          {/* No.of days */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel, { color: secondaryColor }]}>Number of Days</Text>
              <Text style={styles.cardContainer}>{this.state.noOfDays}</Text>
            </View>
          </Card>

          {/* Leave Reason  */}
          <Card style={styles.cards}>
            <View style={styles.cardMenuSpasing}>
              <Text style={[styles.cardLabel, { color: secondaryColor }]}>Reason of Leave</Text>
              <Text multiline style={styles.longText}>{this.state.reasonOfLeave}</Text>
            </View>
          </Card>

          {/* Attachments */}
          {
                    this.state.leaveType === '1003 - Sick Leave (SL)'
                      ? (
                        <View style={styles.attachmentView}>
                          <Text style={{ color: 'black', marginTop: 10, marginStart: 5 }}>
                            Attachment
                          </Text>

                          <View flexDirection="row" marginTop={10}>
                            <Image style={{ height: 50, width: 50 }} source={require('../assets/images/ic_attachment.png')} />

                            <FlatList
                              data={this.state.attachments}
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{ alignItems: 'center' }}
                              style={{ flex: 1 }}
                              renderItem={({ item }) => (
                                <FileItem item={item} onPress={() => this.onPressAttachment(item)} />
                              )}
                            />

                          </View>
                        </View>
                      ) : null
                  }

          {/* Remark , TODO: On Reject Remark is mendatory */}
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
                selectionColor={this.props.secondaryColor}
                maxLength={250}
                numberOfLines={5}
                value={this.state.remark}
                onChangeText={(text) => this.setState({ remark: text })}
                style={styles.inputBackground}
              />
            </View>
          </Card>

          {/* Submit/Discard */}
          <View style={styles.buttonContainer}>
            <Button
              contentStyle={styles.buttonContent}
              style={styles.button}
              labelStyle={styles.buttonLabels}
              mode="contained"
              uppercase
              color={this.props.primaryColor}
              loading={this.state.loadingApprove}
              onPress={this.onPressApprove}
              disabled={this.state.loadingApprove || this.state.loadingReject}
            >
              Approve
            </Button>
            {/* color="#00CD00" */}
            <Button
              contentStyle={styles.buttonContent}
              style={styles.button}
              labelStyle={styles.buttonLabels}
              mode="contained"
              uppercase
              color={this.props.secondaryColor}
              loading={this.state.loadingReject}
              onPress={this.onPressReject}
              disabled={this.state.loadingReject || this.state.loadingApprove}
            >
              Reject
            </Button>
            {/* color="#FF5151" */}
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
)(LeaveApprovalRejectScreen);
