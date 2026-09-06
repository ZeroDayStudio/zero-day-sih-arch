function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: 'A record with those values already exists' });
  }

  if (error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Malformed JSON request body' });
  }

  console.error(error);
  return res.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : 'Internal server error',
  });
}

module.exports = { notFound, errorHandler };