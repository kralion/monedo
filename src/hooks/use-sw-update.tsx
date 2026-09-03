import { createContext, useContext } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

interface SWUpdateContextValue {
  needRefresh: boolean
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  close: () => void
}

const SWUpdateContext = createContext<SWUpdateContextValue | null>(null)

export function SWUpdateProvider({ children }: { children: React.ReactNode }) {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r)
      if (r) {
        setInterval(
          () => {
            r.update()
          },
          60 * 60 * 1000
        )
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setNeedRefresh(false)
  }

  return (
    <SWUpdateContext.Provider
      value={{ needRefresh, updateServiceWorker, close }}
    >
      {children}
    </SWUpdateContext.Provider>
  )
}

export function useSWUpdate() {
  const ctx = useContext(SWUpdateContext)
  if (!ctx) throw new Error('useSWUpdate must be used within SWUpdateProvider')
  return ctx
}
