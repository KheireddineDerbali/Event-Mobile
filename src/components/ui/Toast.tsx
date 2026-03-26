import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, SafeAreaView } from 'react-native';
import { useToastStore } from '../../stores/useToastStore';

export const Toast = () => {
  const { message, type, isVisible } = useToastStore();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, opacity]);

  const bgColors = {
    success: 'bg-emerald-600',
    error: 'bg-rose-600',
    info: 'bg-blue-600',
  };

  return (
    <Animated.View 
      pointerEvents={isVisible ? 'auto' : 'none'}
      style={{ opacity, transform: [{ translateY: opacity.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }}
      className={`absolute top-12 left-4 right-4 p-4 rounded-xl shadow-lg z-50 flex-row items-center ${bgColors[type]}`}
    >
      <Text className="text-white font-semibold text-base flex-1">{message}</Text>
    </Animated.View>
  );
};
