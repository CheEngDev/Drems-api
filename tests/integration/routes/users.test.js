const request = require('supertest');
const {User} = require('../../../models/user');
const mongoose = require('mongoose');
let server;


describe('/api/users', ()=>{
    beforeEach(()=> {server = require('../../../index');});
    afterEach(async() => {
        server.close();
        await User.collection.deleteMany({});});

    describe('GET /',()=>{
        let token;

        beforeEach(()=> {
            token = new User({}).generateAuthToken();
        });

        it('should return 401 if user is not logged in', async()=>{
            token = '';

            const res = await request(server).get('/api/users');

            expect(res.status).toBe(401);
        });

        it('should return all users',async()=>{
            await User.collection.insertMany([{
                username:'chejaysdv@gmail.com',
                password:'5576@',
                fullname:'Jayson De Vera',
                role:'Associate Dentist'
                },
                {username:'remskie@gmail.com',
                password:'5576@',
                fullname:'Remelyn Rinon',
                role:'Head Dentist'}]);
            
  
            const res = await request(server).get('/api/users').set('x-auth-token',token);
        
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0]).toHaveProperty('_id');
            expect(res.body[0]).toHaveProperty('username','chejaysdv@gmail.com');
            expect(res.body[0]).toHaveProperty('fullname','Jayson De Vera');
            expect(res.body[0]).toHaveProperty('clinicName');
            expect(res.body[0]).toHaveProperty('role','Associate Dentist');

            expect(res.body[1]).toHaveProperty('_id');
            expect(res.body[1]).toHaveProperty('username','remskie@gmail.com');
            expect(res.body[1]).toHaveProperty('fullname','Remelyn Rinon');
            expect(res.body[1]).toHaveProperty('clinicName');
            expect(res.body[1]).toHaveProperty('role','Head Dentist');
        })
    });

    describe('GET /dashboard',()=>{
        beforeEach(async()=>{
            const payload = {
                _id: new mongoose.Types.ObjectId().toHexString(),
                username:'chejaysdv@gmail.com',
                password:'12345',
                fullname:'Jayson De Vera',
                role: 'Associate Dentist'
            }

            const user = new User(payload);

            token = user.generateAuthToken();
            await user.save();
        })

        it('should return 401 if user is not logged in', async()=>{

            const res = await request(server).get('/api/users');

            expect(res.status).toBe(401);
        });

        it('should return the user',async()=>{
         
           const res = await request(server).get('/api/users/dashboard').set('x-auth-token',token);
            
           expect(res.body).toHaveProperty('_id');
           expect(res.body).toHaveProperty('username','chejaysdv@gmail.com');
           expect(res.body).toHaveProperty('fullname','Jayson De Vera');
           expect(res.body).toHaveProperty('clinicName');
           expect(res.body).toHaveProperty('role','Associate Dentist');
        })
    });

    describe('POST /', ()=>{

       let username;
       let password;
       let fullname;
       let role;
       let headDent;
       let assocDent;

        const exec = () => {
                return request(server)
                        .post('/api/users')
                        .send({
                            username,
                            password,
                            fullname,
                            role,
                            headDent,
                            assocDent
                           });
           }

        beforeEach(()=>{
            username = 'chejaysdv@gmail.com';
            password = '5576@';
            fullname = 'Jayson De Vera';
            role = 'Associate Dentist';
            headDent=undefined;
            assocDent=undefined;
           }); 

        it('should return 400 if username is not a valid email',async()=>{
            username = 'ambabangil';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if pw is less than 5 char',async()=>{
            password = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if pw is too long',async()=>{
            password = '1234567890123';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if role is not in option',async()=>{
            role = 'alalay';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if user already registered',async()=>{
            let olduser = new User ({
                username:'chejaysdv@gmail.com',
                password:'5576@',
                fullname:'Jayson De Vera',
                role:'Associate Dentist',
            });

            await olduser.save();

            const res = await exec();

            expect(res.status).toBe(400);

        });
     
        describe('role is Associate dentist', ()=>{


            it('should set assocDent of headDent', async()=>{
                let owner = new User ({
                    _id: new mongoose.Types.ObjectId().toHexString(),
                    username:'remzkie@gmail.com',
                    password:'5576@',
                    fullname:'Remelyn Rinon',
                    clinicName:'Denti',
                    role:'Head Dentist',
                });
                
                await owner.save();
                

                headDent = owner._id.toHexString();

                const res = await exec();
                owner = await User.findById(owner._id);
                const id = owner._id.toHexString();
                
                expect(res.body).toHaveProperty('fullname','Dr. Jayson De Vera');
                expect(res.body).toHaveProperty('role','Associate Dentist');
                expect(res.body).toHaveProperty('clinicName','Denti');
                expect(res.body.headDent).toBe(id);
    
            });

            it('should return user without headDent', async()=>{

                const res = await exec();

                expect(res.body).toHaveProperty('fullname','Dr. Jayson De Vera');
                expect(res.body).toHaveProperty('role','Associate Dentist');
            });
        });

        describe('role is Head Dentist',()=>{
            it('should set headDent of assocDent',async()=>{
                let assoc = new User ({
                    _id: new mongoose.Types.ObjectId().toHexString(),
                    username:'remzkie@gmail.com',
                    password:'5576@',
                    fullname:'Remelyn Rinon',
                    role:'Associate Dentist'
                });

                await assoc.save();

                assocDent = assoc._id;
                role = 'Head Dentist';
                assoc = await User.findById(assoc._id);
                id = assoc._id.toHexString();

                const res = await exec();
                
                expect(res.body).toHaveProperty('_id');
                expect(res.body).toHaveProperty('fullname', 'Dr. Jayson De Vera');
                expect(res.body).toHaveProperty('clinicName');
                expect(res.body.assocDent).toBe(id);
                expect(res.body.clinicName).toBe(assoc.clinicName);
                
                
            });

            it('should return user without assocDent',async()=>{
                role = 'Head Dentist';

                const res = await exec();
                expect(res.body).toHaveProperty('fullname','Dr. Jayson De Vera');
                expect(res.body).toHaveProperty('role','Head Dentist');

            })
        })
    });
    
    describe('PUT /', ()=>{
        let username;
        let password;
        let fullname;
        let role;
        let token
 
        const exec = (id) => {
            return request(server)
                .put(`/api/users/${id}`)
                .send({
                    username,
                    password,
                    fullname,
                    role
                        })
                .set('x-auth-token',token)}

        
        const payload = {
            _id: new mongoose.Types.ObjectId(),
            username:'chejays2@gmail.com',
            password:'55765@',
            fullname: 'Jayson Devs',
            role:'Head Dentist'}

         beforeEach(async ()=>{
            username = 'chejaysdv@gmail.com';
            password = '5576@';
            fullname = 'Jayson De Vera';
            role = 'Associate Dentist';
            
            const user = new User(payload);   

            await user.save();
            token = user.generateAuthToken();

            });

        it('should return 401 if user is not logged in', async()=>{
            token = '';
    
            const res = await exec(payload._id);
            
            expect(res.status).toBe(401);
        });

        it('should return 400 if username is not a valid email',async()=>{
            username = 'ambabangil';
            const res = await exec(payload._id);
            expect(res.status).toBe(400);
        });
        
        it('should return 400 if pw is too long',async()=>{
            password = '1234567890123';
            const res = await exec(payload._id);

            expect(res.status).toBe(400);
        });
        
        it('should return 400 if role is not in option',async()=>{
            role = 'alalay';
            const res = await exec(payload._id);
            expect(res.status).toBe(400);
        });

        it('should update the user',async()=>{
          const theuser = await User.findById(payload._id);
          
          const res = await exec(payload._id);
          
          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('fullname','Dr. Jayson De Vera');
          expect (res.body).toHaveProperty('role','Associate Dentist');
        });
    })
})