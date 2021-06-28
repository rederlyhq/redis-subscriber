import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { SocketStream } from 'fastify-websocket';
import Redis from 'ioredis';


export default async function clients(fastify: FastifyInstance): Promise<void> {
    fastify.get('/', { websocket: true, schema: { querystring: { token: { type: 'string' } }} }, async function (connection: SocketStream, request: FastifyRequest<{Querystring: {token: string}}>) {
        console.log('Getting base websocket route.');

        connection.socket.on('message', (message: unknown) => {
            console.log('Forbidden: Clients to the subcriber may not publish.');
            return connection.destroy();
        });

        const token = request.query.token;
        // TODO: Not sure if types are smarter than needing to specify all this.
        const jwt = fastify.jwt.decode<{data: {userId: number}, iat: number, exp: number}>(token);
        console.log(jwt);

        const userId = jwt?.data.userId;

        if (!userId) {
            console.log('Error, jwt failed to parse a userId.');
            return;
        }

        const redis = new Redis();

        connection.socket.on('close', () => {
            console.log('Connection closed, tearing down Redis.');
            redis.disconnect();
        });

        redis.subscribe(`user/${userId}`, (err, count) => {
            if (err) {
                // Just like other commands, subscribe() can fail for some reasons, ex network issues.
                console.error('Failed to subscribe: %s', err.message);
            } else {
                // `count` represents the number of channels this client are currently subscribed to.
                console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
            }
        });


        redis.on('message', (channel, message) => {
            console.log(`Received ${message} from ${channel}`);
            connection.socket.send(message);
        });

        // There's also an event called 'messageBuffer', which is the same as 'message' except
        // it returns buffers instead of strings.
        // It's useful when the messages are binary data.
        redis.on('messageBuffer', (channel, message) => {
            // Both `channel` and `message` are buffers.
            console.log(channel, message);
        });
    });
}
