/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class CustomervalidContract extends Contract {

    async customervalidExists(ctx, customervalidId) {
        const buffer = await ctx.stub.getState(customervalidId);
        return (!!buffer && buffer.length > 0);
    }

    //////////////////////////////////////////////////////////
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        
        const emp = [
            {
                name: 'rajat',
                school: 'dps',
                college: 'rvce',
                company: 'wdc',
                validate: [0,0,0],
            },
            {
                name: 'nishanth',
                school: 'spes',
                college: 'rvce',
                company: 'cisco',
                validate: [0,0,0],
            },
            {
                name: 'vijay',
                school: 'cmr',
                college: 'rvce',
                company: 'cisco',
                validate: [0,0,0],
            },
            {
                name: 'mahadev',
                school: 'sssjvk',
                college: 'rvce',
                company: 'UHG',
                validate: [0,0,0],
            }
        ];

        for (let i = 0; i < emp.length; i++) {
            emp[i].docType = 'emp';
            await ctx.stub.putState('EMP' + i, Buffer.from(JSON.stringify(emp[i])));
            console.info('Added <--> ', emp[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    //////////////////////////////////////////////////////////
    //TO CHECK IF EMPLOYEE EXISTS AND VALIDATED
    async querydata(ctx, customerid) {
        const customerasbytes = await ctx.stub.getState(customerid); // get the car from chaincode state
        if (!customerasbytes || customerasbytes.length === 0) {
            throw new Error(`${customerid} does not exist`);
        }
        console.log(customerasbytes.toString());
        return customerasbytes.toString();
    }

    async createemp(ctx, empid, name, school, college, company,validate=[0,0,0]) {
        console.info('============= START : Create emp ===========');

        const emp = {
            name,
            docType: 'emp',
            school,
            college,
            company,
            validate,
        };

        await ctx.stub.putState(empid, Buffer.from(JSON.stringify(emp)));
        console.info('============= END : Create emp ===========');
    }


    async querryallemp(ctx) {
        const startKey = 'EMP0';
        const endKey = 'EMP99';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async valid(ctx, empid,index) {
        console.info('============= START : validate ===========');

        const carAsBytes = await ctx.stub.getState(empid); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${empid} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());

        car.validate[index] = 1;

        await ctx.stub.putState(empid, Buffer.from(JSON.stringify(emp)));
        console.info('============= END : validate ===========');
    }

    /////////////////////////////////////////////////////////
    /*
    async createCustomervalid(ctx, customervalidId, value) {
        const exists = await this.customervalidExists(ctx, customervalidId);
        if (exists) {
            throw new Error(`The customervalid ${customervalidId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(customervalidId, buffer);
    }

    async readCustomervalid(ctx, customervalidId) {
        const exists = await this.customervalidExists(ctx, customervalidId);
        if (!exists) {
            throw new Error(`The customervalid ${customervalidId} does not exist`);
        }
        const buffer = await ctx.stub.getState(customervalidId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateCustomervalid(ctx, customervalidId, newValue) {
        const exists = await this.customervalidExists(ctx, customervalidId);
        if (!exists) {
            throw new Error(`The customervalid ${customervalidId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(customervalidId, buffer);
    }

    async deleteCustomervalid(ctx, customervalidId) {
        const exists = await this.customervalidExists(ctx, customervalidId);
        if (!exists) {
            throw new Error(`The customervalid ${customervalidId} does not exist`);
        }
        await ctx.stub.deleteState(customervalidId);
    }*/

}

module.exports = CustomervalidContract;
