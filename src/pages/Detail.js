
import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';

class App extends Component {
  constructor(props) {
    super(props);
  }


  validate() {
    this.props.navigation.navigate('Personaldetail');
  }

  validate1() {
    this.props.navigation.navigate('Familydetail');
  }

  validate2() {
    this.props.navigation.navigate('Previousemploymentdetail');
  }

  validate3() {
    this.props.navigation.navigate('Bankdetail');
  }

  validate4() {
    this.props.navigation.navigate('Identitydetail');
  }

  validate5() {
    this.props.navigation.navigate('Addressdetail');
  }

  validate6() {
    this.props.navigation.navigate('Mydocumentscreen');
  }

  validate7() {
    this.props.navigation.navigate('Academicdetail');
  }


  render() {
    const { secondaryColor } = this.props;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', backgroundColor: '#EFF0F1', flex: 1 }}>

          <View style={{ flexDirection: 'column', flex: 1 }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.validate()}
            >
              <View style={{
                width: '100%', height: 60, alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff'
              }}
              >

                <View style={{
                  width: '12%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <Image
                    source={require('../assets/images/ic_persnoal.png')}
                    style={styles.ImageStyle1}
                  />
                </View>

                <View style={{
                  width: '68%', height: 60, justifyContent: 'center', flexDirection: 'column'
                }}
                >
                  <Text style={{ color: '#00000090', fontSize: 18 }}>Personal</Text>

                </View>

                <View style={{
                  width: '20%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <MaterialIcons name="keyboard-arrow-right" size={30} color={secondaryColor} />

                </View>
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: '#00000010',
                borderBottomWidth: 1,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.validate1()}
            >
              <View style={{
                width: '100%', height: 60, alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff'
              }}
              >

                <View style={{
                  width: '12%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <Image
                    source={require('../assets/images/ic_persnoalcopy.png')}
                    style={styles.ImageStyle1}
                  />
                </View>

                <View style={{
                  width: '68%', height: 60, justifyContent: 'center', flexDirection: 'column'
                }}
                >
                  <Text style={{ color: '#00000090', fontSize: 18 }}>Family</Text>

                </View>
                <View style={{
                  width: '20%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <MaterialIcons name="keyboard-arrow-right" size={30} color={secondaryColor} />
                </View>
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: '#00000010',
                borderBottomWidth: 1,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.validate2()}
            >
              <View style={{
                width: '100%', height: 60, alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff'
              }}
              >

                <View style={{
                  width: '12%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <Image
                    source={require('../assets/images/ic_previousemployment.png')}
                    style={styles.ImageStyle1}
                  />
                </View>

                <View style={{
                  width: '68%', height: 60, justifyContent: 'center', flexDirection: 'column'
                }}
                >
                  <Text style={{ color: '#00000090', fontSize: 18 }}>Previous Employment</Text>

                </View>
                <View style={{
                  width: '20%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <MaterialIcons name="keyboard-arrow-right" size={30} color={secondaryColor} />
                </View>
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: '#00000010',
                borderBottomWidth: 1,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.validate4()}
            >
              <View style={{
                width: '100%', height: 60, alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff'
              }}
              >

                <View style={{
                  width: '12%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <Image
                    source={require('../assets/images/ic_identity.png')}
                    style={styles.ImageStyle1}
                  />
                </View>

                <View style={{
                  width: '68%', height: 60, justifyContent: 'center', flexDirection: 'column'
                }}
                >
                  <Text style={{ color: '#00000090', fontSize: 18 }}>Identity</Text>

                </View>
                <View style={{
                  width: '20%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <MaterialIcons name="keyboard-arrow-right" size={30} color={secondaryColor} />
                </View>
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: '#00000010',
                borderBottomWidth: 1,
              }}
            />

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.validate6()}
            >

              <View style={{
                width: '100%', height: 60, alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff'
              }}
              >

                <View style={{
                  width: '12%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <Image
                    source={require('../assets/images/ic_document1.png')}
                    style={styles.ImageStyle1}
                  />
                </View>

                <View style={{
                  width: '68%', height: 60, justifyContent: 'center', flexDirection: 'column'
                }}
                >
                  <Text style={{ color: '#00000090', fontSize: 18 }}>My Documents</Text>

                </View>
                <View style={{
                  width: '20%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <MaterialIcons name="keyboard-arrow-right" size={30} color={secondaryColor} />
                </View>
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: '#00000010',
                borderBottomWidth: 1,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.validate5()}
            >
              <View style={{
                width: '100%', height: 60, alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff'
              }}
              >

                <View style={{
                  width: '12%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <Image
                    source={require('../assets/images/ic_address.png')}
                    style={styles.ImageStyle1}
                  />
                </View>

                <View style={{
                  width: '68%', height: 60, justifyContent: 'center', flexDirection: 'column'
                }}
                >
                  <Text style={{ color: '#00000090', fontSize: 18 }}>Address</Text>

                </View>
                <View style={{
                  width: '20%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <MaterialIcons name="keyboard-arrow-right" size={30} color={secondaryColor} />
                </View>
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: '#00000010',
                borderBottomWidth: 1,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.validate7()}
            >
              <View style={{
                width: '100%', height: 60, alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff'
              }}
              >

                <View style={{
                  width: '12%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <Image
                    source={require('../assets/images/ic_academic.png')}
                    style={styles.ImageStyle1}
                  />
                </View>

                <View style={{
                  width: '68%', height: 60, justifyContent: 'center', flexDirection: 'column'
                }}
                >
                  <Text style={{ color: '#00000090', fontSize: 18 }}>Academic</Text>

                </View>
                <View style={{
                  width: '20%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <MaterialIcons name="keyboard-arrow-right" size={30} color={secondaryColor} />
                </View>
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: '#00000010',
                borderBottomWidth: 1,
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.validate3()}
            >
              <View style={{
                width: '100%', height: 60, alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff'
              }}
              >

                <View style={{
                  width: '12%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <Image
                    source={require('../assets/images/ic_bank.png')}
                    style={styles.ImageStyle1}
                  />
                </View>

                <View style={{
                  width: '68%', height: 60, justifyContent: 'center', flexDirection: 'column'
                }}
                >
                  <Text style={{ color: '#00000090', fontSize: 18 }}>Bank</Text>

                </View>
                <View style={{
                  width: '20%', height: 60, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
                }}
                >
                  <MaterialIcons name="keyboard-arrow-right" size={30} color={secondaryColor} />

                </View>
              </View>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: '#00000010',
                borderBottomWidth: 1,
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

  ImageStyle1: {
    width: 22,
    height: 25,
    marginLeft: 10,

  },
  ImageStyle2: {
    width: 20,
    height: 20,
    marginLeft: 10,

  },

});
const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  isLoggedIn: state.user.isLoggedIn,
  messages: state.messageData.messages,
});


export default connect(
  mapStateToProps,
)(App);
