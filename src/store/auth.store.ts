import { create } from 'zustand'
import { devtools, persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import { authApi } from '../api/auth.api'
import { AUTH_STORAGE_KEY } from '../api/client'
import { getErrorMessage } from '../utils/utils'
import type { AuthState } from './auth.types'

const getInitialTarget = (): 'local' | 'session' => {
  if (typeof window === 'undefined') return 'local'
  try {
    if (localStorage.getItem(AUTH_STORAGE_KEY)) return 'local'
    if (sessionStorage.getItem(AUTH_STORAGE_KEY)) return 'session'
  } catch {
    // fall back to local
  }
  return 'local'
}

const storageTarget = { current: getInitialTarget() }

const dynamicStorage: StateStorage = {
  getItem: (name) => {
    try {
      const localValue = localStorage.getItem(name)
      if (localValue) {
        return localValue
      }

      const sessionValue = sessionStorage.getItem(name)
      if (sessionValue) {
        return sessionValue
      }
      return null
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      const primary = storageTarget.current === 'local' ? localStorage : sessionStorage
      const secondary = storageTarget.current === 'local' ? sessionStorage : localStorage
      primary.setItem(name, value)
      secondary.removeItem(name)
    } catch {
      // ignore storage write failures
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {
      // ignore storage errors
    }
    try {
      sessionStorage.removeItem(name)
    } catch {
      // ignore storage errors
    }
  },
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isLoading: false,
        error: null,

        login: async (email: string, password: string, rememberMe = false) => {
          set({ isLoading: true, error: null })
          storageTarget.current = rememberMe ? 'local' : 'session'

          try {
            const response = await authApi.login({ email, password, rememberMe })
            const { token, user } = response

            set({
              token,
              user,
              error: null,
              isLoading: false,
            })
          } catch (error: unknown) {
            set({
              token: null,
              user: null,
              error: getErrorMessage(error, 'שגיאה בהתחברות'),
              isLoading: false,
            })
          }
        },

        logout: async () => {
          try {
            await authApi.logout()
          } catch {
            // Even if cookie clearing fails, drop local session state
          } finally {
            set({
              token: null,
              user: null,
              isLoading: false,
              error: null,
            })
          }
        },

        clearError: () => set({ error: null }),

        resetSession: () => {
          set({
            token: null,
            user: null,
            isLoading: false,
            error: null,
          })
        },
      }),
      {
        name: AUTH_STORAGE_KEY,
        storage: createJSONStorage(() => dynamicStorage),
        partialize: (state) => ({ token: state.token, user: state.user }),
        onRehydrateStorage: () => () => {
          try {
            if (typeof window === 'undefined') return
            if (localStorage.getItem(AUTH_STORAGE_KEY)) {
              storageTarget.current = 'local'
            } else if (sessionStorage.getItem(AUTH_STORAGE_KEY)) {
              storageTarget.current = 'session'
            }
          } catch {
            // keep existing target
          }
        },
      },
    ),
    { name: 'AuthStore' },
  ),
)
