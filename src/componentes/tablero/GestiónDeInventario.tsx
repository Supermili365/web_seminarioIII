import React from 'react';
import InventoryManagement, { InventoryManagement as InventoryManagementNamed } from '../../components/dashboard/InventoryManagement';
import { NavigateHandler } from '../../types/navigation.types';

export interface GestionDeInventarioProps {
  onNavigate: NavigateHandler;
}

// Compatibilidad: componente espejo para ramas que usan la ruta en español.
export const GestionDeInventario: React.FC<GestionDeInventarioProps> = ({ onNavigate }) => (
  <InventoryManagement onNavigate={onNavigate} />
);

export default GestionDeInventario;
export { InventoryManagementNamed as InventoryManagement };
