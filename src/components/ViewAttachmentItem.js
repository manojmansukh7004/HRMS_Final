import React, { Component } from 'react';
import {
  Text, StyleSheet, Image, TouchableOpacity
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 5,
    height: 50,
    width: 40,
    margin: 2
  },
  image: {
    height: 30,
    width: 30
  },
  text: {
    fontSize: 10
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
  }
});

export default class FileItem extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        {
          this.props.item.FileName.includes('pdf')
            ? <Image source={require('../assets/images/pdf-icon.png')} style={styles.image} />
            : <Image source={require('../assets/images/png-icon.png')} style={styles.image} />
        }
        <Text numberOfLines={1} style={styles.text}>{this.props.item.FileName}</Text>
      </TouchableOpacity>
    );
  }
}
