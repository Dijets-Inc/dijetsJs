"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_mock_axios_1 = __importDefault(require("jest-mock-axios"));
const utxos_1 = require("../../../src/apis/platformvm/utxos");
const api_1 = require("../../../src/apis/platformvm/api");
const tx_1 = require("../../../src/apis/platformvm/tx");
const keychain_1 = require("../../../src/apis/platformvm/keychain");
const inputs_1 = require("../../../src/apis/platformvm/inputs");
const create_hash_1 = __importDefault(require("create-hash"));
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer/");
const outputs_1 = require("../../../src/apis/platformvm/outputs");
const constants_1 = require("../../../src/apis/platformvm/constants");
const index_1 = require("../../../src/index");
const payload_1 = require("../../../src/utils/payload");
const helperfunctions_1 = require("../../../src/utils/helperfunctions");
const basetx_1 = require("../../../src/apis/platformvm/basetx");
const importtx_1 = require("../../../src/apis/platformvm/importtx");
const exporttx_1 = require("../../../src/apis/platformvm/exporttx");
const constants_2 = require("../../../src/utils/constants");
// import { AddSubnetValidatorTx, SubnetAuth } from "src/apis/platformvm"
const platformvm_1 = require("src/apis/platformvm");
describe("Transactions", () => {
    /**
     * @ignore
     */
    const bintools = bintools_1.default.getInstance();
    const networkID = 1337;
    let set;
    let keymgr1;
    let keymgr2;
    let keymgr3;
    let addrs1;
    let addrs2;
    let addrs3;
    let utxos;
    let inputs;
    let outputs;
    let importIns;
    let importUTXOs;
    let exportOuts;
    let fungutxos;
    let exportUTXOIDS;
    let api;
    const amnt = 10000;
    const netid = 12345;
    const blockchainID = bintools.cb58Decode(constants_2.PlatformChainID);
    const alias = "X";
    const assetID = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
        .update("Well, now, don't you tell me to smile, you stick around I'll make it worth your while.")
        .digest());
    let amount;
    let addresses;
    let fallAddresses;
    let locktime;
    let fallLocktime;
    let threshold;
    let fallThreshold;
    const ip = "127.0.0.1";
    const port = 8080;
    const protocol = "http";
    const nodeIDStr = "NodeID-GWPcbFJZFfZreETSoWjPimr846mXEKCtu";
    const nodeID = (0, helperfunctions_1.NodeIDStringToBuffer)("NodeID-GWPcbFJZFfZreETSoWjPimr846mXEKCtu");
    const startTime = new bn_js_1.default(1641961736);
    const endTime = new bn_js_1.default(1662307000);
    const weight = new bn_js_1.default(20);
    let avalanche;
    const name = "Mortycoin is the dumb as a sack of hammers.";
    const symbol = "morT";
    const denomination = 8;
    let djtxAssetID;
    const pChainBlockchainID = "11111111111111111111111111111111LpoYY";
    const genesisDataStr = "11111DdZMhYXUZiFV9FNpfpTSQroysjHyMuT5zapYkPYrmap7t7S3sDNNwFzngxR9x1XmoRj5JK1XomX8RHvXYY5h3qYeEsMQRF8Ypia7p1CFHDo6KGSjMdiQkrmpvL8AvoezSxVWKXt2ubmBCnSkpPjnQbBSF7gNg4sPu1PXdh1eKgthaSFREqqG5FKMrWNiS6U87kxCmbKjkmBvwnAd6TpNx75YEiS9YKMyHaBZjkRDNf6Nj1";
    const subnetIDStr = "LtYUqdbbLzTmHMXPPVhAHMeDr6riEmt2pjtfEiqAqAce9MxCg";
    const memoStr = "from snowflake to avalanche";
    const memo = buffer_1.Buffer.from(memoStr, "utf8");
    const subnetID = bintools.cb58Decode(subnetIDStr);
    const chainNameStr = "EPIC AVM";
    const vmIDStr = "avm";
    const fxIDsStr = ["secp256k1fx"];
    const gd = new index_1.GenesisData();
    gd.fromBuffer(bintools.cb58Decode(genesisDataStr));
    const addressIndex = buffer_1.Buffer.alloc(4);
    addressIndex.writeUIntBE(0x0, 0, 4);
    const subnetAuth = new platformvm_1.SubnetAuth([addressIndex]);
    // let addSubnetValidatorTx: AddSubnetValidatorTx = new AddSubnetValidatorTx()
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        avalanche = new index_1.Avalanche(ip, port, protocol, 12345, undefined, undefined, undefined, true);
        api = new api_1.PlatformVMAPI(avalanche, "/ext/bc/P");
        const result = api.getDJTXAssetID();
        const payload = {
            result: {
                name,
                symbol,
                assetID: bintools.cb58Encode(assetID),
                denomination: `${denomination}`
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        djtxAssetID = yield result;
    }));
    beforeEach(() => {
        set = new utxos_1.UTXOSet();
        keymgr1 = new keychain_1.KeyChain(avalanche.getHRP(), alias);
        keymgr2 = new keychain_1.KeyChain(avalanche.getHRP(), alias);
        keymgr3 = new keychain_1.KeyChain(avalanche.getHRP(), alias);
        addrs1 = [];
        addrs2 = [];
        addrs3 = [];
        utxos = [];
        inputs = [];
        outputs = [];
        importIns = [];
        importUTXOs = [];
        exportOuts = [];
        fungutxos = [];
        exportUTXOIDS = [];
        for (let i = 0; i < 3; i++) {
            addrs1.push(keymgr1.makeKey().getAddress());
            addrs2.push(keymgr2.makeKey().getAddress());
            addrs3.push(keymgr3.makeKey().getAddress());
        }
        amount = new bn_js_1.default(amnt);
        addresses = keymgr1.getAddresses();
        fallAddresses = keymgr2.getAddresses();
        locktime = new bn_js_1.default(54321);
        fallLocktime = locktime.add(new bn_js_1.default(50));
        threshold = 3;
        fallThreshold = 1;
        const payload = buffer_1.Buffer.alloc(1024);
        payload.write("All you Trekkies and TV addicts, Don't mean to diss don't mean to bring static.", 0, 1024, "utf8");
        for (let i = 0; i < 5; i++) {
            let txid = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
                .update(bintools.fromBNToBuffer(new bn_js_1.default(i), 32))
                .digest());
            let txidx = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(i), 4));
            const out = new outputs_1.SECPTransferOutput(amount, addresses, locktime, threshold);
            const xferout = new outputs_1.TransferableOutput(assetID, out);
            outputs.push(xferout);
            const u = new utxos_1.UTXO(constants_1.PlatformVMConstants.LATESTCODEC, txid, txidx, assetID, out);
            utxos.push(u);
            fungutxos.push(u);
            importUTXOs.push(u);
            txid = u.getTxID();
            txidx = u.getOutputIdx();
            const input = new inputs_1.SECPTransferInput(amount);
            const xferin = new inputs_1.TransferableInput(txid, txidx, assetID, input);
            inputs.push(xferin);
        }
        for (let i = 1; i < 4; i++) {
            importIns.push(inputs[i]);
            exportOuts.push(outputs[i]);
            exportUTXOIDS.push(fungutxos[i].getUTXOID());
        }
        set.addArray(utxos);
        // addSubnetValidatorTx = new AddSubnetValidatorTx(
        //   networkID,
        //   bintools.cb58Decode(pChainBlockchainID),
        //   outputs,
        //   inputs,
        //   memo,
        //   nodeID,
        //   startTime,
        //   endTime,
        //   weight,
        //   subnetID,
        //   subnetAuth
        // )
    });
    test("Create small BaseTx that is Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
        const outs = [];
        const ins = [];
        const outputAmt = new bn_js_1.default("266");
        const output = new outputs_1.SECPTransferOutput(outputAmt, addrs1, new bn_js_1.default(0), 1);
        const transferableOutput = new outputs_1.TransferableOutput(djtxAssetID, output);
        outs.push(transferableOutput);
        const inputAmt = new bn_js_1.default("400");
        const input = new inputs_1.SECPTransferInput(inputAmt);
        input.addSignatureIdx(0, addrs1[0]);
        const txid = bintools.cb58Decode("n8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        const outputIndex = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(0), 4));
        const transferableInput = new inputs_1.TransferableInput(txid, outputIndex, djtxAssetID, input);
        ins.push(transferableInput);
        const baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(true);
    }));
    test("confirm inputTotal, outputTotal and fee are correct", () => __awaiter(void 0, void 0, void 0, function* () {
        const bintools = bintools_1.default.getInstance();
        // local network P Chain ID
        // DJTX assetID
        const assetID = bintools.cb58Decode("n8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        const outs = [];
        const ins = [];
        const outputAmt = new bn_js_1.default("266");
        const output = new outputs_1.SECPTransferOutput(outputAmt, addrs1, new bn_js_1.default(0), 1);
        const transferableOutput = new outputs_1.TransferableOutput(assetID, output);
        outs.push(transferableOutput);
        const inputAmt = new bn_js_1.default("400");
        const input = new inputs_1.SECPTransferInput(inputAmt);
        input.addSignatureIdx(0, addrs1[0]);
        const txid = bintools.cb58Decode("n8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        const outputIndex = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(0), 4));
        const transferableInput = new inputs_1.TransferableInput(txid, outputIndex, assetID, input);
        ins.push(transferableInput);
        const baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        const inputTotal = unsignedTx.getInputTotal(assetID);
        const outputTotal = unsignedTx.getOutputTotal(assetID);
        const burn = unsignedTx.getBurn(assetID);
        expect(inputTotal.toNumber()).toEqual(new bn_js_1.default(400).toNumber());
        expect(outputTotal.toNumber()).toEqual(new bn_js_1.default(266).toNumber());
        expect(burn.toNumber()).toEqual(new bn_js_1.default(134).toNumber());
    }));
    test("Create small BaseTx that isn't Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
        // local network X Chain ID
        const outs = [];
        const ins = [];
        const outputAmt = new bn_js_1.default("267");
        const output = new outputs_1.SECPTransferOutput(outputAmt, addrs1, new bn_js_1.default(0), 1);
        const transferableOutput = new outputs_1.TransferableOutput(djtxAssetID, output);
        outs.push(transferableOutput);
        const inputAmt = new bn_js_1.default("400");
        const input = new inputs_1.SECPTransferInput(inputAmt);
        input.addSignatureIdx(0, addrs1[0]);
        const txid = bintools.cb58Decode("n8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        const outputIndex = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(0), 4));
        const transferableInput = new inputs_1.TransferableInput(txid, outputIndex, djtxAssetID, input);
        ins.push(transferableInput);
        const baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(true);
    }));
    test("Create large BaseTx that is Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
        // local network P Chain ID
        const outs = [];
        const ins = [];
        const outputAmt = new bn_js_1.default("609555500000");
        const output = new outputs_1.SECPTransferOutput(outputAmt, addrs1, new bn_js_1.default(0), 1);
        const transferableOutput = new outputs_1.TransferableOutput(djtxAssetID, output);
        outs.push(transferableOutput);
        const inputAmt = new bn_js_1.default("45000000000000000");
        const input = new inputs_1.SECPTransferInput(inputAmt);
        input.addSignatureIdx(0, addrs1[0]);
        const txid = bintools.cb58Decode("n8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        const outputIndex = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(0), 4));
        const transferableInput = new inputs_1.TransferableInput(txid, outputIndex, djtxAssetID, input);
        ins.push(transferableInput);
        const baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(false);
    }));
    test("Create large BaseTx that isn't Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
        // local network P Chain ID
        const outs = [];
        const ins = [];
        const outputAmt = new bn_js_1.default("44995609555500000");
        const output = new outputs_1.SECPTransferOutput(outputAmt, addrs1, new bn_js_1.default(0), 1);
        const transferableOutput = new outputs_1.TransferableOutput(djtxAssetID, output);
        outs.push(transferableOutput);
        const inputAmt = new bn_js_1.default("45000000000000000");
        const input = new inputs_1.SECPTransferInput(inputAmt);
        input.addSignatureIdx(0, addrs1[0]);
        const txid = bintools.cb58Decode("n8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        const outputIndex = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(0), 4));
        const transferableInput = new inputs_1.TransferableInput(txid, outputIndex, djtxAssetID, input);
        ins.push(transferableInput);
        const baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(true);
    }));
    test("Creation UnsignedTx", () => {
        const baseTx = new basetx_1.BaseTx(netid, blockchainID, outputs, inputs);
        const txu = new tx_1.UnsignedTx(baseTx);
        const txins = txu.getTransaction().getIns();
        const txouts = txu.getTransaction().getOuts();
        expect(txins.length).toBe(inputs.length);
        expect(txouts.length).toBe(outputs.length);
        expect(txu.getTransaction().getTxType()).toBe(0);
        expect(txu.getTransaction().getNetworkID()).toBe(12345);
        expect(txu.getTransaction().getBlockchainID().toString("hex")).toBe(blockchainID.toString("hex"));
        let a = [];
        let b = [];
        for (let i = 0; i < txins.length; i++) {
            a.push(txins[i].toString());
            b.push(inputs[i].toString());
        }
        expect(JSON.stringify(a.sort())).toBe(JSON.stringify(b.sort()));
        a = [];
        b = [];
        for (let i = 0; i < txouts.length; i++) {
            a.push(txouts[i].toString());
            b.push(outputs[i].toString());
        }
        expect(JSON.stringify(a.sort())).toBe(JSON.stringify(b.sort()));
        const txunew = new tx_1.UnsignedTx();
        txunew.fromBuffer(txu.toBuffer());
        expect(txunew.toBuffer().toString("hex")).toBe(txu.toBuffer().toString("hex"));
        expect(txunew.toString()).toBe(txu.toString());
    });
    test("Creation UnsignedTx Check Amount", () => {
        expect(() => {
            set.buildBaseTx(netid, blockchainID, new bn_js_1.default(amnt * 1000), assetID, addrs3, addrs1, addrs1);
        }).toThrow();
    });
    test("Creation ImportTx", () => {
        const bombtx = new importtx_1.ImportTx(netid, blockchainID, outputs, inputs, new payload_1.UTF8Payload("hello world").getPayload(), undefined, importIns);
        expect(() => {
            bombtx.toBuffer();
        }).toThrow();
        const importTx = new importtx_1.ImportTx(netid, blockchainID, outputs, inputs, new payload_1.UTF8Payload("hello world").getPayload(), bintools.cb58Decode(constants_2.PlatformChainID), importIns);
        const txunew = new importtx_1.ImportTx();
        const importbuff = importTx.toBuffer();
        txunew.fromBuffer(importbuff);
        expect(importTx).toBeInstanceOf(importtx_1.ImportTx);
        expect(importTx.getSourceChain().toString("hex")).toBe(bintools.cb58Decode(constants_2.PlatformChainID).toString("hex"));
        expect(txunew.toBuffer().toString("hex")).toBe(importbuff.toString("hex"));
        expect(txunew.toString()).toBe(importTx.toString());
        expect(importTx.getImportInputs().length).toBe(importIns.length);
    });
    test("Creation ExportTx", () => {
        const bombtx = new exporttx_1.ExportTx(netid, blockchainID, outputs, inputs, undefined, undefined, exportOuts);
        expect(() => {
            bombtx.toBuffer();
        }).toThrow();
        const exportTx = new exporttx_1.ExportTx(netid, blockchainID, outputs, inputs, undefined, bintools.cb58Decode(constants_2.PlatformChainID), exportOuts);
        const txunew = new exporttx_1.ExportTx();
        const exportbuff = exportTx.toBuffer();
        txunew.fromBuffer(exportbuff);
        expect(exportTx).toBeInstanceOf(exporttx_1.ExportTx);
        expect(exportTx.getDestinationChain().toString("hex")).toBe(bintools.cb58Decode(constants_2.PlatformChainID).toString("hex"));
        expect(txunew.toBuffer().toString("hex")).toBe(exportbuff.toString("hex"));
        expect(txunew.toString()).toBe(exportTx.toString());
        expect(exportTx.getExportOutputs().length).toBe(exportOuts.length);
    });
    test("Creation Tx1 with asof, locktime, threshold", () => {
        const txu = set.buildBaseTx(netid, blockchainID, new bn_js_1.default(9000), assetID, addrs3, addrs1, addrs1, undefined, undefined, undefined, (0, helperfunctions_1.UnixNow)(), (0, helperfunctions_1.UnixNow)().add(new bn_js_1.default(50)), 1);
        const tx = txu.sign(keymgr1);
        const tx2 = new tx_1.Tx();
        tx2.fromString(tx.toString());
        expect(tx2.toBuffer().toString("hex")).toBe(tx.toBuffer().toString("hex"));
        expect(tx2.toString()).toBe(tx.toString());
    });
    test("Creation Tx2 without asof, locktime, threshold", () => {
        const txu = set.buildBaseTx(netid, blockchainID, new bn_js_1.default(9000), assetID, addrs3, addrs1, addrs1);
        const tx = txu.sign(keymgr1);
        const tx2 = new tx_1.Tx();
        tx2.fromBuffer(tx.toBuffer());
        expect(tx2.toBuffer().toString("hex")).toBe(tx.toBuffer().toString("hex"));
        expect(tx2.toString()).toBe(tx.toString());
    });
    test("Creation Tx4 using ImportTx", () => {
        const txu = set.buildImportTx(netid, blockchainID, addrs3, addrs1, addrs2, importUTXOs, bintools.cb58Decode(constants_2.PlatformChainID), new bn_js_1.default(90), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
        const tx = txu.sign(keymgr1);
        const tx2 = new tx_1.Tx();
        tx2.fromBuffer(tx.toBuffer());
        expect(tx2.toBuffer().toString("hex")).toBe(tx.toBuffer().toString("hex"));
    });
    test("Creation Tx5 using ExportTx", () => {
        const txu = set.buildExportTx(netid, blockchainID, new bn_js_1.default(90), djtxAssetID, addrs3, addrs1, addrs2, bintools.cb58Decode(constants_2.PlatformChainID), undefined, undefined, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
        const tx = txu.sign(keymgr1);
        const tx2 = new tx_1.Tx();
        tx2.fromBuffer(tx.toBuffer());
        expect(tx.toBuffer().toString("hex")).toBe(tx2.toBuffer().toString("hex"));
    });
    // test("addSubnetValidatorTx getBlockchainID", (): void => {
    //   const blockchainIDBuf: Buffer = addSubnetValidatorTx.getBlockchainID()
    //   const blockchainIDStr: string = bintools.cb58Encode(blockchainIDBuf)
    //   expect(blockchainIDStr).toBe(pChainBlockchainID)
    // })
    // test("addSubnetValidatorTx getNodeID", (): void => {
    //   const nodeIDBuf: Buffer = addSubnetValidatorTx.getNodeID()
    //   const nIDStr: string = bintools.cb58Encode(nodeIDBuf)
    //   expect(`NodeID-${nIDStr}`).toBe(nodeIDStr)
    // })
    // test("addSubnetValidatorTx getStartTime", (): void => {
    //   const startTimeBN: BN = addSubnetValidatorTx.getStartTime()
    //   expect(startTimeBN.toNumber()).toEqual(startTime.toNumber())
    // })
    // test("addSubnetValidatorTx getEndTime", (): void => {
    //   const endTimeBN: BN = addSubnetValidatorTx.getEndTime()
    //   expect(endTimeBN.toNumber()).toEqual(endTime.toNumber())
    // })
    // test("addSubnetValidatorTx getWeight", (): void => {
    //   const weightBN: BN = addSubnetValidatorTx.getWeight()
    //   expect(weightBN.toNumber()).toEqual(weight.toNumber())
    // })
    // test("addSubnetValidatorTx getSubnetID", (): void => {
    //   const sIDStr: string = addSubnetValidatorTx.getSubnetID()
    //   expect(sIDStr).toBe(subnetIDStr)
    // })
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3RzL2FwaXMvcGxhdGZvcm12bS90eC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXVDO0FBQ3ZDLDhEQUFrRTtBQUNsRSwwREFBZ0U7QUFDaEUsd0RBQWdFO0FBQ2hFLG9FQUFnRTtBQUNoRSxnRUFHNEM7QUFDNUMsOERBQW9DO0FBQ3BDLDJFQUFrRDtBQUNsRCxrREFBc0I7QUFDdEIsb0NBQWdDO0FBQ2hDLGtFQUc2QztBQUM3QyxzRUFBNEU7QUFDNUUsOENBQTJEO0FBQzNELHdEQUF3RDtBQUN4RCx3RUFHMkM7QUFDM0MsZ0VBQTREO0FBQzVELG9FQUFnRTtBQUNoRSxvRUFBZ0U7QUFDaEUsNERBQThEO0FBRTlELHlFQUF5RTtBQUN6RSxvREFBZ0Q7QUFFaEQsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFTLEVBQUU7SUFDbEM7O09BRUc7SUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0lBRWpELE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQTtJQUM5QixJQUFJLEdBQVksQ0FBQTtJQUNoQixJQUFJLE9BQWlCLENBQUE7SUFDckIsSUFBSSxPQUFpQixDQUFBO0lBQ3JCLElBQUksT0FBaUIsQ0FBQTtJQUNyQixJQUFJLE1BQWdCLENBQUE7SUFDcEIsSUFBSSxNQUFnQixDQUFBO0lBQ3BCLElBQUksTUFBZ0IsQ0FBQTtJQUNwQixJQUFJLEtBQWEsQ0FBQTtJQUNqQixJQUFJLE1BQTJCLENBQUE7SUFDL0IsSUFBSSxPQUE2QixDQUFBO0lBQ2pDLElBQUksU0FBOEIsQ0FBQTtJQUNsQyxJQUFJLFdBQW1CLENBQUE7SUFDdkIsSUFBSSxVQUFnQyxDQUFBO0lBQ3BDLElBQUksU0FBaUIsQ0FBQTtJQUNyQixJQUFJLGFBQXVCLENBQUE7SUFDM0IsSUFBSSxHQUFrQixDQUFBO0lBQ3RCLE1BQU0sSUFBSSxHQUFXLEtBQUssQ0FBQTtJQUMxQixNQUFNLEtBQUssR0FBVyxLQUFLLENBQUE7SUFDM0IsTUFBTSxZQUFZLEdBQVcsUUFBUSxDQUFDLFVBQVUsQ0FBQywyQkFBZSxDQUFDLENBQUE7SUFDakUsTUFBTSxLQUFLLEdBQVcsR0FBRyxDQUFBO0lBQ3pCLE1BQU0sT0FBTyxHQUFXLGVBQU0sQ0FBQyxJQUFJLENBQ2pDLElBQUEscUJBQVUsRUFBQyxRQUFRLENBQUM7U0FDakIsTUFBTSxDQUNMLHdGQUF3RixDQUN6RjtTQUNBLE1BQU0sRUFBRSxDQUNaLENBQUE7SUFDRCxJQUFJLE1BQVUsQ0FBQTtJQUNkLElBQUksU0FBbUIsQ0FBQTtJQUN2QixJQUFJLGFBQXVCLENBQUE7SUFDM0IsSUFBSSxRQUFZLENBQUE7SUFDaEIsSUFBSSxZQUFnQixDQUFBO0lBQ3BCLElBQUksU0FBaUIsQ0FBQTtJQUNyQixJQUFJLGFBQXFCLENBQUE7SUFDekIsTUFBTSxFQUFFLEdBQVcsV0FBVyxDQUFBO0lBQzlCLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQTtJQUN6QixNQUFNLFFBQVEsR0FBVyxNQUFNLENBQUE7SUFDL0IsTUFBTSxTQUFTLEdBQVcsMENBQTBDLENBQUE7SUFDcEUsTUFBTSxNQUFNLEdBQVcsSUFBQSxzQ0FBb0IsRUFDekMsMENBQTBDLENBQzNDLENBQUE7SUFDRCxNQUFNLFNBQVMsR0FBTyxJQUFJLGVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUN4QyxNQUFNLE9BQU8sR0FBTyxJQUFJLGVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUN0QyxNQUFNLE1BQU0sR0FBTyxJQUFJLGVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUM3QixJQUFJLFNBQW9CLENBQUE7SUFDeEIsTUFBTSxJQUFJLEdBQVcsNkNBQTZDLENBQUE7SUFDbEUsTUFBTSxNQUFNLEdBQVcsTUFBTSxDQUFBO0lBQzdCLE1BQU0sWUFBWSxHQUFXLENBQUMsQ0FBQTtJQUM5QixJQUFJLFdBQW1CLENBQUE7SUFDdkIsTUFBTSxrQkFBa0IsR0FBVyx1Q0FBdUMsQ0FBQTtJQUMxRSxNQUFNLGNBQWMsR0FDbEIscVBBQXFQLENBQUE7SUFDdlAsTUFBTSxXQUFXLEdBQ2YsbURBQW1ELENBQUE7SUFDckQsTUFBTSxPQUFPLEdBQVcsNkJBQTZCLENBQUE7SUFDckQsTUFBTSxJQUFJLEdBQVcsZUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDakQsTUFBTSxRQUFRLEdBQVcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUN6RCxNQUFNLFlBQVksR0FBVyxVQUFVLENBQUE7SUFDdkMsTUFBTSxPQUFPLEdBQVcsS0FBSyxDQUFBO0lBQzdCLE1BQU0sUUFBUSxHQUFhLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDMUMsTUFBTSxFQUFFLEdBQWdCLElBQUksbUJBQVcsRUFBRSxDQUFBO0lBQ3pDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFBO0lBQ2xELE1BQU0sWUFBWSxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDNUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ25DLE1BQU0sVUFBVSxHQUFlLElBQUksdUJBQVUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7SUFDN0QsOEVBQThFO0lBRTlFLFNBQVMsQ0FBQyxHQUF3QixFQUFFO1FBQ2xDLFNBQVMsR0FBRyxJQUFJLGlCQUFTLENBQ3ZCLEVBQUUsRUFDRixJQUFJLEVBQ0osUUFBUSxFQUNSLEtBQUssRUFDTCxTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxJQUFJLENBQ0wsQ0FBQTtRQUNELEdBQUcsR0FBRyxJQUFJLG1CQUFhLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFBO1FBQy9DLE1BQU0sTUFBTSxHQUFvQixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUE7UUFDcEQsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLElBQUk7Z0JBQ0osTUFBTTtnQkFDTixPQUFPLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7Z0JBQ3JDLFlBQVksRUFBRSxHQUFHLFlBQVksRUFBRTthQUNoQztTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsV0FBVyxHQUFHLE1BQU0sTUFBTSxDQUFBO0lBQzVCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixVQUFVLENBQUMsR0FBUyxFQUFFO1FBQ3BCLEdBQUcsR0FBRyxJQUFJLGVBQU8sRUFBRSxDQUFBO1FBQ25CLE9BQU8sR0FBRyxJQUFJLG1CQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ2pELE9BQU8sR0FBRyxJQUFJLG1CQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ2pELE9BQU8sR0FBRyxJQUFJLG1CQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ2pELE1BQU0sR0FBRyxFQUFFLENBQUE7UUFDWCxNQUFNLEdBQUcsRUFBRSxDQUFBO1FBQ1gsTUFBTSxHQUFHLEVBQUUsQ0FBQTtRQUNYLEtBQUssR0FBRyxFQUFFLENBQUE7UUFDVixNQUFNLEdBQUcsRUFBRSxDQUFBO1FBQ1gsT0FBTyxHQUFHLEVBQUUsQ0FBQTtRQUNaLFNBQVMsR0FBRyxFQUFFLENBQUE7UUFDZCxXQUFXLEdBQUcsRUFBRSxDQUFBO1FBQ2hCLFVBQVUsR0FBRyxFQUFFLENBQUE7UUFDZixTQUFTLEdBQUcsRUFBRSxDQUFBO1FBQ2QsYUFBYSxHQUFHLEVBQUUsQ0FBQTtRQUNsQixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7WUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQTtZQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFBO1NBQzVDO1FBQ0QsTUFBTSxHQUFHLElBQUksZUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3JCLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUE7UUFDbEMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUN0QyxRQUFRLEdBQUcsSUFBSSxlQUFFLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEIsWUFBWSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxlQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN2QyxTQUFTLEdBQUcsQ0FBQyxDQUFBO1FBQ2IsYUFBYSxHQUFHLENBQUMsQ0FBQTtRQUVqQixNQUFNLE9BQU8sR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzFDLE9BQU8sQ0FBQyxLQUFLLENBQ1gsaUZBQWlGLEVBQ2pGLENBQUMsRUFDRCxJQUFJLEVBQ0osTUFBTSxDQUNQLENBQUE7UUFFRCxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xDLElBQUksSUFBSSxHQUFXLGVBQU0sQ0FBQyxJQUFJLENBQzVCLElBQUEscUJBQVUsRUFBQyxRQUFRLENBQUM7aUJBQ2pCLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUM5QyxNQUFNLEVBQUUsQ0FDWixDQUFBO1lBQ0QsSUFBSSxLQUFLLEdBQVcsZUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDdEUsTUFBTSxHQUFHLEdBQXVCLElBQUksNEJBQWtCLENBQ3BELE1BQU0sRUFDTixTQUFTLEVBQ1QsUUFBUSxFQUNSLFNBQVMsQ0FDVixDQUFBO1lBQ0QsTUFBTSxPQUFPLEdBQXVCLElBQUksNEJBQWtCLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQ3hFLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7WUFFckIsTUFBTSxDQUFDLEdBQVMsSUFBSSxZQUFJLENBQ3RCLCtCQUFtQixDQUFDLFdBQVcsRUFDL0IsSUFBSSxFQUNKLEtBQUssRUFDTCxPQUFPLEVBQ1AsR0FBRyxDQUNKLENBQUE7WUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2IsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNqQixXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRW5CLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7WUFDbEIsS0FBSyxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtZQUV4QixNQUFNLEtBQUssR0FBc0IsSUFBSSwwQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM5RCxNQUFNLE1BQU0sR0FBc0IsSUFBSSwwQkFBaUIsQ0FDckQsSUFBSSxFQUNKLEtBQUssRUFDTCxPQUFPLEVBQ1AsS0FBSyxDQUNOLENBQUE7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQ3BCO1FBQ0QsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3pCLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDM0IsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtTQUM3QztRQUNELEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFbkIsbURBQW1EO1FBQ25ELGVBQWU7UUFDZiw2Q0FBNkM7UUFDN0MsYUFBYTtRQUNiLFlBQVk7UUFDWixVQUFVO1FBQ1YsWUFBWTtRQUNaLGVBQWU7UUFDZixhQUFhO1FBQ2IsWUFBWTtRQUNaLGNBQWM7UUFDZCxlQUFlO1FBQ2YsSUFBSTtJQUNOLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLDBDQUEwQyxFQUFFLEdBQXdCLEVBQUU7UUFDekUsTUFBTSxJQUFJLEdBQXlCLEVBQUUsQ0FBQTtRQUNyQyxNQUFNLEdBQUcsR0FBd0IsRUFBRSxDQUFBO1FBQ25DLE1BQU0sU0FBUyxHQUFPLElBQUksZUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ25DLE1BQU0sTUFBTSxHQUF1QixJQUFJLDRCQUFrQixDQUN2RCxTQUFTLEVBQ1QsTUFBTSxFQUNOLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxFQUNULENBQUMsQ0FDRixDQUFBO1FBQ0QsTUFBTSxrQkFBa0IsR0FBdUIsSUFBSSw0QkFBa0IsQ0FDbkUsV0FBVyxFQUNYLE1BQU0sQ0FDUCxDQUFBO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1FBQzdCLE1BQU0sUUFBUSxHQUFPLElBQUksZUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2xDLE1BQU0sS0FBSyxHQUFzQixJQUFJLDBCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ2hFLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sSUFBSSxHQUFXLFFBQVEsQ0FBQyxVQUFVLENBQ3RDLG1EQUFtRCxDQUNwRCxDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQVcsZUFBTSxDQUFDLElBQUksQ0FDckMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDdEMsQ0FBQTtRQUNELE1BQU0saUJBQWlCLEdBQXNCLElBQUksMEJBQWlCLENBQ2hFLElBQUksRUFDSixXQUFXLEVBQ1gsV0FBVyxFQUNYLEtBQUssQ0FDTixDQUFBO1FBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1FBQzNCLE1BQU0sTUFBTSxHQUFXLElBQUksZUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQ3JFLE1BQU0sVUFBVSxHQUFlLElBQUksZUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3JELE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDeEQsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxxREFBcUQsRUFBRSxHQUF3QixFQUFFO1FBQ3BGLE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDakQsMkJBQTJCO1FBQzNCLGVBQWU7UUFDZixNQUFNLE9BQU8sR0FBVyxRQUFRLENBQUMsVUFBVSxDQUN6QyxtREFBbUQsQ0FDcEQsQ0FBQTtRQUNELE1BQU0sSUFBSSxHQUF5QixFQUFFLENBQUE7UUFDckMsTUFBTSxHQUFHLEdBQXdCLEVBQUUsQ0FBQTtRQUNuQyxNQUFNLFNBQVMsR0FBTyxJQUFJLGVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNuQyxNQUFNLE1BQU0sR0FBdUIsSUFBSSw0QkFBa0IsQ0FDdkQsU0FBUyxFQUNULE1BQU0sRUFDTixJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDVCxDQUFDLENBQ0YsQ0FBQTtRQUNELE1BQU0sa0JBQWtCLEdBQXVCLElBQUksNEJBQWtCLENBQ25FLE9BQU8sRUFDUCxNQUFNLENBQ1AsQ0FBQTtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtRQUM3QixNQUFNLFFBQVEsR0FBTyxJQUFJLGVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNsQyxNQUFNLEtBQUssR0FBc0IsSUFBSSwwQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNoRSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuQyxNQUFNLElBQUksR0FBVyxRQUFRLENBQUMsVUFBVSxDQUN0QyxtREFBbUQsQ0FDcEQsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFXLGVBQU0sQ0FBQyxJQUFJLENBQ3JDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3RDLENBQUE7UUFDRCxNQUFNLGlCQUFpQixHQUFzQixJQUFJLDBCQUFpQixDQUNoRSxJQUFJLEVBQ0osV0FBVyxFQUNYLE9BQU8sRUFDUCxLQUFLLENBQ04sQ0FBQTtRQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtRQUMzQixNQUFNLE1BQU0sR0FBVyxJQUFJLGVBQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUNyRSxNQUFNLFVBQVUsR0FBZSxJQUFJLGVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNyRCxNQUFNLFVBQVUsR0FBTyxVQUFVLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3hELE1BQU0sV0FBVyxHQUFPLFVBQVUsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDMUQsTUFBTSxJQUFJLEdBQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUM1QyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksZUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFDN0QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLGVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxlQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUN6RCxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQXdCLEVBQUU7UUFDNUUsMkJBQTJCO1FBQzNCLE1BQU0sSUFBSSxHQUF5QixFQUFFLENBQUE7UUFDckMsTUFBTSxHQUFHLEdBQXdCLEVBQUUsQ0FBQTtRQUNuQyxNQUFNLFNBQVMsR0FBTyxJQUFJLGVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNuQyxNQUFNLE1BQU0sR0FBdUIsSUFBSSw0QkFBa0IsQ0FDdkQsU0FBUyxFQUNULE1BQU0sRUFDTixJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDVCxDQUFDLENBQ0YsQ0FBQTtRQUNELE1BQU0sa0JBQWtCLEdBQXVCLElBQUksNEJBQWtCLENBQ25FLFdBQVcsRUFDWCxNQUFNLENBQ1AsQ0FBQTtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtRQUM3QixNQUFNLFFBQVEsR0FBTyxJQUFJLGVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNsQyxNQUFNLEtBQUssR0FBc0IsSUFBSSwwQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNoRSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuQyxNQUFNLElBQUksR0FBVyxRQUFRLENBQUMsVUFBVSxDQUN0QyxtREFBbUQsQ0FDcEQsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFXLGVBQU0sQ0FBQyxJQUFJLENBQ3JDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3RDLENBQUE7UUFDRCxNQUFNLGlCQUFpQixHQUFzQixJQUFJLDBCQUFpQixDQUNoRSxJQUFJLEVBQ0osV0FBVyxFQUNYLFdBQVcsRUFDWCxLQUFLLENBQ04sQ0FBQTtRQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtRQUMzQixNQUFNLE1BQU0sR0FBVyxJQUFJLGVBQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUNyRSxNQUFNLFVBQVUsR0FBZSxJQUFJLGVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNyRCxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3hELENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsMENBQTBDLEVBQUUsR0FBd0IsRUFBRTtRQUN6RSwyQkFBMkI7UUFDM0IsTUFBTSxJQUFJLEdBQXlCLEVBQUUsQ0FBQTtRQUNyQyxNQUFNLEdBQUcsR0FBd0IsRUFBRSxDQUFBO1FBQ25DLE1BQU0sU0FBUyxHQUFPLElBQUksZUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQzVDLE1BQU0sTUFBTSxHQUF1QixJQUFJLDRCQUFrQixDQUN2RCxTQUFTLEVBQ1QsTUFBTSxFQUNOLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxFQUNULENBQUMsQ0FDRixDQUFBO1FBQ0QsTUFBTSxrQkFBa0IsR0FBdUIsSUFBSSw0QkFBa0IsQ0FDbkUsV0FBVyxFQUNYLE1BQU0sQ0FDUCxDQUFBO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1FBQzdCLE1BQU0sUUFBUSxHQUFPLElBQUksZUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUE7UUFDaEQsTUFBTSxLQUFLLEdBQXNCLElBQUksMEJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDaEUsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsTUFBTSxJQUFJLEdBQVcsUUFBUSxDQUFDLFVBQVUsQ0FDdEMsbURBQW1ELENBQ3BELENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBVyxlQUFNLENBQUMsSUFBSSxDQUNyQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUN0QyxDQUFBO1FBQ0QsTUFBTSxpQkFBaUIsR0FBc0IsSUFBSSwwQkFBaUIsQ0FDaEUsSUFBSSxFQUNKLFdBQVcsRUFDWCxXQUFXLEVBQ1gsS0FBSyxDQUNOLENBQUE7UUFDRCxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUE7UUFDM0IsTUFBTSxNQUFNLEdBQVcsSUFBSSxlQUFNLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDckUsTUFBTSxVQUFVLEdBQWUsSUFBSSxlQUFVLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDckQsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUN6RCxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQXdCLEVBQUU7UUFDNUUsMkJBQTJCO1FBQzNCLE1BQU0sSUFBSSxHQUF5QixFQUFFLENBQUE7UUFDckMsTUFBTSxHQUFHLEdBQXdCLEVBQUUsQ0FBQTtRQUNuQyxNQUFNLFNBQVMsR0FBTyxJQUFJLGVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1FBQ2pELE1BQU0sTUFBTSxHQUF1QixJQUFJLDRCQUFrQixDQUN2RCxTQUFTLEVBQ1QsTUFBTSxFQUNOLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxFQUNULENBQUMsQ0FDRixDQUFBO1FBQ0QsTUFBTSxrQkFBa0IsR0FBdUIsSUFBSSw0QkFBa0IsQ0FDbkUsV0FBVyxFQUNYLE1BQU0sQ0FDUCxDQUFBO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1FBQzdCLE1BQU0sUUFBUSxHQUFPLElBQUksZUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUE7UUFDaEQsTUFBTSxLQUFLLEdBQXNCLElBQUksMEJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDaEUsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsTUFBTSxJQUFJLEdBQVcsUUFBUSxDQUFDLFVBQVUsQ0FDdEMsbURBQW1ELENBQ3BELENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBVyxlQUFNLENBQUMsSUFBSSxDQUNyQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUN0QyxDQUFBO1FBQ0QsTUFBTSxpQkFBaUIsR0FBc0IsSUFBSSwwQkFBaUIsQ0FDaEUsSUFBSSxFQUNKLFdBQVcsRUFDWCxXQUFXLEVBQ1gsS0FBSyxDQUNOLENBQUE7UUFDRCxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUE7UUFDM0IsTUFBTSxNQUFNLEdBQVcsSUFBSSxlQUFNLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDckUsTUFBTSxVQUFVLEdBQWUsSUFBSSxlQUFVLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDckQsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN4RCxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQVMsRUFBRTtRQUNyQyxNQUFNLE1BQU0sR0FBVyxJQUFJLGVBQU0sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUN2RSxNQUFNLEdBQUcsR0FBZSxJQUFJLGVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM5QyxNQUFNLEtBQUssR0FBd0IsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQ2hFLE1BQU0sTUFBTSxHQUF5QixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUE7UUFDbkUsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUUxQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2hELE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDdkQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ2pFLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQzdCLENBQUE7UUFFRCxJQUFJLENBQUMsR0FBYSxFQUFFLENBQUE7UUFDcEIsSUFBSSxDQUFDLEdBQWEsRUFBRSxDQUFBO1FBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzdDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtTQUM3QjtRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUUvRCxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ04sQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUVOLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzlDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDNUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtTQUM5QjtRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUUvRCxNQUFNLE1BQU0sR0FBZSxJQUFJLGVBQVUsRUFBRSxDQUFBO1FBQzNDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQy9CLENBQUE7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBQ2hELENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEdBQVMsRUFBRTtRQUNsRCxNQUFNLENBQUMsR0FBUyxFQUFFO1lBQ2hCLEdBQUcsQ0FBQyxXQUFXLENBQ2IsS0FBSyxFQUNMLFlBQVksRUFDWixJQUFJLGVBQUUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQ25CLE9BQU8sRUFDUCxNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sQ0FDUCxDQUFBO1FBQ0gsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDZCxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFTLEVBQUU7UUFDbkMsTUFBTSxNQUFNLEdBQWEsSUFBSSxtQkFBUSxDQUNuQyxLQUFLLEVBQ0wsWUFBWSxFQUNaLE9BQU8sRUFDUCxNQUFNLEVBQ04sSUFBSSxxQkFBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUMzQyxTQUFTLEVBQ1QsU0FBUyxDQUNWLENBQUE7UUFFRCxNQUFNLENBQUMsR0FBUyxFQUFFO1lBQ2hCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNuQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUVaLE1BQU0sUUFBUSxHQUFhLElBQUksbUJBQVEsQ0FDckMsS0FBSyxFQUNMLFlBQVksRUFDWixPQUFPLEVBQ1AsTUFBTSxFQUNOLElBQUkscUJBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFDM0MsUUFBUSxDQUFDLFVBQVUsQ0FBQywyQkFBZSxDQUFDLEVBQ3BDLFNBQVMsQ0FDVixDQUFBO1FBQ0QsTUFBTSxNQUFNLEdBQWEsSUFBSSxtQkFBUSxFQUFFLENBQUE7UUFDdkMsTUFBTSxVQUFVLEdBQVcsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQzlDLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUE7UUFFN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxtQkFBUSxDQUFDLENBQUE7UUFDekMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ3BELFFBQVEsQ0FBQyxVQUFVLENBQUMsMkJBQWUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FDckQsQ0FBQTtRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtRQUMxRSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQ25ELE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsRSxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFTLEVBQUU7UUFDbkMsTUFBTSxNQUFNLEdBQWEsSUFBSSxtQkFBUSxDQUNuQyxLQUFLLEVBQ0wsWUFBWSxFQUNaLE9BQU8sRUFDUCxNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLENBQ1gsQ0FBQTtRQUVELE1BQU0sQ0FBQyxHQUFTLEVBQUU7WUFDaEIsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ25CLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBRVosTUFBTSxRQUFRLEdBQWEsSUFBSSxtQkFBUSxDQUNyQyxLQUFLLEVBQ0wsWUFBWSxFQUNaLE9BQU8sRUFDUCxNQUFNLEVBQ04sU0FBUyxFQUNULFFBQVEsQ0FBQyxVQUFVLENBQUMsMkJBQWUsQ0FBQyxFQUNwQyxVQUFVLENBQ1gsQ0FBQTtRQUNELE1BQU0sTUFBTSxHQUFhLElBQUksbUJBQVEsRUFBRSxDQUFBO1FBQ3ZDLE1BQU0sVUFBVSxHQUFXLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUM5QyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBRTdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUMsbUJBQVEsQ0FBQyxDQUFBO1FBQ3pDLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ3pELFFBQVEsQ0FBQyxVQUFVLENBQUMsMkJBQWUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FDckQsQ0FBQTtRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtRQUMxRSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQ25ELE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3BFLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQVMsRUFBRTtRQUM3RCxNQUFNLEdBQUcsR0FBZSxHQUFHLENBQUMsV0FBVyxDQUNyQyxLQUFLLEVBQ0wsWUFBWSxFQUNaLElBQUksZUFBRSxDQUFDLElBQUksQ0FBQyxFQUNaLE9BQU8sRUFDUCxNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxJQUFBLHlCQUFPLEdBQUUsRUFDVCxJQUFBLHlCQUFPLEdBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxlQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDekIsQ0FBQyxDQUNGLENBQUE7UUFDRCxNQUFNLEVBQUUsR0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRWhDLE1BQU0sR0FBRyxHQUFPLElBQUksT0FBRSxFQUFFLENBQUE7UUFDeEIsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7UUFDMUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUM1QyxDQUFDLENBQUMsQ0FBQTtJQUNGLElBQUksQ0FBQyxnREFBZ0QsRUFBRSxHQUFTLEVBQUU7UUFDaEUsTUFBTSxHQUFHLEdBQWUsR0FBRyxDQUFDLFdBQVcsQ0FDckMsS0FBSyxFQUNMLFlBQVksRUFDWixJQUFJLGVBQUUsQ0FBQyxJQUFJLENBQUMsRUFDWixPQUFPLEVBQ1AsTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLENBQ1AsQ0FBQTtRQUNELE1BQU0sRUFBRSxHQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDaEMsTUFBTSxHQUFHLEdBQU8sSUFBSSxPQUFFLEVBQUUsQ0FBQTtRQUN4QixHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQzdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtRQUMxRSxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBQzVDLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQVMsRUFBRTtRQUM3QyxNQUFNLEdBQUcsR0FBZSxHQUFHLENBQUMsYUFBYSxDQUN2QyxLQUFLLEVBQ0wsWUFBWSxFQUNaLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLFdBQVcsRUFDWCxRQUFRLENBQUMsVUFBVSxDQUFDLDJCQUFlLENBQUMsRUFDcEMsSUFBSSxlQUFFLENBQUMsRUFBRSxDQUFDLEVBQ1YsT0FBTyxFQUNQLElBQUkscUJBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFDM0MsSUFBQSx5QkFBTyxHQUFFLENBQ1YsQ0FBQTtRQUNELE1BQU0sRUFBRSxHQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDaEMsTUFBTSxHQUFHLEdBQU8sSUFBSSxPQUFFLEVBQUUsQ0FBQTtRQUN4QixHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQzdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUM1RSxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFTLEVBQUU7UUFDN0MsTUFBTSxHQUFHLEdBQWUsR0FBRyxDQUFDLGFBQWEsQ0FDdkMsS0FBSyxFQUNMLFlBQVksRUFDWixJQUFJLGVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDVixXQUFXLEVBQ1gsTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sUUFBUSxDQUFDLFVBQVUsQ0FBQywyQkFBZSxDQUFDLEVBQ3BDLFNBQVMsRUFDVCxTQUFTLEVBQ1QsSUFBSSxxQkFBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUMzQyxJQUFBLHlCQUFPLEdBQUUsQ0FDVixDQUFBO1FBQ0QsTUFBTSxFQUFFLEdBQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNoQyxNQUFNLEdBQUcsR0FBTyxJQUFJLE9BQUUsRUFBRSxDQUFBO1FBQ3hCLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFDN0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBQzVFLENBQUMsQ0FBQyxDQUFBO0lBQ0YsNkRBQTZEO0lBQzdELDJFQUEyRTtJQUMzRSx5RUFBeUU7SUFDekUscURBQXFEO0lBQ3JELEtBQUs7SUFDTCx1REFBdUQ7SUFDdkQsK0RBQStEO0lBQy9ELDBEQUEwRDtJQUMxRCwrQ0FBK0M7SUFDL0MsS0FBSztJQUNMLDBEQUEwRDtJQUMxRCxnRUFBZ0U7SUFDaEUsaUVBQWlFO0lBQ2pFLEtBQUs7SUFDTCx3REFBd0Q7SUFDeEQsNERBQTREO0lBQzVELDZEQUE2RDtJQUM3RCxLQUFLO0lBQ0wsdURBQXVEO0lBQ3ZELDBEQUEwRDtJQUMxRCwyREFBMkQ7SUFDM0QsS0FBSztJQUNMLHlEQUF5RDtJQUN6RCw4REFBOEQ7SUFDOUQscUNBQXFDO0lBQ3JDLEtBQUs7QUFDUCxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb2NrQXhpb3MgZnJvbSBcImplc3QtbW9jay1heGlvc1wiXG5pbXBvcnQgeyBVVFhPU2V0LCBVVFhPIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vdXR4b3NcIlxuaW1wb3J0IHsgUGxhdGZvcm1WTUFQSSB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL2FwaVwiXG5pbXBvcnQgeyBVbnNpZ25lZFR4LCBUeCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL3R4XCJcbmltcG9ydCB7IEtleUNoYWluIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0va2V5Y2hhaW5cIlxuaW1wb3J0IHtcbiAgU0VDUFRyYW5zZmVySW5wdXQsXG4gIFRyYW5zZmVyYWJsZUlucHV0XG59IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL2lucHV0c1wiXG5pbXBvcnQgY3JlYXRlSGFzaCBmcm9tIFwiY3JlYXRlLWhhc2hcIlxuaW1wb3J0IEJpblRvb2xzIGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvYmludG9vbHNcIlxuaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXG5pbXBvcnQge1xuICBTRUNQVHJhbnNmZXJPdXRwdXQsXG4gIFRyYW5zZmVyYWJsZU91dHB1dFxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS9vdXRwdXRzXCJcbmltcG9ydCB7IFBsYXRmb3JtVk1Db25zdGFudHMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS9jb25zdGFudHNcIlxuaW1wb3J0IHsgQXZhbGFuY2hlLCBHZW5lc2lzRGF0YSB9IGZyb20gXCIuLi8uLi8uLi9zcmMvaW5kZXhcIlxuaW1wb3J0IHsgVVRGOFBheWxvYWQgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL3BheWxvYWRcIlxuaW1wb3J0IHtcbiAgTm9kZUlEU3RyaW5nVG9CdWZmZXIsXG4gIFVuaXhOb3dcbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9oZWxwZXJmdW5jdGlvbnNcIlxuaW1wb3J0IHsgQmFzZVR4IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vYmFzZXR4XCJcbmltcG9ydCB7IEltcG9ydFR4IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vaW1wb3J0dHhcIlxuaW1wb3J0IHsgRXhwb3J0VHggfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS9leHBvcnR0eFwiXG5pbXBvcnQgeyBQbGF0Zm9ybUNoYWluSUQgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2NvbnN0YW50c1wiXG5pbXBvcnQgeyBIdHRwUmVzcG9uc2UgfSBmcm9tIFwiamVzdC1tb2NrLWF4aW9zL2Rpc3QvbGliL21vY2stYXhpb3MtdHlwZXNcIlxuLy8gaW1wb3J0IHsgQWRkU3VibmV0VmFsaWRhdG9yVHgsIFN1Ym5ldEF1dGggfSBmcm9tIFwic3JjL2FwaXMvcGxhdGZvcm12bVwiXG5pbXBvcnQgeyBTdWJuZXRBdXRoIH0gZnJvbSBcInNyYy9hcGlzL3BsYXRmb3Jtdm1cIlxuXG5kZXNjcmliZShcIlRyYW5zYWN0aW9uc1wiLCAoKTogdm9pZCA9PiB7XG4gIC8qKlxuICAgKiBAaWdub3JlXG4gICAqL1xuICBjb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXG5cbiAgY29uc3QgbmV0d29ya0lEOiBudW1iZXIgPSAxMzM3XG4gIGxldCBzZXQ6IFVUWE9TZXRcbiAgbGV0IGtleW1ncjE6IEtleUNoYWluXG4gIGxldCBrZXltZ3IyOiBLZXlDaGFpblxuICBsZXQga2V5bWdyMzogS2V5Q2hhaW5cbiAgbGV0IGFkZHJzMTogQnVmZmVyW11cbiAgbGV0IGFkZHJzMjogQnVmZmVyW11cbiAgbGV0IGFkZHJzMzogQnVmZmVyW11cbiAgbGV0IHV0eG9zOiBVVFhPW11cbiAgbGV0IGlucHV0czogVHJhbnNmZXJhYmxlSW5wdXRbXVxuICBsZXQgb3V0cHV0czogVHJhbnNmZXJhYmxlT3V0cHV0W11cbiAgbGV0IGltcG9ydEluczogVHJhbnNmZXJhYmxlSW5wdXRbXVxuICBsZXQgaW1wb3J0VVRYT3M6IFVUWE9bXVxuICBsZXQgZXhwb3J0T3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W11cbiAgbGV0IGZ1bmd1dHhvczogVVRYT1tdXG4gIGxldCBleHBvcnRVVFhPSURTOiBzdHJpbmdbXVxuICBsZXQgYXBpOiBQbGF0Zm9ybVZNQVBJXG4gIGNvbnN0IGFtbnQ6IG51bWJlciA9IDEwMDAwXG4gIGNvbnN0IG5ldGlkOiBudW1iZXIgPSAxMjM0NVxuICBjb25zdCBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoUGxhdGZvcm1DaGFpbklEKVxuICBjb25zdCBhbGlhczogc3RyaW5nID0gXCJYXCJcbiAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgY3JlYXRlSGFzaChcInNoYTI1NlwiKVxuICAgICAgLnVwZGF0ZShcbiAgICAgICAgXCJXZWxsLCBub3csIGRvbid0IHlvdSB0ZWxsIG1lIHRvIHNtaWxlLCB5b3Ugc3RpY2sgYXJvdW5kIEknbGwgbWFrZSBpdCB3b3J0aCB5b3VyIHdoaWxlLlwiXG4gICAgICApXG4gICAgICAuZGlnZXN0KClcbiAgKVxuICBsZXQgYW1vdW50OiBCTlxuICBsZXQgYWRkcmVzc2VzOiBCdWZmZXJbXVxuICBsZXQgZmFsbEFkZHJlc3NlczogQnVmZmVyW11cbiAgbGV0IGxvY2t0aW1lOiBCTlxuICBsZXQgZmFsbExvY2t0aW1lOiBCTlxuICBsZXQgdGhyZXNob2xkOiBudW1iZXJcbiAgbGV0IGZhbGxUaHJlc2hvbGQ6IG51bWJlclxuICBjb25zdCBpcDogc3RyaW5nID0gXCIxMjcuMC4wLjFcIlxuICBjb25zdCBwb3J0OiBudW1iZXIgPSA4MDgwXG4gIGNvbnN0IHByb3RvY29sOiBzdHJpbmcgPSBcImh0dHBcIlxuICBjb25zdCBub2RlSURTdHI6IHN0cmluZyA9IFwiTm9kZUlELUdXUGNiRkpaRmZacmVFVFNvV2pQaW1yODQ2bVhFS0N0dVwiXG4gIGNvbnN0IG5vZGVJRDogQnVmZmVyID0gTm9kZUlEU3RyaW5nVG9CdWZmZXIoXG4gICAgXCJOb2RlSUQtR1dQY2JGSlpGZlpyZUVUU29XalBpbXI4NDZtWEVLQ3R1XCJcbiAgKVxuICBjb25zdCBzdGFydFRpbWU6IEJOID0gbmV3IEJOKDE2NDE5NjE3MzYpXG4gIGNvbnN0IGVuZFRpbWU6IEJOID0gbmV3IEJOKDE2NjIzMDcwMDApXG4gIGNvbnN0IHdlaWdodDogQk4gPSBuZXcgQk4oMjApXG4gIGxldCBhdmFsYW5jaGU6IEF2YWxhbmNoZVxuICBjb25zdCBuYW1lOiBzdHJpbmcgPSBcIk1vcnR5Y29pbiBpcyB0aGUgZHVtYiBhcyBhIHNhY2sgb2YgaGFtbWVycy5cIlxuICBjb25zdCBzeW1ib2w6IHN0cmluZyA9IFwibW9yVFwiXG4gIGNvbnN0IGRlbm9taW5hdGlvbjogbnVtYmVyID0gOFxuICBsZXQgZGp0eEFzc2V0SUQ6IEJ1ZmZlclxuICBjb25zdCBwQ2hhaW5CbG9ja2NoYWluSUQ6IHN0cmluZyA9IFwiMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTFMcG9ZWVwiXG4gIGNvbnN0IGdlbmVzaXNEYXRhU3RyOiBzdHJpbmcgPVxuICAgIFwiMTExMTFEZFpNaFlYVVppRlY5Rk5wZnBUU1Fyb3lzakh5TXVUNXphcFlrUFlybWFwN3Q3UzNzRE5Od0Z6bmd4Ujl4MVhtb1JqNUpLMVhvbVg4Ukh2WFlZNWgzcVllRXNNUVJGOFlwaWE3cDFDRkhEbzZLR1NqTWRpUWtybXB2TDhBdm9lelN4VldLWHQydWJtQkNuU2twUGpuUWJCU0Y3Z05nNHNQdTFQWGRoMWVLZ3RoYVNGUkVxcUc1RktNcldOaVM2VTg3a3hDbWJLamttQnZ3bkFkNlRwTng3NVlFaVM5WUtNeUhhQlpqa1JETmY2TmoxXCJcbiAgY29uc3Qgc3VibmV0SURTdHI6IHN0cmluZyA9XG4gICAgXCJMdFlVcWRiYkx6VG1ITVhQUFZoQUhNZURyNnJpRW10MnBqdGZFaXFBcUFjZTlNeENnXCJcbiAgY29uc3QgbWVtb1N0cjogc3RyaW5nID0gXCJmcm9tIHNub3dmbGFrZSB0byBhdmFsYW5jaGVcIlxuICBjb25zdCBtZW1vOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShtZW1vU3RyLCBcInV0ZjhcIilcbiAgY29uc3Qgc3VibmV0SUQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoc3VibmV0SURTdHIpXG4gIGNvbnN0IGNoYWluTmFtZVN0cjogc3RyaW5nID0gXCJFUElDIEFWTVwiXG4gIGNvbnN0IHZtSURTdHI6IHN0cmluZyA9IFwiYXZtXCJcbiAgY29uc3QgZnhJRHNTdHI6IHN0cmluZ1tdID0gW1wic2VjcDI1NmsxZnhcIl1cbiAgY29uc3QgZ2Q6IEdlbmVzaXNEYXRhID0gbmV3IEdlbmVzaXNEYXRhKClcbiAgZ2QuZnJvbUJ1ZmZlcihiaW50b29scy5jYjU4RGVjb2RlKGdlbmVzaXNEYXRhU3RyKSlcbiAgY29uc3QgYWRkcmVzc0luZGV4OiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcbiAgYWRkcmVzc0luZGV4LndyaXRlVUludEJFKDB4MCwgMCwgNClcbiAgY29uc3Qgc3VibmV0QXV0aDogU3VibmV0QXV0aCA9IG5ldyBTdWJuZXRBdXRoKFthZGRyZXNzSW5kZXhdKVxuICAvLyBsZXQgYWRkU3VibmV0VmFsaWRhdG9yVHg6IEFkZFN1Ym5ldFZhbGlkYXRvclR4ID0gbmV3IEFkZFN1Ym5ldFZhbGlkYXRvclR4KClcblxuICBiZWZvcmVBbGwoYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGF2YWxhbmNoZSA9IG5ldyBBdmFsYW5jaGUoXG4gICAgICBpcCxcbiAgICAgIHBvcnQsXG4gICAgICBwcm90b2NvbCxcbiAgICAgIDEyMzQ1LFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgdHJ1ZVxuICAgIClcbiAgICBhcGkgPSBuZXcgUGxhdGZvcm1WTUFQSShhdmFsYW5jaGUsIFwiL2V4dC9iYy9QXCIpXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEJ1ZmZlcj4gPSBhcGkuZ2V0REpUWEFzc2V0SUQoKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBuYW1lLFxuICAgICAgICBzeW1ib2wsXG4gICAgICAgIGFzc2V0SUQ6IGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRCksXG4gICAgICAgIGRlbm9taW5hdGlvbjogYCR7ZGVub21pbmF0aW9ufWBcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGRqdHhBc3NldElEID0gYXdhaXQgcmVzdWx0XG4gIH0pXG5cbiAgYmVmb3JlRWFjaCgoKTogdm9pZCA9PiB7XG4gICAgc2V0ID0gbmV3IFVUWE9TZXQoKVxuICAgIGtleW1ncjEgPSBuZXcgS2V5Q2hhaW4oYXZhbGFuY2hlLmdldEhSUCgpLCBhbGlhcylcbiAgICBrZXltZ3IyID0gbmV3IEtleUNoYWluKGF2YWxhbmNoZS5nZXRIUlAoKSwgYWxpYXMpXG4gICAga2V5bWdyMyA9IG5ldyBLZXlDaGFpbihhdmFsYW5jaGUuZ2V0SFJQKCksIGFsaWFzKVxuICAgIGFkZHJzMSA9IFtdXG4gICAgYWRkcnMyID0gW11cbiAgICBhZGRyczMgPSBbXVxuICAgIHV0eG9zID0gW11cbiAgICBpbnB1dHMgPSBbXVxuICAgIG91dHB1dHMgPSBbXVxuICAgIGltcG9ydElucyA9IFtdXG4gICAgaW1wb3J0VVRYT3MgPSBbXVxuICAgIGV4cG9ydE91dHMgPSBbXVxuICAgIGZ1bmd1dHhvcyA9IFtdXG4gICAgZXhwb3J0VVRYT0lEUyA9IFtdXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgYWRkcnMxLnB1c2goa2V5bWdyMS5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpKVxuICAgICAgYWRkcnMyLnB1c2goa2V5bWdyMi5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpKVxuICAgICAgYWRkcnMzLnB1c2goa2V5bWdyMy5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpKVxuICAgIH1cbiAgICBhbW91bnQgPSBuZXcgQk4oYW1udClcbiAgICBhZGRyZXNzZXMgPSBrZXltZ3IxLmdldEFkZHJlc3NlcygpXG4gICAgZmFsbEFkZHJlc3NlcyA9IGtleW1ncjIuZ2V0QWRkcmVzc2VzKClcbiAgICBsb2NrdGltZSA9IG5ldyBCTig1NDMyMSlcbiAgICBmYWxsTG9ja3RpbWUgPSBsb2NrdGltZS5hZGQobmV3IEJOKDUwKSlcbiAgICB0aHJlc2hvbGQgPSAzXG4gICAgZmFsbFRocmVzaG9sZCA9IDFcblxuICAgIGNvbnN0IHBheWxvYWQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygxMDI0KVxuICAgIHBheWxvYWQud3JpdGUoXG4gICAgICBcIkFsbCB5b3UgVHJla2tpZXMgYW5kIFRWIGFkZGljdHMsIERvbid0IG1lYW4gdG8gZGlzcyBkb24ndCBtZWFuIHRvIGJyaW5nIHN0YXRpYy5cIixcbiAgICAgIDAsXG4gICAgICAxMDI0LFxuICAgICAgXCJ1dGY4XCJcbiAgICApXG5cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICBsZXQgdHhpZDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAudXBkYXRlKGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG5ldyBCTihpKSwgMzIpKVxuICAgICAgICAgIC5kaWdlc3QoKVxuICAgICAgKVxuICAgICAgbGV0IHR4aWR4OiBCdWZmZXIgPSBCdWZmZXIuZnJvbShiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oaSksIDQpKVxuICAgICAgY29uc3Qgb3V0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGFkZHJlc3NlcyxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZFxuICAgICAgKVxuICAgICAgY29uc3QgeGZlcm91dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChhc3NldElELCBvdXQpXG4gICAgICBvdXRwdXRzLnB1c2goeGZlcm91dClcblxuICAgICAgY29uc3QgdTogVVRYTyA9IG5ldyBVVFhPKFxuICAgICAgICBQbGF0Zm9ybVZNQ29uc3RhbnRzLkxBVEVTVENPREVDLFxuICAgICAgICB0eGlkLFxuICAgICAgICB0eGlkeCxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgb3V0XG4gICAgICApXG4gICAgICB1dHhvcy5wdXNoKHUpXG4gICAgICBmdW5ndXR4b3MucHVzaCh1KVxuICAgICAgaW1wb3J0VVRYT3MucHVzaCh1KVxuXG4gICAgICB0eGlkID0gdS5nZXRUeElEKClcbiAgICAgIHR4aWR4ID0gdS5nZXRPdXRwdXRJZHgoKVxuXG4gICAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoYW1vdW50KVxuICAgICAgY29uc3QgeGZlcmluOiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcbiAgICAgICAgdHhpZCxcbiAgICAgICAgdHhpZHgsXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIGlucHV0XG4gICAgICApXG4gICAgICBpbnB1dHMucHVzaCh4ZmVyaW4pXG4gICAgfVxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDE7IGkgPCA0OyBpKyspIHtcbiAgICAgIGltcG9ydElucy5wdXNoKGlucHV0c1tpXSlcbiAgICAgIGV4cG9ydE91dHMucHVzaChvdXRwdXRzW2ldKVxuICAgICAgZXhwb3J0VVRYT0lEUy5wdXNoKGZ1bmd1dHhvc1tpXS5nZXRVVFhPSUQoKSlcbiAgICB9XG4gICAgc2V0LmFkZEFycmF5KHV0eG9zKVxuXG4gICAgLy8gYWRkU3VibmV0VmFsaWRhdG9yVHggPSBuZXcgQWRkU3VibmV0VmFsaWRhdG9yVHgoXG4gICAgLy8gICBuZXR3b3JrSUQsXG4gICAgLy8gICBiaW50b29scy5jYjU4RGVjb2RlKHBDaGFpbkJsb2NrY2hhaW5JRCksXG4gICAgLy8gICBvdXRwdXRzLFxuICAgIC8vICAgaW5wdXRzLFxuICAgIC8vICAgbWVtbyxcbiAgICAvLyAgIG5vZGVJRCxcbiAgICAvLyAgIHN0YXJ0VGltZSxcbiAgICAvLyAgIGVuZFRpbWUsXG4gICAgLy8gICB3ZWlnaHQsXG4gICAgLy8gICBzdWJuZXRJRCxcbiAgICAvLyAgIHN1Ym5ldEF1dGhcbiAgICAvLyApXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0ZSBzbWFsbCBCYXNlVHggdGhhdCBpcyBHb29zZSBFZ2cgVHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cbiAgICBjb25zdCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxuICAgIGNvbnN0IG91dHB1dEFtdDogQk4gPSBuZXcgQk4oXCIyNjZcIilcbiAgICBjb25zdCBvdXRwdXQ6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICBvdXRwdXRBbXQsXG4gICAgICBhZGRyczEsXG4gICAgICBuZXcgQk4oMCksXG4gICAgICAxXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZU91dHB1dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChcbiAgICAgIGRqdHhBc3NldElELFxuICAgICAgb3V0cHV0XG4gICAgKVxuICAgIG91dHMucHVzaCh0cmFuc2ZlcmFibGVPdXRwdXQpXG4gICAgY29uc3QgaW5wdXRBbXQ6IEJOID0gbmV3IEJOKFwiNDAwXCIpXG4gICAgY29uc3QgaW5wdXQ6IFNFQ1BUcmFuc2ZlcklucHV0ID0gbmV3IFNFQ1BUcmFuc2ZlcklucHV0KGlucHV0QW10KVxuICAgIGlucHV0LmFkZFNpZ25hdHVyZUlkeCgwLCBhZGRyczFbMF0pXG4gICAgY29uc3QgdHhpZDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgIFwibjhYSDVKWTFFWDVWWXFEZUFoQjRaZDRHS3hpOVVOUXk2b1BwTXNDQWoxUTZ4a2lpTFwiXG4gICAgKVxuICAgIGNvbnN0IG91dHB1dEluZGV4OiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgIGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG5ldyBCTigwKSwgNClcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlSW5wdXQ6IFRyYW5zZmVyYWJsZUlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KFxuICAgICAgdHhpZCxcbiAgICAgIG91dHB1dEluZGV4LFxuICAgICAgZGp0eEFzc2V0SUQsXG4gICAgICBpbnB1dFxuICAgIClcbiAgICBpbnMucHVzaCh0cmFuc2ZlcmFibGVJbnB1dClcbiAgICBjb25zdCBiYXNlVHg6IEJhc2VUeCA9IG5ldyBCYXNlVHgobmV0d29ya0lELCBibG9ja2NoYWluSUQsIG91dHMsIGlucylcbiAgICBjb25zdCB1bnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gbmV3IFVuc2lnbmVkVHgoYmFzZVR4KVxuICAgIGV4cGVjdChhd2FpdCBhcGkuY2hlY2tHb29zZUVnZyh1bnNpZ25lZFR4KSkudG9CZSh0cnVlKVxuICB9KVxuXG4gIHRlc3QoXCJjb25maXJtIGlucHV0VG90YWwsIG91dHB1dFRvdGFsIGFuZCBmZWUgYXJlIGNvcnJlY3RcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcbiAgICAvLyBsb2NhbCBuZXR3b3JrIFAgQ2hhaW4gSURcbiAgICAvLyBESlRYIGFzc2V0SURcbiAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgXCJuOFhINUpZMUVYNVZZcURlQWhCNFpkNEdLeGk5VU5ReTZvUHBNc0NBajFRNnhraWlMXCJcbiAgICApXG4gICAgY29uc3Qgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxuICAgIGNvbnN0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXG4gICAgY29uc3Qgb3V0cHV0QW10OiBCTiA9IG5ldyBCTihcIjI2NlwiKVxuICAgIGNvbnN0IG91dHB1dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgIG91dHB1dEFtdCxcbiAgICAgIGFkZHJzMSxcbiAgICAgIG5ldyBCTigwKSxcbiAgICAgIDFcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlT3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxuICAgICAgYXNzZXRJRCxcbiAgICAgIG91dHB1dFxuICAgIClcbiAgICBvdXRzLnB1c2godHJhbnNmZXJhYmxlT3V0cHV0KVxuICAgIGNvbnN0IGlucHV0QW10OiBCTiA9IG5ldyBCTihcIjQwMFwiKVxuICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChpbnB1dEFtdClcbiAgICBpbnB1dC5hZGRTaWduYXR1cmVJZHgoMCwgYWRkcnMxWzBdKVxuICAgIGNvbnN0IHR4aWQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICBcIm44WEg1SlkxRVg1VllxRGVBaEI0WmQ0R0t4aTlVTlF5Nm9QcE1zQ0FqMVE2eGtpaUxcIlxuICAgIClcbiAgICBjb25zdCBvdXRwdXRJbmRleDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICBiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oMCksIDQpXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZUlucHV0OiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcbiAgICAgIHR4aWQsXG4gICAgICBvdXRwdXRJbmRleCxcbiAgICAgIGFzc2V0SUQsXG4gICAgICBpbnB1dFxuICAgIClcbiAgICBpbnMucHVzaCh0cmFuc2ZlcmFibGVJbnB1dClcbiAgICBjb25zdCBiYXNlVHg6IEJhc2VUeCA9IG5ldyBCYXNlVHgobmV0d29ya0lELCBibG9ja2NoYWluSUQsIG91dHMsIGlucylcbiAgICBjb25zdCB1bnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gbmV3IFVuc2lnbmVkVHgoYmFzZVR4KVxuICAgIGNvbnN0IGlucHV0VG90YWw6IEJOID0gdW5zaWduZWRUeC5nZXRJbnB1dFRvdGFsKGFzc2V0SUQpXG4gICAgY29uc3Qgb3V0cHV0VG90YWw6IEJOID0gdW5zaWduZWRUeC5nZXRPdXRwdXRUb3RhbChhc3NldElEKVxuICAgIGNvbnN0IGJ1cm46IEJOID0gdW5zaWduZWRUeC5nZXRCdXJuKGFzc2V0SUQpXG4gICAgZXhwZWN0KGlucHV0VG90YWwudG9OdW1iZXIoKSkudG9FcXVhbChuZXcgQk4oNDAwKS50b051bWJlcigpKVxuICAgIGV4cGVjdChvdXRwdXRUb3RhbC50b051bWJlcigpKS50b0VxdWFsKG5ldyBCTigyNjYpLnRvTnVtYmVyKCkpXG4gICAgZXhwZWN0KGJ1cm4udG9OdW1iZXIoKSkudG9FcXVhbChuZXcgQk4oMTM0KS50b051bWJlcigpKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGUgc21hbGwgQmFzZVR4IHRoYXQgaXNuJ3QgR29vc2UgRWdnIFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAvLyBsb2NhbCBuZXR3b3JrIFggQ2hhaW4gSURcbiAgICBjb25zdCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXG4gICAgY29uc3QgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cbiAgICBjb25zdCBvdXRwdXRBbXQ6IEJOID0gbmV3IEJOKFwiMjY3XCIpXG4gICAgY29uc3Qgb3V0cHV0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgb3V0cHV0QW10LFxuICAgICAgYWRkcnMxLFxuICAgICAgbmV3IEJOKDApLFxuICAgICAgMVxuICAgIClcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVPdXRwdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoXG4gICAgICBkanR4QXNzZXRJRCxcbiAgICAgIG91dHB1dFxuICAgIClcbiAgICBvdXRzLnB1c2godHJhbnNmZXJhYmxlT3V0cHV0KVxuICAgIGNvbnN0IGlucHV0QW10OiBCTiA9IG5ldyBCTihcIjQwMFwiKVxuICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChpbnB1dEFtdClcbiAgICBpbnB1dC5hZGRTaWduYXR1cmVJZHgoMCwgYWRkcnMxWzBdKVxuICAgIGNvbnN0IHR4aWQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICBcIm44WEg1SlkxRVg1VllxRGVBaEI0WmQ0R0t4aTlVTlF5Nm9QcE1zQ0FqMVE2eGtpaUxcIlxuICAgIClcbiAgICBjb25zdCBvdXRwdXRJbmRleDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICBiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oMCksIDQpXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZUlucHV0OiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcbiAgICAgIHR4aWQsXG4gICAgICBvdXRwdXRJbmRleCxcbiAgICAgIGRqdHhBc3NldElELFxuICAgICAgaW5wdXRcbiAgICApXG4gICAgaW5zLnB1c2godHJhbnNmZXJhYmxlSW5wdXQpXG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KG5ldHdvcmtJRCwgYmxvY2tjaGFpbklELCBvdXRzLCBpbnMpXG4gICAgY29uc3QgdW5zaWduZWRUeDogVW5zaWduZWRUeCA9IG5ldyBVbnNpZ25lZFR4KGJhc2VUeClcbiAgICBleHBlY3QoYXdhaXQgYXBpLmNoZWNrR29vc2VFZ2codW5zaWduZWRUeCkpLnRvQmUodHJ1ZSlcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRlIGxhcmdlIEJhc2VUeCB0aGF0IGlzIEdvb3NlIEVnZyBUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgLy8gbG9jYWwgbmV0d29yayBQIENoYWluIElEXG4gICAgY29uc3Qgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxuICAgIGNvbnN0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXG4gICAgY29uc3Qgb3V0cHV0QW10OiBCTiA9IG5ldyBCTihcIjYwOTU1NTUwMDAwMFwiKVxuICAgIGNvbnN0IG91dHB1dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgIG91dHB1dEFtdCxcbiAgICAgIGFkZHJzMSxcbiAgICAgIG5ldyBCTigwKSxcbiAgICAgIDFcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlT3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxuICAgICAgZGp0eEFzc2V0SUQsXG4gICAgICBvdXRwdXRcbiAgICApXG4gICAgb3V0cy5wdXNoKHRyYW5zZmVyYWJsZU91dHB1dClcbiAgICBjb25zdCBpbnB1dEFtdDogQk4gPSBuZXcgQk4oXCI0NTAwMDAwMDAwMDAwMDAwMFwiKVxuICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChpbnB1dEFtdClcbiAgICBpbnB1dC5hZGRTaWduYXR1cmVJZHgoMCwgYWRkcnMxWzBdKVxuICAgIGNvbnN0IHR4aWQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICBcIm44WEg1SlkxRVg1VllxRGVBaEI0WmQ0R0t4aTlVTlF5Nm9QcE1zQ0FqMVE2eGtpaUxcIlxuICAgIClcbiAgICBjb25zdCBvdXRwdXRJbmRleDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICBiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oMCksIDQpXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZUlucHV0OiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcbiAgICAgIHR4aWQsXG4gICAgICBvdXRwdXRJbmRleCxcbiAgICAgIGRqdHhBc3NldElELFxuICAgICAgaW5wdXRcbiAgICApXG4gICAgaW5zLnB1c2godHJhbnNmZXJhYmxlSW5wdXQpXG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KG5ldHdvcmtJRCwgYmxvY2tjaGFpbklELCBvdXRzLCBpbnMpXG4gICAgY29uc3QgdW5zaWduZWRUeDogVW5zaWduZWRUeCA9IG5ldyBVbnNpZ25lZFR4KGJhc2VUeClcbiAgICBleHBlY3QoYXdhaXQgYXBpLmNoZWNrR29vc2VFZ2codW5zaWduZWRUeCkpLnRvQmUoZmFsc2UpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0ZSBsYXJnZSBCYXNlVHggdGhhdCBpc24ndCBHb29zZSBFZ2cgVHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIC8vIGxvY2FsIG5ldHdvcmsgUCBDaGFpbiBJRFxuICAgIGNvbnN0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cbiAgICBjb25zdCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxuICAgIGNvbnN0IG91dHB1dEFtdDogQk4gPSBuZXcgQk4oXCI0NDk5NTYwOTU1NTUwMDAwMFwiKVxuICAgIGNvbnN0IG91dHB1dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgIG91dHB1dEFtdCxcbiAgICAgIGFkZHJzMSxcbiAgICAgIG5ldyBCTigwKSxcbiAgICAgIDFcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlT3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxuICAgICAgZGp0eEFzc2V0SUQsXG4gICAgICBvdXRwdXRcbiAgICApXG4gICAgb3V0cy5wdXNoKHRyYW5zZmVyYWJsZU91dHB1dClcbiAgICBjb25zdCBpbnB1dEFtdDogQk4gPSBuZXcgQk4oXCI0NTAwMDAwMDAwMDAwMDAwMFwiKVxuICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChpbnB1dEFtdClcbiAgICBpbnB1dC5hZGRTaWduYXR1cmVJZHgoMCwgYWRkcnMxWzBdKVxuICAgIGNvbnN0IHR4aWQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICBcIm44WEg1SlkxRVg1VllxRGVBaEI0WmQ0R0t4aTlVTlF5Nm9QcE1zQ0FqMVE2eGtpaUxcIlxuICAgIClcbiAgICBjb25zdCBvdXRwdXRJbmRleDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICBiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oMCksIDQpXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZUlucHV0OiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcbiAgICAgIHR4aWQsXG4gICAgICBvdXRwdXRJbmRleCxcbiAgICAgIGRqdHhBc3NldElELFxuICAgICAgaW5wdXRcbiAgICApXG4gICAgaW5zLnB1c2godHJhbnNmZXJhYmxlSW5wdXQpXG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KG5ldHdvcmtJRCwgYmxvY2tjaGFpbklELCBvdXRzLCBpbnMpXG4gICAgY29uc3QgdW5zaWduZWRUeDogVW5zaWduZWRUeCA9IG5ldyBVbnNpZ25lZFR4KGJhc2VUeClcbiAgICBleHBlY3QoYXdhaXQgYXBpLmNoZWNrR29vc2VFZ2codW5zaWduZWRUeCkpLnRvQmUodHJ1ZSlcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRpb24gVW5zaWduZWRUeFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KG5ldGlkLCBibG9ja2NoYWluSUQsIG91dHB1dHMsIGlucHV0cylcbiAgICBjb25zdCB0eHU6IFVuc2lnbmVkVHggPSBuZXcgVW5zaWduZWRUeChiYXNlVHgpXG4gICAgY29uc3QgdHhpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSB0eHUuZ2V0VHJhbnNhY3Rpb24oKS5nZXRJbnMoKVxuICAgIGNvbnN0IHR4b3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB0eHUuZ2V0VHJhbnNhY3Rpb24oKS5nZXRPdXRzKClcbiAgICBleHBlY3QodHhpbnMubGVuZ3RoKS50b0JlKGlucHV0cy5sZW5ndGgpXG4gICAgZXhwZWN0KHR4b3V0cy5sZW5ndGgpLnRvQmUob3V0cHV0cy5sZW5ndGgpXG5cbiAgICBleHBlY3QodHh1LmdldFRyYW5zYWN0aW9uKCkuZ2V0VHhUeXBlKCkpLnRvQmUoMClcbiAgICBleHBlY3QodHh1LmdldFRyYW5zYWN0aW9uKCkuZ2V0TmV0d29ya0lEKCkpLnRvQmUoMTIzNDUpXG4gICAgZXhwZWN0KHR4dS5nZXRUcmFuc2FjdGlvbigpLmdldEJsb2NrY2hhaW5JRCgpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgYmxvY2tjaGFpbklELnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgKVxuXG4gICAgbGV0IGE6IHN0cmluZ1tdID0gW11cbiAgICBsZXQgYjogc3RyaW5nW10gPSBbXVxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0eGlucy5sZW5ndGg7IGkrKykge1xuICAgICAgYS5wdXNoKHR4aW5zW2ldLnRvU3RyaW5nKCkpXG4gICAgICBiLnB1c2goaW5wdXRzW2ldLnRvU3RyaW5nKCkpXG4gICAgfVxuICAgIGV4cGVjdChKU09OLnN0cmluZ2lmeShhLnNvcnQoKSkpLnRvQmUoSlNPTi5zdHJpbmdpZnkoYi5zb3J0KCkpKVxuXG4gICAgYSA9IFtdXG4gICAgYiA9IFtdXG5cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdHhvdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhLnB1c2godHhvdXRzW2ldLnRvU3RyaW5nKCkpXG4gICAgICBiLnB1c2gob3V0cHV0c1tpXS50b1N0cmluZygpKVxuICAgIH1cbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkoYS5zb3J0KCkpKS50b0JlKEpTT04uc3RyaW5naWZ5KGIuc29ydCgpKSlcblxuICAgIGNvbnN0IHR4dW5ldzogVW5zaWduZWRUeCA9IG5ldyBVbnNpZ25lZFR4KClcbiAgICB0eHVuZXcuZnJvbUJ1ZmZlcih0eHUudG9CdWZmZXIoKSlcbiAgICBleHBlY3QodHh1bmV3LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICB0eHUudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgIClcbiAgICBleHBlY3QodHh1bmV3LnRvU3RyaW5nKCkpLnRvQmUodHh1LnRvU3RyaW5nKCkpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0aW9uIFVuc2lnbmVkVHggQ2hlY2sgQW1vdW50XCIsICgpOiB2b2lkID0+IHtcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xuICAgICAgc2V0LmJ1aWxkQmFzZVR4KFxuICAgICAgICBuZXRpZCxcbiAgICAgICAgYmxvY2tjaGFpbklELFxuICAgICAgICBuZXcgQk4oYW1udCAqIDEwMDApLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMxXG4gICAgICApXG4gICAgfSkudG9UaHJvdygpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0aW9uIEltcG9ydFR4XCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBib21idHg6IEltcG9ydFR4ID0gbmV3IEltcG9ydFR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBvdXRwdXRzLFxuICAgICAgaW5wdXRzLFxuICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgaW1wb3J0SW5zXG4gICAgKVxuXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcbiAgICAgIGJvbWJ0eC50b0J1ZmZlcigpXG4gICAgfSkudG9UaHJvdygpXG5cbiAgICBjb25zdCBpbXBvcnRUeDogSW1wb3J0VHggPSBuZXcgSW1wb3J0VHgoXG4gICAgICBuZXRpZCxcbiAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgIG91dHB1dHMsXG4gICAgICBpbnB1dHMsXG4gICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICBiaW50b29scy5jYjU4RGVjb2RlKFBsYXRmb3JtQ2hhaW5JRCksXG4gICAgICBpbXBvcnRJbnNcbiAgICApXG4gICAgY29uc3QgdHh1bmV3OiBJbXBvcnRUeCA9IG5ldyBJbXBvcnRUeCgpXG4gICAgY29uc3QgaW1wb3J0YnVmZjogQnVmZmVyID0gaW1wb3J0VHgudG9CdWZmZXIoKVxuICAgIHR4dW5ldy5mcm9tQnVmZmVyKGltcG9ydGJ1ZmYpXG5cbiAgICBleHBlY3QoaW1wb3J0VHgpLnRvQmVJbnN0YW5jZU9mKEltcG9ydFR4KVxuICAgIGV4cGVjdChpbXBvcnRUeC5nZXRTb3VyY2VDaGFpbigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShQbGF0Zm9ybUNoYWluSUQpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgKVxuICAgIGV4cGVjdCh0eHVuZXcudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShpbXBvcnRidWZmLnRvU3RyaW5nKFwiaGV4XCIpKVxuICAgIGV4cGVjdCh0eHVuZXcudG9TdHJpbmcoKSkudG9CZShpbXBvcnRUeC50b1N0cmluZygpKVxuICAgIGV4cGVjdChpbXBvcnRUeC5nZXRJbXBvcnRJbnB1dHMoKS5sZW5ndGgpLnRvQmUoaW1wb3J0SW5zLmxlbmd0aClcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRpb24gRXhwb3J0VHhcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGJvbWJ0eDogRXhwb3J0VHggPSBuZXcgRXhwb3J0VHgoXG4gICAgICBuZXRpZCxcbiAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgIG91dHB1dHMsXG4gICAgICBpbnB1dHMsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBleHBvcnRPdXRzXG4gICAgKVxuXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcbiAgICAgIGJvbWJ0eC50b0J1ZmZlcigpXG4gICAgfSkudG9UaHJvdygpXG5cbiAgICBjb25zdCBleHBvcnRUeDogRXhwb3J0VHggPSBuZXcgRXhwb3J0VHgoXG4gICAgICBuZXRpZCxcbiAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgIG91dHB1dHMsXG4gICAgICBpbnB1dHMsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBiaW50b29scy5jYjU4RGVjb2RlKFBsYXRmb3JtQ2hhaW5JRCksXG4gICAgICBleHBvcnRPdXRzXG4gICAgKVxuICAgIGNvbnN0IHR4dW5ldzogRXhwb3J0VHggPSBuZXcgRXhwb3J0VHgoKVxuICAgIGNvbnN0IGV4cG9ydGJ1ZmY6IEJ1ZmZlciA9IGV4cG9ydFR4LnRvQnVmZmVyKClcbiAgICB0eHVuZXcuZnJvbUJ1ZmZlcihleHBvcnRidWZmKVxuXG4gICAgZXhwZWN0KGV4cG9ydFR4KS50b0JlSW5zdGFuY2VPZihFeHBvcnRUeClcbiAgICBleHBlY3QoZXhwb3J0VHguZ2V0RGVzdGluYXRpb25DaGFpbigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShQbGF0Zm9ybUNoYWluSUQpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgKVxuICAgIGV4cGVjdCh0eHVuZXcudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShleHBvcnRidWZmLnRvU3RyaW5nKFwiaGV4XCIpKVxuICAgIGV4cGVjdCh0eHVuZXcudG9TdHJpbmcoKSkudG9CZShleHBvcnRUeC50b1N0cmluZygpKVxuICAgIGV4cGVjdChleHBvcnRUeC5nZXRFeHBvcnRPdXRwdXRzKCkubGVuZ3RoKS50b0JlKGV4cG9ydE91dHMubGVuZ3RoKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGlvbiBUeDEgd2l0aCBhc29mLCBsb2NrdGltZSwgdGhyZXNob2xkXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0eHU6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRCYXNlVHgoXG4gICAgICBuZXRpZCxcbiAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgIG5ldyBCTig5MDAwKSxcbiAgICAgIGFzc2V0SUQsXG4gICAgICBhZGRyczMsXG4gICAgICBhZGRyczEsXG4gICAgICBhZGRyczEsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBVbml4Tm93KCksXG4gICAgICBVbml4Tm93KCkuYWRkKG5ldyBCTig1MCkpLFxuICAgICAgMVxuICAgIClcbiAgICBjb25zdCB0eDogVHggPSB0eHUuc2lnbihrZXltZ3IxKVxuXG4gICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgdHgyLmZyb21TdHJpbmcodHgudG9TdHJpbmcoKSlcbiAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUodHgudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSlcbiAgICBleHBlY3QodHgyLnRvU3RyaW5nKCkpLnRvQmUodHgudG9TdHJpbmcoKSlcbiAgfSlcbiAgdGVzdChcIkNyZWF0aW9uIFR4MiB3aXRob3V0IGFzb2YsIGxvY2t0aW1lLCB0aHJlc2hvbGRcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHR4dTogVW5zaWduZWRUeCA9IHNldC5idWlsZEJhc2VUeChcbiAgICAgIG5ldGlkLFxuICAgICAgYmxvY2tjaGFpbklELFxuICAgICAgbmV3IEJOKDkwMDApLFxuICAgICAgYXNzZXRJRCxcbiAgICAgIGFkZHJzMyxcbiAgICAgIGFkZHJzMSxcbiAgICAgIGFkZHJzMVxuICAgIClcbiAgICBjb25zdCB0eDogVHggPSB0eHUuc2lnbihrZXltZ3IxKVxuICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxuICAgIHR4Mi5mcm9tQnVmZmVyKHR4LnRvQnVmZmVyKCkpXG4gICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKHR4LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpXG4gICAgZXhwZWN0KHR4Mi50b1N0cmluZygpKS50b0JlKHR4LnRvU3RyaW5nKCkpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0aW9uIFR4NCB1c2luZyBJbXBvcnRUeFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdHh1OiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkSW1wb3J0VHgoXG4gICAgICBuZXRpZCxcbiAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgIGFkZHJzMyxcbiAgICAgIGFkZHJzMSxcbiAgICAgIGFkZHJzMixcbiAgICAgIGltcG9ydFVUWE9zLFxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShQbGF0Zm9ybUNoYWluSUQpLFxuICAgICAgbmV3IEJOKDkwKSxcbiAgICAgIGFzc2V0SUQsXG4gICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICBVbml4Tm93KClcbiAgICApXG4gICAgY29uc3QgdHg6IFR4ID0gdHh1LnNpZ24oa2V5bWdyMSlcbiAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICB0eDIuZnJvbUJ1ZmZlcih0eC50b0J1ZmZlcigpKVxuICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZSh0eC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGlvbiBUeDUgdXNpbmcgRXhwb3J0VHhcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHR4dTogVW5zaWduZWRUeCA9IHNldC5idWlsZEV4cG9ydFR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBuZXcgQk4oOTApLFxuICAgICAgZGp0eEFzc2V0SUQsXG4gICAgICBhZGRyczMsXG4gICAgICBhZGRyczEsXG4gICAgICBhZGRyczIsXG4gICAgICBiaW50b29scy5jYjU4RGVjb2RlKFBsYXRmb3JtQ2hhaW5JRCksXG4gICAgICB1bmRlZmluZWQsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICBVbml4Tm93KClcbiAgICApXG4gICAgY29uc3QgdHg6IFR4ID0gdHh1LnNpZ24oa2V5bWdyMSlcbiAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICB0eDIuZnJvbUJ1ZmZlcih0eC50b0J1ZmZlcigpKVxuICAgIGV4cGVjdCh0eC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKVxuICB9KVxuICAvLyB0ZXN0KFwiYWRkU3VibmV0VmFsaWRhdG9yVHggZ2V0QmxvY2tjaGFpbklEXCIsICgpOiB2b2lkID0+IHtcbiAgLy8gICBjb25zdCBibG9ja2NoYWluSURCdWY6IEJ1ZmZlciA9IGFkZFN1Ym5ldFZhbGlkYXRvclR4LmdldEJsb2NrY2hhaW5JRCgpXG4gIC8vICAgY29uc3QgYmxvY2tjaGFpbklEU3RyOiBzdHJpbmcgPSBiaW50b29scy5jYjU4RW5jb2RlKGJsb2NrY2hhaW5JREJ1ZilcbiAgLy8gICBleHBlY3QoYmxvY2tjaGFpbklEU3RyKS50b0JlKHBDaGFpbkJsb2NrY2hhaW5JRClcbiAgLy8gfSlcbiAgLy8gdGVzdChcImFkZFN1Ym5ldFZhbGlkYXRvclR4IGdldE5vZGVJRFwiLCAoKTogdm9pZCA9PiB7XG4gIC8vICAgY29uc3Qgbm9kZUlEQnVmOiBCdWZmZXIgPSBhZGRTdWJuZXRWYWxpZGF0b3JUeC5nZXROb2RlSUQoKVxuICAvLyAgIGNvbnN0IG5JRFN0cjogc3RyaW5nID0gYmludG9vbHMuY2I1OEVuY29kZShub2RlSURCdWYpXG4gIC8vICAgZXhwZWN0KGBOb2RlSUQtJHtuSURTdHJ9YCkudG9CZShub2RlSURTdHIpXG4gIC8vIH0pXG4gIC8vIHRlc3QoXCJhZGRTdWJuZXRWYWxpZGF0b3JUeCBnZXRTdGFydFRpbWVcIiwgKCk6IHZvaWQgPT4ge1xuICAvLyAgIGNvbnN0IHN0YXJ0VGltZUJOOiBCTiA9IGFkZFN1Ym5ldFZhbGlkYXRvclR4LmdldFN0YXJ0VGltZSgpXG4gIC8vICAgZXhwZWN0KHN0YXJ0VGltZUJOLnRvTnVtYmVyKCkpLnRvRXF1YWwoc3RhcnRUaW1lLnRvTnVtYmVyKCkpXG4gIC8vIH0pXG4gIC8vIHRlc3QoXCJhZGRTdWJuZXRWYWxpZGF0b3JUeCBnZXRFbmRUaW1lXCIsICgpOiB2b2lkID0+IHtcbiAgLy8gICBjb25zdCBlbmRUaW1lQk46IEJOID0gYWRkU3VibmV0VmFsaWRhdG9yVHguZ2V0RW5kVGltZSgpXG4gIC8vICAgZXhwZWN0KGVuZFRpbWVCTi50b051bWJlcigpKS50b0VxdWFsKGVuZFRpbWUudG9OdW1iZXIoKSlcbiAgLy8gfSlcbiAgLy8gdGVzdChcImFkZFN1Ym5ldFZhbGlkYXRvclR4IGdldFdlaWdodFwiLCAoKTogdm9pZCA9PiB7XG4gIC8vICAgY29uc3Qgd2VpZ2h0Qk46IEJOID0gYWRkU3VibmV0VmFsaWRhdG9yVHguZ2V0V2VpZ2h0KClcbiAgLy8gICBleHBlY3Qod2VpZ2h0Qk4udG9OdW1iZXIoKSkudG9FcXVhbCh3ZWlnaHQudG9OdW1iZXIoKSlcbiAgLy8gfSlcbiAgLy8gdGVzdChcImFkZFN1Ym5ldFZhbGlkYXRvclR4IGdldFN1Ym5ldElEXCIsICgpOiB2b2lkID0+IHtcbiAgLy8gICBjb25zdCBzSURTdHI6IHN0cmluZyA9IGFkZFN1Ym5ldFZhbGlkYXRvclR4LmdldFN1Ym5ldElEKClcbiAgLy8gICBleHBlY3Qoc0lEU3RyKS50b0JlKHN1Ym5ldElEU3RyKVxuICAvLyB9KVxufSlcbiJdfQ==