module.exports = {
    "extends": "airbnb-base",
    "plugins": ["jest"],
    "rules": {
        "no-unused-vars": "warn",
        "no-console": "off"
    },
    "globals": {
        "jest": true,
    },
    "env": {
        "jest/globals": true
    }
};