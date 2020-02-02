/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
const request = require('request');

const init = async () => {
    const server = new Server({
        port: 4233,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['http://localhost:4200'],
                headers: ['Accept', 'Content-Type']
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: async (req, reply) => {
            const [symbol, timePeriod, token] = ['AAPL', '1M', 'pk_e8c2bd225b264096be5fb2acbf4fb747'];
            const response = server.methods.getData(symbol, timePeriod, token);
            return response;
        }
    });

    const getAPIData = function (symbol, timePeriod, token) {
        const url =
            'https://sandbox.iexapis.com/beta/stock/' + symbol + '/chart/' + timePeriod + '?token=' + token;
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (response && response['statusCode'] === 200) {
                    resolve(body);
                }
            });
        });
    };

    server.method('getData', getAPIData, {
        cache: {
            expiresIn: 10 * 100000,
            generateTimeout: 2000000
        },
        generateKey: (symbol, timePeriod) => symbol + '_' + timePeriod
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

init();
