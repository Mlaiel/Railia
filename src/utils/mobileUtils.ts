// Utility functions for mobile device interactions

/**
 * Provides haptic feedback if available on the device
 */
export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
  },
  
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20)
    }
  },
  
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 30])
    }
  },

  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([40, 10, 20])
    }
  },

  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100])
    }
  }
}

/**
 * Detects if the user is on a mobile device
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Detects if the device supports touch
 */
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Prevents default scroll behavior during specific interactions
 */
export const preventScroll = (e: Event) => {
  e.preventDefault()
}

/**
 * Safe area insets for devices with notches or rounded corners
 */
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement)
  return {
    top: style.getPropertyValue('--safe-area-inset-top') || '0px',
    right: style.getPropertyValue('--safe-area-inset-right') || '0px',
    bottom: style.getPropertyValue('--safe-area-inset-bottom') || '0px',
    left: style.getPropertyValue('--safe-area-inset-left') || '0px',
  }
}