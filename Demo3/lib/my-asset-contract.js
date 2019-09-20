/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MyAssetContract extends Contract {


    async empValidExists(ctx, empValidId) {
        const buffer = await ctx.stub.getState(empValidId);
        return (!!buffer && buffer.length > 0);
    }

    
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        const emp = [
            {
                name: 'rajat',
                school: 'dps',
                college: 'rvce',
                usn: '1RV16EC001',
                company: 'wdc',
                schoolValidate: "0",
                collegeValidate: "0",
                companyValidate: "0",
            },
            {
                name: 'nishanth',
                school: 'spes',
                college: 'rvce',
                usn: '1RV16EC002',
                company: 'cisco',
                schoolValidate: "0",
                collegeValidate: "0",
                companyValidate: "0",
            },
            {
                name: 'vijay',
                school: 'cmr',
                college: 'rvce',
                usn: '1RV16EC003',
                company: 'cisco',
                schoolValidate: "0",
                collegeValidate: "0",
                companyValidate: "0",
            },
            {
                name: 'mahadev',
                school: 'sssjvk',
                college: 'rvce',
                usn: '1RV16EC004',
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

    async queryData(ctx, empId) {
        const empAsBytes = await ctx.stub.getState(empId);
        if (!empAsBytes || empAsBytes.length === 0) {
            throw new Error(`${empId} does not exist`);
        }
        console.log(empAsBytes.toString());
        return empAsBytes.toString();
    }

    async createEmp(ctx, empId, name, school, college, usn, company, validate="000") {
        console.info('============= START : Create emp ===========');

        const emp = {
            name,
            docType: 'emp',
            school,
            college,
            usn,
            company,
            schoolValidate,
            collegeValidate,
            companyValidate,
        };

        await ctx.stub.putState(empId, Buffer.from(JSON.stringify(emp)));
        console.info('============= END : Create emp ===========');
    }

    async validation(ctx, empId, index) {
        console.log('============= START : validate ===========');

        const empAsBytes = await ctx.stub.getState(empId);
        if(!empAsBytes || empAsBytes === 0) {
            throw new Error(`${empId} does not exist`);
        }

        const emp = JSON.parse(empAsBytes.toString());
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
