
exports.authentication = async (req,res,next)=>{
    try {
        let bearerToken = req.headers["authorization"]
        if (typeof bearerToken == "undefined") {
            return res.status(400).send({ status: false, message: "bearer token is missing" })
        }
        bearerToken = bearerToken.split(" ")[1]
        jwt.verify(bearerToken, "SecretKey",function (err, result) {
            if (err) return res.status(401).send({ status: false, message: err })
            else {
                req.userId = result.userId
                if(result.type!="admin")return res.status(400).send({status:false,message:"You are not an Admin"})
                next()
            }
        })
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}