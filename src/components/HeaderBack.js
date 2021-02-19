import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  btnClose: {
    marginLeft: 5
  },
  icClose: {
    margin: 5,
    padding: 5
  }
});

export default props => (
  <TouchableOpacity
    style={styles.btnClose}
    onPress={() => props.navigation.goBack()}
  >
    <Icon name="ios-arrow-round-back" color="white" style={styles.icClose} size={34} />
  </TouchableOpacity>
);
