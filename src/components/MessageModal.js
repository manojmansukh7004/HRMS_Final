/* eslint-disable max-len */
/* eslint-disable radix */
import React, { Component } from 'react';
import {
  View, StyleSheet, Dimensions, Text,
} from 'react-native';
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
    fontSize: 16,
    padding: 10,
  },

});

const backgroundSuccess = '#259b24';
const backgroundError = '#ffc107';
const backgroundException = '#ff5722';
const backgroundConfirmation = '#fff';

const textSuccess = '#fff';
const textError = '#333';
const textException = '#ff';
const textConfirmation = '#000';

class ModalPunchIn extends Component {
  getBackgroundColor= () => {
    if (this.props.type === 'S') {
      return backgroundSuccess;
    } if (this.props.type === 'E') {
      return backgroundError;
    } if (this.props.type === 'X') {
      return backgroundException;
    } if (this.props.type === 'C') {
      return backgroundConfirmation;
    }
    return null;
  }

  getTextColor= () => {
    if (this.props.type === 'S') {
      return textSuccess;
    } if (this.props.type === 'E') {
      return textError;
    } if (this.props.type === 'X') {
      return textException;
    } if (this.props.type === 'C') {
      return textConfirmation;
    }
    return null;
  }

  setTimeout = () => {
    // setTimeout(() => {
    //   this.modal.close();
    //   this.props.hideModal();
    // }, 5000);
  }

  onModalHide = () => {
    clearTimeout(this.timeout);
    this.props.onModalHide();
  }

  render() {
    return (
      <Modal
        ref={modal => this.modal = modal}
        style={styles.modal}
        isVisible={this.props.isVisible}
        onBackdropPress={this.props.hideModal}
        onBackButtonPress={this.props.hideModal}
        onModalShow={this.setTimeout}
        onModalHide={this.onModalHide}
      >

        <View style={[styles.container, { backgroundColor: this.getBackgroundColor() }]}>
          <Text style={[styles.text, { color: this.getTextColor() }]}>{this.props.message}</Text>
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
