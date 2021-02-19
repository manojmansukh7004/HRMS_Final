/* eslint-disable max-len */
/* eslint-disable no-console */
import React, { Component, } from 'react';
import {
  Text, View, StyleSheet, Image, TouchableOpacity, FlatList, PermissionsAndroid, Alert, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { Card } from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';

const RNFS = require('react-native-fs');

const styles = StyleSheet.create({
  label: {
    color: '#C1BDBD'
  },
  container: {
    borderRadius: 8,
    margin: 8,
    padding: 8
  },
  containerFile: {
    padding: 5,
    height: 50,
    width: 40,
    margin: 2
  },
  image: {
    height: 20,
    width: 20
  },
  textFileName: {
    fontSize: 10
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
  }
});

class ExpenseAppRejItem extends Component {
  downloadAttachment = item => {
    Alert.alert(
      'File Download',
      `Do you want to download ${item.FileName}?`,
      [
        {
          text: 'NO',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
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
                  const filePath = `${baseUrl}/${item.FilePath}`;
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
              const filePath = `${baseUrl}/${FilePath}`;
              RNFetchBlob.config({
                fileCache: true,
                path: downloadDest,
              })
                .fetch('GET', filePath, {},)
                .then(res => {
                  console.log('The file saved to ', res.path());
                  Alert.alert(
                    'File downloaded',
                    `${FilePath} downloaded successfully.`,
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
        },
      ],
      { cancelable: false },
    );
  }

  render() {
    return (
      <Card elevation={2} style={styles.container}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', }}>
            <View style={{ width: '33%' }}>
              <Text style={styles.label}>Expense Date</Text>
              <Text>{this.props.item.ExpenseDate}</Text>
            </View>
            <View style={{ width: '33%' }}>
              <Text style={styles.label}>Expense Type</Text>
              <Text>{this.props.item.ExpenseType}</Text>
            </View>
            <View style={{ width: '33%' }}>
              <Text style={styles.label}>Expense Amount</Text>
              <Text>{`INR ${this.props.item.ExpenseAmount}`}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.label}>Attachments</Text>
            <FlatList
              data={this.props.item.attachments}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
              style={{ flex: 1 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.containerFile} onPress={() => this.downloadAttachment(item)}>
                  {
                item.FileName.includes('pdf')
                  ? <Image source={require('../assets/images/pdf-icon.png')} style={styles.image} />
                  : <Image source={require('../assets/images/png-icon.png')} style={styles.image} />
              }
                  <Text numberOfLines={1} style={styles.textFileName}>{item.FileName}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Card>
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
)(ExpenseAppRejItem);
