import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { hapticFeedback } from '../utils/mobileUtils'

interface SwipeIndicatorProps {
  direction: 'left' | 'right'
  show: boolean
  progress: number
  onAnimationComplete?: () => void
}

const SwipeIndicator = ({ direction, show, progress, onAnimationComplete }: SwipeIndicatorProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: direction === 'left' ? 20 : -20 }}
          animate={{ 
            opacity: Math.min(progress * 2, 1), 
            scale: 0.8 + (progress * 0.4), 
            x: 0 
          }}
          exit={{ opacity: 0, scale: 0.8, x: direction === 'left' ? -20 : 20 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          onAnimationComplete={onAnimationComplete}
          className={`fixed top-1/2 transform -translate-y-1/2 z-50 pointer-events-none ${
            direction === 'left' ? 'left-8' : 'right-8'
          }`}
        >
          <div 
            className={`bg-primary/20 backdrop-blur-sm rounded-full p-4 border border-primary/30 transition-all duration-100 ${
              progress > 0.7 ? 'bg-primary/40 border-primary/50' : ''
            }`}
          >
            {direction === 'left' ? (
              <CaretLeft size={24} className="text-primary" />
            ) : (
              <CaretRight size={24} className="text-primary" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface SwipeDetectorProps {
  children: React.ReactNode
  onSwipe: (direction: 'left' | 'right') => void
  threshold?: number
  enableHapticFeedback?: boolean
}

export const SwipeDetector = ({ 
  children, 
  onSwipe, 
  threshold = 50,
  enableHapticFeedback = true 
}: SwipeDetectorProps) => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const [showIndicator, setShowIndicator] = useState(false)
  const [swipeProgress, setSwipeProgress] = useState(0)
  
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number } | null>(null)
  const hasTriggeredHaptic = useRef(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null
    hasTriggeredHaptic.current = false
    setSwipeProgress(0)
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }

    // Show preview indicator during swipe
    if (touchStart.current && touchEnd.current) {
      const deltaX = touchStart.current.x - touchEnd.current.x
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(touchStart.current.y - touchEnd.current.y)
      
      // Only show indicator for horizontal swipes
      if (absDeltaX > absDeltaY && absDeltaX > threshold / 3) {
        const direction = deltaX > 0 ? 'left' : 'right'
        const progress = Math.min(absDeltaX / threshold, 1)
        
        setSwipeDirection(direction)
        setSwipeProgress(progress)
        setShowIndicator(true)

        // Haptic feedback at 70% progress
        if (enableHapticFeedback && !hasTriggeredHaptic.current && progress > 0.7) {
          hapticFeedback.light()
          hasTriggeredHaptic.current = true
        }
      } else {
        setShowIndicator(false)
        setSwipeProgress(0)
      }
    }
  }

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return

    const deltaX = touchStart.current.x - touchEnd.current.x
    const deltaY = touchStart.current.y - touchEnd.current.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Only trigger if horizontal swipe is dominant and meets threshold
    if (absDeltaX > threshold && absDeltaX > absDeltaY) {
      const direction = deltaX > 0 ? 'left' : 'right'
      
      if (enableHapticFeedback) {
        hapticFeedback.medium()
      }
      
      onSwipe(direction)
    }

    setShowIndicator(false)
    setSwipeDirection(null)
    setSwipeProgress(0)
    hasTriggeredHaptic.current = false
    touchStart.current = null
    touchEnd.current = null
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {children}
      {swipeDirection && (
        <SwipeIndicator
          direction={swipeDirection}
          show={showIndicator}
          progress={swipeProgress}
          onAnimationComplete={() => setShowIndicator(false)}
        />
      )}
    </div>
  )
}

export default SwipeDetector