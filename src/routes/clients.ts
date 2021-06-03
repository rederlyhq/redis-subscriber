import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { SocketStream } from 'fastify-websocket';


export default async function clients(fastify: FastifyInstance): Promise<void> {
    fastify.get('/', {websocket: true}, async function (connection: SocketStream, _request: FastifyRequest) {
        console.log('Getting base websocket route.');
        connection.on('open', (message: unknown) => {
            console.log('Got an open event.');
            connection.socket.send('New message');
        });
        connection.socket.on('connection', (message: unknown) => {
            console.log('Got an connection event.');
            connection.socket.send('New message');
        });
        connection.socket.on('message', (message: unknown) => {
            console.log('Got an message event.');
            connection.socket.send('New message');
        });
    });
}
