import app from './app';

const http = require('http');

const port = 8080;
const httpServer = http.createServer(app);

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(server: { address: () => { address: string; family: string; port: number } }, protocol: string) {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`${protocol} server listening on ${bind}`);
}

httpServer.listen(port);
httpServer.on('http error', onError);
httpServer.on('listening', () => onListening(httpServer, 'HTTP'));
