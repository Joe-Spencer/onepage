import { configureStore, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type Theme = 'light' | 'dark'

interface UiState {
  theme: Theme
}

const initialUiState: UiState = { theme: 'light' }

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUiState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
  },
})

export const { setTheme, toggleTheme } = uiSlice.actions

interface EffectsState {
  bloom: boolean
  glitch: boolean
  chromaticAberration: boolean
  physics: boolean
}

const initialEffectsState: EffectsState = {
  bloom: true,
  glitch: false,
  chromaticAberration: true,
  physics: true,
}

const effectsSlice = createSlice({
  name: 'effects',
  initialState: initialEffectsState,
  reducers: {
    toggleBloom(state) { state.bloom = !state.bloom },
    toggleGlitch(state) { state.glitch = !state.glitch },
    toggleChromaticAberration(state) { state.chromaticAberration = !state.chromaticAberration },
    togglePhysics(state) { state.physics = !state.physics },
  },
})

export const { toggleBloom, toggleGlitch, toggleChromaticAberration, togglePhysics } = effectsSlice.actions

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    effects: effectsSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


