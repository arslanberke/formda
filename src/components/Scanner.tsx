import React, { useRef, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { CameraView as CV } from 'expo-camera'
import type { OffProduct } from '../data/foods'
import type { LabelValues } from '../lib/label'
import { cam, lookupBarcode, ocrAvailable, readLabel } from '../lib/scan'
import { C, F } from '../lib/theme'
import { Button, Muted } from './ui'

interface Props {
  mode: 'barcode' | 'label'
  onClose: () => void
  onProduct: (p: OffProduct) => void
  onLabel: (v: LabelValues) => void
  onWantLabel: () => void
}

export default function Scanner(props: Props) {
  if (!cam) return null
  return <ScannerInner {...props} />
}

function ScannerInner({ mode, onClose, onProduct, onLabel, onWantLabel }: Props) {
  const { CameraView, useCameraPermissions } = cam!
  const [perm, request] = useCameraPermissions()
  const insets = useSafeAreaInsets()
  const ref = useRef<CV>(null)
  const busy = useRef(false)
  const [status, setStatus] = useState<'idle' | 'busy' | 'notfound' | 'unread'>('idle')

  if (!perm) return <View style={styles.full} />
  if (!perm.granted) {
    return (
      <View style={[styles.full, { padding: 24, justifyContent: 'center' }]}>
        <Text style={styles.title}>Kamera izni lazım</Text>
        <Muted style={{ marginBottom: 16 }}>Barkodu ve besin tablosunu okumak için. Fotoğraf telefonda işlenir, bir yere gönderilmez.</Muted>
        <Button title="İzin ver" onPress={request} />
        <Button kind="ghost" title="Vazgeç" style={{ marginTop: 8 }} onPress={onClose} />
      </View>
    )
  }

  const onCode = async ({ data }: { data: string }) => {
    if (busy.current) return
    busy.current = true
    setStatus('busy')
    const p = await lookupBarcode(data).catch(() => null)
    if (p) onProduct(p)
    else { setStatus('notfound') }
  }

  const shoot = async () => {
    if (busy.current || !ref.current) return
    busy.current = true
    setStatus('busy')
    try {
      const pic = await ref.current.takePictureAsync({ quality: 0.9 })
      const v = pic ? await readLabel(pic.uri) : {}
      if (v.kcal !== undefined || v.p !== undefined) onLabel(v)
      else { setStatus('unread'); busy.current = false }
    } catch { setStatus('unread'); busy.current = false }
  }

  return (
    <View style={styles.full}>
      <CameraView
        ref={ref}
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={mode === 'barcode' ? { barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] } : undefined}
        onBarcodeScanned={mode === 'barcode' && status === 'idle' ? onCode : undefined}
      />
      <View style={[styles.top, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>{mode === 'barcode' ? 'Barkodu çerçeveye getir' : 'Besin tablosunu çek'}</Text>
        <Muted>{mode === 'barcode' ? 'Ürün internetteki veritabanında varsa değerleri gelir.' : '"100 g için" sütunu net görünsün, ışık iyi olsun.'}</Muted>
      </View>
      <View style={[styles.frame, mode === 'label' && { height: 340 }]} pointerEvents="none" />
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        {status === 'busy' && <ActivityIndicator color={C.accent} style={{ marginBottom: 12 }} />}
        {status === 'notfound' && (
          <>
            <Muted style={{ marginBottom: 10 }}>Bu barkod veritabanında yok ya da değerleri girilmemiş.</Muted>
            {ocrAvailable() && <Button title="Etiketi fotoğrafla" style={{ marginBottom: 8 }} onPress={onWantLabel} />}
            <Button kind="secondary" title="Tekrar dene" style={{ marginBottom: 8 }} onPress={() => { busy.current = false; setStatus('idle') }} />
          </>
        )}
        {status === 'unread' && <Muted style={{ marginBottom: 10 }}>Tabloyu okuyamadım. Biraz daha yakından, düz tutarak tekrar dene.</Muted>}
        {mode === 'label' && status !== 'busy' && <Button title="Fotoğrafı çek" style={{ marginBottom: 8 }} onPress={shoot} />}
        <Button kind="ghost" title="Kapat" onPress={onClose} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  full: { flex: 1, backgroundColor: '#000' },
  top: { position: 'absolute', left: 0, right: 0, top: 0, paddingHorizontal: 20, paddingBottom: 14, backgroundColor: 'rgba(11,13,8,0.75)' },
  title: { color: C.text, fontSize: 20, fontFamily: F.semi, marginBottom: 4 },
  frame: { position: 'absolute', left: 30, right: 30, top: '32%', height: 160, borderRadius: 20, borderWidth: 2, borderColor: C.accent },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 14, backgroundColor: 'rgba(11,13,8,0.8)' },
})
