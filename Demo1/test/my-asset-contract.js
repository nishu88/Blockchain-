/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { CustomervalidContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('CustomervalidContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new CustomervalidContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('EMP0').resolves(Buffer.from('{"value":"customervalid 1001 value"}'));
        ctx.stub.getState.withArgs('EMP1').resolves(Buffer.from('{"value":"customervalid 1002 value"}'));
    });


    describe('#querydata', () => {

        it('should return true for a customervalid', async () => {
            await contract.querydata(ctx, 'EMP0').should.eventually.be.true;
        });

        it('should return false for a customervalid that does not exist', async () => {
            await contract.querydata(ctx, 'EMP5').should.eventually.be.false;
        });

    });

    describe('#querydata', () => {

        it('should return a customervalid', async () => {
            await contract.querydata(ctx, 'EMP0').should.eventually.deep.equal({ value: 'customervalid 1001 value' });
        });

        it('should throw an error for a customervalid that does not exist', async () => {
            await contract.querydata(ctx, 'EMP5').should.be.rejectedWith(/The customervalid 1003 does not exist/);
        });

    });

    describe('#valid', () => {

        it('should update a customervalid', async () => {
            await contract.valid(ctx, 'EMP0', 'customervalid 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"customervalid 1001 new value"}'));
        });

        it('should throw an error for a customervalid that does not exist', async () => {
            await contract.valid(ctx, 'EMP5', 'customervalid 1003 new value').should.be.rejectedWith(/The customervalid 1003 does not exist/);
        })

    });






});

/*
describe('CustomervalidContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new CustomervalidContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"customervalid 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"customervalid 1002 value"}'));
    });

    describe('#customervalidExists', () => {

        it('should return true for a customervalid', async () => {
            await contract.customervalidExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a customervalid that does not exist', async () => {
            await contract.customervalidExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createCustomervalid', () => {

        it('should create a customervalid', async () => {
            await contract.createCustomervalid(ctx, '1003', 'customervalid 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"customervalid 1003 value"}'));
        });

        it('should throw an error for a customervalid that already exists', async () => {
            await contract.createCustomervalid(ctx, '1001', 'myvalue').should.be.rejectedWith(/The customervalid 1001 already exists/);
        });

    });

    describe('#readCustomervalid', () => {

        it('should return a customervalid', async () => {
            await contract.readCustomervalid(ctx, '1001').should.eventually.deep.equal({ value: 'customervalid 1001 value' });
        });

        it('should throw an error for a customervalid that does not exist', async () => {
            await contract.readCustomervalid(ctx, '1003').should.be.rejectedWith(/The customervalid 1003 does not exist/);
        });

    });

    describe('#updateCustomervalid', () => {

        it('should update a customervalid', async () => {
            await contract.updateCustomervalid(ctx, '1001', 'customervalid 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"customervalid 1001 new value"}'));
        });

        it('should throw an error for a customervalid that does not exist', async () => {
            await contract.updateCustomervalid(ctx, '1003', 'customervalid 1003 new value').should.be.rejectedWith(/The customervalid 1003 does not exist/);
        });

    });

    describe('#deleteCustomervalid', () => {

        it('should delete a customervalid', async () => {
            await contract.deleteCustomervalid(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a customervalid that does not exist', async () => {
            await contract.deleteCustomervalid(ctx, '1003').should.be.rejectedWith(/The customervalid 1003 does not exist/);
        });

    });
   

}); */
