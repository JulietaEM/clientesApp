import { StyleSheet, Text, View } from 'react-native';
import { ActionIcon } from '../components/ActionIcon';
import { useResponsive } from '../hooks/useResponsive';
import { palette, radius, spacing } from '../theme';
import type { PurchaseResponse } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

const pencilIcon = require('../../assets/pencilIcon.png');
const trashIcon = require('../../assets/trashIcon.png');

type Props = {
  purchase: PurchaseResponse;
  onEdit: (detailId: number) => void;
  onDelete: (detailId: number) => void;
};

export function CompraScreen({ purchase, onEdit, onDelete }: Props) {
  const { header, details } = purchase;
  const { isTablet } = useResponsive();

  return (
    <View style={styles.layout}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Encabezado</Text>
        {header ? (
          <View style={styles.headerGrid}>
            <Text style={styles.headerItem}>ID Factura: {header.idEncabezado}</Text>
            <Text style={styles.headerItem}>Cliente: {header.cliente}</Text>
            <Text style={styles.headerItem}>Fecha: {formatDate(header.fecha)}</Text>
          </View>
        ) : (
          <Text style={styles.emptyText}>Aún no tienes una compra creada.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detalles</Text>
        {details.length === 0 ? (
          <Text style={styles.emptyText}>Agrega productos desde Home para ver la factura.</Text>
        ) : !isTablet ? ( //Si es una tablet o móvil -> Cards
          <View style={styles.mobileList}>
            {details.map((detail) => (
              <View key={detail.idDetalles} style={styles.mobileDetailCard}>
                <View style={styles.mobileDetailTop}>
                  <Text style={styles.mobileProductName}>{detail.nombreProducto}</Text>
                  <View style={styles.mobileActions}>
                    <ActionIcon source={pencilIcon} onPress={() => onEdit(detail.idDetalles)} />
                    <ActionIcon source={trashIcon} onPress={() => onDelete(detail.idDetalles)} />
                  </View>
                </View>

                <View style={styles.mobileInfoGrid}>
                  <View style={styles.mobileInfoItem}>
                    <Text style={styles.mobileLabel}>Cantidad</Text>
                    <Text style={styles.mobileValue}>{detail.cantidad}</Text>
                  </View>
                  <View style={styles.mobileInfoItem}>
                    <Text style={styles.mobileLabel}>Valor unitario</Text>
                    <Text style={styles.mobileValue}>{formatCurrency(detail.valorUnitario)}</Text>
                  </View>
                  <View style={styles.mobileInfoItem}>
                    <Text style={styles.mobileLabel}>Descuento</Text>
                    <Text style={styles.mobileValue}>{formatCurrency(detail.descuento)}</Text>
                  </View>
                  <View style={styles.mobileInfoItem}>
                    <Text style={styles.mobileLabel}>Subtotal</Text>
                    <Text style={styles.mobileSubtotal}>{formatCurrency(detail.subtotal)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : ( //Si es desktop -> Tabla
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, styles.headerCell, styles.productCell]}>Producto</Text>
              <Text style={[styles.cell, styles.headerCell]}>Cantidad</Text>
              <Text style={[styles.cell, styles.headerCell]}>Valor unitario</Text>
              <Text style={[styles.cell, styles.headerCell]}>Subtotal</Text>
              <Text style={[styles.cell, styles.headerCell]}>Editar / Eliminar</Text>
            </View>
            {details.map((detail) => (
              <View key={detail.idDetalles} style={styles.tableRow}>
                <Text style={[styles.cell, styles.productCell]}>{detail.nombreProducto}</Text>
                <Text style={styles.cell}>{detail.cantidad}</Text>
                <Text style={styles.cell}>{formatCurrency(detail.valorUnitario)}</Text>
                <Text style={styles.cell}>{formatCurrency(detail.subtotal)}</Text>
                <View style={[styles.cell, styles.actionsCell]}>
                  <ActionIcon source={pencilIcon} onPress={() => onEdit(detail.idDetalles)} />
                  <ActionIcon source={trashIcon} onPress={() => onDelete(detail.idDetalles)} />
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.summary}> 
          <Text style={styles.summaryItem}>Subtotal: {formatCurrency(header?.subTotal || 0)}</Text>
          <Text style={styles.summaryItem}>Descuento total: {formatCurrency(header?.descuentoTotal || 0)}</Text>
          <Text style={styles.summaryTotal}>Total a pagar: {formatCurrency(header?.total || 0)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    gap: spacing.lg,
  },
  card: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  cardTitle: {
    color: palette.primary,
    fontSize: 24,
    fontWeight: '800',
  },
  headerGrid: {
    gap: spacing.sm,
  },
  headerItem: {
    color: palette.text,
    fontSize: 15,
  },
  mobileList: {
    gap: spacing.md,
  },
  mobileDetailCard: {
    backgroundColor: '#F8FAF7',
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  mobileDetailTop: {
    gap: spacing.sm,
  },
  mobileProductName: {
    color: palette.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  mobileActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  mobileInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  mobileInfoItem: {
    flexGrow: 1,
    minWidth: 120,
  },
  mobileLabel: {
    color: palette.textMuted,
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  mobileValue: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '600',
  },
  mobileSubtotal: {
    color: palette.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  table: {
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#EDF4EC',
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  tableRow: {
    borderTopColor: palette.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  cell: {
    color: palette.text,
    flex: 1,
    fontSize: 14,
    paddingHorizontal: spacing.sm,
    textAlign: 'center',
  },
  headerCell: {
    color: palette.primary,
    fontWeight: '800',
  },
  productCell: {
    flex: 1.6,
    textAlign: 'left',
  },
  actionsCell: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  summary: {
    alignSelf: 'flex-end',
    gap: 6,
    marginTop: spacing.md,
  },
  summaryItem: {
    color: palette.text,
    fontSize: 15,
    textAlign: 'right',
  },
  summaryTotal: {
    color: palette.primary,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
  },
  emptyText: {
    color: palette.textMuted,
    fontSize: 15,
  },
});
