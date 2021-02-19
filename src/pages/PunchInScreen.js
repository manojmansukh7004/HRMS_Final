/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, StatusBar, Dimensions, ActivityIndicator, Alert, PermissionsAndroid, FlatList, ToastAndroid, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Searchbar, FAB } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import { getPreciseDistance } from 'geolib';
import { setPunchStatus, setPunchInTime } from '../redux/actions/user';
import { getDynamicFieldsData } from '../services/GetDynamicFieldsData';
import { getDynamicFieldsValues } from '../services/GetDynamicFieldsValues';
import { punchInService } from '../services/PunchInService';
import debounce from '../config/debounce';
import PlacesItem from '../components/PlacesItem';
import { getPlacesAutocomplete } from '../services/GetPlacesAutoComplete';
import { getPunchStatus } from '../services/GetPunchStatus';
import getMessage from '../config/GetMessage';
import MessageModal from '../components/MessageModal';

const contantPadding = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: contantPadding,
    marginTop: contantPadding
  },
  button: {
    width: '80%',
    height: 45,
    borderRadius: 12,
    margin: 20,
  },
  fab: {
    position: 'absolute',
    margin: 20,
    bottom: 0,
    alignSelf: 'center'
  },
});

class PunchInScreen extends Component {
  state = {
    loading: true,
    pickerLabel: '',
    pickerValues: [],
    selectedValue: null,
    requiredFeildMsg: '',
    reqesting: false,
    query: '',
    latitude: '',
    longitude: '',
    isPermission: false,
    isLocationService: false,
    suggestions: [],
    distance: 0,
    isModalVisible: false,
    modalMessage: '',
    modalType: '',
  };

  constructor(props) {
    super(props);
    this.selectedItem = {};
  }

  async componentDidMount() {
    getDynamicFieldsData('5', '0', 'ESS_Att_PunchInPunchOut', this.props.user)
      .then(dynamicFieldsData => {
        if (dynamicFieldsData) {
          const controlList = dynamicFieldsData.controlList[0];
          this.setState({
            pickerLabel: controlList[0].FieldLabel,
            requiredFeildMsg: controlList[0].RequiredFieldMessage,
          }, async () => {
            try {
              const res = await getDynamicFieldsValues('4', '506', 'ESS_Att_PunchInPunchOut', this.props.user);
              this.getUserLocation();
              if (res) {
                this.setState({
                  pickerValues: res.controlDataValues[0],
                  // loading: false
                });
              }
            } catch (error) {
              // console.log(error);
            }
          });
        }
      }).catch(() => {
        // console.log(err)
      });

  }

   componentWillUnmount = () => {
     // Geolocation.clearWatch(this.watchID);
   }

    getUserLocation =async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
              title: 'Location Access Required',
              message: 'This App needs to Access your location'
            }
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.setState({ isPermission: true, loading: true });
            Geolocation.getCurrentPosition(
              async (position) => {
                if (position) {
                  // ToastAndroid.show(`${position.coords.longitude}`, ToastAndroid.LONG);
                  this.setState({ isLocationService: true });
                  // console.log(`${position.coords.latitude}`, `${position.coords.longitude}`);
                  // console.log(`${this.props.user.Lattitude}`, `${this.props.user.Longitude}`);
                  const distance = getPreciseDistance(
                    { latitude: position.coords.latitude, longitude: position.coords.longitude },
                    { latitude: this.props.user.Lattitude, longitude: this.props.user.Longitude },
                    0.1,
                  );
                  const raduis = parseInt(this.props.user.RadiusInMeter, 10);
                  // console.log('RAD', raduis);
                  if (distance >= raduis) {
                    // console.log('out of radius');
                    this.setState({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                      distance,
                    }, async () => {
                      try {
                        const result = await getPlacesAutocomplete('a', this.state.latitude, this.state.longitude);
                        if (result) {
                          if (result.status === 'OK') {
                            const wfh = { description: 'Work From Home' };
                            result.predictions.unshift(wfh);
                            this.setState({
                              suggestions: result.predictions,
                              loading: false
                            });
                          } else if (result.status === 'OVER_QUERY_LIMIT') {
                            ToastAndroid.show('Please wait. Try after some time.', ToastAndroid.LONG);
                          }
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    });
                  } else {
                    // console.log('within radius');

                    // this.setState({ reqesting: true });
                    let offsiteValue = '';
                    // eslint-disable-next-line no-plusplus
                    for (let i = 0; i < this.state.pickerValues.length; i++) {
                      if (this.state.pickerValues[i].Text === 'Work From Home') {
                      } else if (this.state.pickerValues[i].Text === 'Offsite') {
                        offsiteValue = this.state.pickerValues[i].Value;
                      }
                    }
                    if (offsiteValue) {
                      const response = await punchInService(
                        offsiteValue,
                        this.props.user,
                        this.state.latitude,
                        this.state.longitude,
                        'Office Premises',
                      );
                      if (response) {
                        if (response.SuccessList) {
                          const responsePunchStatus = await getPunchStatus(this.props.user);
                          if (responsePunchStatus) {
                            this.props.setPunchInTime(responsePunchStatus.EmployeeDetails[0][0].PunchInTime);
                          }
                          this.props.setPunchStatus(true);
                          // this.props.navigation.goBack();
                          this.setState({ reqesting: false, loading: false });
                          const msg = getMessage(response.SuccessList.toString(), this.props.messages);
                          if (msg) {
                            this.setState({
                              isModalVisible: true,
                              modalMessage: msg.message,
                              modalType: msg.type,
                            });
                          } else if (response.SuccessList) {
                            Alert.alert('', response.SuccessList.toString());
                          } else {
                            Alert.alert('', 'Successfully punched in.');
                          }
                        } else {
                          this.props.setPunchStatus(false);
                          // this.props.navigation.goBack();
                          this.setState({ reqesting: false, loading: false });
                          const msg = getMessage(response.ErrorList.toString(), this.props.messages);
                          if (msg) {
                            this.setState({
                              isModalVisible: true,
                              modalMessage: msg.message,
                              modalType: msg.type
                            });
                          } else {
                            Alert.alert('Error', 'Something went wrong');
                          }
                        }
                      }
                    } else {
                      Alert.alert('Error', 'Please try again.');
                      this.props.navigation.goBack();
                    }
                  }
                } else {
                  this.setState({ isLocationService: false, loading: false });
                }
              },
              async (error) => {
                this.setState({ isLocationService: false, loading: false });
                console.log(error);
                // ToastAndroid.show(`${error}`, ToastAndroid.LONG);
              },
              { enableHighAccuracy: false, timeout: 20000, maximumAge: 0 }
            );
          } else {
            Alert.alert('Permission Denied');
            this.setState({ isPermission: false });
          }
        } catch (error) {
          console.log(error);
          // ToastAndroid.show(`${error}`, ToastAndroid.LONG);
          this.setState({ isLocationService: false, loading: false });
          this.setState({ isPermission: false });
        }
      } else {
        this.setState({ isPermission: true, loading: true });
        try {
          Geolocation.getCurrentPosition(
            async (position) => {
              if (position) {
                // ToastAndroid.show(`${position.coords.longitude}`, ToastAndroid.LONG);
                this.setState({ isLocationService: true });
                console.log(`${position.coords.latitude}`, `${position.coords.longitude}`);
                // console.log(`${this.props.user.Lattitude}`, `${this.props.user.Longitude}`);
                const distance = getPreciseDistance(
                  { latitude: position.coords.latitude, longitude: position.coords.longitude },
                  { latitude: this.props.user.Lattitude, longitude: this.props.user.Longitude },
                  0.1,
                );
                const raduis = parseInt(this.props.user.RadiusInMeter, 10);
                // console.log('RAD', raduis);
                if (distance >= raduis) {
                  // console.log('out of radius');
                  this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    distance,
                  }, async () => {
                    try {
                      const result = await getPlacesAutocomplete('a', this.state.latitude, this.state.longitude);
                      console.log(result);
                      if (result) {
                        if (result.status === 'OK') {
                          const wfh = { description: 'Work From Home' };
                          result.predictions.unshift(wfh);
                          this.setState({
                            suggestions: result.predictions,
                            loading: false
                          });
                        } else if (result.status === 'OVER_QUERY_LIMIT') {
                          ToastAndroid.show('Please wait. Try after some time.', ToastAndroid.LONG);
                        }
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  });
                } else {
                  // console.log('within radius');

                  // this.setState({ reqesting: true });
                  let offsiteValue = '';
                  // eslint-disable-next-line no-plusplus
                  for (let i = 0; i < this.state.pickerValues.length; i++) {
                    if (this.state.pickerValues[i].Text === 'Work From Home') {
                    } else if (this.state.pickerValues[i].Text === 'Offsite') {
                      offsiteValue = this.state.pickerValues[i].Value;
                    }
                  }
                  if (offsiteValue) {
                    const response = await punchInService(
                      offsiteValue,
                      this.props.user,
                      this.state.latitude,
                      this.state.longitude,
                      'Office Premises',
                    );
                    if (response) {
                      if (response.SuccessList) {
                        const responsePunchStatus = await getPunchStatus(this.props.user);
                        if (responsePunchStatus) {
                          this.props.setPunchInTime(responsePunchStatus.EmployeeDetails[0][0].PunchInTime);
                        }
                        this.props.setPunchStatus(true);
                        // this.props.navigation.goBack();
                        this.setState({ reqesting: false, loading: false });
                        const msg = getMessage(response.SuccessList.toString(), this.props.messages);
                        if (msg) {
                          this.setState({
                            isModalVisible: true,
                            modalMessage: msg.message,
                            modalType: msg.type,
                          });
                        } else if (response.SuccessList) {
                          Alert.alert('', response.SuccessList.toString());
                        } else {
                          Alert.alert('', 'Successfully punched in.');
                        }
                      } else {
                        this.props.setPunchStatus(false);
                        // this.props.navigation.goBack();
                        this.setState({ reqesting: false, loading: false });
                        const msg = getMessage(response.ErrorList.toString(), this.props.messages);
                        if (msg) {
                          this.setState({
                            isModalVisible: true,
                            modalMessage: msg.message,
                            modalType: msg.type
                          });
                        } else {
                          Alert.alert('Error', 'Something went wrong');
                        }
                      }
                    }
                  } else {
                    Alert.alert('Error', 'Please try again.');
                    this.props.navigation.goBack();
                  }
                }
              } else {
                this.setState({ isLocationService: false, loading: false });
              }
            },
            async (error) => {
              this.setState({ isLocationService: false, loading: false });
              console.log(error);
              // ToastAndroid.show(`${error}`, ToastAndroid.LONG);
            },
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 0 }
          );
        } catch (error) {
          console.log(error);
          Alert.alert('Permission Denied');
          this.setState({ isPermission: false });
        }
      }
    }

    onModalHide = () => {
      if (this.state.modalType === 'S') {
        this.props.navigation.goBack();
      }
    }

  // eslint-disable-next-line react/sort-comp
  handler = debounce(async () => {
    try {
      if (this.state.query) {
        const result = await getPlacesAutocomplete(this.state.query, this.state.latitude, this.state.longitude);
        console.log(result);
        if (result) {
          if (result.status === 'OK') {
            const wfh = { description: 'Work From Home' };
            result.predictions.unshift(wfh);
            this.setState({
              suggestions: result.predictions
            });
          } else if (result.status === 'OVER_QUERY_LIMIT') {
            ToastAndroid.show('Please wait. Try after some time.', ToastAndroid.LONG);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, 2000, false);

  onChangeText = text => {
    this.setState({ query: text });
    this.handler();
  }

  onPressSkip = () => {
    this.props.navigation.navigate('App');
  }

  onValueChange = (value) => {
    if (value !== '0') {
      this.setState({ selectedValue: value });
    } else {
      Alert.alert('', this.state.requiredFeildMsg);
    }
  }

  onPressItem = (item, index) => {
    this.selectedItem = item;
    const { suggestions } = this.state;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < suggestions.length; i++) {
      suggestions[i].isSelected = false;
    }
    suggestions[index].isSelected = true;
    this.setState({ suggestions });
  }

  punchIn =async () => {
    if (Object.keys(this.selectedItem).length !== 0) {
      this.setState({ reqesting: true });
      let wfhValue = '';
      let offsiteValue = '';
      let selectedValue = '';
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.state.pickerValues.length; i++) {
        if (this.state.pickerValues[i].Text === 'Work From Home') {
          wfhValue = this.state.pickerValues[i].Value;
        } else if (this.state.pickerValues[i].Text === 'Onsite') {
          offsiteValue = this.state.pickerValues[i].Value;
        }
      }
      if (this.selectedItem.description === 'Work From Home') {
        selectedValue = wfhValue;
      } else {
        selectedValue = offsiteValue;
      }
      const response = await punchInService(
        selectedValue,
        this.props.user,
        this.state.latitude,
        this.state.longitude,
        this.selectedItem.description,
      );
      if (response) {
        if (response.SuccessList) {
          const responsePunchStatus = await getPunchStatus(this.props.user);
          if (responsePunchStatus) {
            this.props.setPunchInTime(responsePunchStatus.EmployeeDetails[0][0].PunchInTime);
            this.props.setPunchStatus(true);
          }
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
            Alert.alert('', 'Successfully punched in.');
          }
          this.setState({ reqesting: false });
        } else {
          this.props.setPunchStatus(false);
          this.setState({ reqesting: false });
          const msg = getMessage(response.ErrorList.toString(), this.props.messages);
          if (msg) {
            this.setState({
              isModalVisible: true,
              modalMessage: msg.message,
              modalType: msg.type
            });
          } else {
            Alert.alert('Error', 'Something went wrong');
          }
        }
      } else {
        ToastAndroid.show('Please select your location.', ToastAndroid.SHORT);
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={this.props.primaryColor} />
        <MessageModal
          isVisible={this.state.isModalVisible}
          message={this.state.modalMessage}
          type={this.state.modalType}
          hideModal={() => this.setState({ isModalVisible: false })}
          onModalHide={() => this.onModalHide()}
        />
        {
        this.state.loading
          ? <ActivityIndicator color={this.props.secondaryColor} style={{ height: '100%' }} size="large" />
          : (
            <View>

              {
                this.state.isPermission
                  ? (
                    <View>
                      {
                        this.state.isLocationService
                          ? (
                            <View style={{ height: '100%', width: '100%' }}>
                              <Searchbar
                                placeholder="Search"
                                selectionColor={this.props.secondaryColor}
                                inputStyle={
                      {
                        padding: 0,
                        fontSize: 16,
                        margin: 0,
                        alignSelf: 'center',
                        elevation: 0
                      }
                    }
                                style={{
                                  margin: 10,
                                  borderRadius: 4,
                                  backgroundColor: '#E5E5E5',
                                  height: 40,
                                  elevation: 0
                                }}
                                onChangeText={query => this.onChangeText(query)}
                                value={this.state.query}
                              />

                              {/* <Text>{`Office = (${this.props.user.Lattitude}, ${this.props.user.Longitude})`}</Text>
                              <Text>{`Radius = ${this.props.user.RadiusInMeter} m`}</Text>
                              <Text>{`Current = (${this.state.latitude}, ${this.state.longitude})`}</Text>
                              <Text>{`Distance = ${this.state.distance} m`}</Text> */}
                              <FlatList
                                data={this.state.suggestions}
                                renderItem={({ item, index }) => <PlacesItem item={item} onPress={() => this.onPressItem(item, index)} />}
                                keyExtractor={item => item.id}
                              />
                              <FAB
                                style={[styles.fab, { backgroundColor: this.props.secondaryColor }]}
                                icon="arrow-right"
                                onPress={() => this.punchIn()}
                                loading={this.state.reqesting}
                              />
                            </View>
                          )

                          : (
                            <View style={{
                              justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'
                            }}
                            >
                              <Text>No location provider available.</Text>
                              <Button color={this.props.secondaryColor} contentStyle={{ height: 45, }} style={styles.button} labelStyle={{ color: 'white', fontSize: 16 }} mode="contained" uppercase={false} onPress={() => this.getUserLocation()}>
                                Retry
                              </Button>
                            </View>
                          )
                      }
                    </View>
                  )
                  : (
                    <View style={{
                      justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'
                    }}
                    >
                      <Text>Please grant location permission.</Text>
                    </View>
                  )
              }

            </View>
          )
      }

      </View>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn,
  isPunched: state.user.isPunched,
  punchInTime: state.user.punchInTime,
  punchOutTime: state.user.punchOutTime,
  messages: state.messageData.messages,
});

const mapDispatchToProps = dispatch => ({
  setPunchStatus: isPunched => {
    dispatch(setPunchStatus(isPunched));
  },
  setPunchInTime: time => {
    dispatch(setPunchInTime(time));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PunchInScreen);
