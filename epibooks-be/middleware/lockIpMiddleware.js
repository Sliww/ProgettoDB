const lockIpMiddleware = (lockedIp) => {
    
    return (req, res, next) => {
        const { ip } = req
        if (lockedIp.includes(ip)) {
            return res
                .status(403)
                .send({
                    statusCode: 403,
                    message: "Forbidden: your IP in banned from this site"
                })
        }
        next()
    }
}

module.exports = lockIpMiddleware