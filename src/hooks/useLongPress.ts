import { useCallback, useRef } from 'react'
import { hapticFeedback } from '../utils/mobileUtils'

export interface LongPressOptions {
  threshold?: number // Duration in ms before long press is triggered
  enableHapticFeedback?: boolean
  shouldPreventDefault?: boolean
}

export interface LongPressHandlers {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseUp: (e: React.MouseEvent) => void
  onMouseLeave: (e: React.MouseEvent) => void
}

export function useLongPress(
  onLongPress: (event?: React.TouchEvent | React.MouseEvent) => void,
  onClick?: () => void,
  options: LongPressOptions = {}
): LongPressHandlers {
  const {
    threshold = 500,
    enableHapticFeedback = true,
    shouldPreventDefault = true
  } = options

  const isLongPress = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const startPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const currentEvent = useRef<React.TouchEvent | React.MouseEvent | null>(null)
  const moveThreshold = 10 // pixels

  const start = useCallback((x: number, y: number, event?: React.TouchEvent | React.MouseEvent) => {
    if (shouldPreventDefault) {
      // Prevent context menu on long press
      document.addEventListener('contextmenu', preventDefault, { once: true })
    }

    isLongPress.current = false
    startPosition.current = { x, y }
    currentEvent.current = event || null

    timeoutRef.current = setTimeout(() => {
      isLongPress.current = true
      if (enableHapticFeedback) {
        hapticFeedback.medium()
      }
      onLongPress(currentEvent.current || undefined)
    }, threshold)
  }, [onLongPress, threshold, enableHapticFeedback, shouldPreventDefault])

  const clear = useCallback((x?: number, y?: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }

    // Check if it was a regular click (not long press and minimal movement)
    if (!isLongPress.current && onClick && x !== undefined && y !== undefined) {
      const deltaX = Math.abs(x - startPosition.current.x)
      const deltaY = Math.abs(y - startPosition.current.y)
      
      if (deltaX < moveThreshold && deltaY < moveThreshold) {
        onClick()
      }
    }

    isLongPress.current = false
  }, [onClick])

  const preventDefault = useCallback((e: Event) => {
    e.preventDefault()
  }, [])

  const checkMovement = useCallback((x: number, y: number) => {
    const deltaX = Math.abs(x - startPosition.current.x)
    const deltaY = Math.abs(y - startPosition.current.y)
    
    // Cancel long press if user moves too much
    if (deltaX > moveThreshold || deltaY > moveThreshold) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
    }
  }, [])

  return {
    onTouchStart: (e) => {
      const touch = e.touches[0]
      start(touch.clientX, touch.clientY, e)
    },
    onTouchEnd: (e) => {
      const touch = e.changedTouches[0]
      clear(touch.clientX, touch.clientY)
    },
    onTouchMove: (e) => {
      const touch = e.touches[0]
      checkMovement(touch.clientX, touch.clientY)
    },
    onMouseDown: (e) => {
      start(e.clientX, e.clientY, e)
    },
    onMouseUp: (e) => {
      clear(e.clientX, e.clientY)
    },
    onMouseLeave: () => {
      clear()
    }
  }
}