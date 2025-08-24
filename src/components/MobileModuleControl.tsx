import { useLongPress } from '../hooks/useLongPress'

interface MobileModuleControlProps {
  module: {
    id: string
    name: string
    icon: React.ComponentType<{ size: number; className?: string }>
  }
  onShowQuickActions: (moduleId: string, moduleName: string, event?: React.TouchEvent | React.MouseEvent) => void
}

export default function MobileModuleControl({ module, onShowQuickActions }: MobileModuleControlProps) {
  const Icon = module.icon
  
  const longPressHandlers = useLongPress(
    () => onShowQuickActions(module.id, module.name),
    undefined,
    {
      threshold: 500,
      enableHapticFeedback: true,
      shouldPreventDefault: true
    }
  )

  return (
    <div 
      className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-secondary/30 transition-colors"
      {...longPressHandlers}
    >
      <Icon size={18} className="text-primary" />
      <span className="font-medium text-sm">{module.name}</span>
    </div>
  )
}