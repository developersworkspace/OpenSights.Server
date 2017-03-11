export let config = {
    production: false,
    datastores: {
        mongo: {
            uri: 'mongodb://mongo:27017/opensights_dev'
        }
    },
    logging: {
        path: './'
    }
};