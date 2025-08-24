import { useRef, useCallback } from 'react'
import { hapticFeedback } from '../utils/mobileUtils'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

interface SwipeConfig {
  threshold?: number
  preventDefaultTouchmoveEvent?: boolean
  deltaThreshold?: number
  enableHapticFeedback?: boolean
}

export const useSwipeGesture = (
  handlers: SwipeHandlers,
  config: SwipeConfig = {}
) => {
  const {
    threshold = 50,
    preventDefaultTouchmoveEvent = false,
    deltaThreshold = 5,
    enableHapticFeedback = true
  } = config

  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number } | null>(null)
  const hasTriggeredHaptic = useRef(false)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEnd.current = null
    hasTriggeredHaptic.current = false
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault()
    }
    
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }

    // Trigger haptic feedback when threshold is reached
    if (enableHapticFeedback && !hasTriggeredHaptic.current && touchStart.current && touchEnd.current) {
      const deltaX = Math.abs(touchStart.current.x - touchEnd.current.x)
      const deltaY = Math.abs(touchStart.current.y - touchEnd.current.y)
      
      if (deltaX > threshold * 0.7 && deltaX > deltaY) {
        hapticFeedback.light()
        hasTriggeredHaptic.current = true
      }
    }
  }, [preventDefaultTouchmoveEvent, enableHapticFeedback, threshold])

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return

    const deltaX = touchStart.current.x - touchEnd.current.x
    const deltaY = touchStart.current.y - touchEnd.current.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Determine if the swipe is more horizontal or vertical
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (absDeltaX > threshold && absDeltaY < deltaThreshold) {
        if (enableHapticFeedback) {
          hapticFeedback.medium()
        }
        
        if (deltaX > 0) {
          handlers.onSwipeLeft?.()
        } else {
          handlers.onSwipeRight?.()
        }
      }
    } else {
      // Vertical swipe
      if (absDeltaY > threshold && absDeltaX < deltaThreshold) {
        if (enableHapticFeedback) {
          hapticFeedback.medium()
        }
        
        if (deltaY > 0) {
          handlers.onSwipeUp?.()
        } else {
          handlers.onSwipeDown?.()
        }
      }
    }

    touchStart.current = null
    touchEnd.current = null
    hasTriggeredHaptic.current = false
  }, [handlers, threshold, deltaThreshold, enableHapticFeedback])

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}