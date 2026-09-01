import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <div style={styles.toastContainer}>
      <div style={styles.toast}>
        <div style={styles.message}>
          {offlineReady ? 'App ready to work offline' : 'New content available, click reload to update.'}
        </div>
        <div style={styles.buttonGroup}>
          {needRefresh && <button style={styles.button} onClick={() => updateServiceWorker(true)}>Reload</button>}
          <button style={styles.buttonClose} onClick={close}>Close</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  toastContainer: { position: 'fixed', right: 16, bottom: 16, zIndex: 1000 },
  toast: { padding: '12px', border: '1px solid #ccc', borderRadius: '8px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  message: { marginBottom: '8px', fontSize: '14px', color: '#333' },
  buttonGroup: { display: 'flex', gap: '8px' },
  button: { background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
  buttonClose: { background: '#e5e7eb', color: '#374151', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }
}
