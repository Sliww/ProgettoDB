const routeNotFoundHandler = ( req, res, next ) => {
    res
        .status(404)
        .send({
            statusCode: 404,
            message: "Ops... the requested route does not exist."
        })
}

module.exports = routeNotFoundHandler