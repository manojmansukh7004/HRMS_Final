import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
    if (this.props.item.type) {
      return (
        <View style={styles.container}>
          <Icon onPress={this.props.onPress} style={styles.icon} name="ios-close" size={18} color="black" />
          {
            this.props.item.type.includes('pdf')
              ? <Image source={require('../assets/images/pdf-icon.png')} style={styles.image} />
              : <Image source={require('../assets/images/png-icon.png')} style={styles.image} />
          }
          <Text numberOfLines={1} style={styles.text}>{this.props.item.name}</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Icon onPress={this.props.onPress} style={styles.icon} name="ios-close" size={18} color="black" />
        {
            this.props.item.FileType.includes('pdf')
              ? <Image source={require('../assets/images/pdf-icon.png')} style={styles.image} />
              : <Image source={require('../assets/images/png-icon.png')} style={styles.image} />
          }
        <Text numberOfLines={1} style={styles.text}>{this.props.item.FileName}</Text>
      </View>

    );
  }
}
