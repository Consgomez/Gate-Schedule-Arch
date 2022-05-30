let jwt = require('jsonwebtoken');

function verifyToken(req, res, next)
{
    let token = req.cookies.token || '';

    if(!token){
        return res.redirect('/login');
    }
    else {
        jwt.verify(token, process.env.SECRET, async(err, datos) => {
            if(err){
                console.log(err);
                return res.redirect('login');
            }
            else {
                req.userId = datos.id;
                next();
            }
        })
    }
}

module.exports = verifyToken;