const request = require('supertest');
const {Procedure} = require('../../../models/procedure');
const {User} = require('../../../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
let server;


describe('/api/procedures',()=>{
    beforeEach(()=>{
        server = require('../../../index');
    });
    
    afterEach(async()=>{
        server.close();
        await Procedure.collection.deleteMany({});
        await User.collection.deleteMany({});
    });

    describe('GET /',()=>{

        const exec = () =>{
            return request(server)
                    .get('/api/procedures')
                    .set('x-auth-token',token);
        }

        let user;
        let token;
        let _id;
        let username;
        let password;
        let fullname;
        let role;
        let name;
        let amount;
        let dentist;
        let headDent;
        
        const dent = () => {
         return  {_id,
            username,
            password,
            fullname,
            role,
            headDent} 
        }
        const proc = () => {
            return  {
                name,
                amount,
                dentist
            }
           }

        beforeEach(async()=>{
            
            _id = new mongoose.Types.ObjectId();
            password = '123456@';
            username ='chejays23@gmail.com';
            fullname = 'Jayson De Vera';
            role = 'Head Dentist';
            headDent = undefined;
            user = new User (dent());

            token = user.generateAuthToken();
            await user.save();

            name = 'Cleaning';
            amount = 800;
            dentist = user._id;
            const procedure = new Procedure(proc());
            await procedure.save();
           
        });

        it('should return 401 if user is not logged in', async()=>{
            token ='';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        describe('if user has a headDent', () =>{

            it('should look for procedures of headDent',async()=>{
     
                newuser = new User({
                    username:'reden@gmail.com',
                    password:'12345@',
                    fullname:'Reden De Vera',
                    role:'Associate Dentist',
                    headDent: user._id
                });
                newuser.save();
       
                token = newuser.generateAuthToken();

                const res = await exec();


                expect(res.body[0]).toHaveProperty('_id');
                expect(res.body[0]).toHaveProperty('name','Cleaning');
                expect(res.body[0]).toHaveProperty('amount',800);
                expect(res.body[0].dentist).toHaveProperty('username','chejays23@gmail.com');
                expect(res.body[0].dentist).toHaveProperty('role','Head Dentist');
            });
        });

        describe('if user has no headDent',()=>{
            it('should return procedures of user', async()=>{
                
                const res = await exec();

                expect(res.body[0]).toHaveProperty('_id');
            })
        })

     

    })
})