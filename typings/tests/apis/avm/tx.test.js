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
const utxos_1 = require("../../../src/apis/avm/utxos");
const api_1 = require("../../../src/apis/avm/api");
const tx_1 = require("../../../src/apis/avm/tx");
const keychain_1 = require("../../../src/apis/avm/keychain");
const inputs_1 = require("../../../src/apis/avm/inputs");
const create_hash_1 = __importDefault(require("create-hash"));
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer/");
const outputs_1 = require("../../../src/apis/avm/outputs");
const constants_1 = require("../../../src/apis/avm/constants");
const ops_1 = require("../../../src/apis/avm/ops");
const index_1 = require("../../../src/index");
const payload_1 = require("../../../src/utils/payload");
const initialstates_1 = require("../../../src/apis/avm/initialstates");
const helperfunctions_1 = require("../../../src/utils/helperfunctions");
const basetx_1 = require("../../../src/apis/avm/basetx");
const createassettx_1 = require("../../../src/apis/avm/createassettx");
const operationtx_1 = require("../../../src/apis/avm/operationtx");
const importtx_1 = require("../../../src/apis/avm/importtx");
const exporttx_1 = require("../../../src/apis/avm/exporttx");
const constants_2 = require("../../../src/utils/constants");
const constants_3 = require("../../../src/utils/constants");
const constants_4 = require("../../../src/utils/constants");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
describe("Transactions", () => {
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
    let ops;
    let importIns;
    let importUTXOs;
    let exportOuts;
    let fungutxos;
    let exportUTXOIDS;
    let api;
    const amnt = 10000;
    const netid = 12345;
    const bID = constants_3.Defaults.network[netid].X.blockchainID;
    const alias = "X";
    const assetID = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
        .update("Well, now, don't you tell me to smile, you stick around I'll make it worth your while.")
        .digest());
    const NFTassetID = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
        .update("I can't stand it, I know you planned it, I'mma set straight this Watergate.'")
        .digest());
    const codecID_zero = 0;
    const codecID_one = 1;
    let amount;
    let addresses;
    let fallAddresses;
    let locktime;
    let fallLocktime;
    let threshold;
    let fallThreshold;
    const nftutxoids = [];
    const ip = "127.0.0.1";
    const port = 8080;
    const protocol = "http";
    let avalanche;
    const blockchainID = bintools.cb58Decode(bID);
    const name = "Mortycoin is the dumb as a sack of hammers.";
    const symbol = "morT";
    const denomination = 8;
    let djtxAssetID;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        avalanche = new index_1.Avalanche(ip, port, protocol, netid, undefined, undefined, undefined, true);
        api = new api_1.AVMAPI(avalanche, "/ext/bc/avm", bID);
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
        ops = [];
        for (let i = 0; i < 3; i++) {
            addrs1.push(keymgr1.makeKey().getAddress());
            addrs2.push(keymgr2.makeKey().getAddress());
            addrs3.push(keymgr3.makeKey().getAddress());
        }
        amount = constants_4.ONEDJTX.mul(new bn_js_1.default(amnt));
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
            const u = new utxos_1.UTXO(constants_1.AVMConstants.LATESTCODEC, txid, txidx, assetID, out);
            utxos.push(u);
            fungutxos.push(u);
            importUTXOs.push(u);
            txid = u.getTxID();
            txidx = u.getOutputIdx();
            const input = new inputs_1.SECPTransferInput(amount);
            const xferin = new inputs_1.TransferableInput(txid, txidx, assetID, input);
            inputs.push(xferin);
            const nout = new outputs_1.NFTTransferOutput(1000 + i, payload, addresses, locktime, threshold);
            const op = new ops_1.NFTTransferOperation(nout);
            const nfttxid = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
                .update(bintools.fromBNToBuffer(new bn_js_1.default(1000 + i), 32))
                .digest());
            const nftutxo = new utxos_1.UTXO(constants_1.AVMConstants.LATESTCODEC, nfttxid, 1000 + i, NFTassetID, nout);
            nftutxoids.push(nftutxo.getUTXOID());
            const xferop = new ops_1.TransferableOperation(NFTassetID, [nftutxo.getUTXOID()], op);
            ops.push(xferop);
            utxos.push(nftutxo);
        }
        for (let i = 1; i < 4; i++) {
            importIns.push(inputs[i]);
            exportOuts.push(outputs[i]);
            exportUTXOIDS.push(fungutxos[i].getUTXOID());
        }
        set.addArray(utxos);
    });
    test("BaseTx codecIDs", () => {
        const baseTx = new basetx_1.BaseTx();
        expect(baseTx.getCodecID()).toBe(codecID_zero);
        expect(baseTx.getTypeID()).toBe(constants_1.AVMConstants.BASETX);
        baseTx.setCodecID(codecID_one);
        expect(baseTx.getCodecID()).toBe(codecID_one);
        expect(baseTx.getTypeID()).toBe(constants_1.AVMConstants.BASETX_CODECONE);
        baseTx.setCodecID(codecID_zero);
        expect(baseTx.getCodecID()).toBe(codecID_zero);
        expect(baseTx.getTypeID()).toBe(constants_1.AVMConstants.BASETX);
    });
    test("Invalid BaseTx codecID", () => {
        const baseTx = new basetx_1.BaseTx();
        expect(() => {
            baseTx.setCodecID(2);
        }).toThrow("Error - BaseTx.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
    });
    test("CreateAssetTx codecIDs", () => {
        const createAssetTx = new createassettx_1.CreateAssetTx();
        expect(createAssetTx.getCodecID()).toBe(codecID_zero);
        expect(createAssetTx.getTypeID()).toBe(constants_1.AVMConstants.CREATEASSETTX);
        createAssetTx.setCodecID(codecID_one);
        expect(createAssetTx.getCodecID()).toBe(codecID_one);
        expect(createAssetTx.getTypeID()).toBe(constants_1.AVMConstants.CREATEASSETTX_CODECONE);
        createAssetTx.setCodecID(codecID_zero);
        expect(createAssetTx.getCodecID()).toBe(codecID_zero);
        expect(createAssetTx.getTypeID()).toBe(constants_1.AVMConstants.CREATEASSETTX);
    });
    test("Invalid CreateAssetTx codecID", () => {
        const createAssetTx = new createassettx_1.CreateAssetTx();
        expect(() => {
            createAssetTx.setCodecID(2);
        }).toThrow("Error - CreateAssetTx.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
    });
    test("OperationTx codecIDs", () => {
        const operationTx = new operationtx_1.OperationTx();
        expect(operationTx.getCodecID()).toBe(codecID_zero);
        expect(operationTx.getTypeID()).toBe(constants_1.AVMConstants.OPERATIONTX);
        operationTx.setCodecID(codecID_one);
        expect(operationTx.getCodecID()).toBe(codecID_one);
        expect(operationTx.getTypeID()).toBe(constants_1.AVMConstants.OPERATIONTX_CODECONE);
        operationTx.setCodecID(codecID_zero);
        expect(operationTx.getCodecID()).toBe(codecID_zero);
        expect(operationTx.getTypeID()).toBe(constants_1.AVMConstants.OPERATIONTX);
    });
    test("Invalid OperationTx codecID", () => {
        const operationTx = new operationtx_1.OperationTx();
        expect(() => {
            operationTx.setCodecID(2);
        }).toThrow("Error - OperationTx.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
    });
    test("ImportTx codecIDs", () => {
        const importTx = new importtx_1.ImportTx();
        expect(importTx.getCodecID()).toBe(codecID_zero);
        expect(importTx.getTypeID()).toBe(constants_1.AVMConstants.IMPORTTX);
        importTx.setCodecID(codecID_one);
        expect(importTx.getCodecID()).toBe(codecID_one);
        expect(importTx.getTypeID()).toBe(constants_1.AVMConstants.IMPORTTX_CODECONE);
        importTx.setCodecID(codecID_zero);
        expect(importTx.getCodecID()).toBe(codecID_zero);
        expect(importTx.getTypeID()).toBe(constants_1.AVMConstants.IMPORTTX);
    });
    test("Invalid ImportTx codecID", () => {
        const importTx = new importtx_1.ImportTx();
        expect(() => {
            importTx.setCodecID(2);
        }).toThrow("Error - ImportTx.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
    });
    test("ExportTx codecIDs", () => {
        const exportTx = new exporttx_1.ExportTx();
        expect(exportTx.getCodecID()).toBe(codecID_zero);
        expect(exportTx.getTypeID()).toBe(constants_1.AVMConstants.EXPORTTX);
        exportTx.setCodecID(codecID_one);
        expect(exportTx.getCodecID()).toBe(codecID_one);
        expect(exportTx.getTypeID()).toBe(constants_1.AVMConstants.EXPORTTX_CODECONE);
        exportTx.setCodecID(codecID_zero);
        expect(exportTx.getCodecID()).toBe(codecID_zero);
        expect(exportTx.getTypeID()).toBe(constants_1.AVMConstants.EXPORTTX);
    });
    test("Invalid ExportTx codecID", () => {
        const exportTx = new exporttx_1.ExportTx();
        expect(() => {
            exportTx.setCodecID(2);
        }).toThrow("Error - ExportTx.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
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
        const baseTx = new basetx_1.BaseTx(netid, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(true);
    }));
    test("Create small BaseTx with bad txid", () => __awaiter(void 0, void 0, void 0, function* () {
        const outs = [];
        const outputAmt = new bn_js_1.default("266");
        const output = new outputs_1.SECPTransferOutput(outputAmt, addrs1, new bn_js_1.default(0), 1);
        const transferableOutput = new outputs_1.TransferableOutput(djtxAssetID, output);
        outs.push(transferableOutput);
        const inputAmt = new bn_js_1.default("400");
        const input = new inputs_1.SECPTransferInput(inputAmt);
        input.addSignatureIdx(0, addrs1[0]);
        expect(() => {
            const txid = bintools.cb58Decode("n8XHaaaa5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        }).toThrow("Error - BinTools.cb58Decode: invalid checksum");
    }));
    test("confirm inputTotal, outputTotal and fee are correct", () => __awaiter(void 0, void 0, void 0, function* () {
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
        const baseTx = new basetx_1.BaseTx(netid, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        const inputTotal = unsignedTx.getInputTotal(assetID);
        const outputTotal = unsignedTx.getOutputTotal(assetID);
        const burn = unsignedTx.getBurn(assetID);
        expect(inputTotal.toNumber()).toEqual(new bn_js_1.default(400).toNumber());
        expect(outputTotal.toNumber()).toEqual(new bn_js_1.default(266).toNumber());
        expect(burn.toNumber()).toEqual(new bn_js_1.default(134).toNumber());
    }));
    test("Create small BaseTx that isn't Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
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
        const baseTx = new basetx_1.BaseTx(netid, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(true);
    }));
    test("Create large BaseTx that is Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
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
        const baseTx = new basetx_1.BaseTx(netid, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(false);
    }));
    test("Create large BaseTx that isn't Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
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
        const baseTx = new basetx_1.BaseTx(netid, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(true);
    }));
    test("bad asset ID", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(() => {
            const assetID = bintools.cb58Decode("badaaaan8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        }).toThrow();
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
            set.buildBaseTx(netid, blockchainID, constants_4.ONEDJTX.mul(new bn_js_1.default(amnt * 10000)), assetID, addrs3, addrs1, addrs1);
        }).toThrow();
    });
    test("CreateAssetTX", () => {
        const secpbase1 = new outputs_1.SECPTransferOutput(new bn_js_1.default(777), addrs3, locktime, 1);
        const secpbase2 = new outputs_1.SECPTransferOutput(new bn_js_1.default(888), addrs2, locktime, 1);
        const secpbase3 = new outputs_1.SECPTransferOutput(new bn_js_1.default(999), addrs2, locktime, 1);
        const initialState = new initialstates_1.InitialStates();
        initialState.addOutput(secpbase1, constants_1.AVMConstants.SECPFXID);
        initialState.addOutput(secpbase2, constants_1.AVMConstants.SECPFXID);
        initialState.addOutput(secpbase3, constants_1.AVMConstants.SECPFXID);
        const name = "Rickcoin is the most intelligent coin";
        const symbol = "RICK";
        const denomination = 9;
        const txu = new createassettx_1.CreateAssetTx(netid, blockchainID, outputs, inputs, new payload_1.UTF8Payload("hello world").getPayload(), name, symbol, denomination, initialState);
        const txins = txu.getIns();
        const txouts = txu.getOuts();
        const initState = txu.getInitialStates();
        expect(txins.length).toBe(inputs.length);
        expect(txouts.length).toBe(outputs.length);
        expect(initState.toBuffer().toString("hex")).toBe(initialState.toBuffer().toString("hex"));
        expect(txu.getTxType()).toBe(constants_1.AVMConstants.CREATEASSETTX);
        expect(txu.getNetworkID()).toBe(12345);
        expect(txu.getBlockchainID().toString("hex")).toBe(blockchainID.toString("hex"));
        expect(txu.getName()).toBe(name);
        expect(txu.getSymbol()).toBe(symbol);
        expect(txu.getDenomination()).toBe(denomination);
        expect(txu.getDenominationBuffer().readUInt8(0)).toBe(denomination);
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
        const txunew = new createassettx_1.CreateAssetTx();
        txunew.fromBuffer(txu.toBuffer());
        expect(txunew.toBuffer().toString("hex")).toBe(txu.toBuffer().toString("hex"));
        expect(txunew.toString()).toBe(txu.toString());
    });
    test("Creation OperationTx", () => {
        const optx = new operationtx_1.OperationTx(netid, blockchainID, outputs, inputs, new payload_1.UTF8Payload("hello world").getPayload(), ops);
        const txunew = new operationtx_1.OperationTx();
        const opbuff = optx.toBuffer();
        txunew.fromBuffer(opbuff);
        expect(txunew.toBuffer().toString("hex")).toBe(opbuff.toString("hex"));
        expect(txunew.toString()).toBe(optx.toString());
        expect(optx.getOperations().length).toBe(ops.length);
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
    test("Creation Tx3 using OperationTx", () => {
        const txu = set.buildNFTTransferTx(netid, blockchainID, addrs3, addrs1, addrs2, nftutxoids, new bn_js_1.default(90), djtxAssetID, undefined, (0, helperfunctions_1.UnixNow)(), (0, helperfunctions_1.UnixNow)().add(new bn_js_1.default(50)), 1);
        const tx = txu.sign(keymgr1);
        const tx2 = new tx_1.Tx();
        tx2.fromBuffer(tx.toBuffer());
        expect(tx2.toBuffer().toString("hex")).toBe(tx.toBuffer().toString("hex"));
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3RzL2FwaXMvYXZtL3R4LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBdUM7QUFDdkMsdURBQTJEO0FBQzNELG1EQUFrRDtBQUNsRCxpREFBeUQ7QUFDekQsNkRBQXlEO0FBQ3pELHlEQUdxQztBQUNyQyw4REFBb0M7QUFDcEMsMkVBQWtEO0FBQ2xELGtEQUFzQjtBQUN0QixvQ0FBZ0M7QUFDaEMsMkRBSXNDO0FBQ3RDLCtEQUE4RDtBQUM5RCxtREFHa0M7QUFDbEMsOENBQThDO0FBQzlDLHdEQUF3RDtBQUN4RCx1RUFBbUU7QUFDbkUsd0VBQTREO0FBQzVELHlEQUFxRDtBQUNyRCx1RUFBbUU7QUFDbkUsbUVBQStEO0FBQy9ELDZEQUF5RDtBQUN6RCw2REFBeUQ7QUFDekQsNERBQThEO0FBQzlELDREQUF1RDtBQUN2RCw0REFBc0Q7QUFHdEQ7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBUyxFQUFFO0lBQ2xDLElBQUksR0FBWSxDQUFBO0lBQ2hCLElBQUksT0FBaUIsQ0FBQTtJQUNyQixJQUFJLE9BQWlCLENBQUE7SUFDckIsSUFBSSxPQUFpQixDQUFBO0lBQ3JCLElBQUksTUFBZ0IsQ0FBQTtJQUNwQixJQUFJLE1BQWdCLENBQUE7SUFDcEIsSUFBSSxNQUFnQixDQUFBO0lBQ3BCLElBQUksS0FBYSxDQUFBO0lBQ2pCLElBQUksTUFBMkIsQ0FBQTtJQUMvQixJQUFJLE9BQTZCLENBQUE7SUFDakMsSUFBSSxHQUE0QixDQUFBO0lBQ2hDLElBQUksU0FBOEIsQ0FBQTtJQUNsQyxJQUFJLFdBQW1CLENBQUE7SUFDdkIsSUFBSSxVQUFnQyxDQUFBO0lBQ3BDLElBQUksU0FBaUIsQ0FBQTtJQUNyQixJQUFJLGFBQXVC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RSxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vY2tBeGlvcyBmcm9tIFwiamVzdC1tb2NrLWF4aW9zXCJcbmltcG9ydCB7IFVUWE9TZXQsIFVUWE8gfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL3V0eG9zXCJcbmltcG9ydCB7IEFWTUFQSSB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vYXBpXCJcbmltcG9ydCB7IFVuc2lnbmVkVHgsIFR4IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS90eFwiXG5pbXBvcnQgeyBLZXlDaGFpbiB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0va2V5Y2hhaW5cIlxuaW1wb3J0IHtcbiAgU0VDUFRyYW5zZmVySW5wdXQsXG4gIFRyYW5zZmVyYWJsZUlucHV0XG59IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vaW5wdXRzXCJcbmltcG9ydCBjcmVhdGVIYXNoIGZyb20gXCJjcmVhdGUtaGFzaFwiXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9iaW50b29sc1wiXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcbmltcG9ydCB7XG4gIFNFQ1BUcmFuc2Zlck91dHB1dCxcbiAgTkZUVHJhbnNmZXJPdXRwdXQsXG4gIFRyYW5zZmVyYWJsZU91dHB1dFxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL291dHB1dHNcIlxuaW1wb3J0IHsgQVZNQ29uc3RhbnRzIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9jb25zdGFudHNcIlxuaW1wb3J0IHtcbiAgVHJhbnNmZXJhYmxlT3BlcmF0aW9uLFxuICBORlRUcmFuc2Zlck9wZXJhdGlvblxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL29wc1wiXG5pbXBvcnQgeyBBdmFsYW5jaGUgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2luZGV4XCJcbmltcG9ydCB7IFVURjhQYXlsb2FkIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9wYXlsb2FkXCJcbmltcG9ydCB7IEluaXRpYWxTdGF0ZXMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL2luaXRpYWxzdGF0ZXNcIlxuaW1wb3J0IHsgVW5peE5vdyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvaGVscGVyZnVuY3Rpb25zXCJcbmltcG9ydCB7IEJhc2VUeCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vYmFzZXR4XCJcbmltcG9ydCB7IENyZWF0ZUFzc2V0VHggfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL2NyZWF0ZWFzc2V0dHhcIlxuaW1wb3J0IHsgT3BlcmF0aW9uVHggfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL29wZXJhdGlvbnR4XCJcbmltcG9ydCB7IEltcG9ydFR4IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9pbXBvcnR0eFwiXG5pbXBvcnQgeyBFeHBvcnRUeCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vZXhwb3J0dHhcIlxuaW1wb3J0IHsgUGxhdGZvcm1DaGFpbklEIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9jb25zdGFudHNcIlxuaW1wb3J0IHsgRGVmYXVsdHMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2NvbnN0YW50c1wiXG5pbXBvcnQgeyBPTkVESlRYIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9jb25zdGFudHNcIlxuaW1wb3J0IHsgSHR0cFJlc3BvbnNlIH0gZnJvbSBcImplc3QtbW9jay1heGlvcy9kaXN0L2xpYi9tb2NrLWF4aW9zLXR5cGVzXCJcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcbmRlc2NyaWJlKFwiVHJhbnNhY3Rpb25zXCIsICgpOiB2b2lkID0+IHtcbiAgbGV0IHNldDogVVRYT1NldFxuICBsZXQga2V5bWdyMTogS2V5Q2hhaW5cbiAgbGV0IGtleW1ncjI6IEtleUNoYWluXG4gIGxldCBrZXltZ3IzOiBLZXlDaGFpblxuICBsZXQgYWRkcnMxOiBCdWZmZXJbXVxuICBsZXQgYWRkcnMyOiBCdWZmZXJbXVxuICBsZXQgYWRkcnMzOiBCdWZmZXJbXVxuICBsZXQgdXR4b3M6IFVUWE9bXVxuICBsZXQgaW5wdXRzOiBUcmFuc2ZlcmFibGVJbnB1dFtdXG4gIGxldCBvdXRwdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXVxuICBsZXQgb3BzOiBUcmFuc2ZlcmFibGVPcGVyYXRpb25bXVxuICBsZXQgaW1wb3J0SW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdXG4gIGxldCBpbXBvcnRVVFhPczogVVRYT1tdXG4gIGxldCBleHBvcnRPdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXVxuICBsZXQgZnVuZ3V0eG9zOiBVVFhPW11cbiAgbGV0IGV4cG9ydFVUWE9JRFM6IHN0cmluZ1tdXG4gIGxldCBhcGk6IEFWTUFQSVxuICBjb25zdCBhbW50OiBudW1iZXIgPSAxMDAwMFxuICBjb25zdCBuZXRpZDogbnVtYmVyID0gMTIzNDVcbiAgY29uc3QgYklEOiBzdHJpbmcgPSBEZWZhdWx0cy5uZXR3b3JrW25ldGlkXS5YLmJsb2NrY2hhaW5JRFxuICBjb25zdCBhbGlhczogc3RyaW5nID0gXCJYXCJcbiAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgY3JlYXRlSGFzaChcInNoYTI1NlwiKVxuICAgICAgLnVwZGF0ZShcbiAgICAgICAgXCJXZWxsLCBub3csIGRvbid0IHlvdSB0ZWxsIG1lIHRvIHNtaWxlLCB5b3Ugc3RpY2sgYXJvdW5kIEknbGwgbWFrZSBpdCB3b3J0aCB5b3VyIHdoaWxlLlwiXG4gICAgICApXG4gICAgICAuZGlnZXN0KClcbiAgKVxuICBjb25zdCBORlRhc3NldElEOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAudXBkYXRlKFxuICAgICAgICBcIkkgY2FuJ3Qgc3RhbmQgaXQsIEkga25vdyB5b3UgcGxhbm5lZCBpdCwgSSdtbWEgc2V0IHN0cmFpZ2h0IHRoaXMgV2F0ZXJnYXRlLidcIlxuICAgICAgKVxuICAgICAgLmRpZ2VzdCgpXG4gIClcbiAgY29uc3QgY29kZWNJRF96ZXJvOiBudW1iZXIgPSAwXG4gIGNvbnN0IGNvZGVjSURfb25lOiBudW1iZXIgPSAxXG4gIGxldCBhbW91bnQ6IEJOXG4gIGxldCBhZGRyZXNzZXM6IEJ1ZmZlcltdXG4gIGxldCBmYWxsQWRkcmVzc2VzOiBCdWZmZXJbXVxuICBsZXQgbG9ja3RpbWU6IEJOXG4gIGxldCBmYWxsTG9ja3RpbWU6IEJOXG4gIGxldCB0aHJlc2hvbGQ6IG51bWJlclxuICBsZXQgZmFsbFRocmVzaG9sZDogbnVtYmVyXG4gIGNvbnN0IG5mdHV0eG9pZHM6IHN0cmluZ1tdID0gW11cbiAgY29uc3QgaXA6IHN0cmluZyA9IFwiMTI3LjAuMC4xXCJcbiAgY29uc3QgcG9ydDogbnVtYmVyID0gODA4MFxuICBjb25zdCBwcm90b2NvbDogc3RyaW5nID0gXCJodHRwXCJcbiAgbGV0IGF2YWxhbmNoZTogQXZhbGFuY2hlXG4gIGNvbnN0IGJsb2NrY2hhaW5JRDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShiSUQpXG4gIGNvbnN0IG5hbWU6IHN0cmluZyA9IFwiTW9ydHljb2luIGlzIHRoZSBkdW1iIGFzIGEgc2FjayBvZiBoYW1tZXJzLlwiXG4gIGNvbnN0IHN5bWJvbDogc3RyaW5nID0gXCJtb3JUXCJcbiAgY29uc3QgZGVub21pbmF0aW9uOiBudW1iZXIgPSA4XG4gIGxldCBkanR4QXNzZXRJRDogQnVmZmVyXG5cbiAgYmVmb3JlQWxsKGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBhdmFsYW5jaGUgPSBuZXcgQXZhbGFuY2hlKFxuICAgICAgaXAsXG4gICAgICBwb3J0LFxuICAgICAgcHJvdG9jb2wsXG4gICAgICBuZXRpZCxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHRydWVcbiAgICApXG4gICAgYXBpID0gbmV3IEFWTUFQSShhdmFsYW5jaGUsIFwiL2V4dC9iYy9hdm1cIiwgYklEKVxuXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEJ1ZmZlcj4gPSBhcGkuZ2V0REpUWEFzc2V0SUQoKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBuYW1lLFxuICAgICAgICBzeW1ib2wsXG4gICAgICAgIGFzc2V0SUQ6IGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRCksXG4gICAgICAgIGRlbm9taW5hdGlvbjogYCR7ZGVub21pbmF0aW9ufWBcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGRqdHhBc3NldElEID0gYXdhaXQgcmVzdWx0XG4gIH0pXG5cbiAgYmVmb3JlRWFjaCgoKTogdm9pZCA9PiB7XG4gICAgc2V0ID0gbmV3IFVUWE9TZXQoKVxuICAgIGtleW1ncjEgPSBuZXcgS2V5Q2hhaW4oYXZhbGFuY2hlLmdldEhSUCgpLCBhbGlhcylcbiAgICBrZXltZ3IyID0gbmV3IEtleUNoYWluKGF2YWxhbmNoZS5nZXRIUlAoKSwgYWxpYXMpXG4gICAga2V5bWdyMyA9IG5ldyBLZXlDaGFpbihhdmFsYW5jaGUuZ2V0SFJQKCksIGFsaWFzKVxuICAgIGFkZHJzMSA9IFtdXG4gICAgYWRkcnMyID0gW11cbiAgICBhZGRyczMgPSBbXVxuICAgIHV0eG9zID0gW11cbiAgICBpbnB1dHMgPSBbXVxuICAgIG91dHB1dHMgPSBbXVxuICAgIGltcG9ydElucyA9IFtdXG4gICAgaW1wb3J0VVRYT3MgPSBbXVxuICAgIGV4cG9ydE91dHMgPSBbXVxuICAgIGZ1bmd1dHhvcyA9IFtdXG4gICAgZXhwb3J0VVRYT0lEUyA9IFtdXG4gICAgb3BzID0gW11cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBhZGRyczEucHVzaChrZXltZ3IxLm1ha2VLZXkoKS5nZXRBZGRyZXNzKCkpXG4gICAgICBhZGRyczIucHVzaChrZXltZ3IyLm1ha2VLZXkoKS5nZXRBZGRyZXNzKCkpXG4gICAgICBhZGRyczMucHVzaChrZXltZ3IzLm1ha2VLZXkoKS5nZXRBZGRyZXNzKCkpXG4gICAgfVxuICAgIGFtb3VudCA9IE9ORURKVFgubXVsKG5ldyBCTihhbW50KSlcbiAgICBhZGRyZXNzZXMgPSBrZXltZ3IxLmdldEFkZHJlc3NlcygpXG4gICAgZmFsbEFkZHJlc3NlcyA9IGtleW1ncjIuZ2V0QWRkcmVzc2VzKClcbiAgICBsb2NrdGltZSA9IG5ldyBCTig1NDMyMSlcbiAgICBmYWxsTG9ja3RpbWUgPSBsb2NrdGltZS5hZGQobmV3IEJOKDUwKSlcbiAgICB0aHJlc2hvbGQgPSAzXG4gICAgZmFsbFRocmVzaG9sZCA9IDFcblxuICAgIGNvbnN0IHBheWxvYWQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygxMDI0KVxuICAgIHBheWxvYWQud3JpdGUoXG4gICAgICBcIkFsbCB5b3UgVHJla2tpZXMgYW5kIFRWIGFkZGljdHMsIERvbid0IG1lYW4gdG8gZGlzcyBkb24ndCBtZWFuIHRvIGJyaW5nIHN0YXRpYy5cIixcbiAgICAgIDAsXG4gICAgICAxMDI0LFxuICAgICAgXCJ1dGY4XCJcbiAgICApXG5cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICBsZXQgdHhpZDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAudXBkYXRlKGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG5ldyBCTihpKSwgMzIpKVxuICAgICAgICAgIC5kaWdlc3QoKVxuICAgICAgKVxuICAgICAgbGV0IHR4aWR4OiBCdWZmZXIgPSBCdWZmZXIuZnJvbShiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oaSksIDQpKVxuICAgICAgY29uc3Qgb3V0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGFkZHJlc3NlcyxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZFxuICAgICAgKVxuICAgICAgY29uc3QgeGZlcm91dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChhc3NldElELCBvdXQpXG4gICAgICBvdXRwdXRzLnB1c2goeGZlcm91dClcblxuICAgICAgY29uc3QgdTogVVRYTyA9IG5ldyBVVFhPKFxuICAgICAgICBBVk1Db25zdGFudHMuTEFURVNUQ09ERUMsXG4gICAgICAgIHR4aWQsXG4gICAgICAgIHR4aWR4LFxuICAgICAgICBhc3NldElELFxuICAgICAgICBvdXRcbiAgICAgIClcbiAgICAgIHV0eG9zLnB1c2godSlcbiAgICAgIGZ1bmd1dHhvcy5wdXNoKHUpXG4gICAgICBpbXBvcnRVVFhPcy5wdXNoKHUpXG5cbiAgICAgIHR4aWQgPSB1LmdldFR4SUQoKVxuICAgICAgdHhpZHggPSB1LmdldE91dHB1dElkeCgpXG5cbiAgICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChhbW91bnQpXG4gICAgICBjb25zdCB4ZmVyaW46IFRyYW5zZmVyYWJsZUlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KFxuICAgICAgICB0eGlkLFxuICAgICAgICB0eGlkeCxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgaW5wdXRcbiAgICAgIClcbiAgICAgIGlucHV0cy5wdXNoKHhmZXJpbilcblxuICAgICAgY29uc3Qgbm91dDogTkZUVHJhbnNmZXJPdXRwdXQgPSBuZXcgTkZUVHJhbnNmZXJPdXRwdXQoXG4gICAgICAgIDEwMDAgKyBpLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgICBhZGRyZXNzZXMsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICB0aHJlc2hvbGRcbiAgICAgIClcbiAgICAgIGNvbnN0IG9wOiBORlRUcmFuc2Zlck9wZXJhdGlvbiA9IG5ldyBORlRUcmFuc2Zlck9wZXJhdGlvbihub3V0KVxuICAgICAgY29uc3QgbmZ0dHhpZDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAudXBkYXRlKGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG5ldyBCTigxMDAwICsgaSksIDMyKSlcbiAgICAgICAgICAuZGlnZXN0KClcbiAgICAgIClcbiAgICAgIGNvbnN0IG5mdHV0eG86IFVUWE8gPSBuZXcgVVRYTyhcbiAgICAgICAgQVZNQ29uc3RhbnRzLkxBVEVTVENPREVDLFxuICAgICAgICBuZnR0eGlkLFxuICAgICAgICAxMDAwICsgaSxcbiAgICAgICAgTkZUYXNzZXRJRCxcbiAgICAgICAgbm91dFxuICAgICAgKVxuICAgICAgbmZ0dXR4b2lkcy5wdXNoKG5mdHV0eG8uZ2V0VVRYT0lEKCkpXG4gICAgICBjb25zdCB4ZmVyb3A6IFRyYW5zZmVyYWJsZU9wZXJhdGlvbiA9IG5ldyBUcmFuc2ZlcmFibGVPcGVyYXRpb24oXG4gICAgICAgIE5GVGFzc2V0SUQsXG4gICAgICAgIFtuZnR1dHhvLmdldFVUWE9JRCgpXSxcbiAgICAgICAgb3BcbiAgICAgIClcbiAgICAgIG9wcy5wdXNoKHhmZXJvcClcbiAgICAgIHV0eG9zLnB1c2gobmZ0dXR4bylcbiAgICB9XG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8IDQ7IGkrKykge1xuICAgICAgaW1wb3J0SW5zLnB1c2goaW5wdXRzW2ldKVxuICAgICAgZXhwb3J0T3V0cy5wdXNoKG91dHB1dHNbaV0pXG4gICAgICBleHBvcnRVVFhPSURTLnB1c2goZnVuZ3V0eG9zW2ldLmdldFVUWE9JRCgpKVxuICAgIH1cbiAgICBzZXQuYWRkQXJyYXkodXR4b3MpXG4gIH0pXG5cbiAgdGVzdChcIkJhc2VUeCBjb2RlY0lEc1wiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KClcbiAgICBleHBlY3QoYmFzZVR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KGJhc2VUeC5nZXRUeXBlSUQoKSkudG9CZShBVk1Db25zdGFudHMuQkFTRVRYKVxuICAgIGJhc2VUeC5zZXRDb2RlY0lEKGNvZGVjSURfb25lKVxuICAgIGV4cGVjdChiYXNlVHguZ2V0Q29kZWNJRCgpKS50b0JlKGNvZGVjSURfb25lKVxuICAgIGV4cGVjdChiYXNlVHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLkJBU0VUWF9DT0RFQ09ORSlcbiAgICBiYXNlVHguc2V0Q29kZWNJRChjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KGJhc2VUeC5nZXRDb2RlY0lEKCkpLnRvQmUoY29kZWNJRF96ZXJvKVxuICAgIGV4cGVjdChiYXNlVHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLkJBU0VUWClcbiAgfSlcblxuICB0ZXN0KFwiSW52YWxpZCBCYXNlVHggY29kZWNJRFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KClcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xuICAgICAgYmFzZVR4LnNldENvZGVjSUQoMilcbiAgICB9KS50b1Rocm93KFxuICAgICAgXCJFcnJvciAtIEJhc2VUeC5zZXRDb2RlY0lEOiBpbnZhbGlkIGNvZGVjSUQuIFZhbGlkIGNvZGVjSURzIGFyZSAwIGFuZCAxLlwiXG4gICAgKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGVBc3NldFR4IGNvZGVjSURzXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBjcmVhdGVBc3NldFR4OiBDcmVhdGVBc3NldFR4ID0gbmV3IENyZWF0ZUFzc2V0VHgoKVxuICAgIGV4cGVjdChjcmVhdGVBc3NldFR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KGNyZWF0ZUFzc2V0VHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLkNSRUFURUFTU0VUVFgpXG4gICAgY3JlYXRlQXNzZXRUeC5zZXRDb2RlY0lEKGNvZGVjSURfb25lKVxuICAgIGV4cGVjdChjcmVhdGVBc3NldFR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX29uZSlcbiAgICBleHBlY3QoY3JlYXRlQXNzZXRUeC5nZXRUeXBlSUQoKSkudG9CZShBVk1Db25zdGFudHMuQ1JFQVRFQVNTRVRUWF9DT0RFQ09ORSlcbiAgICBjcmVhdGVBc3NldFR4LnNldENvZGVjSUQoY29kZWNJRF96ZXJvKVxuICAgIGV4cGVjdChjcmVhdGVBc3NldFR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KGNyZWF0ZUFzc2V0VHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLkNSRUFURUFTU0VUVFgpXG4gIH0pXG5cbiAgdGVzdChcIkludmFsaWQgQ3JlYXRlQXNzZXRUeCBjb2RlY0lEXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBjcmVhdGVBc3NldFR4OiBDcmVhdGVBc3NldFR4ID0gbmV3IENyZWF0ZUFzc2V0VHgoKVxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XG4gICAgICBjcmVhdGVBc3NldFR4LnNldENvZGVjSUQoMilcbiAgICB9KS50b1Rocm93KFxuICAgICAgXCJFcnJvciAtIENyZWF0ZUFzc2V0VHguc2V0Q29kZWNJRDogaW52YWxpZCBjb2RlY0lELiBWYWxpZCBjb2RlY0lEcyBhcmUgMCBhbmQgMS5cIlxuICAgIClcbiAgfSlcblxuICB0ZXN0KFwiT3BlcmF0aW9uVHggY29kZWNJRHNcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG9wZXJhdGlvblR4OiBPcGVyYXRpb25UeCA9IG5ldyBPcGVyYXRpb25UeCgpXG4gICAgZXhwZWN0KG9wZXJhdGlvblR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KG9wZXJhdGlvblR4LmdldFR5cGVJRCgpKS50b0JlKEFWTUNvbnN0YW50cy5PUEVSQVRJT05UWClcbiAgICBvcGVyYXRpb25UeC5zZXRDb2RlY0lEKGNvZGVjSURfb25lKVxuICAgIGV4cGVjdChvcGVyYXRpb25UeC5nZXRDb2RlY0lEKCkpLnRvQmUoY29kZWNJRF9vbmUpXG4gICAgZXhwZWN0KG9wZXJhdGlvblR4LmdldFR5cGVJRCgpKS50b0JlKEFWTUNvbnN0YW50cy5PUEVSQVRJT05UWF9DT0RFQ09ORSlcbiAgICBvcGVyYXRpb25UeC5zZXRDb2RlY0lEKGNvZGVjSURfemVybylcbiAgICBleHBlY3Qob3BlcmF0aW9uVHguZ2V0Q29kZWNJRCgpKS50b0JlKGNvZGVjSURfemVybylcbiAgICBleHBlY3Qob3BlcmF0aW9uVHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLk9QRVJBVElPTlRYKVxuICB9KVxuXG4gIHRlc3QoXCJJbnZhbGlkIE9wZXJhdGlvblR4IGNvZGVjSURcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG9wZXJhdGlvblR4OiBPcGVyYXRpb25UeCA9IG5ldyBPcGVyYXRpb25UeCgpXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcbiAgICAgIG9wZXJhdGlvblR4LnNldENvZGVjSUQoMilcbiAgICB9KS50b1Rocm93KFxuICAgICAgXCJFcnJvciAtIE9wZXJhdGlvblR4LnNldENvZGVjSUQ6IGludmFsaWQgY29kZWNJRC4gVmFsaWQgY29kZWNJRHMgYXJlIDAgYW5kIDEuXCJcbiAgICApXG4gIH0pXG5cbiAgdGVzdChcIkltcG9ydFR4IGNvZGVjSURzXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBpbXBvcnRUeDogSW1wb3J0VHggPSBuZXcgSW1wb3J0VHgoKVxuICAgIGV4cGVjdChpbXBvcnRUeC5nZXRDb2RlY0lEKCkpLnRvQmUoY29kZWNJRF96ZXJvKVxuICAgIGV4cGVjdChpbXBvcnRUeC5nZXRUeXBlSUQoKSkudG9CZShBVk1Db25zdGFudHMuSU1QT1JUVFgpXG4gICAgaW1wb3J0VHguc2V0Q29kZWNJRChjb2RlY0lEX29uZSlcbiAgICBleHBlY3QoaW1wb3J0VHguZ2V0Q29kZWNJRCgpKS50b0JlKGNvZGVjSURfb25lKVxuICAgIGV4cGVjdChpbXBvcnRUeC5nZXRUeXBlSUQoKSkudG9CZShBVk1Db25zdGFudHMuSU1QT1JUVFhfQ09ERUNPTkUpXG4gICAgaW1wb3J0VHguc2V0Q29kZWNJRChjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KGltcG9ydFR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KGltcG9ydFR4LmdldFR5cGVJRCgpKS50b0JlKEFWTUNvbnN0YW50cy5JTVBPUlRUWClcbiAgfSlcblxuICB0ZXN0KFwiSW52YWxpZCBJbXBvcnRUeCBjb2RlY0lEXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBpbXBvcnRUeDogSW1wb3J0VHggPSBuZXcgSW1wb3J0VHgoKVxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XG4gICAgICBpbXBvcnRUeC5zZXRDb2RlY0lEKDIpXG4gICAgfSkudG9UaHJvdyhcbiAgICAgIFwiRXJyb3IgLSBJbXBvcnRUeC5zZXRDb2RlY0lEOiBpbnZhbGlkIGNvZGVjSUQuIFZhbGlkIGNvZGVjSURzIGFyZSAwIGFuZCAxLlwiXG4gICAgKVxuICB9KVxuXG4gIHRlc3QoXCJFeHBvcnRUeCBjb2RlY0lEc1wiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZXhwb3J0VHg6IEV4cG9ydFR4ID0gbmV3IEV4cG9ydFR4KClcbiAgICBleHBlY3QoZXhwb3J0VHguZ2V0Q29kZWNJRCgpKS50b0JlKGNvZGVjSURfemVybylcbiAgICBleHBlY3QoZXhwb3J0VHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLkVYUE9SVFRYKVxuICAgIGV4cG9ydFR4LnNldENvZGVjSUQoY29kZWNJRF9vbmUpXG4gICAgZXhwZWN0KGV4cG9ydFR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX29uZSlcbiAgICBleHBlY3QoZXhwb3J0VHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLkVYUE9SVFRYX0NPREVDT05FKVxuICAgIGV4cG9ydFR4LnNldENvZGVjSUQoY29kZWNJRF96ZXJvKVxuICAgIGV4cGVjdChleHBvcnRUeC5nZXRDb2RlY0lEKCkpLnRvQmUoY29kZWNJRF96ZXJvKVxuICAgIGV4cGVjdChleHBvcnRUeC5nZXRUeXBlSUQoKSkudG9CZShBVk1Db25zdGFudHMuRVhQT1JUVFgpXG4gIH0pXG5cbiAgdGVzdChcIkludmFsaWQgRXhwb3J0VHggY29kZWNJRFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZXhwb3J0VHg6IEV4cG9ydFR4ID0gbmV3IEV4cG9ydFR4KClcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xuICAgICAgZXhwb3J0VHguc2V0Q29kZWNJRCgyKVxuICAgIH0pLnRvVGhyb3coXG4gICAgICBcIkVycm9yIC0gRXhwb3J0VHguc2V0Q29kZWNJRDogaW52YWxpZCBjb2RlY0lELiBWYWxpZCBjb2RlY0lEcyBhcmUgMCBhbmQgMS5cIlxuICAgIClcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRlIHNtYWxsIEJhc2VUeCB0aGF0IGlzIEdvb3NlIEVnZyBUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxuICAgIGNvbnN0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXG4gICAgY29uc3Qgb3V0cHV0QW10OiBCTiA9IG5ldyBCTihcIjI2NlwiKVxuICAgIGNvbnN0IG91dHB1dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgIG91dHB1dEFtdCxcbiAgICAgIGFkZHJzMSxcbiAgICAgIG5ldyBCTigwKSxcbiAgICAgIDFcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlT3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxuICAgICAgZGp0eEFzc2V0SUQsXG4gICAgICBvdXRwdXRcbiAgICApXG4gICAgb3V0cy5wdXNoKHRyYW5zZmVyYWJsZU91dHB1dClcbiAgICBjb25zdCBpbnB1dEFtdDogQk4gPSBuZXcgQk4oXCI0MDBcIilcbiAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoaW5wdXRBbXQpXG4gICAgaW5wdXQuYWRkU2lnbmF0dXJlSWR4KDAsIGFkZHJzMVswXSlcbiAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgXCJuOFhINUpZMUVYNVZZcURlQWhCNFpkNEdLeGk5VU5ReTZvUHBNc0NBajFRNnhraWlMXCJcbiAgICApXG4gICAgY29uc3Qgb3V0cHV0SW5kZXg6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgICAgYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKDApLCA0KVxuICAgIClcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVJbnB1dDogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoXG4gICAgICB0eGlkLFxuICAgICAgb3V0cHV0SW5kZXgsXG4gICAgICBkanR4QXNzZXRJRCxcbiAgICAgIGlucHV0XG4gICAgKVxuICAgIGlucy5wdXNoKHRyYW5zZmVyYWJsZUlucHV0KVxuICAgIGNvbnN0IGJhc2VUeDogQmFzZVR4ID0gbmV3IEJhc2VUeChuZXRpZCwgYmxvY2tjaGFpbklELCBvdXRzLCBpbnMpXG4gICAgY29uc3QgdW5zaWduZWRUeDogVW5zaWduZWRUeCA9IG5ldyBVbnNpZ25lZFR4KGJhc2VUeClcbiAgICBleHBlY3QoYXdhaXQgYXBpLmNoZWNrR29vc2VFZ2codW5zaWduZWRUeCkpLnRvQmUodHJ1ZSlcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRlIHNtYWxsIEJhc2VUeCB3aXRoIGJhZCB0eGlkXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXG4gICAgY29uc3Qgb3V0cHV0QW10OiBCTiA9IG5ldyBCTihcIjI2NlwiKVxuICAgIGNvbnN0IG91dHB1dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgIG91dHB1dEFtdCxcbiAgICAgIGFkZHJzMSxcbiAgICAgIG5ldyBCTigwKSxcbiAgICAgIDFcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlT3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxuICAgICAgZGp0eEFzc2V0SUQsXG4gICAgICBvdXRwdXRcbiAgICApXG4gICAgb3V0cy5wdXNoKHRyYW5zZmVyYWJsZU91dHB1dClcbiAgICBjb25zdCBpbnB1dEFtdDogQk4gPSBuZXcgQk4oXCI0MDBcIilcbiAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoaW5wdXRBbXQpXG4gICAgaW5wdXQuYWRkU2lnbmF0dXJlSWR4KDAsIGFkZHJzMVswXSlcblxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgICBcIm44WEhhYWFhNUpZMUVYNVZZcURlQWhCNFpkNEdLeGk5VU5ReTZvUHBNc0NBajFRNnhraWlMXCJcbiAgICAgIClcbiAgICB9KS50b1Rocm93KFwiRXJyb3IgLSBCaW5Ub29scy5jYjU4RGVjb2RlOiBpbnZhbGlkIGNoZWNrc3VtXCIpXG4gIH0pXG5cbiAgdGVzdChcImNvbmZpcm0gaW5wdXRUb3RhbCwgb3V0cHV0VG90YWwgYW5kIGZlZSBhcmUgY29ycmVjdFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgLy8gREpUWCBhc3NldElEXG4gICAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgIFwibjhYSDVKWTFFWDVWWXFEZUFoQjRaZDRHS3hpOVVOUXk2b1BwTXNDQWoxUTZ4a2lpTFwiXG4gICAgKVxuICAgIGNvbnN0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cbiAgICBjb25zdCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxuICAgIGNvbnN0IG91dHB1dEFtdDogQk4gPSBuZXcgQk4oXCIyNjZcIilcbiAgICBjb25zdCBvdXRwdXQ6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICBvdXRwdXRBbXQsXG4gICAgICBhZGRyczEsXG4gICAgICBuZXcgQk4oMCksXG4gICAgICAxXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZU91dHB1dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChcbiAgICAgIGFzc2V0SUQsXG4gICAgICBvdXRwdXRcbiAgICApXG4gICAgb3V0cy5wdXNoKHRyYW5zZmVyYWJsZU91dHB1dClcbiAgICBjb25zdCBpbnB1dEFtdDogQk4gPSBuZXcgQk4oXCI0MDBcIilcbiAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoaW5wdXRBbXQpXG4gICAgaW5wdXQuYWRkU2lnbmF0dXJlSWR4KDAsIGFkZHJzMVswXSlcbiAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgXCJuOFhINUpZMUVYNVZZcURlQWhCNFpkNEdLeGk5VU5ReTZvUHBNc0NBajFRNnhraWlMXCJcbiAgICApXG4gICAgY29uc3Qgb3V0cHV0SW5kZXg6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgICAgYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKDApLCA0KVxuICAgIClcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVJbnB1dDogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoXG4gICAgICB0eGlkLFxuICAgICAgb3V0cHV0SW5kZXgsXG4gICAgICBhc3NldElELFxuICAgICAgaW5wdXRcbiAgICApXG4gICAgaW5zLnB1c2godHJhbnNmZXJhYmxlSW5wdXQpXG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KG5ldGlkLCBibG9ja2NoYWluSUQsIG91dHMsIGlucylcbiAgICBjb25zdCB1bnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gbmV3IFVuc2lnbmVkVHgoYmFzZVR4KVxuICAgIGNvbnN0IGlucHV0VG90YWw6IEJOID0gdW5zaWduZWRUeC5nZXRJbnB1dFRvdGFsKGFzc2V0SUQpXG4gICAgY29uc3Qgb3V0cHV0VG90YWw6IEJOID0gdW5zaWduZWRUeC5nZXRPdXRwdXRUb3RhbChhc3NldElEKVxuICAgIGNvbnN0IGJ1cm46IEJOID0gdW5zaWduZWRUeC5nZXRCdXJuKGFzc2V0SUQpXG4gICAgZXhwZWN0KGlucHV0VG90YWwudG9OdW1iZXIoKSkudG9FcXVhbChuZXcgQk4oNDAwKS50b051bWJlcigpKVxuICAgIGV4cGVjdChvdXRwdXRUb3RhbC50b051bWJlcigpKS50b0VxdWFsKG5ldyBCTigyNjYpLnRvTnVtYmVyKCkpXG4gICAgZXhwZWN0KGJ1cm4udG9OdW1iZXIoKSkudG9FcXVhbChuZXcgQk4oMTM0KS50b051bWJlcigpKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGUgc21hbGwgQmFzZVR4IHRoYXQgaXNuJ3QgR29vc2UgRWdnIFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXG4gICAgY29uc3QgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cbiAgICBjb25zdCBvdXRwdXRBbXQ6IEJOID0gbmV3IEJOKFwiMjY3XCIpXG4gICAgY29uc3Qgb3V0cHV0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgb3V0cHV0QW10LFxuICAgICAgYWRkcnMxLFxuICAgICAgbmV3IEJOKDApLFxuICAgICAgMVxuICAgIClcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVPdXRwdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoXG4gICAgICBkanR4QXNzZXRJRCxcbiAgICAgIG91dHB1dFxuICAgIClcbiAgICBvdXRzLnB1c2godHJhbnNmZXJhYmxlT3V0cHV0KVxuICAgIGNvbnN0IGlucHV0QW10OiBCTiA9IG5ldyBCTihcIjQwMFwiKVxuICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChpbnB1dEFtdClcbiAgICBpbnB1dC5hZGRTaWduYXR1cmVJZHgoMCwgYWRkcnMxWzBdKVxuICAgIGNvbnN0IHR4aWQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICBcIm44WEg1SlkxRVg1VllxRGVBaEI0WmQ0R0t4aTlVTlF5Nm9QcE1zQ0FqMVE2eGtpaUxcIlxuICAgIClcbiAgICBjb25zdCBvdXRwdXRJbmRleDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICBiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oMCksIDQpXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZUlucHV0OiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcbiAgICAgIHR4aWQsXG4gICAgICBvdXRwdXRJbmRleCxcbiAgICAgIGRqdHhBc3NldElELFxuICAgICAgaW5wdXRcbiAgICApXG4gICAgaW5zLnB1c2godHJhbnNmZXJhYmxlSW5wdXQpXG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KG5ldGlkLCBibG9ja2NoYWluSUQsIG91dHMsIGlucylcbiAgICBjb25zdCB1bnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gbmV3IFVuc2lnbmVkVHgoYmFzZVR4KVxuICAgIGV4cGVjdChhd2FpdCBhcGkuY2hlY2tHb29zZUVnZyh1bnNpZ25lZFR4KSkudG9CZSh0cnVlKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGUgbGFyZ2UgQmFzZVR4IHRoYXQgaXMgR29vc2UgRWdnIFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXG4gICAgY29uc3QgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cbiAgICBjb25zdCBvdXRwdXRBbXQ6IEJOID0gbmV3IEJOKFwiNjA5NTU1NTAwMDAwXCIpXG4gICAgY29uc3Qgb3V0cHV0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgb3V0cHV0QW10LFxuICAgICAgYWRkcnMxLFxuICAgICAgbmV3IEJOKDApLFxuICAgICAgMVxuICAgIClcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVPdXRwdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoXG4gICAgICBkanR4QXNzZXRJRCxcbiAgICAgIG91dHB1dFxuICAgIClcbiAgICBvdXRzLnB1c2godHJhbnNmZXJhYmxlT3V0cHV0KVxuICAgIGNvbnN0IGlucHV0QW10OiBCTiA9IG5ldyBCTihcIjQ1MDAwMDAwMDAwMDAwMDAwXCIpXG4gICAgY29uc3QgaW5wdXQ6IFNFQ1BUcmFuc2ZlcklucHV0ID0gbmV3IFNFQ1BUcmFuc2ZlcklucHV0KGlucHV0QW10KVxuICAgIGlucHV0LmFkZFNpZ25hdHVyZUlkeCgwLCBhZGRyczFbMF0pXG4gICAgY29uc3QgdHhpZDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgIFwibjhYSDVKWTFFWDVWWXFEZUFoQjRaZDRHS3hpOVVOUXk2b1BwTXNDQWoxUTZ4a2lpTFwiXG4gICAgKVxuICAgIGNvbnN0IG91dHB1dEluZGV4OiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgIGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG5ldyBCTigwKSwgNClcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlSW5wdXQ6IFRyYW5zZmVyYWJsZUlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KFxuICAgICAgdHhpZCxcbiAgICAgIG91dHB1dEluZGV4LFxuICAgICAgZGp0eEFzc2V0SUQsXG4gICAgICBpbnB1dFxuICAgIClcbiAgICBpbnMucHVzaCh0cmFuc2ZlcmFibGVJbnB1dClcbiAgICBjb25zdCBiYXNlVHg6IEJhc2VUeCA9IG5ldyBCYXNlVHgobmV0aWQsIGJsb2NrY2hhaW5JRCwgb3V0cywgaW5zKVxuICAgIGNvbnN0IHVuc2lnbmVkVHg6IFVuc2lnbmVkVHggPSBuZXcgVW5zaWduZWRUeChiYXNlVHgpXG4gICAgZXhwZWN0KGF3YWl0IGFwaS5jaGVja0dvb3NlRWdnKHVuc2lnbmVkVHgpKS50b0JlKGZhbHNlKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGUgbGFyZ2UgQmFzZVR4IHRoYXQgaXNuJ3QgR29vc2UgRWdnIFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXG4gICAgY29uc3QgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cbiAgICBjb25zdCBvdXRwdXRBbXQ6IEJOID0gbmV3IEJOKFwiNDQ5OTU2MDk1NTU1MDAwMDBcIilcbiAgICBjb25zdCBvdXRwdXQ6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICBvdXRwdXRBbXQsXG4gICAgICBhZGRyczEsXG4gICAgICBuZXcgQk4oMCksXG4gICAgICAxXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZU91dHB1dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChcbiAgICAgIGRqdHhBc3NldElELFxuICAgICAgb3V0cHV0XG4gICAgKVxuICAgIG91dHMucHVzaCh0cmFuc2ZlcmFibGVPdXRwdXQpXG4gICAgY29uc3QgaW5wdXRBbXQ6IEJOID0gbmV3IEJOKFwiNDUwMDAwMDAwMDAwMDAwMDBcIilcbiAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoaW5wdXRBbXQpXG4gICAgaW5wdXQuYWRkU2lnbmF0dXJlSWR4KDAsIGFkZHJzMVswXSlcbiAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgXCJuOFhINUpZMUVYNVZZcURlQWhCNFpkNEdLeGk5VU5ReTZvUHBNc0NBajFRNnhraWlMXCJcbiAgICApXG4gICAgY29uc3Qgb3V0cHV0SW5kZXg6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgICAgYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKDApLCA0KVxuICAgIClcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVJbnB1dDogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoXG4gICAgICB0eGlkLFxuICAgICAgb3V0cHV0SW5kZXgsXG4gICAgICBkanR4QXNzZXRJRCxcbiAgICAgIGlucHV0XG4gICAgKVxuICAgIGlucy5wdXNoKHRyYW5zZmVyYWJsZUlucHV0KVxuICAgIGNvbnN0IGJhc2VUeDogQmFzZVR4ID0gbmV3IEJhc2VUeChuZXRpZCwgYmxvY2tjaGFpbklELCBvdXRzLCBpbnMpXG4gICAgY29uc3QgdW5zaWduZWRUeDogVW5zaWduZWRUeCA9IG5ldyBVbnNpZ25lZFR4KGJhc2VUeClcbiAgICBleHBlY3QoYXdhaXQgYXBpLmNoZWNrR29vc2VFZ2codW5zaWduZWRUeCkpLnRvQmUodHJ1ZSlcbiAgfSlcblxuICB0ZXN0KFwiYmFkIGFzc2V0IElEXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgICAgXCJiYWRhYWFhbjhYSDVKWTFFWDVWWXFEZUFoQjRaZDRHS3hpOVVOUXk2b1BwTXNDQWoxUTZ4a2lpTFwiXG4gICAgICApXG4gICAgfSkudG9UaHJvdygpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0aW9uIFVuc2lnbmVkVHhcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGJhc2VUeDogQmFzZVR4ID0gbmV3IEJhc2VUeChuZXRpZCwgYmxvY2tjaGFpbklELCBvdXRwdXRzLCBpbnB1dHMpXG4gICAgY29uc3QgdHh1OiBVbnNpZ25lZFR4ID0gbmV3IFVuc2lnbmVkVHgoYmFzZVR4KVxuICAgIGNvbnN0IHR4aW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gdHh1LmdldFRyYW5zYWN0aW9uKCkuZ2V0SW5zKClcbiAgICBjb25zdCB0eG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gdHh1LmdldFRyYW5zYWN0aW9uKCkuZ2V0T3V0cygpXG4gICAgZXhwZWN0KHR4aW5zLmxlbmd0aCkudG9CZShpbnB1dHMubGVuZ3RoKVxuICAgIGV4cGVjdCh0eG91dHMubGVuZ3RoKS50b0JlKG91dHB1dHMubGVuZ3RoKVxuXG4gICAgZXhwZWN0KHR4dS5nZXRUcmFuc2FjdGlvbigpLmdldFR4VHlwZSgpKS50b0JlKDApXG4gICAgZXhwZWN0KHR4dS5nZXRUcmFuc2FjdGlvbigpLmdldE5ldHdvcmtJRCgpKS50b0JlKDEyMzQ1KVxuICAgIGV4cGVjdCh0eHUuZ2V0VHJhbnNhY3Rpb24oKS5nZXRCbG9ja2NoYWluSUQoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgIGJsb2NrY2hhaW5JRC50b1N0cmluZyhcImhleFwiKVxuICAgIClcblxuICAgIGxldCBhOiBzdHJpbmdbXSA9IFtdXG4gICAgbGV0IGI6IHN0cmluZ1tdID0gW11cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdHhpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGEucHVzaCh0eGluc1tpXS50b1N0cmluZygpKVxuICAgICAgYi5wdXNoKGlucHV0c1tpXS50b1N0cmluZygpKVxuICAgIH1cbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkoYS5zb3J0KCkpKS50b0JlKEpTT04uc3RyaW5naWZ5KGIuc29ydCgpKSlcblxuICAgIGEgPSBbXVxuICAgIGIgPSBbXVxuXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHR4b3V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgYS5wdXNoKHR4b3V0c1tpXS50b1N0cmluZygpKVxuICAgICAgYi5wdXNoKG91dHB1dHNbaV0udG9TdHJpbmcoKSlcbiAgICB9XG4gICAgZXhwZWN0KEpTT04uc3RyaW5naWZ5KGEuc29ydCgpKSkudG9CZShKU09OLnN0cmluZ2lmeShiLnNvcnQoKSkpXG5cbiAgICBjb25zdCB0eHVuZXc6IFVuc2lnbmVkVHggPSBuZXcgVW5zaWduZWRUeCgpXG4gICAgdHh1bmV3LmZyb21CdWZmZXIodHh1LnRvQnVmZmVyKCkpXG4gICAgZXhwZWN0KHR4dW5ldy50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgdHh1LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICApXG4gICAgZXhwZWN0KHR4dW5ldy50b1N0cmluZygpKS50b0JlKHR4dS50b1N0cmluZygpKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGlvbiBVbnNpZ25lZFR4IENoZWNrIEFtb3VudFwiLCAoKTogdm9pZCA9PiB7XG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcbiAgICAgIHNldC5idWlsZEJhc2VUeChcbiAgICAgICAgbmV0aWQsXG4gICAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgICAgT05FREpUWC5tdWwobmV3IEJOKGFtbnQgKiAxMDAwMCkpLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMxXG4gICAgICApXG4gICAgfSkudG9UaHJvdygpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0ZUFzc2V0VFhcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHNlY3BiYXNlMTogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgIG5ldyBCTig3NzcpLFxuICAgICAgYWRkcnMzLFxuICAgICAgbG9ja3RpbWUsXG4gICAgICAxXG4gICAgKVxuICAgIGNvbnN0IHNlY3BiYXNlMjogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgIG5ldyBCTig4ODgpLFxuICAgICAgYWRkcnMyLFxuICAgICAgbG9ja3RpbWUsXG4gICAgICAxXG4gICAgKVxuICAgIGNvbnN0IHNlY3BiYXNlMzogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgIG5ldyBCTig5OTkpLFxuICAgICAgYWRkcnMyLFxuICAgICAgbG9ja3RpbWUsXG4gICAgICAxXG4gICAgKVxuICAgIGNvbnN0IGluaXRpYWxTdGF0ZTogSW5pdGlhbFN0YXRlcyA9IG5ldyBJbml0aWFsU3RhdGVzKClcbiAgICBpbml0aWFsU3RhdGUuYWRkT3V0cHV0KHNlY3BiYXNlMSwgQVZNQ29uc3RhbnRzLlNFQ1BGWElEKVxuICAgIGluaXRpYWxTdGF0ZS5hZGRPdXRwdXQoc2VjcGJhc2UyLCBBVk1Db25zdGFudHMuU0VDUEZYSUQpXG4gICAgaW5pdGlhbFN0YXRlLmFkZE91dHB1dChzZWNwYmFzZTMsIEFWTUNvbnN0YW50cy5TRUNQRlhJRClcbiAgICBjb25zdCBuYW1lOiBzdHJpbmcgPSBcIlJpY2tjb2luIGlzIHRoZSBtb3N0IGludGVsbGlnZW50IGNvaW5cIlxuICAgIGNvbnN0IHN5bWJvbDogc3RyaW5nID0gXCJSSUNLXCJcbiAgICBjb25zdCBkZW5vbWluYXRpb246IG51bWJlciA9IDlcbiAgICBjb25zdCB0eHU6IENyZWF0ZUFzc2V0VHggPSBuZXcgQ3JlYXRlQXNzZXRUeChcbiAgICAgIG5ldGlkLFxuICAgICAgYmxvY2tjaGFpbklELFxuICAgICAgb3V0cHV0cyxcbiAgICAgIGlucHV0cyxcbiAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgIG5hbWUsXG4gICAgICBzeW1ib2wsXG4gICAgICBkZW5vbWluYXRpb24sXG4gICAgICBpbml0aWFsU3RhdGVcbiAgICApXG4gICAgY29uc3QgdHhpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSB0eHUuZ2V0SW5zKClcbiAgICBjb25zdCB0eG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gdHh1LmdldE91dHMoKVxuICAgIGNvbnN0IGluaXRTdGF0ZTogSW5pdGlhbFN0YXRlcyA9IHR4dS5nZXRJbml0aWFsU3RhdGVzKClcbiAgICBleHBlY3QodHhpbnMubGVuZ3RoKS50b0JlKGlucHV0cy5sZW5ndGgpXG4gICAgZXhwZWN0KHR4b3V0cy5sZW5ndGgpLnRvQmUob3V0cHV0cy5sZW5ndGgpXG4gICAgZXhwZWN0KGluaXRTdGF0ZS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgaW5pdGlhbFN0YXRlLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICApXG5cbiAgICBleHBlY3QodHh1LmdldFR4VHlwZSgpKS50b0JlKEFWTUNvbnN0YW50cy5DUkVBVEVBU1NFVFRYKVxuICAgIGV4cGVjdCh0eHUuZ2V0TmV0d29ya0lEKCkpLnRvQmUoMTIzNDUpXG4gICAgZXhwZWN0KHR4dS5nZXRCbG9ja2NoYWluSUQoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgIGJsb2NrY2hhaW5JRC50b1N0cmluZyhcImhleFwiKVxuICAgIClcblxuICAgIGV4cGVjdCh0eHUuZ2V0TmFtZSgpKS50b0JlKG5hbWUpXG4gICAgZXhwZWN0KHR4dS5nZXRTeW1ib2woKSkudG9CZShzeW1ib2wpXG4gICAgZXhwZWN0KHR4dS5nZXREZW5vbWluYXRpb24oKSkudG9CZShkZW5vbWluYXRpb24pXG4gICAgZXhwZWN0KHR4dS5nZXREZW5vbWluYXRpb25CdWZmZXIoKS5yZWFkVUludDgoMCkpLnRvQmUoZGVub21pbmF0aW9uKVxuXG4gICAgbGV0IGE6IHN0cmluZ1tdID0gW11cbiAgICBsZXQgYjogc3RyaW5nW10gPSBbXVxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0eGlucy5sZW5ndGg7IGkrKykge1xuICAgICAgYS5wdXNoKHR4aW5zW2ldLnRvU3RyaW5nKCkpXG4gICAgICBiLnB1c2goaW5wdXRzW2ldLnRvU3RyaW5nKCkpXG4gICAgfVxuICAgIGV4cGVjdChKU09OLnN0cmluZ2lmeShhLnNvcnQoKSkpLnRvQmUoSlNPTi5zdHJpbmdpZnkoYi5zb3J0KCkpKVxuXG4gICAgYSA9IFtdXG4gICAgYiA9IFtdXG5cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdHhvdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhLnB1c2godHhvdXRzW2ldLnRvU3RyaW5nKCkpXG4gICAgICBiLnB1c2gob3V0cHV0c1tpXS50b1N0cmluZygpKVxuICAgIH1cbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkoYS5zb3J0KCkpKS50b0JlKEpTT04uc3RyaW5naWZ5KGIuc29ydCgpKSlcblxuICAgIGNvbnN0IHR4dW5ldzogQ3JlYXRlQXNzZXRUeCA9IG5ldyBDcmVhdGVBc3NldFR4KClcbiAgICB0eHVuZXcuZnJvbUJ1ZmZlcih0eHUudG9CdWZmZXIoKSlcbiAgICBleHBlY3QodHh1bmV3LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICB0eHUudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgIClcbiAgICBleHBlY3QodHh1bmV3LnRvU3RyaW5nKCkpLnRvQmUodHh1LnRvU3RyaW5nKCkpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0aW9uIE9wZXJhdGlvblR4XCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBvcHR4OiBPcGVyYXRpb25UeCA9IG5ldyBPcGVyYXRpb25UeChcbiAgICAgIG5ldGlkLFxuICAgICAgYmxvY2tjaGFpbklELFxuICAgICAgb3V0cHV0cyxcbiAgICAgIGlucHV0cyxcbiAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgIG9wc1xuICAgIClcbiAgICBjb25zdCB0eHVuZXc6IE9wZXJhdGlvblR4ID0gbmV3IE9wZXJhdGlvblR4KClcbiAgICBjb25zdCBvcGJ1ZmY6IEJ1ZmZlciA9IG9wdHgudG9CdWZmZXIoKVxuICAgIHR4dW5ldy5mcm9tQnVmZmVyKG9wYnVmZilcbiAgICBleHBlY3QodHh1bmV3LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUob3BidWZmLnRvU3RyaW5nKFwiaGV4XCIpKVxuICAgIGV4cGVjdCh0eHVuZXcudG9TdHJpbmcoKSkudG9CZShvcHR4LnRvU3RyaW5nKCkpXG4gICAgZXhwZWN0KG9wdHguZ2V0T3BlcmF0aW9ucygpLmxlbmd0aCkudG9CZShvcHMubGVuZ3RoKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGlvbiBJbXBvcnRUeFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYm9tYnR4OiBJbXBvcnRUeCA9IG5ldyBJbXBvcnRUeChcbiAgICAgIG5ldGlkLFxuICAgICAgYmxvY2tjaGFpbklELFxuICAgICAgb3V0cHV0cyxcbiAgICAgIGlucHV0cyxcbiAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIGltcG9ydEluc1xuICAgIClcblxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XG4gICAgICBib21idHgudG9CdWZmZXIoKVxuICAgIH0pLnRvVGhyb3coKVxuXG4gICAgY29uc3QgaW1wb3J0VHg6IEltcG9ydFR4ID0gbmV3IEltcG9ydFR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBvdXRwdXRzLFxuICAgICAgaW5wdXRzLFxuICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShQbGF0Zm9ybUNoYWluSUQpLFxuICAgICAgaW1wb3J0SW5zXG4gICAgKVxuICAgIGNvbnN0IHR4dW5ldzogSW1wb3J0VHggPSBuZXcgSW1wb3J0VHgoKVxuICAgIGNvbnN0IGltcG9ydGJ1ZmY6IEJ1ZmZlciA9IGltcG9ydFR4LnRvQnVmZmVyKClcbiAgICB0eHVuZXcuZnJvbUJ1ZmZlcihpbXBvcnRidWZmKVxuXG4gICAgZXhwZWN0KGltcG9ydFR4KS50b0JlSW5zdGFuY2VPZihJbXBvcnRUeClcbiAgICBleHBlY3QoaW1wb3J0VHguZ2V0U291cmNlQ2hhaW4oKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoUGxhdGZvcm1DaGFpbklEKS50b1N0cmluZyhcImhleFwiKVxuICAgIClcbiAgICBleHBlY3QodHh1bmV3LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoaW1wb3J0YnVmZi50b1N0cmluZyhcImhleFwiKSlcbiAgICBleHBlY3QodHh1bmV3LnRvU3RyaW5nKCkpLnRvQmUoaW1wb3J0VHgudG9TdHJpbmcoKSlcbiAgICBleHBlY3QoaW1wb3J0VHguZ2V0SW1wb3J0SW5wdXRzKCkubGVuZ3RoKS50b0JlKGltcG9ydElucy5sZW5ndGgpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0aW9uIEV4cG9ydFR4XCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBib21idHg6IEV4cG9ydFR4ID0gbmV3IEV4cG9ydFR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBvdXRwdXRzLFxuICAgICAgaW5wdXRzLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgZXhwb3J0T3V0c1xuICAgIClcblxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XG4gICAgICBib21idHgudG9CdWZmZXIoKVxuICAgIH0pLnRvVGhyb3coKVxuXG4gICAgY29uc3QgZXhwb3J0VHg6IEV4cG9ydFR4ID0gbmV3IEV4cG9ydFR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBvdXRwdXRzLFxuICAgICAgaW5wdXRzLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShQbGF0Zm9ybUNoYWluSUQpLFxuICAgICAgZXhwb3J0T3V0c1xuICAgIClcbiAgICBjb25zdCB0eHVuZXc6IEV4cG9ydFR4ID0gbmV3IEV4cG9ydFR4KClcbiAgICBjb25zdCBleHBvcnRidWZmOiBCdWZmZXIgPSBleHBvcnRUeC50b0J1ZmZlcigpXG4gICAgdHh1bmV3LmZyb21CdWZmZXIoZXhwb3J0YnVmZilcblxuICAgIGV4cGVjdChleHBvcnRUeCkudG9CZUluc3RhbmNlT2YoRXhwb3J0VHgpXG4gICAgZXhwZWN0KGV4cG9ydFR4LmdldERlc3RpbmF0aW9uQ2hhaW4oKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoUGxhdGZvcm1DaGFpbklEKS50b1N0cmluZyhcImhleFwiKVxuICAgIClcbiAgICBleHBlY3QodHh1bmV3LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoZXhwb3J0YnVmZi50b1N0cmluZyhcImhleFwiKSlcbiAgICBleHBlY3QodHh1bmV3LnRvU3RyaW5nKCkpLnRvQmUoZXhwb3J0VHgudG9TdHJpbmcoKSlcbiAgICBleHBlY3QoZXhwb3J0VHguZ2V0RXhwb3J0T3V0cHV0cygpLmxlbmd0aCkudG9CZShleHBvcnRPdXRzLmxlbmd0aClcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRpb24gVHgxIHdpdGggYXNvZiwgbG9ja3RpbWUsIHRocmVzaG9sZFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdHh1OiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQmFzZVR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBuZXcgQk4oOTAwMCksXG4gICAgICBhc3NldElELFxuICAgICAgYWRkcnMzLFxuICAgICAgYWRkcnMxLFxuICAgICAgYWRkcnMxLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgVW5peE5vdygpLFxuICAgICAgVW5peE5vdygpLmFkZChuZXcgQk4oNTApKSxcbiAgICAgIDFcbiAgICApXG4gICAgY29uc3QgdHg6IFR4ID0gdHh1LnNpZ24oa2V5bWdyMSlcblxuICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxuICAgIHR4Mi5mcm9tU3RyaW5nKHR4LnRvU3RyaW5nKCkpXG4gICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKHR4LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpXG4gICAgZXhwZWN0KHR4Mi50b1N0cmluZygpKS50b0JlKHR4LnRvU3RyaW5nKCkpXG4gIH0pXG4gIHRlc3QoXCJDcmVhdGlvbiBUeDIgd2l0aG91dCBhc29mLCBsb2NrdGltZSwgdGhyZXNob2xkXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0eHU6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRCYXNlVHgoXG4gICAgICBuZXRpZCxcbiAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgIG5ldyBCTig5MDAwKSxcbiAgICAgIGFzc2V0SUQsXG4gICAgICBhZGRyczMsXG4gICAgICBhZGRyczEsXG4gICAgICBhZGRyczFcbiAgICApXG4gICAgY29uc3QgdHg6IFR4ID0gdHh1LnNpZ24oa2V5bWdyMSlcbiAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICB0eDIuZnJvbUJ1ZmZlcih0eC50b0J1ZmZlcigpKVxuICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZSh0eC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKVxuICAgIGV4cGVjdCh0eDIudG9TdHJpbmcoKSkudG9CZSh0eC50b1N0cmluZygpKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGlvbiBUeDMgdXNpbmcgT3BlcmF0aW9uVHhcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHR4dTogVW5zaWduZWRUeCA9IHNldC5idWlsZE5GVFRyYW5zZmVyVHgoXG4gICAgICBuZXRpZCxcbiAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgIGFkZHJzMyxcbiAgICAgIGFkZHJzMSxcbiAgICAgIGFkZHJzMixcbiAgICAgIG5mdHV0eG9pZHMsXG4gICAgICBuZXcgQk4oOTApLFxuICAgICAgZGp0eEFzc2V0SUQsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBVbml4Tm93KCksXG4gICAgICBVbml4Tm93KCkuYWRkKG5ldyBCTig1MCkpLFxuICAgICAgMVxuICAgIClcbiAgICBjb25zdCB0eDogVHggPSB0eHUuc2lnbihrZXltZ3IxKVxuICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxuICAgIHR4Mi5mcm9tQnVmZmVyKHR4LnRvQnVmZmVyKCkpXG4gICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKHR4LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0aW9uIFR4NCB1c2luZyBJbXBvcnRUeFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdHh1OiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkSW1wb3J0VHgoXG4gICAgICBuZXRpZCxcbiAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgIGFkZHJzMyxcbiAgICAgIGFkZHJzMSxcbiAgICAgIGFkZHJzMixcbiAgICAgIGltcG9ydFVUWE9zLFxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShQbGF0Zm9ybUNoYWluSUQpLFxuICAgICAgbmV3IEJOKDkwKSxcbiAgICAgIGFzc2V0SUQsXG4gICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICBVbml4Tm93KClcbiAgICApXG4gICAgY29uc3QgdHg6IFR4ID0gdHh1LnNpZ24oa2V5bWdyMSlcbiAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICB0eDIuZnJvbUJ1ZmZlcih0eC50b0J1ZmZlcigpKVxuICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZSh0eC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGlvbiBUeDUgdXNpbmcgRXhwb3J0VHhcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHR4dTogVW5zaWduZWRUeCA9IHNldC5idWlsZEV4cG9ydFR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBuZXcgQk4oOTApLFxuICAgICAgZGp0eEFzc2V0SUQsXG4gICAgICBhZGRyczMsXG4gICAgICBhZGRyczEsXG4gICAgICBhZGRyczIsXG4gICAgICBiaW50b29scy5jYjU4RGVjb2RlKFBsYXRmb3JtQ2hhaW5JRCksXG4gICAgICB1bmRlZmluZWQsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICBVbml4Tm93KClcbiAgICApXG4gICAgY29uc3QgdHg6IFR4ID0gdHh1LnNpZ24oa2V5bWdyMSlcbiAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICB0eDIuZnJvbUJ1ZmZlcih0eC50b0J1ZmZlcigpKVxuICAgIGV4cGVjdCh0eC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKVxuICB9KVxufSlcbiJdfQ==