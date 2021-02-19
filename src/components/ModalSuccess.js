/* eslint-disable max-len */
/* eslint-disable radix */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Dimensions, Image,
} from 'react-native';
import Modal from 'react-native-modal';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modal: {
    alignSelf: 'center',
    alignItems: 'center',
    height: 100,
  },
  container: {
    width: width - 40,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginLeft: 10,
    alignItems: 'center',
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
  }

});

export default class ModalSuccess extends Component {
  setTimeout = () => {
    // this.timeout = setTimeout(() => {
    //   this.modal.close();
    //   this.props.hideModal();
    // }, 5000);
  }

  onModalHide = () => {
    clearTimeout(this.timeout);
    this.props.hideModal();
  }

  render() {
    return (
      <Modal
        ref={modal => this.modal = modal}
        style={styles.modal}
        isVisible={this.props.isVisible}
        onBackdropPress={this.props.hideModal}
        onBackButtonPress={this.props.hideModal}
        onModalHide={this.props.onDismiss}
        onModalShow={this.setTimeout}
        onDismiss={this.props.onDismiss}
      >

        <View style={styles.container}>
          {
          this.props.type === 'E'
            ? <Image style={styles.image} source={require('../assets/images/ic_error.png')} />
            : <Image style={styles.image} source={require('../assets/images/ic_tick_success.png')} />
        }

          <Text style={styles.text}>{this.props.text}</Text>
        </View>

      </Modal>
    );
  }
}
