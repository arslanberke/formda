import * as Haptics from 'expo-haptics'
import React from 'react'
import { Dimensions, Platform, Pressable, Text } from 'react-native'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, type SharedValue } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { C, F } from '../lib/theme'

const ACTION = 84
const FULL = Dimensions.get('window').width * 0.5

function DeleteAction({ drag, onDelete }: { drag: SharedValue<number>; onDelete: () => void }) {
  const fired = useSharedValue(false)
  // sonuna kadar kaydırınca (iOS Mail gibi) basmadan sil
  useAnimatedReaction(() => drag.value, (v) => {
    if (v < -FULL && !fired.value) { fired.value = true; scheduleOnRN(onDelete) }
  })
  const st = useAnimatedStyle(() => ({ width: Math.max(ACTION, -drag.value) }))
  return (
    <Animated.View style={[{ backgroundColor: C.danger, borderRadius: 14, overflow: 'hidden' }, st]}>
      <Pressable accessibilityLabel="Sil" onPress={onDelete} style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 24 }}>
        <Text style={{ color: C.onAccent, fontFamily: F.semi, fontSize: 15 }}>Sil</Text>
      </Pressable>
    </Animated.View>
  )
}

export function SwipeDelete({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  const del = () => {
    if (Platform.OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
    onDelete()
  }
  return (
    <ReanimatedSwipeable friction={1} rightThreshold={40} overshootRight renderRightActions={(_, drag) => <DeleteAction drag={drag} onDelete={del} />}>
      {children}
    </ReanimatedSwipeable>
  )
}
