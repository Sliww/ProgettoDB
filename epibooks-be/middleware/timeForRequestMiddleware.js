const timeForRequestMiddleware = (req, res, next) => {

    const initialTime = new Date();
    res.on("finish", ()=>{
        const duration = new Date() - initialTime;
        console.log(`Request: ${req.method}, Duration: ${duration} ms`)
    })

    next();
}

module.exports = timeForRequestMiddleware;