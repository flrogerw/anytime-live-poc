const axios = require('axios');
const axiosConfig = {
    headers: {
        'content-type': 'application/json',
    },
    auth: {
        username: process.env.SIGNALWIRE_PROJECT_KEY,
        password: process.env.SIGNALWIRE_TOKEN,
    }
};

const getToken = async (user) => {
    const params = {
        uuid: user,
        info: {},
        "space": process.env.SIGNALWIRE_SPACE,
    }
    const body = JSON.stringify(params);
    return axios.post(`${process.env.CHAT_INSTANCE}/create_token`, body, axiosConfig)
        .then(token => { return { token: token.data.token } })
        .catch(error => { throw (error) })
}

module.exports = {
    getToken
};