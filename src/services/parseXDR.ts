import { TransactionBuilder } from "stellar-base"

const parseXDR = (xdr: string) => {
    console.log('FAKE XDR, UPDATE PLEASE')
    const tx = TransactionBuilder.fromXDR('AAAAAgAAAADk0hA7NYTWtjNyn3aY0TzkII8xFahb8JhCVaSmr56ecwAAAGQAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAABldC+HAAAAAAAAAAEAAAABAAAAAHoKJ9BDYX3nkKDTqBtdngj5tCHF0Uy6rNgMkPNPA/ahAAAACgAAABpodHRwOi8vMTI3LjAuMC4xOjg3ODggYXV0aAAAAAAAAQAAAAY5ODg4MzgAAAAAAAAAAAABTwP2oQAAAEAJO+ygmyRALKiD40Nuf7fANBwZJoZ9qnPc8P/BMaYDhvUF8jCPLWuSAGsAd19+nurvlQpMVjvH17a8wUuvCoYN', 'Test SDF Network ; September 2015')
    console.log(JSON.stringify(tx))

    let txString = JSON.stringify(tx)
    const txObject = JSON.parse(txString);

    // // Extract and log the source account details
    // const sourceAccount = txObject._tx._attributes.sourceAccount._value.data;
    // console.log("Source Account:", Buffer.from(sourceAccount).toString('hex'));

    // Extract and log the fee
    const fee = txObject._tx._attributes.fee;
    console.log("Fee:", fee);

    // Extract and log the sequence number
    const sequenceNumber = txObject._tx._attributes.seqNum._value;
    console.log("Sequence Number:", sequenceNumber);

    // Extract and log the time bounds
    const timeBounds = txObject._tx._attributes.cond._value._attributes;
    console.log("Time Bounds:", timeBounds);

    // Extract and log the memo type
    const memoType = txObject._tx._attributes.memo._switch.name;
    console.log("Memo Type:", memoType);
    console.log('txObject._tx?._attributes?.operations', txObject._tx?._attributes?.operations)
    // Extract and log operations
    const operations = txObject._tx?._attributes?.operations.map((op: any) => {
        console.log('op._attributes.sourceAccount._value.data', op._attributes.sourceAccount._value)
        const operationSourceAccount = op._attributes.sourceAccount._value;
        const operationType = op._attributes.body._switch.name;
        const dataNameBuffer = op._attributes.body._arm === 'manageDataOp' && op._attributes.body._value ? op._attributes.body._value._attributes.dataName.data : [];
        const dataValueBuffer = op._attributes.body._arm === 'manageDataOp' && op._attributes.body._value ? op._attributes.body._value._attributes.dataValue.data : [];
        console.log('operationSourceAccount', operationSourceAccount)
        // Buffer.from(operationSourceAccount).toString('hex')
        // return {
        //     source: Buffer.from(operationSourceAccount).toString('hex'),
        //     type: operationType,
        //     name: dataNameBuffer.length > 0 ? Buffer.from(dataNameBuffer).toString() : null,
        //     value: dataValueBuffer.length > 0 ? Buffer.from(dataValueBuffer).toString() : null,
        // };
    });

    // console.log("Operations:", operations);
    // // Extract and log signatures
    // const signatures = txObject._signatures?.map((sig: any) => {
    //     const hint = sig._attributes.hint.data;
    //     const signature = sig._attributes.signature.data;
    //     return {
    //         hint: Buffer.from(hint).toString('hex'),
    //         signature: Buffer.from(signature).toString('hex'),
    //     };
    // });

    // console.log("Signatures:", signatures);
}

export { parseXDR };