const trimString = (str) => {
    if (!str) return str;

    const trimmedStr = str.replace(/\s+/g, ' ');

    return trimmedStr.trim();
};

module.exports = { 
    trimString 
};
