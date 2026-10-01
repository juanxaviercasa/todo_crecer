# Deriva, rollback y deprecación

La deriva compara digests esperados y observados. Una diferencia en configuración pide reconciliación; una diferencia de motor pausa; una diferencia de receta o diseño exige rollback.

El rollback se planifica con una referencia al checkpoint, deriva o decisión manual. Un actor distinto debe ejecutarlo. En esta fase la ejecución sólo actualiza el estado sintético local y conserva `external_changes: false`.

La deprecación nombra una versión sucesora, todos los sitios afectados, una fecha objetivo y bloqueos. Aprobar el plan no retira el activo ni migra sitios. La versión sólo puede considerarse retirada cuando ningún sitio dependa de ella y el plan haya cerrado.
