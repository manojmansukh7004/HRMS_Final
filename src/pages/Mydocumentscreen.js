/* eslint-disable max-len */
/* eslint-disable no-console */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Card, FAB } from 'react-native-paper';
import { connect } from 'react-redux';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import RNFetchBlob from 'rn-fetch-blob';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MessageModal from '../components/MessageModal';

const RNFS = require('react-native-fs');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      second: true,
      loading: false,
      NameHolder: '',
      IdHolder: '',
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      spinner: true,
    };
    this.arrayholder = [];
  }

  componentDidMount() {
    this.GetMyProfileData();
  }

  GetMyProfileData() {
    const myarray = {
      loginDetails:
        {
          LoginEmpID: this.props.user.LoginEmpID,
          LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
        }
    };

    return fetch(`${this.props.user.baseUrl}/MyProfile/GetMyProfileData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(myarray),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState(
          {
            isLoading: false,
            loading: false,
            spinner: false,
            dataSource: responseJson.ProfileData[0].MyDocuments,
          },

        );
      })
      .catch(() => {

      });
  }

  documentadd() {
    this.props.navigation.navigate('Mydocumentedit', { callHome: this.proFun.bind(this), });
  }

  documentdelete(filename, id) {
    const myarray = {
      loginDetails:
  {
    LoginEmpID: this.props.user.LoginEmpID,
    LoginEmpCompanyCodeNo: this.props.user.LoginEmpCompanyCodeNo
  },
      data:
 {
   Id: id,
   FileName: filename
 }
    };
    return fetch(`${this.props.user.baseUrl}/MyProfile/DeleteMyDocuments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(myarray),
    })
      .then((response) => response.json())
      .then(() => {
        this.setState({ spinner: true, },);
        this.GetMyProfileData();
      })
      .catch(() => {
        this.setState({ spinner: false, },);
      });
  }

  proFun() {
    this.setState({ spinner: true, },);
    this.GetMyProfileData();
  }

      onModalHide = () => {

      }

  downloadAttachment = async (item) => {
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
                  const date = new Date();
                  const downloadDest = `${RNFS.ExternalStorageDirectoryPath}/Download/${item.FileName}${Math.floor(date.getTime()
            + date.getSeconds() / 2)}`;
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
                    .fetch('GET', item.FilePath)
                  // eslint-disable-next-line no-console
                    .catch(e => console.log(e))
                    .then((res) => {
                      Alert.alert(
                        'Attachment downloaded',
                        `${item.FileName} downloaded successfully.`,
                        [
                          {
                            text: 'OPEN',
                            onPress: () => {
                              android.actionViewIntent(res.path(), item.FileType);
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
                      res.path();
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
              RNFetchBlob.config({
                fileCache: true,
                path: downloadDest,
              })
                .fetch('GET', FilePath, {},)
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
        },
      ],
      { cancelable: false },
    );
  }

    renderItem=({ item }) => {
      const renderLeftActions = (progress, dragX) => (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity

            activeOpacity={0.5}
            onPress={() => this.documentdelete(item.FileName, item.RecordId)}
          >
            <View style={{
              width: 40, height: 70, flexDirection: 'column', backgroundColor: '#EFF0F150', alignItems: 'center', justifyContent: 'center', marginTop: 10
            }}
            >
              <EvilIcons name="trash" color="black" size={32} />
            </View>
          </TouchableOpacity>
        </View>
      );
      return (
        <Swipeable

          renderRightActions={renderLeftActions}
        >
          <Card style={styles.cards}>
            <MessageModal
              isVisible={this.state.isModalVisible}
              message={this.state.modalMessage}
              type={this.state.modalType}
              hideModal={() => this.setState({ isModalVisible: false })}
              onModalHide={() => this.onModalHide()}
            />
            <View>
              <View style={{
                width: wp('94%'),
                height: 55,

                flexDirection: 'row',
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3
              }}
              >
                <View style={{
                  width: 25, height: 25, backgroundColor: !item.IsApproved ? '#9E9E9E' : '#f27420', justifyContent: 'center', alignItems: 'center', borderRadius: 63
                }}
                >
                  <MaterialIcons name="insert-drive-file" size={20} color="#fff" />
                </View>
                <View style={{
                  width: wp('80%'), alignItems: 'center', marginLeft: 5, flexDirection: 'row'
                }}
                >
                  <View style={{ width: wp('45%'), flexDirection: 'column', marginLeft: 5 }}>
                    <Text style={{ color: '#000000', fontSize: 12, fontFamily: 'Nunito-BoldItalic', }}>{item.InfoType}</Text>

                  </View>
                  <TouchableOpacity onPress={() => this.downloadAttachment(item)}>
                    <View style={{
                      width: wp('27%'), flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end'
                    }}
                    >

                      <Image
                        source={require('../assets/images/download.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </Card>

        </Swipeable>

      );
    }

    render() {
      return (
        <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>
          {
      this.state.spinner ? <ActivityIndicator style={styles.activityIndicatotor} color={this.props.secondaryColor} size="large" />
        : (
          <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>
            {
      this.state.dataSource ? (null) : <Text style={{ fontSize: 15, marginTop: 30 }}>No Records Found</Text>
}

            <FlatList
              showsVerticalScrollIndicator={false}

              data={this.state.dataSource}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />

          </View>
        )
}
          <FAB
            style={[styles.fab, { backgroundColor: this.props.secondaryColor }]}
            icon="plus"
            onPress={() => this.documentadd()}
          />
        </View>
      );
    }
}

const styles = StyleSheet.create({

  ImageStyle1: {
    width: 20,
    height: 25,
    marginLeft: 10,

  },
  textStyle1: {
    color: '#000',
    fontSize: 20,
    justifyContent: 'center',
    fontFamily: 'Nunito-BoldItalic',

  },
  cards: {
    elevation: 3,
    height: 55,
    width: wp('94%'),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 5,

  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    // backgroundColor:'#fff'
  },
  activityIndicatotor: {
    height: '100%',
    width: '100%',
  },
  fab: {
    position: 'absolute',
    margin: 20,
    bottom: 0,
    right: 0,
    alignSelf: 'flex-end',
    marginBottom: 40
  },
});
const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn
});

export default connect(
  mapStateToProps,
)(App);
