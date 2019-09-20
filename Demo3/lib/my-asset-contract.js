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
                schoolValidate: "0",
                collegeValidate: "0",
                companyValidate: "0",
            },
            {
                name: 'nishanth',
                school: 'spes',
                college: 'rvce',
                company: 'cisco',
                schoolValidate: "0",
                collegeValidate: "0",
                companyValidate: "0",
            },
            {
                name: 'vijay',
                school: 'cmr',
                college: 'rvce',
                company: 'cisco',
                schoolValidate: "0",
                collegeValidate: "0",
                companyValidate: "0",
            },
            {
                name: 'mahadev',
                school: 'sssjvk',
                college: 'rvce',
                company: 'UHG',
                schoolValidate: "0",
                collegeValidate: "0",
                companyValidate: "0",
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

    async createEmp(ctx, empid, name, school, college, company, validate="000") {
        console.info('============= START : Create emp ===========');

        const emp = {
            name,
            docType: 'emp',
            school,
            college,
            company,
            schoolValidate,
            collegeValidate,
            companyValidate,
        };

        await ctx.stub.putState(empid, Buffer.from(JSON.stringify(emp)));
        console.info('============= END : Create emp ===========');
    }

    async validation1(ctx, empid, index) {
        console.log('============= START : validate ===========');

        const customerasbytes = await ctx.stub.getState(empid);
        if(!customerasbytes || customerasbytes === 0) {
            throw new Error(`${empid} does not exist`);
        }

        const emp = JSON.parse(customerasbytes.toString());
        console.log(emp);
        
        if (index == "1") {
            emp.schoolValidate = "1";
        } else if (index == "2") {
            emp.collegeValidate = "1";
        } else if (index == "3") {
            emp.companyValidate = "1";
        }

        if (emp.schoolValidate == "1" && emp.collegeValidate == "1" && emp.companyValidate == "1") {
            console.log("ALL DOCUMENTS ARE VALIDATED!!!");
        }

        await ctx.stub.putState(empid, Buffer.from(JSON.stringify(emp)));
    }

    async querryallemp(ctx) {
        const startKey = 'EMP0';
        const endKey = 'EMP999';

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

}

module.exports = MyAssetContract;
