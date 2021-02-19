import React from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Colors from '../config/Colors';


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  card: {
    borderRadius: 30,
    height: 60,
    width: 60,
    borderColor: Colors.accentBlue,
    borderWidth: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  img: {
    height: 25,
    width: 25,
  },
  title: {
    color: Colors.accentBlue,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10
  }
});

export default props => (

  <TouchableOpacity style={styles.container}>
    <View style={styles.card} onPress={props.onPress} activeOpacity={0.5}>
      <Image style={styles.img} source={props.image} />
    </View>
    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{props.title}</Text>

  </TouchableOpacity>

);
