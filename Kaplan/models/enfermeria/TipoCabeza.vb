﻿Imports Kaplan.Clases
Namespace Tipos

    Public Class TipoCabeza
        Inherits BaseType
        Private Shared CachedTipo As New CachedType(Of TipoCabeza)
        Private Shared CachedCollection As New Dictionary(Of Integer, TipoCabeza)
        Shared Sub New()
            CachedTipo.DataPackage = "ListarTipoFECabeza"
        End Sub
        Shared Function getTipos() As List(Of TipoCabeza)
            CachedTipo.CachedCollection = CachedCollection
            Return CachedTipo.getTipos
        End Function
        Shared Function getTipo(prmID As Integer) As TipoCabeza
            CachedTipo.CachedCollection = CachedCollection
            Return CachedTipo.getTipo(prmID)
        End Function
        Shared Sub Release()
            CachedCollection.Clear()
        End Sub
    End Class
End Namespace