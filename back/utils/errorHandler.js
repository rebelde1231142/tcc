function enviarErro(res, statusCode, message, error) {
  const isDev = process.env.NODE_ENV !== 'production';
  const payload = { erro: message };
  if (isDev && error) payload.detalhes = error.message || String(error);
  return res.status(statusCode).json(payload);
}

module.exports = { enviarErro };
