/* eslint-disable max-len */
/* eslint-disable radix */
import React, { Component } from 'react';
import {
  View, StyleSheet, Dimensions,
} from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modal: {
    alignSelf: 'center',
    alignItems: 'center',
    height: 100,
    justifyContent: 'center'
  },
  container: {
    width: width - 40,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    height: 80,
    width: 80,
  },
  text: {
    textAlign: 'center',
    fontSize: 22,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: '80%',
    height: 45,
    borderRadius: 12,
    margin: 20,
  },

});

class ModalPunchIn extends Component {
  render() {
    return (
      <Modal
        style={styles.modal}
        isVisible={this.props.isVisible}
        onBackdropPress={this.props.hideModal}
        onBackButtonPress={this.props.hideModal}
      >

        <View style={styles.container}>
          <Button contentStyle={{ height: 45, }} style={[styles.button, { backgroundColor: this.props.primaryColor }]} labelStyle={{ color: 'white', fontSize: 16 }} mode="contained" uppercase={false} onPress={this.props.onPressPunchIn}>
            Punch-In
          </Button>

          <Button contentStyle={{ height: 45, }} style={[styles.button, { backgroundColor: this.props.secondaryColor }]} labelStyle={{ color: 'white', fontSize: 16 }} mode="contained" uppercase={false} onPress={this.props.onCancelPunch}>
            No Thanks!
          </Button>
        </View>

      </Modal>

    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  isPunched: state.user.isPunched,
  isPunchSkip: state.user.isPunchSkip,
  isPunchOut: state.user.isPunchOut,
});

export default connect(
  mapStateToProps
)(ModalPunchIn);
