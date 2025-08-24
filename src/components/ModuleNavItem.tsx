import { useLongPress } from '../hooks/useLongPress'

interface ModuleNavItemProps {
  module: {
    id: string
    name: string
    icon: React.ComponentType<{ size: number; className?: string }>
  }
  isActive: boolean
  onModuleSelect: (moduleId: string) => void
  onShowQuickActions: (moduleId: string, moduleName: string, event?: React.TouchEvent | React.MouseEvent) => void
}

export default function ModuleNavItem({ 
  module, 
  isActive, 
  onModuleSelect, 
  onShowQuickActions 
}: ModuleNavItemProps) {
  const Icon = module.icon

  const longPressHandlers = useLongPress(
    () => onShowQuickActions(module.id, module.name),
    () => onModuleSelect(module.id),
    {
      threshold: 500,
      enableHapticFeedback: true,
      shouldPreventDefault: true
    }
  )

  return (
    <button
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? "bg-primary text-primary-foreground shadow-sm" 
          : "hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
      }`}
      onClick={() => onModuleSelect(module.id)}
      {...longPressHandlers}
    >
      <Icon size={20} className="flex-shrink-0" />
      <span className="font-medium text-sm">{module.name}</span>
      {isActive && (
        <div className="ml-auto w-2 h-2 bg-primary-foreground/70 rounded-full"></div>
      )}
    </button>
  )
}