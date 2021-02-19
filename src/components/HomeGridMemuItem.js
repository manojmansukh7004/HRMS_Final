import React from 'react';
import {
  Image, StyleSheet, Text,
} from 'react-native';
import { Card } from 'react-native-paper';

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 25,
    flex: 1,
  },
  imgGrid: {
    height: 100,
    width: 100,
    margin: 10
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default props => (
  <Card style={styles.card} onPress={props.onPress}>
    <Card.Content style={styles.cardContent}>
      <Text>{props.title}</Text>
      <Image style={styles.imgGrid} source={props.image} />
    </Card.Content>
  </Card>
);
