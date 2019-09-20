/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MyAssetContract extends Contract {


    async empvalidExists(ctx, customervalidId) {
        const buffer = await ctx.stub.getState(customervalidId);
        return (!!buffer && buffer.length > 0);
    }

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

        for (let i=0; i<emp.length; i++) {
            emp[i].docType = 'emp';
            await ctx.stub.putState('EMP' + i, Buffer.from(JSON.stringify(emp[i])));
            console.info('Added <--> ', emp[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryData(ctx, customerId) {
        const customerasbytes = await ctx.stub.getState(customerId);
        if (!customerasbytes || customerasbytes.length === 0) {
            throw new Error(`${customerId} does not exist`);
        }
        console.log(customerasbytes.toString());
        return customerasbytes.toString();
    }

    async createEmp(ctx, empid, name, school, college, company, validate=[0,0,0]) {
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

    async valid(ctx, empid, index) {
        console.log('============= START : validate ===========');

        const customerasbytes = await ctx.stub.getState(empid);
        if(!customerasbytes || customerasbytes === 0) {
            throw new Error(`${empid} does not exist`);
        }

        const emp = JSON.parse(customerasbytes.toString);

        if (index == "1") {
            emp.validate[0] = 1;
        } else if (index == "2") {
            emp.validate[1] = 1;
        } else if (index == "3") {
            emp.validate[2] = 1;
        }

        await ctx.stub.putState(empid, Buffer.from(JSON.stringify(emp)));
    }

    /* 
    async myAssetExists(ctx, myAssetId) {
        const buffer = await ctx.stub.getState(myAssetId);
        return (!!buffer && buffer.length > 0);
    }

    async createMyAsset(ctx, myAssetId, value) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (exists) {
            throw new Error(`The my asset ${myAssetId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(myAssetId, buffer);
    }

    async readMyAsset(ctx, myAssetId) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        const buffer = await ctx.stub.getState(myAssetId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateMyAsset(ctx, myAssetId, newValue) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(myAssetId, buffer);
    }

    async deleteMyAsset(ctx, myAssetId) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        await ctx.stub.deleteState(myAssetId);
    }


    */
}

module.exports = MyAssetContract;
