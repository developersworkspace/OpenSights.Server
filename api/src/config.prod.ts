export let config = {
    production: true,
    datastores: {
        mongo: {
            uri: 'mongodb://mongo:27017/opensights_prod'
        }
    },
    logging: {
        path: '/logs'
    }
};