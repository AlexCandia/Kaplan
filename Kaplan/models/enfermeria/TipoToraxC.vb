﻿Imports Kaplan.Clases
Namespace Tipos

    Public Class TipoToraxC
        Inherits BaseType
        Private Shared CachedTipo As New CachedType(Of TipoToraxC)
        Private Shared CachedCollection As New Dictionary(Of Integer, TipoToraxC)
        Shared Sub New()
            CachedTipo.DataPackage = "ListarTipoFEToraxC"
        End Sub
        Shared Function getTipos() As List(Of TipoToraxC)
            CachedTipo.CachedCollection = CachedCollection
            Return CachedTipo.getTipos
        End Function
        Shared Function getTipo(prmID As Integer) As TipoToraxC
            CachedTipo.CachedCollection = CachedCollection
            Return CachedTipo.getTipo(prmID)
        End Function
        Shared Sub Release()
            CachedCollection.Clear()
        End Sub
    End Class
End Namespace