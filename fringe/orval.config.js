module.exports = {
    myapi: {
        input: {
            target: 'http://localhost:5098/swagger/v1/swagger.json',
        },
        output: {
            mode: 'split',
            target: './services/api',
            schemas: './types/api/',
            client: 'react-query',
            override: {
                mutator: {
                    path: './services/api/mutator/custom-instance.ts',
                    name: 'customInstance',
                },
            },
        },
    },
};