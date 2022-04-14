const testCode = require('../user.controller');
const {userServices} = require('../../services');
const expectExport = require('expect');

jest.mock('../../services', ()=>{
    return{
        userServices: {
            create:jest.fn(),
            login:jest.fn()
        },
    }
})

afterEach(()=>{
    jest.clearAllMocks();
})

const req = {
    body:{
        username: "duck",
        password: "duckie123",
        email: "duckie@fishpond.com",
        name: "chicken",
    }
}


describe('Tests for user creation', ()=>{
    test('Test 1: Returns status 200 when user creation is successful', async ()=>{
        const res = {
            status:jest.fn(),
            json:jest.fn(),
        };

        const createUserSpy = jest.spyOn(userServices, 'create').mockResolvedValue({
            status:201,
            message: `User ${req.username} created.`,
            data:{
                username:req.username,
                email:req.email,
            }
        })

        const returnStatusSpy = jest.spyOn(res,'status');
        const returnValueSpy = jest.spyOn(res,'json');

        await testCode.create(req, res);

        expectExport(createUserSpy).toBeCalledWith(req.body);

        expect(returnStatusSpy).toBeCalledWith(201),
        expect(returnValueSpy).toBeCalledWith({
            message: `User ${req.username} created.`,
            data:{
                username:req.username,
                email:req.email,
            }
        })
    })
})

describe('Tests for user login', ()=>{
    test('Test 1: Returns status 201 when user login is successful', async ()=>{
        const res = {
            status:jest.fn(),
            json:jest.fn(),
        };

        const loginSpy = jest.spyOn(userServices, 'login').mockResolvedValue({
            status:201,
            message: `User ${req.username} logged in.`,
            jwt:'ASDFAF12515sad'
        })

        const returnStatusSpy = jest.spyOn(res,'status');
        const returnValueSpy = jest.spyOn(res,'json');

        await testCode.login(req, res);

        expectExport(loginSpy).toBeCalledWith(req.body);

        expect(returnStatusSpy).toBeCalledWith(201),
        expect(returnValueSpy).toBeCalledWith({
            message: `User ${req.username} logged in.`,
            jwt: 'ASDFAF12515sad',
        })
    })
})