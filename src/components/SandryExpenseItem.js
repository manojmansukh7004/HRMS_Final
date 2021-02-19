/* eslint-disable max-len */
import React, { Component, } from 'react';
import {
  Text, View, StyleSheet, Image, FlatList, Alert, PermissionsAndroid, Platform,
  TouchableOpacity,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { connect } from 'react-redux';
import { Card } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const RNFS = require('react-native-fs');

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around'
  },
  flex: {
    flex: 1,
  },
  textGray: {
    color: 'gray',
    fontSize: 12
  },
  textType: {
    color: 'black',
    fontSize: 14
  },
  containerFiles: {
    flex: 2,
    marginTop: 2,
    height: 80,
  },
  text: {
    color: '#4a4a4a',
    fontSize: 15,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#e4e4e4',
    marginLeft: 10,
  },
  leftAction: {
    backgroundColor: '#388e3c',
    justifyContent: 'center',
    flex: 1,
  },
  rightAction: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    margin: 1,
    padding: 10
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    padding: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  containerFile: {
    padding: 5,
    height: 50,
    width: 40,
    margin: 2
  },
  image: {
    height: 30,
    width: 30
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

class SandryExpenseItem extends Component {
  state={
    isExpanded: false,
  };

  onPress= () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  }

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
                    'Downloaded successfully.',
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
    const RightActions = ({ progress, dragX, onPress }) => {
      const scale = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });
      return (
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={() => this.props.onPressEdit(this.props.item)}>
            <View style={styles.rightAction}>
              <SimpleLineIcon name="pencil" color="black" size={20} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.onPressDelete(this.props.item)}>
            <View style={styles.rightAction}>
              <EvilIcons name="trash" color="black" size={32} />
            </View>
          </TouchableOpacity>
        </View>
      );
    };

    return (

      <Swipeable
        onSwipeableLeftOpen={() => {}}
        renderRightActions={(progress, dragX) => (
          <RightActions progress={progress} dragX={dragX} onPress={() => {}} />
        )}
      >
        <Card elevation={2} style={styles.container} onPress={this.onPress}>

          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.textGray}>Expense Date</Text>
              <Text style={styles.textType}>{this.props.date}</Text>
            </View>

            <View style={styles.flex}>
              <Text style={styles.textGray}>Expense Type</Text>
              <Text style={styles.textType}>{this.props.type}</Text>
            </View>

            <View style={styles.flex}>
              <Text style={styles.textGray}>Expense Amount</Text>
              <Text style={styles.textType}>{this.props.amount}</Text>
            </View>

          </View>

          {
this.state.isExpanded
  ? (
    <View style={{ marginTop: 8 }}>
      <Text style={styles.textGray}>Description</Text>
      <Text style={styles.textType}>{this.props.description}</Text>

      <View style={[styles.row, { marginTop: 8 }]}>
        <View style={styles.flex}>
          <Text style={styles.textGray}>No of Bills</Text>
          <Text style={styles.textType}>{this.props.bills}</Text>
        </View>
        <View style={styles.containerFiles}>
          <Text style={styles.textGray}>Attachments</Text>

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
    </View>
  ) : null
}

        </Card>
      </Swipeable>

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
)(SandryExpenseItem);
