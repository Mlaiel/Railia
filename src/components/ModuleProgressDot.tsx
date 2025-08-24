import { useLongPress } from '../hooks/useLongPress'

interface ModuleProgressDotProps {
  module: {
    id: string
    name: string
    icon: React.ComponentType<{ size: number; className?: string }>
  }
  index: number
  isActive: boolean
  onModuleSelect: (moduleId: string) => void
  onShowQuickActions: (moduleId: string, moduleName: string, event?: React.TouchEvent | React.MouseEvent) => void
}

export default function ModuleProgressDot({ 
  module, 
  index, 
  isActive, 
  onModuleSelect, 
  onShowQuickActions 
}: ModuleProgressDotProps) {
  const longPressHandlers = useLongPress(
    () => onShowQuickActions(module.id, module.name),
    () => onModuleSelect(module.id),
    {
      threshold: 400,
      enableHapticFeedback: true,
      shouldPreventDefault: true
    }
  )

  return (
    <button
      onClick={() => onModuleSelect(module.id)}
      className={`w-2 h-2 rounded-full transition-all duration-200 ${
        isActive 
          ? 'bg-primary w-6' 
          : 'bg-border hover:bg-border/80'
      }`}
      {...longPressHandlers}
    />
  )
}