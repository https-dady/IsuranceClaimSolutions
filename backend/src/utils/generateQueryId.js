const crypto = require("crypto");

const generateQueryId = () => {
    const firstPart = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

    const secondPart = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

    return `ICS-${firstPart}-${secondPart}`;
};

module.exports = generateQueryId;