exports.base64 = (stringToEncode) => {
    let encodedString = Buffer.from(stringToEncode, 'ascii');
    return encodedString.toString('base64')
}