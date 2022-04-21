require('dotenv').config({ debug: true });
const {User} = require('../model/index');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;


const userServices = {
    create: async function (userData){
        let results = {
            message:null,
            status:null,
            data:null
        };

        const {username, password, name, email} = userData;

        let user = await User.findOne({where:{username}});
        
        if(user != null){
            results.status = 403;
            results.message = 'Username already exists.'
            return results;
        };

        user = await User.findOne({where:{email}});

        if(user != null){
            results.status = 403;
            results.message = 'Email already exists.'
            return results;
        };


        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        try{
            const newUser = await User.create({
                hashedPassword:hashedPassword,
                username,
                name,
                email
            });

            results.status = 201;
            results.message = `User ${newUser.username} created.`
            results.data = {
                username:newUser.username,
                email:newUser.email,
            }

        }catch(err){
            results.status = 500;
            results.message = err;
            console.log(err);

        };

        return results;
    },

    login: async function (credentials){

        let results = {
            message:null,
            status:null,
            jwtToken:null,
            userId:null,
        };

        const {username, email, password} = credentials;

        let existingUser;

        if (username){
            existingUser = await User.findOne({where:{username}});
        } else if (email){
            existingUser = await User.findOne({where:{email}});
        };

        if (!existingUser){
            results.status = 401,
            results.message = "Log in failed due to invalid user.";
            return results;
        };

        let passwordVerified = await bcrypt.compare(password, existingUser.hashedPassword);

        if(!passwordVerified){
            results.status = 401;
            results.message = "Log in failed due to invalid password.";
            return results;
        };

        let token;

        try{
            token = jwt.sign({
                username:existingUser.username,
                userId: existingUser.userId,
            }, jwtSecret,{expiresIn: "30 days"})

        } catch(err){
            console.log(err);
            results.status = 500;
            results.message = err;
            return results
        }

        let decoded = jwt.decode(token);

        results.status = 201;
        results.message = "Log in successful";
        results.userId = existingUser.userId;
        results.jwtToken = token;
        results.jwtExpires = new Date(decoded.exp*1000);


        return results;
    },

    delete: async function (username, tokenData){
        let results = {
            status:null,
            message:null,
        }
        if (username!==tokenData.username){
            results.status = 401;
            results.message = 'User not authorized to perform this action'
            return results;
        }

        let existingUser = await User.findOne({where:{username}});

        console.log(existingUser);

        if(!existingUser){
            results.status=404;
            results.message = `${username} not found`;
            return results;
        };

        try{

            await User.destroy({where: {username}});

            results.status = 200;

            results.message = `${username} sucessfully deleted`;

            return results;
        }catch(err){

            console.log(err);
            results.status = 500;

            results.message = err;

            return results;
        }

    },

    existingUser: async function (data){

        let results = {
            status: null,
            message: null,
        }

        if(data.username){

            try{

                const user = await User.findOne({where:{username:data.username}});

                results.status = 200;

                if (user){
                    results.message = true;
                } else{
                    results.message = false;
                }

                return results;

            } catch(err){
                console.log(err)
                results.status =500;
                results.message = "Search failed.";
                return results;

            }
        }else if (data.email){
            try{

                const user = await User.findOne({where:{email:data.email}});

                results.status = 200;

                if (user){
                    results.message = true;
                } else{
                    results.message = false;
                }

                return results;

            } catch(err){
                console.log(err)
                results.status =500;
                results.message = "Search failed.";
                return results;

            }
        }

        
    }
}

module.exports = userServices;