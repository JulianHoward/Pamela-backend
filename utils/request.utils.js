export const checkRequiredFields = (requiredFields, body) => {
  const fieldsWithErrors = [];
  const data = body ?? {}; // <- evita crash si body es undefined
  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      (typeof data[field] === "string" && data[field].trim() === "")
    ) {
      fieldsWithErrors.push(field);
    }
  }
  return fieldsWithErrors;
};

export const sendError500 = (res, error, message = "Error interno del servidor") => {
  // Log útil en desarrollo
  console.error("[sendError500]", message, error);

  // Respuesta consistente
  return res.status(500).json({
    ok: false,
    message,
    // Expón detalles solo en desarrollo; ajusta según tu preferencia
    error: process.env.NODE_ENV === "development" ? String(error) : undefined,
  });
};
