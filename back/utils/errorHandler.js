function enviarErro(res, statusCode, message, error) {
  const payload = { erro: message };
  if (error) payload.detalhes = error.message || String(error);
  return res.status(statusCode).json(payload);
}

module.exports = { enviarErro };
