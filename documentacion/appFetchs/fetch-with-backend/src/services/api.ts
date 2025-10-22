const API_BASE_URL = import.meta.env.VITE_API_URL;

import type { DniCreate, DniDto, DniEdit } from "../types/IDni";
// ============================================
// FUNCIONES DE LA API - Uso correcto de FETCH con Arrow Functions
// ============================================

/**
 * Ejemplo 1: POST - Crear un DNI
 * Muestra cómo enviar datos JSON al servidor
 */
export const createDni = async (dniData: DniCreate): Promise<DniDto> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dniData),
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    // Parsear la respuesta JSON
    const data: DniDto = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear DNI:", error);
    throw error;
  }
};

/**
 * Ejemplo 2: GET - Obtener todos los DNIs
 * Muestra cómo obtener una lista de recursos
 */
export const getAllDnis = async (): Promise<DniDto[]> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    // Tu backend retorna un array directamente desde el controller
    const data: DniDto[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener DNIs:", error);
    throw error;
  }
};

/**
 * Ejemplo 3: GET - Obtener un DNI por ID
 * Muestra cómo obtener un recurso específico
 */
export const getDniById = async (id: number): Promise<DniDto> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data: DniDto = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al obtener DNI con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Ejemplo 4: PUT - Actualizar un DNI completo
 * Muestra cómo actualizar un recurso existente
 */
export const updateDni = async (
  id: number,
  dniData: DniEdit
): Promise<DniDto> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dniData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data: DniDto = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al actualizar DNI con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Ejemplo 5: DELETE - Eliminar un DNI
 * Muestra cómo eliminar un recurso
 */
export const deleteDni = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error(`Error al eliminar DNI con ID ${id}:`, error);
    throw error;
  }
};
