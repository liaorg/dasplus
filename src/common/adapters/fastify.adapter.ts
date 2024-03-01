// import FastifyMultipart from '@fastify/multipart'
import { FastifyAdapter } from '@nestjs/platform-fastify';

const app: FastifyAdapter = new FastifyAdapter({
    trustProxy: true,
    logger: false,
    // forceCloseConnections: true,
});
export { app as fastifyApp };

// app.register(FastifyMultipart, {
//     limits: {
//         fields: 10, // Max number of non-file fields
//         fileSize: 1024 * 1024 * 6, // limit size 6M
//         files: 5, // Max number of file fields
//     },
// });

app.getInstance().addHook('onRequest', (request, reply, done) => {
    // set undefined origin
    const { origin } = request.headers;
    if (!origin) request.headers.origin = request.headers.host;
    const { url } = request;
    // skip favicon request
    if (url.match(/favicon.ico$/) || url.match(/manifest.json$/)) return reply.code(204).send();

    done();
});
