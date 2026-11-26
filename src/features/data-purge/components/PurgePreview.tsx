import type { PurgePreview } from "../api/types";

interface PurgePreviewProps {
  preview: PurgePreview | null;
}

export function PurgePreview({ preview }: PurgePreviewProps) {
  if (!preview) {
    return null;
  }

  const { expenseCount, incomeCount, totalCount, olderThanDays } = preview;

  return (
    <div className="bg-muted/50 rounded-lg p-4 border border-border">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium">Vista previa de purga</h3>
          <p className="text-xs text-muted-foreground">
            Se eliminarán registros con más de {olderThanDays} días de antigüedad.
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Gastos</span>
          <span className="font-medium">{expenseCount}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Ingresos</span>
          <span className="font-medium">{incomeCount}</span>
        </div>
      </div>
      {totalCount > 0 && (
        <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
          <span className="text-muted-foreground">Total a eliminar:</span>
          <span className="text-destructive">{totalCount}</span>
        </div>
      )}
      {totalCount === 0 && (
        <div className="mt-2 text-sm text-muted-foreground">
          No hay registros antiguos para eliminar.
        </div>
      )}
    </div>
  );
}
