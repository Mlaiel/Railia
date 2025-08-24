import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from '@phosphor-icons/react'

export default function TestComponent() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle size={20} className="text-green-500" />
            Test-Komponente erfolgreich geladen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Diese einfache Test-Komponente zeigt, dass die Basis-Funktionalität korrekt funktioniert.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}