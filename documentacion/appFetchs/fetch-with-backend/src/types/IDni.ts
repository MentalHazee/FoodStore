// ============================================
// TIPOS E export interfaceS - Basados en tus DTOs
// ============================================

export interface FotoCreate {
  nombre: string;
  url: string;
}

export interface FotoDto {
  id: number;
  nombre: string;
  url: string;
}

export interface DniCreate {
  nombre: string;
  numero: number;
  fechaVencimiento: string;
  foto: FotoCreate;
}

export interface DniDto {
  id: number;
  nombre: string;
  numero: number; // Agregado según tu DTO actualizado
  fechaCreacion: string;
  fechaVencimiento: string;
  foto: FotoDto;
}

export interface DniEdit {
  nombre: string;
  numero: number;
  fechaVencimiento: string;
  foto: FotoEdit;
}

export interface FotoEdit {
  nombre: string;
  url: string;
}