"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const src_1 = require("src");
const api_1 = require("../../../src/apis/platformvm/api");
const buffer_1 = require("buffer/");
const bn_js_1 = __importDefault(require("bn.js"));
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const bech32 = __importStar(require("bech32"));
const constants_1 = require("../../../src/utils/constants");
const utxos_1 = require("../../../src/apis/platformvm/utxos");
const persistenceoptions_1 = require("../../../src/utils/persistenceoptions");
const keychain_1 = require("../../../src/apis/platformvm/keychain");
const outputs_1 = require("../../../src/apis/platformvm/outputs");
const inputs_1 = require("../../../src/apis/platformvm/inputs");
const utxos_2 = require("../../../src/apis/platformvm/utxos");
const create_hash_1 = __importDefault(require("create-hash"));
const tx_1 = require("../../../src/apis/platformvm/tx");
const helperfunctions_1 = require("../../../src/utils/helperfunctions");
const payload_1 = require("../../../src/utils/payload");
const helperfunctions_2 = require("../../../src/utils/helperfunctions");
const constants_2 = require("../../../src/utils/constants");
const serialization_1 = require("../../../src/utils/serialization");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serializer = serialization_1.Serialization.getInstance();
const display = "display";
const dumpSerialization = false;
const serialzeit = (aThing, name) => {
    if (dumpSerialization) {
        console.log(JSON.stringify(serializer.serialize(aThing, "platformvm", "hex", name + " -- Hex Encoded")));
        console.log(JSON.stringify(serializer.serialize(aThing, "platformvm", "display", name + " -- Human-Readable")));
    }
};
describe("PlatformVMAPI", () => {
    const networkID = 1337;
    const blockchainID = constants_1.PlatformChainID;
    const ip = "127.0.0.1";
    const port = 9650;
    const protocol = "https";
    const nodeID = "NodeID-B6D4v1VtPYLbiUvYXtW4Px8oE9imC2vGW";
    const startTime = (0, helperfunctions_1.UnixNow)().add(new bn_js_1.default(60 * 5));
    const endTime = startTime.add(new bn_js_1.default(1209600));
    const username = "AvaLabs";
    const password = "password";
    const avalanche = new src_1.Avalanche(ip, port, protocol, networkID, undefined, undefined, undefined, true);
    let api;
    let alias;
    const addrA = "P-" +
        bech32.bech32.encode(avalanche.getHRP(), bech32.bech32.toWords(bintools.cb58Decode("B6D4v1VtPYLbiUvYXtW4Px8oE9imC2vGW")));
    const addrB = "P-" +
        bech32.bech32.encode(avalanche.getHRP(), bech32.bech32.toWords(bintools.cb58Decode("P5wdRuZeaDt28eHMP5S3w9ZdoBfo7wuzF")));
    const addrC = "P-" +
        bech32.bech32.encode(avalanche.getHRP(), bech32.bech32.toWords(bintools.cb58Decode("6Y3kysjF9jnHnYkdS9yGAuoHyae2eNmeV")));
    beforeAll(() => {
        api = new api_1.PlatformVMAPI(avalanche, "/ext/bc/P");
        alias = api.getBlockchainAlias();
    });
    afterEach(() => {
        jest_mock_axios_1.default.reset();
    });
    test("getCreateSubnetTxFee", () => __awaiter(void 0, void 0, void 0, function* () {
        let pchain = new api_1.PlatformVMAPI(avalanche, "/ext/bc/P");
        const feeResponse = "1000000000";
        const fee = pchain.getCreateSubnetTxFee();
        expect(fee.toString()).toBe(feeResponse);
    }));
    test("getCreateChainTxFee", () => __awaiter(void 0, void 0, void 0, function* () {
        let pchain = new api_1.PlatformVMAPI(avalanche, "/ext/bc/P");
        const feeResponse = "1000000000";
        const fee = pchain.getCreateChainTxFee();
        expect(fee.toString()).toBe(feeResponse);
    }));
    test("refreshBlockchainID", () => __awaiter(void 0, void 0, void 0, function* () {
        let n3bcID = constants_1.Defaults.network[3].P["blockchainID"];
        let testAPI = new api_1.PlatformVMAPI(avalanche, "/ext/bc/P");
        let bc1 = testAPI.getBlockchainID();
        expect(bc1).toBe(constants_1.PlatformChainID);
        testAPI.refreshBlockchainID();
        let bc2 = testAPI.getBlockchainID();
        expect(bc2).toBe(constants_1.PlatformChainID);
        testAPI.refreshBlockchainID(n3bcID);
        let bc3 = testAPI.getBlockchainID();
        expect(bc3).toBe(n3bcID);
    }));
    test("listAddresses", () => __awaiter(void 0, void 0, void 0, function* () {
        const addresses = [addrA, addrB];
        const result = api.listAddresses(username, password);
        const payload = {
            result: {
                addresses
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(addresses);
    }));
    test("importKey", () => __awaiter(void 0, void 0, void 0, function* () {
        const address = addrC;
        const result = api.importKey(username, password, "key");
        const payload = {
            result: {
                address
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(address);
    }));
    test("import bad key", () => __awaiter(void 0, void 0, void 0, function* () {
        const address = addrC;
        const message = 'problem retrieving data: incorrect password for user "test"';
        const result = api.importKey(username, "badpassword", "key");
        const payload = {
            result: {
                code: -32000,
                message,
                data: null
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response["code"]).toBe(-32000);
        expect(response["message"]).toBe(message);
    }));
    test("getBalance", () => __awaiter(void 0, void 0, void 0, function* () {
        const balance = new bn_js_1.default("100", 10);
        const unlocked = new bn_js_1.default("100", 10);
        const lockedStakeable = new bn_js_1.default("100", 10);
        const lockedNotStakeable = new bn_js_1.default("100", 10);
        const respobj = {
            balance,
            unlocked,
            lockedStakeable,
            lockedNotStakeable,
            utxoIDs: [
                {
                    txID: "LUriB3W919F84LwPMMw4sm2fZ4Y76Wgb6msaauEY7i1tFNmtv",
                    outputIndex: 0
                }
            ]
        };
        const result = api.getBalance(addrA);
        const payload = {
            result: respobj
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(JSON.stringify(response)).toBe(JSON.stringify(respobj));
    }));
    test("getCurrentSupply", () => __awaiter(void 0, void 0, void 0, function* () {
        const supply = new bn_js_1.default("1000000000000", 10);
        const result = api.getCurrentSupply();
        const payload = {
            result: {
                supply
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response.toString(10)).toBe(supply.toString(10));
    }));
    test("getValidatorsAt", () => __awaiter(void 0, void 0, void 0, function* () {
        const height = 0;
        const subnetID = "11111111111111111111111111111111LpoYY";
        const result = api.getValidatorsAt(height, subnetID);
        const payload = {
            result: {
                validators: {
                    "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg": 2000000000000000,
                    "NodeID-GWPcbFJZFfZreETSoWjPimr846mXEKCtu": 2000000000000000,
                    "NodeID-MFrZFVCXPv5iCn6M9K6XduxGTYp891xXZ": 2000000000000000,
                    "NodeID-NFBbbJ4qCmNaCzeW7sxErhvWqvEQMnYcN": 2000000000000000,
                    "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5": 2000000000000000
                }
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
    }));
    test("getHeight", () => __awaiter(void 0, void 0, void 0, function* () {
        const height = new bn_js_1.default("100", 10);
        const result = api.getHeight();
        const payload = {
            result: {
                height
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response.toString(10)).toBe(height.toString(10));
    }));
    test("getMinStake", () => __awaiter(void 0, void 0, void 0, function* () {
        const minStake = new bn_js_1.default("2000000000000", 10);
        const minDelegate = new bn_js_1.default("25000000000", 10);
        const result = api.getMinStake();
        const payload = {
            result: {
                minValidatorStake: "2000000000000",
                minDelegatorStake: "25000000000"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response["minValidatorStake"].toString(10)).toBe(minStake.toString(10));
        expect(response["minDelegatorStake"].toString(10)).toBe(minDelegate.toString(10));
    }));
    test("getStake", () => __awaiter(void 0, void 0, void 0, function* () {
        const staked = new bn_js_1.default("100", 10);
        const stakedOutputs = [
            "0x000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000160000000060bd6180000000070000000fb750430000000000000000000000000100000001e70060b7051a4838ebe8e29bcbe1403db9b88cc316895eb3",
            "0x000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000160000000060bd618000000007000000d18c2e280000000000000000000000000100000001e70060b7051a4838ebe8e29bcbe1403db9b88cc3714de759",
            "0x000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000160000000061340880000000070000000fb750430000000000000000000000000100000001e70060b7051a4838ebe8e29bcbe1403db9b88cc379b89461",
            "0x000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000016000000006134088000000007000000d18c2e280000000000000000000000000100000001e70060b7051a4838ebe8e29bcbe1403db9b88cc3c7aa35d1",
            "0x000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000016000000006134088000000007000001d1a94a200000000000000000000000000100000001e70060b7051a4838ebe8e29bcbe1403db9b88cc38fd232d8"
        ];
        const objs = stakedOutputs.map((stakedOutput) => {
            const transferableOutput = new outputs_1.TransferableOutput();
            let buf = buffer_1.Buffer.from(stakedOutput.replace(/0x/g, ""), "hex");
            transferableOutput.fromBuffer(buf, 2);
            return transferableOutput;
        });
        const result = api.getStake([addrA], "hex");
        const payload = {
            result: {
                staked,
                stakedOutputs
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(JSON.stringify(response["staked"])).toBe(JSON.stringify(staked));
        expect(JSON.stringify(response["stakedOutputs"])).toBe(JSON.stringify(objs));
    }));
    test("addSubnetValidator 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const nodeID = "abcdef";
        const subnetID = "4R5p2RXDGLqaifZE4hHWH9owe34pfoBULn1DrQTWivjg8o4aH";
        const startTime = new Date(1985, 5, 9, 12, 59, 43, 9);
        const endTime = new Date(1982, 3, 1, 12, 58, 33, 7);
        const weight = 13;
        const utx = "valid";
        const result = api.addSubnetValidator(username, password, nodeID, subnetID, startTime, endTime, weight);
        const payload = {
            result: {
                txID: utx
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(utx);
    }));
    test("addSubnetValidator", () => __awaiter(void 0, void 0, void 0, function* () {
        const nodeID = "abcdef";
        const subnetID = buffer_1.Buffer.from("abcdef", "hex");
        const startTime = new Date(1985, 5, 9, 12, 59, 43, 9);
        const endTime = new Date(1982, 3, 1, 12, 58, 33, 7);
        const weight = 13;
        const utx = "valid";
        const result = api.addSubnetValidator(username, password, nodeID, subnetID, startTime, endTime, weight);
        const payload = {
            result: {
                txID: utx
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(utx);
    }));
    test("addDelegator 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const nodeID = "abcdef";
        const startTime = new Date(1985, 5, 9, 12, 59, 43, 9);
        const endTime = new Date(1982, 3, 1, 12, 58, 33, 7);
        const stakeAmount = new bn_js_1.default(13);
        const rewardAddress = "fedcba";
        const utx = "valid";
        const result = api.addDelegator(username, password, nodeID, startTime, endTime, stakeAmount, rewardAddress);
        const payload = {
            result: {
                txID: utx
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(utx);
    }));
    test("getBlockchains 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = [
            {
                id: "nodeID",
                subnetID: "subnetID",
                vmID: "vmID"
            }
        ];
        const result = api.getBlockchains();
        const payload = {
            result: {
                blockchains: resp
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(resp);
    }));
    test("getSubnets 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = [
            {
                id: "id",
                controlKeys: ["controlKeys"],
                threshold: "threshold"
            }
        ];
        const result = api.getSubnets();
        const payload = {
            result: {
                subnets: resp
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toEqual(resp);
    }));
    test("getCurrentValidators 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const validators = ["val1", "val2"];
        const result = api.getCurrentValidators();
        const payload = {
            result: {
                validators
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toStrictEqual({ validators });
    }));
    test("getCurrentValidators 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const subnetID = "abcdef";
        const validators = ["val1", "val2"];
        const result = api.getCurrentValidators(subnetID);
        const payload = {
            result: {
                validators
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toStrictEqual({ validators });
    }));
    test("getCurrentValidators 3", () => __awaiter(void 0, void 0, void 0, function* () {
        const subnetID = buffer_1.Buffer.from("abcdef", "hex");
        const validators = ["val1", "val2"];
        const result = api.getCurrentValidators(subnetID);
        const payload = {
            result: {
                validators
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toStrictEqual({ validators });
    }));
    test("exportKey", () => __awaiter(void 0, void 0, void 0, function* () {
        const key = "sdfglvlj2h3v45";
        const result = api.exportKey(username, password, addrA);
        const payload = {
            result: {
                privateKey: key
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(key);
    }));
    test("exportDJTX", () => __awaiter(void 0, void 0, void 0, function* () {
        const amount = new bn_js_1.default(100);
        const to = "abcdef";
        const username = "Robert";
        const password = "Paulson";
        const txID = "valid";
        const result = api.exportDJTX(username, password, amount, to);
        const payload = {
            result: {
                txID: txID
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(txID);
    }));
    test("importDJTX", () => __awaiter(void 0, void 0, void 0, function* () {
        const to = "abcdef";
        const username = "Robert";
        const password = "Paulson";
        const txID = "valid";
        const result = api.importDJTX(username, password, to, blockchainID);
        const payload = {
            result: {
                txID: txID
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(txID);
    }));
    test("createBlockchain", () => __awaiter(void 0, void 0, void 0, function* () {
        const blockchainID = "7sik3Pr6r1FeLrvK1oWwECBS8iJ5VPuSh";
        const vmID = "7sik3Pr6r1FeLrvK1oWwECBS8iJ5VPuSh";
        const name = "Some Blockchain";
        const genesis = '{ruh:"roh"}';
        const subnetID = buffer_1.Buffer.from("abcdef", "hex");
        const result = api.createBlockchain(username, password, subnetID, vmID, [1, 2, 3], name, genesis);
        const payload = {
            result: {
                txID: blockchainID
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(blockchainID);
    }));
    test("getBlockchainStatus", () => __awaiter(void 0, void 0, void 0, function* () {
        const blockchainID = "7sik3Pr6r1FeLrvK1oWwECBS8iJ5VPuSh";
        const result = api.getBlockchainStatus(blockchainID);
        const payload = {
            result: {
                status: "Accepted"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("Accepted");
    }));
    test("createAddress", () => __awaiter(void 0, void 0, void 0, function* () {
        const alias = "randomalias";
        const result = api.createAddress(username, password);
        const payload = {
            result: {
                address: alias
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(alias);
    }));
    test("createSubnet 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const controlKeys = ["abcdef"];
        const threshold = 13;
        const utx = "valid";
        const result = api.createSubnet(username, password, controlKeys, threshold);
        const payload = {
            result: {
                txID: utx
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(utx);
    }));
    test("sampleValidators 1", () => __awaiter(void 0, void 0, void 0, function* () {
        let subnetID;
        const validators = ["val1", "val2"];
        const result = api.sampleValidators(10, subnetID);
        const payload = {
            result: {
                validators
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(validators);
    }));
    test("sampleValidators 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const subnetID = "abcdef";
        const validators = ["val1", "val2"];
        const result = api.sampleValidators(10, subnetID);
        const payload = {
            result: {
                validators
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(validators);
    }));
    test("sampleValidators 3", () => __awaiter(void 0, void 0, void 0, function* () {
        const subnetID = buffer_1.Buffer.from("abcdef", "hex");
        const validators = ["val1", "val2"];
        const result = api.sampleValidators(10, subnetID);
        const payload = {
            result: {
                validators
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(validators);
    }));
    test("validatedBy 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const blockchainID = "abcdef";
        const resp = "valid";
        const result = api.validatedBy(blockchainID);
        const payload = {
            result: {
                subnetID: resp
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(resp);
    }));
    test("validates 1", () => __awaiter(void 0, void 0, void 0, function* () {
        let subnetID;
        const resp = ["valid"];
        const result = api.validates(subnetID);
        const payload = {
            result: {
                blockchainIDs: resp
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(resp);
    }));
    test("validates 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const subnetID = "deadbeef";
        const resp = ["valid"];
        const result = api.validates(subnetID);
        const payload = {
            result: {
                blockchainIDs: resp
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(resp);
    }));
    test("validates 3", () => __awaiter(void 0, void 0, void 0, function* () {
        const subnetID = buffer_1.Buffer.from("abcdef", "hex");
        const resp = ["valid"];
        const result = api.validates(subnetID);
        const payload = {
            result: {
                blockchainIDs: resp
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(resp);
    }));
    test("getTx", () => __awaiter(void 0, void 0, void 0, function* () {
        const txid = "f966750f438867c3c9828ddcdbe660e21ccdbb36a9276958f011ba472f75d4e7";
        const result = api.getTx(txid);
        const payload = {
            result: {
                tx: "sometx"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("sometx");
    }));
    test("getTxStatus", () => __awaiter(void 0, void 0, void 0, function* () {
        const txid = "f966750f438867c3c9828ddcdbe660e21ccdbb36a9276958f011ba472f75d4e7";
        const result = api.getTxStatus(txid);
        const payload = {
            result: "accepted"
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("accepted");
    }));
    test("getUTXOs", () => __awaiter(void 0, void 0, void 0, function* () {
        // Payment
        const OPUTXOstr1 = bintools.cb58Encode(buffer_1.Buffer.from("000038d1b9f1138672da6fb6c35125539276a9acc2a668d63bea6ba3c795e2edb0f5000000013e07e38e2f23121be8756412c18db7246a16d26ee9936f3cba28be149cfd3558000000070000000000004dd500000000000000000000000100000001a36fd0c2dbcab311731dde7ef1514bd26fcdc74d", "hex"));
        const OPUTXOstr2 = bintools.cb58Encode(buffer_1.Buffer.from("0000c3e4823571587fe2bdfc502689f5a8238b9d0ea7f3277124d16af9de0d2d9911000000003e07e38e2f23121be8756412c18db7246a16d26ee9936f3cba28be149cfd355800000007000000000000001900000000000000000000000100000001e1b6b6a4bad94d2e3f20730379b9bcd6f176318e", "hex"));
        const OPUTXOstr3 = bintools.cb58Encode(buffer_1.Buffer.from("0000f29dba61fda8d57a911e7f8810f935bde810d3f8d495404685bdb8d9d8545e86000000003e07e38e2f23121be8756412c18db7246a16d26ee9936f3cba28be149cfd355800000007000000000000001900000000000000000000000100000001e1b6b6a4bad94d2e3f20730379b9bcd6f176318e", "hex"));
        const set = new utxos_1.UTXOSet();
        set.add(OPUTXOstr1);
        set.addArray([OPUTXOstr2, OPUTXOstr3]);
        const persistOpts = new persistenceoptions_1.PersistanceOptions("test", true, "union");
        expect(persistOpts.getMergeRule()).toBe("union");
        let addresses = set
            .getAddresses()
            .map((a) => api.addressFromBuffer(a));
        let result = api.getUTXOs(addresses, api.getBlockchainID(), 0, undefined, persistOpts);
        const payload = {
            result: {
                numFetched: 3,
                utxos: [OPUTXOstr1, OPUTXOstr2, OPUTXOstr3],
                stopIndex: { address: "a", utxo: "b" }
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        let response = (yield result).utxos;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(JSON.stringify(response.getAllUTXOStrings().sort())).toBe(JSON.stringify(set.getAllUTXOStrings().sort()));
        addresses = set.getAddresses().map((a) => api.addressFromBuffer(a));
        result = api.getUTXOs(addresses, api.getBlockchainID(), 0, undefined, persistOpts);
        jest_mock_axios_1.default.mockResponse(responseObj);
        response = (yield result).utxos;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(2);
        expect(JSON.stringify(response.getAllUTXOStrings().sort())).toBe(JSON.stringify(set.getAllUTXOStrings().sort()));
    }));
    describe("Transactions", () => {
        let set;
        let lset;
        let keymgr2;
        let keymgr3;
        let addrs1;
        let addrs2;
        let addrs3;
        let addressbuffs = [];
        let addresses = [];
        let utxos;
        let lutxos;
        let inputs;
        let outputs;
        const amnt = 10000;
        const assetID = buffer_1.Buffer.from((0, create_hash_1.default)("sha256").update("mary had a little lamb").digest());
        let secpbase1;
        let secpbase2;
        let secpbase3;
        let fungutxoids = [];
        let platformvm;
        const fee = 10;
        const name = "Mortycoin is the dumb as a sack of hammers.";
        const symbol = "morT";
        const denomination = 8;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            platformvm = new api_1.PlatformVMAPI(avalanche, "/ext/bc/P");
            const result = platformvm.getDJTXAssetID();
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
            yield result;
            set = new utxos_1.UTXOSet();
            lset = new utxos_1.UTXOSet();
            platformvm.newKeyChain();
            keymgr2 = new keychain_1.KeyChain(avalanche.getHRP(), alias);
            keymgr3 = new keychain_1.KeyChain(avalanche.getHRP(), alias);
            addrs1 = [];
            addrs2 = [];
            addrs3 = [];
            utxos = [];
            lutxos = [];
            inputs = [];
            outputs = [];
            fungutxoids = [];
            const pload = buffer_1.Buffer.alloc(1024);
            pload.write("All you Trekkies and TV addicts, Don't mean to diss don't mean to bring static.", 0, 1024, "utf8");
            for (let i = 0; i < 3; i++) {
                addrs1.push(platformvm.addressFromBuffer(platformvm.keyChain().makeKey().getAddress()));
                addrs2.push(platformvm.addressFromBuffer(keymgr2.makeKey().getAddress()));
                addrs3.push(platformvm.addressFromBuffer(keymgr3.makeKey().getAddress()));
            }
            const amount = constants_2.ONEDJTX.mul(new bn_js_1.default(amnt));
            addressbuffs = platformvm.keyChain().getAddresses();
            addresses = addressbuffs.map((a) => platformvm.addressFromBuffer(a));
            const locktime = new bn_js_1.default(54321);
            const threshold = 3;
            for (let i = 0; i < 5; i++) {
                let txid = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
                    .update(bintools.fromBNToBuffer(new bn_js_1.default(i), 32))
                    .digest());
                let txidx = buffer_1.Buffer.alloc(4);
                txidx.writeUInt32BE(i, 0);
                const out = new outputs_1.SECPTransferOutput(amount, addressbuffs, locktime, threshold);
                const xferout = new outputs_1.TransferableOutput(assetID, out);
                outputs.push(xferout);
                const u = new utxos_2.UTXO();
                u.fromBuffer(buffer_1.Buffer.concat([u.getCodecIDBuffer(), txid, txidx, xferout.toBuffer()]));
                fungutxoids.push(u.getUTXOID());
                utxos.push(u);
                txid = u.getTxID();
                txidx = u.getOutputIdx();
                const asset = u.getAssetID();
                const input = new inputs_1.SECPTransferInput(amount);
                const xferinput = new inputs_1.TransferableInput(txid, txidx, asset, input);
                inputs.push(xferinput);
            }
            set.addArray(utxos);
            for (let i = 0; i < 4; i++) {
                let txid = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
                    .update(bintools.fromBNToBuffer(new bn_js_1.default(i), 32))
                    .digest());
                let txidx = buffer_1.Buffer.alloc(4);
                txidx.writeUInt32BE(i, 0);
                const out = new outputs_1.SECPTransferOutput(constants_2.ONEDJTX.mul(new bn_js_1.default(5)), addressbuffs, locktime, 1);
                const pout = new outputs_1.ParseableOutput(out);
                const lockout = new outputs_1.StakeableLockOut(constants_2.ONEDJTX.mul(new bn_js_1.default(5)), addressbuffs, locktime, 1, locktime.add(new bn_js_1.default(86400)), pout);
                const xferout = new outputs_1.TransferableOutput(assetID, lockout);
                const u = new utxos_2.UTXO();
                u.fromBuffer(buffer_1.Buffer.concat([u.getCodecIDBuffer(), txid, txidx, xferout.toBuffer()]));
                lutxos.push(u);
            }
            lset.addArray(lutxos);
            lset.addArray(set.getAllUTXOs());
            secpbase1 = new outputs_1.SECPTransferOutput(new bn_js_1.default(777), addrs3.map((a) => platformvm.parseAddress(a)), (0, helperfunctions_1.UnixNow)(), 1);
            secpbase2 = new outputs_1.SECPTransferOutput(new bn_js_1.default(888), addrs2.map((a) => platformvm.parseAddress(a)), (0, helperfunctions_1.UnixNow)(), 1);
            secpbase3 = new outputs_1.SECPTransferOutput(new bn_js_1.default(999), addrs2.map((a) => platformvm.parseAddress(a)), (0, helperfunctions_1.UnixNow)(), 1);
        }));
        test("signTx", () => __awaiter(void 0, void 0, void 0, function* () {
            const assetID = yield platformvm.getDJTXAssetID();
            const txu2 = set.buildBaseTx(networkID, bintools.cb58Decode(blockchainID), new bn_js_1.default(amnt), assetID, addrs3.map((a) => platformvm.parseAddress(a)), addrs1.map((a) => platformvm.parseAddress(a)), addrs1.map((a) => platformvm.parseAddress(a)), platformvm.getTxFee(), assetID, undefined, (0, helperfunctions_1.UnixNow)(), new bn_js_1.default(0), 1);
            txu2.sign(platformvm.keyChain());
        }));
        test("buildImportTx", () => __awaiter(void 0, void 0, void 0, function* () {
            const locktime = new bn_js_1.default(0);
            const threshold = 1;
            platformvm.setTxFee(new bn_js_1.default(fee));
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const fungutxo = set.getUTXO(fungutxoids[1]);
            const fungutxostr = fungutxo.toString();
            const result = platformvm.buildImportTx(set, addrs1, constants_1.PlatformChainID, addrs3, addrs1, addrs2, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)(), locktime, threshold);
            const payload = {
                result: {
                    utxos: [fungutxostr]
                }
            };
            const responseObj = {
                data: payload
            };
            jest_mock_axios_1.default.mockResponse(responseObj);
            const txu1 = yield result;
            const txu2 = set.buildImportTx(networkID, bintools.cb58Decode(blockchainID), addrbuff3, addrbuff1, addrbuff2, [fungutxo], bintools.cb58Decode(constants_1.PlatformChainID), platformvm.getTxFee(), yield platformvm.getDJTXAssetID(), new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)(), locktime, threshold);
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "ImportTx");
        }));
        test("buildExportTx", () => __awaiter(void 0, void 0, void 0, function* () {
            platformvm.setTxFee(new bn_js_1.default(fee));
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const amount = new bn_js_1.default(90);
            const type = "bech32";
            const txu1 = yield platformvm.buildExportTx(set, amount, bintools.cb58Decode(constants_1.Defaults.network[avalanche.getNetworkID()].X["blockchainID"]), addrbuff3.map((a) => serializer.bufferToType(a, type, avalanche.getHRP(), "P")), addrs1, addrs2, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = set.buildExportTx(networkID, bintools.cb58Decode(blockchainID), amount, assetID, addrbuff3, addrbuff1, addrbuff2, bintools.cb58Decode(constants_1.Defaults.network[avalanche.getNetworkID()].X["blockchainID"]), platformvm.getTxFee(), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const txu3 = yield platformvm.buildExportTx(set, amount, bintools.cb58Decode(constants_1.Defaults.network[avalanche.getNetworkID()].X["blockchainID"]), addrs3, addrs1, addrs2, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu4 = set.buildExportTx(networkID, bintools.cb58Decode(blockchainID), amount, assetID, addrbuff3, addrbuff1, addrbuff2, undefined, platformvm.getTxFee(), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu4.toBuffer().toString("hex")).toBe(txu3.toBuffer().toString("hex"));
            expect(txu4.toString()).toBe(txu3.toString());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "ExportTx");
        }));
        /*
            test('buildAddSubnetValidatorTx', async (): Promise<void> => {
              platformvm.setFee(new BN(fee));
              const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
              const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
              const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
              const amount:BN = new BN(90);
    
              const txu1:UnsignedTx = await platformvm.buildAddSubnetValidatorTx(
                set,
                addrs1,
                addrs2,
                nodeID,
                startTime,
                endTime,
                PlatformVMConstants.MINSTAKE,
                new UTF8Payload("hello world"), UnixNow()
              );
    
              const txu2:UnsignedTx = set.buildAddSubnetValidatorTx(
                networkID, bintools.cb58Decode(blockchainID),
                addrbuff1,
                addrbuff2,
                NodeIDStringToBuffer(nodeID),
                startTime,
                endTime,
                PlatformVMConstants.MINSTAKE,
                platformvm.getFee(),
                assetID,
                new UTF8Payload("hello world").getPayload(), UnixNow()
              );
              expect(txu2.toBuffer().toString('hex')).toBe(txu1.toBuffer().toString('hex'));
              expect(txu2.toString()).toBe(txu1.toString());
    
            });
        */
        test("buildAddDelegatorTx 1", () => __awaiter(void 0, void 0, void 0, function* () {
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const amount = constants_1.Defaults.network[networkID]["P"].minDelegationStake;
            const locktime = new bn_js_1.default(54321);
            const threshold = 2;
            platformvm.setMinStake(constants_1.Defaults.network[networkID]["P"].minStake, constants_1.Defaults.network[networkID]["P"].minDelegationStake);
            const txu1 = yield platformvm.buildAddDelegatorTx(set, addrs3, addrs1, addrs2, nodeID, startTime, endTime, amount, addrs3, locktime, threshold, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = set.buildAddDelegatorTx(networkID, bintools.cb58Decode(blockchainID), assetID, addrbuff3, addrbuff1, addrbuff2, (0, helperfunctions_2.NodeIDStringToBuffer)(nodeID), startTime, endTime, amount, locktime, threshold, addrbuff3, new bn_js_1.default(0), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "AddDelegatorTx");
        }));
        test("buildAddValidatorTx sort StakeableLockOuts 1", () => __awaiter(void 0, void 0, void 0, function* () {
            // two UTXO. The 1st has a lesser stakeablelocktime and a greater amount of DJTX. The 2nd has a greater stakeablelocktime and a lesser amount of DJTX.
            // We expect this test to only consume the 2nd UTXO since it has the greater locktime.
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const amount1 = new bn_js_1.default("20000000000000000");
            const amount2 = new bn_js_1.default("10000000000000000");
            const locktime1 = new bn_js_1.default(0);
            const threshold = 1;
            const stakeableLockTime1 = new bn_js_1.default(1633824000);
            const secpTransferOutput1 = new outputs_1.SECPTransferOutput(amount1, addrbuff1, locktime1, threshold);
            const parseableOutput1 = new outputs_1.ParseableOutput(secpTransferOutput1);
            const stakeableLockOut1 = new outputs_1.StakeableLockOut(amount1, addrbuff1, locktime1, threshold, stakeableLockTime1, parseableOutput1);
            const stakeableLockTime2 = new bn_js_1.default(1733824000);
            const secpTransferOutput2 = new outputs_1.SECPTransferOutput(amount2, addrbuff1, locktime1, threshold);
            const parseableOutput2 = new outputs_1.ParseableOutput(secpTransferOutput2);
            const stakeableLockOut2 = new outputs_1.StakeableLockOut(amount2, addrbuff1, locktime1, threshold, stakeableLockTime2, parseableOutput2);
            const nodeID = "NodeID-36giFye5epwBTpGqPk7b4CCYe3hfyoFr1";
            const stakeAmount = constants_1.Defaults.network[networkID]["P"].minStake;
            platformvm.setMinStake(stakeAmount, constants_1.Defaults.network[networkID]["P"].minDelegationStake);
            const delegationFeeRate = new bn_js_1.default(2).toNumber();
            const codecID = 0;
            const txid = bintools.cb58Decode("auhMFs24ffc2BRWKw6i7Qngcs8jSQUS9Ei2XwJsUpEq4sTVib");
            const txid2 = bintools.cb58Decode("2JwDfm3C7p88rJQ1Y1xWLkWNMA1nqPzqnaC2Hi4PDNKiPnXgGv");
            const outputidx0 = 0;
            const outputidx1 = 0;
            const assetID = yield platformvm.getDJTXAssetID();
            const assetID2 = yield platformvm.getDJTXAssetID();
            const utxo1 = new utxos_2.UTXO(codecID, txid, outputidx0, assetID, stakeableLockOut1);
            const utxo2 = new utxos_2.UTXO(codecID, txid2, outputidx1, assetID2, stakeableLockOut2);
            const utxoSet = new utxos_1.UTXOSet();
            utxoSet.add(utxo1);
            utxoSet.add(utxo2);
            const txu1 = yield platformvm.buildAddValidatorTx(utxoSet, addrs3, addrs1, addrs2, nodeID, startTime, endTime, stakeAmount, addrs3, delegationFeeRate);
            const tx = txu1.getTransaction();
            const ins = tx.getIns();
            // start test inputs
            // confirm only 1 input
            expect(ins.length).toBe(1);
            const input = ins[0];
            const ai = input.getInput();
            const ao = stakeableLockOut2
                .getTransferableOutput()
                .getOutput();
            const ao2 = stakeableLockOut1
                .getTransferableOutput()
                .getOutput();
            // confirm input amount matches the output w/ the greater staekablelock time but lesser amount
            expect(ai.getAmount().toString()).toEqual(ao.getAmount().toString());
            // confirm input amount doesn't match the output w/ the lesser staekablelock time but greater amount
            expect(ai.getAmount().toString()).not.toEqual(ao2.getAmount().toString());
            const sli = input.getInput();
            // confirm input stakeablelock time matches the output w/ the greater stakeablelock time but lesser amount
            expect(sli.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
            // confirm input stakeablelock time doesn't match the output w/ the lesser stakeablelock time but greater amount
            expect(sli.getStakeableLocktime().toString()).not.toEqual(stakeableLockOut1.getStakeableLocktime().toString());
            // stop test inputs
            // start test outputs
            const outs = tx.getOuts();
            // confirm only 1 output
            expect(outs.length).toBe(1);
            const output = outs[0];
            const ao3 = output.getOutput();
            // confirm output amount matches the output w/ the greater stakeablelock time but lesser amount sans the stake amount
            expect(ao3.getAmount().toString()).toEqual(ao.getAmount().sub(stakeAmount).toString());
            // confirm output amount doesn't match the output w/ the lesser stakeablelock time but greater amount
            expect(ao3.getAmount().toString()).not.toEqual(ao2.getAmount().toString());
            const slo = output.getOutput();
            // confirm output stakeablelock time matches the output w/ the greater stakeablelock time but lesser amount
            expect(slo.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
            // confirm output stakeablelock time doesn't match the output w/ the greater stakeablelock time but lesser amount
            expect(slo.getStakeableLocktime().toString()).not.toEqual(stakeableLockOut1.getStakeableLocktime().toString());
            // confirm tx nodeID matches nodeID
            expect(tx.getNodeIDString()).toEqual(nodeID);
            // confirm tx starttime matches starttime
            expect(tx.getStartTime().toString()).toEqual(startTime.toString());
            // confirm tx endtime matches endtime
            expect(tx.getEndTime().toString()).toEqual(endTime.toString());
            // confirm tx stake amount matches stakeAmount
            expect(tx.getStakeAmount().toString()).toEqual(stakeAmount.toString());
            const stakeOuts = tx.getStakeOuts();
            // confirm only 1 stakeOut
            expect(stakeOuts.length).toBe(1);
            const stakeOut = stakeOuts[0];
            const slo2 = stakeOut.getOutput();
            // confirm stakeOut stakeablelock time matches the output w/ the greater stakeablelock time but lesser amount
            expect(slo2.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
            // confirm stakeOut stakeablelock time doesn't match the output w/ the greater stakeablelock time but lesser amount
            expect(slo2.getStakeableLocktime().toString()).not.toEqual(stakeableLockOut1.getStakeableLocktime().toString());
            slo2.getAmount();
            // confirm stakeOut stake amount matches stakeAmount
            expect(slo2.getAmount().toString()).toEqual(stakeAmount.toString());
        }));
        test("buildAddValidatorTx sort StakeableLockOuts 2", () => __awaiter(void 0, void 0, void 0, function* () {
            // TODO - debug test
            // two UTXO. The 1st has a lesser stakeablelocktime and a greater amount of DJTX. The 2nd has a greater stakeablelocktime and a lesser amount of DJTX.
            // this time we're staking a greater amount than is available in the 2nd UTXO.
            // We expect this test to consume the full 2nd UTXO and a fraction of the 1st UTXO..
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const amount1 = new bn_js_1.default("20000000000000000");
            const amount2 = new bn_js_1.default("10000000000000000");
            const locktime1 = new bn_js_1.default(0);
            const threshold = 1;
            const stakeableLockTime1 = new bn_js_1.default(1633824000);
            const secpTransferOutput1 = new outputs_1.SECPTransferOutput(amount1, addrbuff1, locktime1, threshold);
            const parseableOutput1 = new outputs_1.ParseableOutput(secpTransferOutput1);
            const stakeableLockOut1 = new outputs_1.StakeableLockOut(amount1, addrbuff1, locktime1, threshold, stakeableLockTime1, parseableOutput1);
            const stakeableLockTime2 = new bn_js_1.default(1733824000);
            const secpTransferOutput2 = new outputs_1.SECPTransferOutput(amount2, addrbuff1, locktime1, threshold);
            const parseableOutput2 = new outputs_1.ParseableOutput(secpTransferOutput2);
            const stakeableLockOut2 = new outputs_1.StakeableLockOut(amount2, addrbuff1, locktime1, threshold, stakeableLockTime2, parseableOutput2);
            const nodeID = "NodeID-36giFye5epwBTpGqPk7b4CCYe3hfyoFr1";
            const stakeAmount = new bn_js_1.default("10000003000000000");
            platformvm.setMinStake(stakeAmount, constants_1.Defaults.network[networkID]["P"].minDelegationStake);
            const delegationFeeRate = new bn_js_1.default(2).toNumber();
            const codecID = 0;
            const txid = bintools.cb58Decode("auhMFs24ffc2BRWKw6i7Qngcs8jSQUS9Ei2XwJsUpEq4sTVib");
            const txid2 = bintools.cb58Decode("2JwDfm3C7p88rJQ1Y1xWLkWNMA1nqPzqnaC2Hi4PDNKiPnXgGv");
            const outputidx0 = 0;
            const outputidx1 = 0;
            const assetID = yield platformvm.getDJTXAssetID();
            const assetID2 = yield platformvm.getDJTXAssetID();
            const utxo1 = new utxos_2.UTXO(codecID, txid, outputidx0, assetID, stakeableLockOut1);
            const utxo2 = new utxos_2.UTXO(codecID, txid2, outputidx1, assetID2, stakeableLockOut2);
            const utxoSet = new utxos_1.UTXOSet();
            utxoSet.add(utxo1);
            utxoSet.add(utxo2);
            const txu1 = yield platformvm.buildAddValidatorTx(utxoSet, addrs3, addrs1, addrs2, nodeID, startTime, endTime, stakeAmount, addrs3, delegationFeeRate);
            const tx = txu1.getTransaction();
            const ins = tx.getIns();
            // start test inputs
            // confirm only 1 input
            expect(ins.length).toBe(2);
            const input1 = ins[0];
            const input2 = ins[1];
            const ai1 = input1.getInput();
            const ai2 = input2.getInput();
            const ao1 = stakeableLockOut2
                .getTransferableOutput()
                .getOutput();
            const ao2 = stakeableLockOut1
                .getTransferableOutput()
                .getOutput();
            // confirm each input amount matches the corresponding output
            expect(ai2.getAmount().toString()).toEqual(ao1.getAmount().toString());
            expect(ai1.getAmount().toString()).toEqual(ao2.getAmount().toString());
            const sli1 = input1.getInput();
            const sli2 = input2.getInput();
            // confirm input strakeablelock time matches the output w/ the greater staekablelock time but lesser amount
            // expect(sli1.getStakeableLocktime().toString()).toEqual(
            //   stakeableLockOut1.getStakeableLocktime().toString()
            // )
            expect(sli2.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
            // stop test inputs
            // start test outputs
            const outs = tx.getOuts();
            // confirm only 1 output
            expect(outs.length).toBe(1);
            const output = outs[0];
            const ao3 = output.getOutput();
            // confirm output amount matches the output amount sans the 2nd utxo amount and the stake amount
            expect(ao3.getAmount().toString()).toEqual(ao2.getAmount().sub(stakeAmount.sub(ao1.getAmount())).toString());
            const slo = output.getOutput();
            // confirm output stakeablelock time matches the output w/ the lesser stakeablelock since the other was consumed
            // expect(slo.getStakeableLocktime().toString()).toEqual(
            //   stakeableLockOut1.getStakeableLocktime().toString()
            // )
            // confirm output stakeablelock time doesn't match the output w/ the greater stakeablelock time
            // expect(slo.getStakeableLocktime().toString()).not.toEqual(
            //   stakeableLockOut2.getStakeableLocktime().toString()
            // )
            // confirm tx nodeID matches nodeID
            expect(tx.getNodeIDString()).toEqual(nodeID);
            // confirm tx starttime matches starttime
            expect(tx.getStartTime().toString()).toEqual(startTime.toString());
            // confirm tx endtime matches endtime
            expect(tx.getEndTime().toString()).toEqual(endTime.toString());
            // confirm tx stake amount matches stakeAmount
            expect(tx.getStakeAmount().toString()).toEqual(stakeAmount.toString());
            let stakeOuts = tx.getStakeOuts();
            // confirm 2 stakeOuts
            expect(stakeOuts.length).toBe(2);
            let stakeOut1 = stakeOuts[0];
            let stakeOut2 = stakeOuts[1];
            let slo2 = stakeOut1.getOutput();
            let slo3 = stakeOut2.getOutput();
            // confirm both stakeOut strakeablelock times matche the corresponding output
            // expect(slo3.getStakeableLocktime().toString()).toEqual(
            //   stakeableLockOut1.getStakeableLocktime().toString()
            // )
            expect(slo2.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
        }));
        test("buildAddValidatorTx sort StakeableLockOuts 3", () => __awaiter(void 0, void 0, void 0, function* () {
            // TODO - debug test
            // three UTXO.
            // The 1st is a SecpTransferableOutput.
            // The 2nd has a lesser stakeablelocktime and a greater amount of DJTX.
            // The 3rd has a greater stakeablelocktime and a lesser amount of DJTX.
            //
            // this time we're staking a greater amount than is available in the 3rd UTXO.
            // We expect this test to consume the full 3rd UTXO and a fraction of the 2nd UTXO and not to consume the SecpTransferableOutput
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const amount1 = new bn_js_1.default("20000000000000000");
            const amount2 = new bn_js_1.default("10000000000000000");
            const locktime1 = new bn_js_1.default(0);
            const threshold = 1;
            const stakeableLockTime1 = new bn_js_1.default(1633824000);
            const secpTransferOutput0 = new outputs_1.SECPTransferOutput(amount1, addrbuff1, locktime1, threshold);
            const secpTransferOutput1 = new outputs_1.SECPTransferOutput(amount1, addrbuff1, locktime1, threshold);
            const parseableOutput1 = new outputs_1.ParseableOutput(secpTransferOutput1);
            const stakeableLockOut1 = new outputs_1.StakeableLockOut(amount1, addrbuff1, locktime1, threshold, stakeableLockTime1, parseableOutput1);
            const stakeableLockTime2 = new bn_js_1.default(1733824000);
            const secpTransferOutput2 = new outputs_1.SECPTransferOutput(amount2, addrbuff1, locktime1, threshold);
            const parseableOutput2 = new outputs_1.ParseableOutput(secpTransferOutput2);
            const stakeableLockOut2 = new outputs_1.StakeableLockOut(amount2, addrbuff1, locktime1, threshold, stakeableLockTime2, parseableOutput2);
            const nodeID = "NodeID-36giFye5epwBTpGqPk7b4CCYe3hfyoFr1";
            const stakeAmount = new bn_js_1.default("10000003000000000");
            platformvm.setMinStake(stakeAmount, constants_1.Defaults.network[networkID]["P"].minDelegationStake);
            const delegationFeeRate = new bn_js_1.default(2).toNumber();
            const codecID = 0;
            const txid0 = bintools.cb58Decode("auhMFs24ffc2BRWKw6i7Qngcs8jSQUS9Ei2XwJsUpEq4sTVib");
            const txid1 = bintools.cb58Decode("2jhyJit8kWA6SwkRwKxXepFnfhs971CEqaGkjJmiADM8H4g2LR");
            const txid2 = bintools.cb58Decode("2JwDfm3C7p88rJQ1Y1xWLkWNMA1nqPzqnaC2Hi4PDNKiPnXgGv");
            const outputidx0 = 0;
            const outputidx1 = 0;
            const assetID = yield platformvm.getDJTXAssetID();
            const assetID2 = yield platformvm.getDJTXAssetID();
            const utxo0 = new utxos_2.UTXO(codecID, txid0, outputidx0, assetID, secpTransferOutput0);
            const utxo1 = new utxos_2.UTXO(codecID, txid1, outputidx0, assetID, stakeableLockOut1);
            const utxo2 = new utxos_2.UTXO(codecID, txid2, outputidx1, assetID2, stakeableLockOut2);
            const utxoSet = new utxos_1.UTXOSet();
            utxoSet.add(utxo0);
            utxoSet.add(utxo1);
            utxoSet.add(utxo2);
            const txu1 = yield platformvm.buildAddValidatorTx(utxoSet, addrs3, addrs1, addrs2, nodeID, startTime, endTime, stakeAmount, addrs3, delegationFeeRate);
            const tx = txu1.getTransaction();
            const ins = tx.getIns();
            // start test inputs
            // confirm only 1 input
            expect(ins.length).toBe(2);
            const input1 = ins[0];
            const input2 = ins[1];
            const ai1 = input1.getInput();
            const ai2 = input2.getInput();
            const ao1 = stakeableLockOut2
                .getTransferableOutput()
                .getOutput();
            const ao2 = stakeableLockOut1
                .getTransferableOutput()
                .getOutput();
            // confirm each input amount matches the corresponding output
            expect(ai2.getAmount().toString()).toEqual(ao2.getAmount().toString());
            expect(ai1.getAmount().toString()).toEqual(ao1.getAmount().toString());
            const sli1 = input1.getInput();
            const sli2 = input2.getInput();
            // confirm input strakeablelock time matches the output w/ the greater staekablelock time but lesser amount
            expect(sli1.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
            // expect(sli2.getStakeableLocktime().toString()).toEqual(
            //   stakeableLockOut1.getStakeableLocktime().toString()
            // )
            // stop test inputs
            // start test outputs
            const outs = tx.getOuts();
            // confirm only 1 output
            expect(outs.length).toBe(1);
            const output = outs[0];
            const ao3 = output.getOutput();
            // confirm output amount matches the output amount sans the 2nd utxo amount and the stake amount
            expect(ao3.getAmount().toString()).toEqual(ao2.getAmount().sub(stakeAmount.sub(ao1.getAmount())).toString());
            const slo = output.getOutput();
            // confirm output stakeablelock time matches the output w/ the lesser stakeablelock since the other was consumed
            // expect(slo.getStakeableLocktime().toString()).toEqual(
            //   stakeableLockOut1.getStakeableLocktime().toString()
            // )
            // confirm output stakeablelock time doesn't match the output w/ the greater stakeablelock time
            // expect(slo.getStakeableLocktime().toString()).not.toEqual(
            //   stakeableLockOut2.getStakeableLocktime().toString()
            // )
            // confirm tx nodeID matches nodeID
            expect(tx.getNodeIDString()).toEqual(nodeID);
            // confirm tx starttime matches starttime
            expect(tx.getStartTime().toString()).toEqual(startTime.toString());
            // confirm tx endtime matches endtime
            expect(tx.getEndTime().toString()).toEqual(endTime.toString());
            // confirm tx stake amount matches stakeAmount
            expect(tx.getStakeAmount().toString()).toEqual(stakeAmount.toString());
            const stakeOuts = tx.getStakeOuts();
            // confirm 2 stakeOuts
            expect(stakeOuts.length).toBe(2);
            const stakeOut1 = stakeOuts[0];
            const stakeOut2 = stakeOuts[1];
            const slo2 = stakeOut1.getOutput();
            const slo3 = stakeOut2.getOutput();
            // confirm both stakeOut strakeablelock times matche the corresponding output
            // expect(slo3.getStakeableLocktime().toString()).toEqual(
            //   stakeableLockOut1.getStakeableLocktime().toString()
            // )
            expect(slo2.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
        }));
        test("buildAddValidatorTx 1", () => __awaiter(void 0, void 0, void 0, function* () {
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const amount = constants_1.Defaults.network[networkID]["P"].minStake.add(new bn_js_1.default(fee));
            const locktime = new bn_js_1.default(54321);
            const threshold = 2;
            platformvm.setMinStake(constants_1.Defaults.network[networkID]["P"].minStake, constants_1.Defaults.network[networkID]["P"].minDelegationStake);
            const txu1 = yield platformvm.buildAddValidatorTx(set, addrs3, addrs1, addrs2, nodeID, startTime, endTime, amount, addrs3, 0.1334556, locktime, threshold, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = set.buildAddValidatorTx(networkID, bintools.cb58Decode(blockchainID), assetID, addrbuff3, addrbuff1, addrbuff2, (0, helperfunctions_2.NodeIDStringToBuffer)(nodeID), startTime, endTime, amount, locktime, threshold, addrbuff3, 0.1335, new bn_js_1.default(0), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "AddValidatorTx");
        }));
        test("buildAddDelegatorTx 2", () => __awaiter(void 0, void 0, void 0, function* () {
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const amount = constants_1.Defaults.network[networkID]["P"].minDelegationStake;
            const locktime = new bn_js_1.default(54321);
            const threshold = 2;
            platformvm.setMinStake(constants_1.Defaults.network[networkID]["P"].minStake, constants_1.Defaults.network[networkID]["P"].minDelegationStake);
            const txu1 = yield platformvm.buildAddDelegatorTx(lset, addrs3, addrs1, addrs2, nodeID, startTime, endTime, amount, addrs3, locktime, threshold, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = lset.buildAddDelegatorTx(networkID, bintools.cb58Decode(blockchainID), assetID, addrbuff3, addrbuff1, addrbuff2, (0, helperfunctions_2.NodeIDStringToBuffer)(nodeID), startTime, endTime, amount, locktime, threshold, addrbuff3, new bn_js_1.default(0), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "AddDelegatorTx");
        }));
        test("buildAddValidatorTx 2", () => __awaiter(void 0, void 0, void 0, function* () {
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const amount = constants_2.ONEDJTX.mul(new bn_js_1.default(25));
            const locktime = new bn_js_1.default(54321);
            const threshold = 2;
            platformvm.setMinStake(constants_2.ONEDJTX.mul(new bn_js_1.default(25)), constants_2.ONEDJTX.mul(new bn_js_1.default(25)));
            const txu1 = yield platformvm.buildAddValidatorTx(lset, addrs3, addrs1, addrs2, nodeID, startTime, endTime, amount, addrs3, 0.1334556, locktime, threshold, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = lset.buildAddValidatorTx(networkID, bintools.cb58Decode(blockchainID), assetID, addrbuff3, addrbuff1, addrbuff2, (0, helperfunctions_2.NodeIDStringToBuffer)(nodeID), startTime, endTime, amount, locktime, threshold, addrbuff3, 0.1335, new bn_js_1.default(0), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "AddValidatorTx");
        }));
        test("buildAddValidatorTx 3", () => __awaiter(void 0, void 0, void 0, function* () {
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const amount = constants_2.ONEDJTX.mul(new bn_js_1.default(3));
            const locktime = new bn_js_1.default(54321);
            const threshold = 2;
            platformvm.setMinStake(constants_2.ONEDJTX.mul(new bn_js_1.default(3)), constants_2.ONEDJTX.mul(new bn_js_1.default(3)));
            //2 utxos; one lockedstakeable; other unlocked; both utxos have 2 djtx; stake 3 DJTX
            const dummySet = new utxos_1.UTXOSet();
            const lockedBaseOut = new outputs_1.SECPTransferOutput(constants_2.ONEDJTX.mul(new bn_js_1.default(2)), addrbuff1, locktime, 1);
            const lockedBaseXOut = new outputs_1.ParseableOutput(lockedBaseOut);
            const lockedOut = new outputs_1.StakeableLockOut(constants_2.ONEDJTX.mul(new bn_js_1.default(2)), addrbuff1, locktime, 1, locktime, lockedBaseXOut);
            const txidLocked = buffer_1.Buffer.alloc(32);
            txidLocked.fill(1);
            const txidxLocked = buffer_1.Buffer.alloc(4);
            txidxLocked.writeUInt32BE(1, 0);
            const lu = new utxos_2.UTXO(0, txidLocked, txidxLocked, assetID, lockedOut);
            const txidUnlocked = buffer_1.Buffer.alloc(32);
            txidUnlocked.fill(2);
            const txidxUnlocked = buffer_1.Buffer.alloc(4);
            txidxUnlocked.writeUInt32BE(2, 0);
            const unlockedOut = new outputs_1.SECPTransferOutput(constants_2.ONEDJTX.mul(new bn_js_1.default(2)), addrbuff1, locktime, 1);
            const ulu = new utxos_2.UTXO(0, txidUnlocked, txidxUnlocked, assetID, unlockedOut);
            dummySet.add(ulu);
            dummySet.add(lu);
            const txu1 = yield platformvm.buildAddValidatorTx(dummySet, addrs3, addrs1, addrs2, nodeID, startTime, endTime, amount, addrs3, 0.1334556, locktime, threshold, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu1Ins = txu1.getTransaction().getIns();
            const txu1Outs = txu1.getTransaction().getOuts();
            const txu1Stake = txu1.getTransaction().getStakeOuts();
            const txu1Total = txu1.getTransaction().getTotalOuts();
            let intotal = new bn_js_1.default(0);
            for (let i = 0; i < txu1Ins.length; i++) {
                intotal = intotal.add(txu1Ins[i].getInput().getAmount());
            }
            let outtotal = new bn_js_1.default(0);
            for (let i = 0; i < txu1Outs.length; i++) {
                outtotal = outtotal.add(txu1Outs[i].getOutput().getAmount());
            }
            let staketotal = new bn_js_1.default(0);
            for (let i = 0; i < txu1Stake.length; i++) {
                staketotal = staketotal.add(txu1Stake[i].getOutput().getAmount());
            }
            let totaltotal = new bn_js_1.default(0);
            for (let i = 0; i < txu1Total.length; i++) {
                totaltotal = totaltotal.add(txu1Total[i].getOutput().getAmount());
            }
            expect(intotal.toString(10)).toBe("4000000000");
            expect(outtotal.toString(10)).toBe("1000000000");
            expect(staketotal.toString(10)).toBe("3000000000");
            expect(totaltotal.toString(10)).toBe("4000000000");
        }));
        test("buildCreateSubnetTx1", () => __awaiter(void 0, void 0, void 0, function* () {
            platformvm.setCreationTxFee(new bn_js_1.default(10));
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const txu1 = yield platformvm.buildCreateSubnetTx(set, addrs1, addrs2, [addrs1[0]], 1, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = set.buildCreateSubnetTx(networkID, bintools.cb58Decode(blockchainID), addrbuff1, addrbuff2, [addrbuff1[0]], 1, platformvm.getCreateSubnetTxFee(), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "CreateSubnetTx");
        }));
        test("buildCreateSubnetTx2", () => __awaiter(void 0, void 0, void 0, function* () {
            platformvm.setCreationTxFee(new bn_js_1.default(10));
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const txu1 = yield platformvm.buildCreateSubnetTx(lset, addrs1, addrs2, [addrs1[0]], 1, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = lset.buildCreateSubnetTx(networkID, bintools.cb58Decode(blockchainID), addrbuff1, addrbuff2, [addrbuff1[0]], 1, platformvm.getCreateSubnetTxFee(), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
        }));
    });
    test("getRewardUTXOs", () => __awaiter(void 0, void 0, void 0, function* () {
        const txID = "7sik3Pr6r1FeLrvK1oWwECBS8iJ5VPuSh";
        const result = api.getRewardUTXOs(txID);
        const payload = {
            result: { numFetched: "0", utxos: [], encoding: "cb58" }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(payload["result"]);
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL3BsYXRmb3Jtdm0vYXBpLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNFQUF1QztBQUN2Qyw2QkFBK0I7QUFDL0IsMERBQWdFO0FBQ2hFLG9DQUFnQztBQUNoQyxrREFBc0I7QUFDdEIsMkVBQWtEO0FBQ2xELCtDQUFnQztBQUNoQyw0REFBd0U7QUFDeEUsOERBQTREO0FBQzVELDhFQUEwRTtBQUMxRSxvRUFBZ0U7QUFDaEUsa0VBTTZDO0FBQzdDLGdFQUs0QztBQUM1Qyw4REFBeUQ7QUFDekQsOERBQW9DO0FBQ3BDLHdEQUFnRTtBQUNoRSx3RUFBNEQ7QUFDNUQsd0RBQXdEO0FBQ3hELHdFQUF5RTtBQUN6RSw0REFBc0Q7QUFDdEQsb0VBS3lDO0FBaUJ6Qzs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxVQUFVLEdBQWtCLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDN0QsTUFBTSxPQUFPLEdBQXVCLFNBQVMsQ0FBQTtBQUM3QyxNQUFNLGlCQUFpQixHQUFZLEtBQUssQ0FBQTtBQUV4QyxNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQW9CLEVBQUUsSUFBWSxFQUFRLEVBQUU7SUFDOUQsSUFBSSxpQkFBaUIsRUFBRTtRQUNyQixPQUFPLENBQUMsR0FBRyxDQUNULElBQUksQ0FBQyxTQUFTLENBQ1osVUFBVSxDQUFDLFNBQVMsQ0FDbEIsTUFBTSxFQUNOLFlBQVksRUFDWixLQUFLLEVBQ0wsSUFBSSxHQUFHLGlCQUFpQixDQUN6QixDQUNGLENBQ0YsQ0FBQTtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FDWixVQUFVLENBQUMsU0FBUyxDQUNsQixNQUFNLEVBQ04s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QyxDQUFBLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vY2tBeGlvcyBmcm9tIFwiamVzdC1tb2NrLWF4aW9zXCJcbmltcG9ydCB7IEF2YWxhbmNoZSB9IGZyb20gXCJzcmNcIlxuaW1wb3J0IHsgUGxhdGZvcm1WTUFQSSB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL2FwaVwiXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2JpbnRvb2xzXCJcbmltcG9ydCAqIGFzIGJlY2gzMiBmcm9tIFwiYmVjaDMyXCJcbmltcG9ydCB7IERlZmF1bHRzLCBQbGF0Zm9ybUNoYWluSUQgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2NvbnN0YW50c1wiXG5pbXBvcnQgeyBVVFhPU2V0IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vdXR4b3NcIlxuaW1wb3J0IHsgUGVyc2lzdGFuY2VPcHRpb25zIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9wZXJzaXN0ZW5jZW9wdGlvbnNcIlxuaW1wb3J0IHsgS2V5Q2hhaW4gfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS9rZXljaGFpblwiXG5pbXBvcnQge1xuICBTRUNQVHJhbnNmZXJPdXRwdXQsXG4gIFRyYW5zZmVyYWJsZU91dHB1dCxcbiAgQW1vdW50T3V0cHV0LFxuICBQYXJzZWFibGVPdXRwdXQsXG4gIFN0YWtlYWJsZUxvY2tPdXRcbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vb3V0cHV0c1wiXG5pbXBvcnQge1xuICBUcmFuc2ZlcmFibGVJbnB1dCxcbiAgU0VDUFRyYW5zZmVySW5wdXQsXG4gIEFtb3VudElucHV0LFxuICBTdGFrZWFibGVMb2NrSW5cbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vaW5wdXRzXCJcbmltcG9ydCB7IFVUWE8gfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS91dHhvc1wiXG5pbXBvcnQgY3JlYXRlSGFzaCBmcm9tIFwiY3JlYXRlLWhhc2hcIlxuaW1wb3J0IHsgVW5zaWduZWRUeCwgVHggfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS90eFwiXG5pbXBvcnQgeyBVbml4Tm93IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9oZWxwZXJmdW5jdGlvbnNcIlxuaW1wb3J0IHsgVVRGOFBheWxvYWQgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL3BheWxvYWRcIlxuaW1wb3J0IHsgTm9kZUlEU3RyaW5nVG9CdWZmZXIgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2hlbHBlcmZ1bmN0aW9uc1wiXG5pbXBvcnQgeyBPTkVESlRYIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9jb25zdGFudHNcIlxuaW1wb3J0IHtcbiAgU2VyaWFsaXphYmxlLFxuICBTZXJpYWxpemF0aW9uLFxuICBTZXJpYWxpemVkRW5jb2RpbmcsXG4gIFNlcmlhbGl6ZWRUeXBlXG59IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvc2VyaWFsaXphdGlvblwiXG5pbXBvcnQgeyBBZGRWYWxpZGF0b3JUeCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL3ZhbGlkYXRpb250eFwiXG5pbXBvcnQge1xuICBCbG9ja2NoYWluLFxuICBHZXRNaW5TdGFrZVJlc3BvbnNlLFxuICBHZXRSZXdhcmRVVFhPc1Jlc3BvbnNlLFxuICBTdWJuZXQsXG4gIEdldFR4U3RhdHVzUmVzcG9uc2UsXG4gIEdldFZhbGlkYXRvcnNBdFJlc3BvbnNlXG59IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL2ludGVyZmFjZXNcIlxuaW1wb3J0IHsgRXJyb3JSZXNwb25zZU9iamVjdCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvZXJyb3JzXCJcbmltcG9ydCB7IEh0dHBSZXNwb25zZSB9IGZyb20gXCJqZXN0LW1vY2stYXhpb3MvZGlzdC9saWIvbW9jay1heGlvcy10eXBlc1wiXG5pbXBvcnQge1xuICBHZXRCYWxhbmNlUmVzcG9uc2UsXG4gIEdldFVUWE9zUmVzcG9uc2Vcbn0gZnJvbSBcInNyYy9hcGlzL3BsYXRmb3Jtdm0vaW50ZXJmYWNlc1wiXG5cbi8qKlxuICogQGlnbm9yZVxuICovXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXG5jb25zdCBzZXJpYWxpemVyOiBTZXJpYWxpemF0aW9uID0gU2VyaWFsaXphdGlvbi5nZXRJbnN0YW5jZSgpXG5jb25zdCBkaXNwbGF5OiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImRpc3BsYXlcIlxuY29uc3QgZHVtcFNlcmlhbGl6YXRpb246IGJvb2xlYW4gPSBmYWxzZVxuXG5jb25zdCBzZXJpYWx6ZWl0ID0gKGFUaGluZzogU2VyaWFsaXphYmxlLCBuYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgaWYgKGR1bXBTZXJpYWxpemF0aW9uKSB7XG4gICAgY29uc29sZS5sb2coXG4gICAgICBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICAgICAgYVRoaW5nLFxuICAgICAgICAgIFwicGxhdGZvcm12bVwiLFxuICAgICAgICAgIFwiaGV4XCIsXG4gICAgICAgICAgbmFtZSArIFwiIC0tIEhleCBFbmNvZGVkXCJcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIEpTT04uc3RyaW5naWZ5KFxuICAgICAgICBzZXJpYWxpemVyLnNlcmlhbGl6ZShcbiAgICAgICAgICBhVGhpbmcsXG4gICAgICAgICAgXCJwbGF0Zm9ybXZtXCIsXG4gICAgICAgICAgXCJkaXNwbGF5XCIsXG4gICAgICAgICAgbmFtZSArIFwiIC0tIEh1bWFuLVJlYWRhYmxlXCJcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcbiAgfVxufVxuXG5kZXNjcmliZShcIlBsYXRmb3JtVk1BUElcIiwgKCk6IHZvaWQgPT4ge1xuICBjb25zdCBuZXR3b3JrSUQ6IG51bWJlciA9IDEzMzdcbiAgY29uc3QgYmxvY2tjaGFpbklEOiBzdHJpbmcgPSBQbGF0Zm9ybUNoYWluSURcbiAgY29uc3QgaXA6IHN0cmluZyA9IFwiMTI3LjAuMC4xXCJcbiAgY29uc3QgcG9ydDogbnVtYmVyID0gOTY1MFxuICBjb25zdCBwcm90b2NvbDogc3RyaW5nID0gXCJodHRwc1wiXG5cbiAgY29uc3Qgbm9kZUlEOiBzdHJpbmcgPSBcIk5vZGVJRC1CNkQ0djFWdFBZTGJpVXZZWHRXNFB4OG9FOWltQzJ2R1dcIlxuICBjb25zdCBzdGFydFRpbWU6IEJOID0gVW5peE5vdygpLmFkZChuZXcgQk4oNjAgKiA1KSlcbiAgY29uc3QgZW5kVGltZTogQk4gPSBzdGFydFRpbWUuYWRkKG5ldyBCTigxMjA5NjAwKSlcblxuICBjb25zdCB1c2VybmFtZTogc3RyaW5nID0gXCJBdmFMYWJzXCJcbiAgY29uc3QgcGFzc3dvcmQ6IHN0cmluZyA9IFwicGFzc3dvcmRcIlxuXG4gIGNvbnN0IGF2YWxhbmNoZTogQXZhbGFuY2hlID0gbmV3IEF2YWxhbmNoZShcbiAgICBpcCxcbiAgICBwb3J0LFxuICAgIHByb3RvY29sLFxuICAgIG5ldHdvcmtJRCxcbiAgICB1bmRlZmluZWQsXG4gICAgdW5kZWZpbmVkLFxuICAgIHVuZGVmaW5lZCxcbiAgICB0cnVlXG4gIClcbiAgbGV0IGFwaTogUGxhdGZvcm1WTUFQSVxuICBsZXQgYWxpYXM6IHN0cmluZ1xuXG4gIGNvbnN0IGFkZHJBOiBzdHJpbmcgPVxuICAgIFwiUC1cIiArXG4gICAgYmVjaDMyLmJlY2gzMi5lbmNvZGUoXG4gICAgICBhdmFsYW5jaGUuZ2V0SFJQKCksXG4gICAgICBiZWNoMzIuYmVjaDMyLnRvV29yZHMoXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoXCJCNkQ0djFWdFBZTGJpVXZZWHRXNFB4OG9FOWltQzJ2R1dcIilcbiAgICAgIClcbiAgICApXG4gIGNvbnN0IGFkZHJCOiBzdHJpbmcgPVxuICAgIFwiUC1cIiArXG4gICAgYmVjaDMyLmJlY2gzMi5lbmNvZGUoXG4gICAgICBhdmFsYW5jaGUuZ2V0SFJQKCksXG4gICAgICBiZWNoMzIuYmVjaDMyLnRvV29yZHMoXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoXCJQNXdkUnVaZWFEdDI4ZUhNUDVTM3c5WmRvQmZvN3d1ekZcIilcbiAgICAgIClcbiAgICApXG4gIGNvbnN0IGFkZHJDOiBzdHJpbmcgPVxuICAgIFwiUC1cIiArXG4gICAgYmVjaDMyLmJlY2gzMi5lbmNvZGUoXG4gICAgICBhdmFsYW5jaGUuZ2V0SFJQKCksXG4gICAgICBiZWNoMzIuYmVjaDMyLnRvV29yZHMoXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoXCI2WTNreXNqRjlqbkhuWWtkUzl5R0F1b0h5YWUyZU5tZVZcIilcbiAgICAgIClcbiAgICApXG5cbiAgYmVmb3JlQWxsKCgpOiB2b2lkID0+IHtcbiAgICBhcGkgPSBuZXcgUGxhdGZvcm1WTUFQSShhdmFsYW5jaGUsIFwiL2V4dC9iYy9QXCIpXG4gICAgYWxpYXMgPSBhcGkuZ2V0QmxvY2tjaGFpbkFsaWFzKClcbiAgfSlcblxuICBhZnRlckVhY2goKCk6IHZvaWQgPT4ge1xuICAgIG1vY2tBeGlvcy5yZXNldCgpXG4gIH0pXG5cbiAgdGVzdChcImdldENyZWF0ZVN1Ym5ldFR4RmVlXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBsZXQgcGNoYWluOiBQbGF0Zm9ybVZNQVBJID0gbmV3IFBsYXRmb3JtVk1BUEkoYXZhbGFuY2hlLCBcIi9leHQvYmMvUFwiKVxuICAgIGNvbnN0IGZlZVJlc3BvbnNlOiBzdHJpbmcgPSBcIjEwMDAwMDAwMDBcIlxuICAgIGNvbnN0IGZlZTogQk4gPSBwY2hhaW4uZ2V0Q3JlYXRlU3VibmV0VHhGZWUoKVxuICAgIGV4cGVjdChmZWUudG9TdHJpbmcoKSkudG9CZShmZWVSZXNwb25zZSlcbiAgfSlcblxuICB0ZXN0KFwiZ2V0Q3JlYXRlQ2hhaW5UeEZlZVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgbGV0IHBjaGFpbjogUGxhdGZvcm1WTUFQSSA9IG5ldyBQbGF0Zm9ybVZNQVBJKGF2YWxhbmNoZSwgXCIvZXh0L2JjL1BcIilcbiAgICBjb25zdCBmZWVSZXNwb25zZTogc3RyaW5nID0gXCIxMDAwMDAwMDAwXCJcbiAgICBjb25zdCBmZWU6IEJOID0gcGNoYWluLmdldENyZWF0ZUNoYWluVHhGZWUoKVxuICAgIGV4cGVjdChmZWUudG9TdHJpbmcoKSkudG9CZShmZWVSZXNwb25zZSlcbiAgfSlcblxuICB0ZXN0KFwicmVmcmVzaEJsb2NrY2hhaW5JRFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgbGV0IG4zYmNJRDogc3RyaW5nID0gRGVmYXVsdHMubmV0d29ya1szXS5QW1wiYmxvY2tjaGFpbklEXCJdXG4gICAgbGV0IHRlc3RBUEk6IFBsYXRmb3JtVk1BUEkgPSBuZXcgUGxhdGZvcm1WTUFQSShhdmFsYW5jaGUsIFwiL2V4dC9iYy9QXCIpXG4gICAgbGV0IGJjMTogc3RyaW5nID0gdGVzdEFQSS5nZXRCbG9ja2NoYWluSUQoKVxuICAgIGV4cGVjdChiYzEpLnRvQmUoUGxhdGZvcm1DaGFpbklEKVxuXG4gICAgdGVzdEFQSS5yZWZyZXNoQmxvY2tjaGFpbklEKClcbiAgICBsZXQgYmMyOiBzdHJpbmcgPSB0ZXN0QVBJLmdldEJsb2NrY2hhaW5JRCgpXG4gICAgZXhwZWN0KGJjMikudG9CZShQbGF0Zm9ybUNoYWluSUQpXG5cbiAgICB0ZXN0QVBJLnJlZnJlc2hCbG9ja2NoYWluSUQobjNiY0lEKVxuICAgIGxldCBiYzM6IHN0cmluZyA9IHRlc3RBUEkuZ2V0QmxvY2tjaGFpbklEKClcbiAgICBleHBlY3QoYmMzKS50b0JlKG4zYmNJRClcbiAgfSlcblxuICB0ZXN0KFwibGlzdEFkZHJlc3Nlc1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgYWRkcmVzc2VzOiBzdHJpbmdbXSA9IFthZGRyQSwgYWRkckJdXG5cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nW10+ID0gYXBpLmxpc3RBZGRyZXNzZXModXNlcm5hbWUsIHBhc3N3b3JkKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBhZGRyZXNzZXNcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmdbXSA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoYWRkcmVzc2VzKVxuICB9KVxuXG4gIHRlc3QoXCJpbXBvcnRLZXlcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGFkZHJlc3M6IHN0cmluZyA9IGFkZHJDXG5cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPSBhcGkuaW1wb3J0S2V5KFxuICAgICAgdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIFwia2V5XCJcbiAgICApXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIGFkZHJlc3NcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0ID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShhZGRyZXNzKVxuICB9KVxuXG4gIHRlc3QoXCJpbXBvcnQgYmFkIGtleVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgYWRkcmVzczogc3RyaW5nID0gYWRkckNcbiAgICBjb25zdCBtZXNzYWdlOiBzdHJpbmcgPVxuICAgICAgJ3Byb2JsZW0gcmV0cmlldmluZyBkYXRhOiBpbmNvcnJlY3QgcGFzc3dvcmQgZm9yIHVzZXIgXCJ0ZXN0XCInXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3Q+ID0gYXBpLmltcG9ydEtleShcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgXCJiYWRwYXNzd29yZFwiLFxuICAgICAgXCJrZXlcIlxuICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgY29kZTogLTMyMDAwLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBkYXRhOiBudWxsXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblxuICAgIGV4cGVjdChyZXNwb25zZVtcImNvZGVcIl0pLnRvQmUoLTMyMDAwKVxuICAgIGV4cGVjdChyZXNwb25zZVtcIm1lc3NhZ2VcIl0pLnRvQmUobWVzc2FnZSlcbiAgfSlcblxuICB0ZXN0KFwiZ2V0QmFsYW5jZVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgYmFsYW5jZTogQk4gPSBuZXcgQk4oXCIxMDBcIiwgMTApXG4gICAgY29uc3QgdW5sb2NrZWQ6IEJOID0gbmV3IEJOKFwiMTAwXCIsIDEwKVxuICAgIGNvbnN0IGxvY2tlZFN0YWtlYWJsZTogQk4gPSBuZXcgQk4oXCIxMDBcIiwgMTApXG4gICAgY29uc3QgbG9ja2VkTm90U3Rha2VhYmxlOiBCTiA9IG5ldyBCTihcIjEwMFwiLCAxMClcbiAgICBjb25zdCByZXNwb2JqOiBHZXRCYWxhbmNlUmVzcG9uc2UgPSB7XG4gICAgICBiYWxhbmNlLFxuICAgICAgdW5sb2NrZWQsXG4gICAgICBsb2NrZWRTdGFrZWFibGUsXG4gICAgICBsb2NrZWROb3RTdGFrZWFibGUsXG4gICAgICB1dHhvSURzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eElEOiBcIkxVcmlCM1c5MTlGODRMd1BNTXc0c20yZlo0WTc2V2diNm1zYWF1RVk3aTF0Rk5tdHZcIixcbiAgICAgICAgICBvdXRwdXRJbmRleDogMFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxHZXRCYWxhbmNlUmVzcG9uc2U+ID0gYXBpLmdldEJhbGFuY2UoYWRkckEpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiByZXNwb2JqXG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogb2JqZWN0ID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpLnRvQmUoSlNPTi5zdHJpbmdpZnkocmVzcG9iaikpXG4gIH0pXG5cbiAgdGVzdChcImdldEN1cnJlbnRTdXBwbHlcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHN1cHBseTogQk4gPSBuZXcgQk4oXCIxMDAwMDAwMDAwMDAwXCIsIDEwKVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxCTj4gPSBhcGkuZ2V0Q3VycmVudFN1cHBseSgpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHN1cHBseVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IEJOID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZS50b1N0cmluZygxMCkpLnRvQmUoc3VwcGx5LnRvU3RyaW5nKDEwKSlcbiAgfSlcblxuICB0ZXN0KFwiZ2V0VmFsaWRhdG9yc0F0XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBoZWlnaHQ6IG51bWJlciA9IDBcbiAgICBjb25zdCBzdWJuZXRJRDogc3RyaW5nID0gXCIxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMUxwb1lZXCJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8R2V0VmFsaWRhdG9yc0F0UmVzcG9uc2U+ID0gYXBpLmdldFZhbGlkYXRvcnNBdChcbiAgICAgIGhlaWdodCxcbiAgICAgIHN1Ym5ldElEXG4gICAgKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICB2YWxpZGF0b3JzOiB7XG4gICAgICAgICAgXCJOb2RlSUQtN1hodzJtRHh1RFM0NGo0MlRDQjZVNTU3OWVzYlN0M0xnXCI6IDIwMDAwMDAwMDAwMDAwMDAsXG4gICAgICAgICAgXCJOb2RlSUQtR1dQY2JGSlpGZlpyZUVUU29XalBpbXI4NDZtWEVLQ3R1XCI6IDIwMDAwMDAwMDAwMDAwMDAsXG4gICAgICAgICAgXCJOb2RlSUQtTUZyWkZWQ1hQdjVpQ242TTlLNlhkdXhHVFlwODkxeFhaXCI6IDIwMDAwMDAwMDAwMDAwMDAsXG4gICAgICAgICAgXCJOb2RlSUQtTkZCYmJKNHFDbU5hQ3plVzdzeEVyaHZXcXZFUU1uWWNOXCI6IDIwMDAwMDAwMDAwMDAwMDAsXG4gICAgICAgICAgXCJOb2RlSUQtUDdvQjJNY2pCR2dXMk5YWFdWWWpWOEpFREZvVzl4REU1XCI6IDIwMDAwMDAwMDAwMDAwMDBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IEdldFZhbGlkYXRvcnNBdFJlc3BvbnNlID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICB9KVxuXG4gIHRlc3QoXCJnZXRIZWlnaHRcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGhlaWdodDogQk4gPSBuZXcgQk4oXCIxMDBcIiwgMTApXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEJOPiA9IGFwaS5nZXRIZWlnaHQoKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBoZWlnaHRcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBCTiA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UudG9TdHJpbmcoMTApKS50b0JlKGhlaWdodC50b1N0cmluZygxMCkpXG4gIH0pXG5cbiAgdGVzdChcImdldE1pblN0YWtlXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBtaW5TdGFrZTogQk4gPSBuZXcgQk4oXCIyMDAwMDAwMDAwMDAwXCIsIDEwKVxuICAgIGNvbnN0IG1pbkRlbGVnYXRlOiBCTiA9IG5ldyBCTihcIjI1MDAwMDAwMDAwXCIsIDEwKVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxHZXRNaW5TdGFrZVJlc3BvbnNlPiA9IGFwaS5nZXRNaW5TdGFrZSgpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIG1pblZhbGlkYXRvclN0YWtlOiBcIjIwMDAwMDAwMDAwMDBcIixcbiAgICAgICAgbWluRGVsZWdhdG9yU3Rha2U6IFwiMjUwMDAwMDAwMDBcIlxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IEdldE1pblN0YWtlUmVzcG9uc2UgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlW1wibWluVmFsaWRhdG9yU3Rha2VcIl0udG9TdHJpbmcoMTApKS50b0JlKFxuICAgICAgbWluU3Rha2UudG9TdHJpbmcoMTApXG4gICAgKVxuICAgIGV4cGVjdChyZXNwb25zZVtcIm1pbkRlbGVnYXRvclN0YWtlXCJdLnRvU3RyaW5nKDEwKSkudG9CZShcbiAgICAgIG1pbkRlbGVnYXRlLnRvU3RyaW5nKDEwKVxuICAgIClcbiAgfSlcblxuICB0ZXN0KFwiZ2V0U3Rha2VcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHN0YWtlZDogQk4gPSBuZXcgQk4oXCIxMDBcIiwgMTApXG4gICAgY29uc3Qgc3Rha2VkT3V0cHV0czogc3RyaW5nW10gPSBbXG4gICAgICBcIjB4MDAwMDIxZTY3MzE3Y2JjNGJlMmFlYjAwNjc3YWQ2NDYyNzc4YThmNTIyNzRiOWQ2MDVkZjI1OTFiMjMwMjdhODdkZmYwMDAwMDAxNjAwMDAwMDAwNjBiZDYxODAwMDAwMDAwNzAwMDAwMDBmYjc1MDQzMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWU3MDA2MGI3MDUxYTQ4MzhlYmU4ZTI5YmNiZTE0MDNkYjliODhjYzMxNjg5NWViM1wiLFxuICAgICAgXCIweDAwMDAyMWU2NzMxN2NiYzRiZTJhZWIwMDY3N2FkNjQ2Mjc3OGE4ZjUyMjc0YjlkNjA1ZGYyNTkxYjIzMDI3YTg3ZGZmMDAwMDAwMTYwMDAwMDAwMDYwYmQ2MTgwMDAwMDAwMDcwMDAwMDBkMThjMmUyODAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFlNzAwNjBiNzA1MWE0ODM4ZWJlOGUyOWJjYmUxNDAzZGI5Yjg4Y2MzNzE0ZGU3NTlcIixcbiAgICAgIFwiMHgwMDAwMjFlNjczMTdjYmM0YmUyYWViMDA2NzdhZDY0NjI3NzhhOGY1MjI3NGI5ZDYwNWRmMjU5MWIyMzAyN2E4N2RmZjAwMDAwMDE2MDAwMDAwMDA2MTM0MDg4MDAwMDAwMDA3MDAwMDAwMGZiNzUwNDMwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMTAwMDAwMDAxZTcwMDYwYjcwNTFhNDgzOGViZThlMjliY2JlMTQwM2RiOWI4OGNjMzc5Yjg5NDYxXCIsXG4gICAgICBcIjB4MDAwMDIxZTY3MzE3Y2JjNGJlMmFlYjAwNjc3YWQ2NDYyNzc4YThmNTIyNzRiOWQ2MDVkZjI1OTFiMjMwMjdhODdkZmYwMDAwMDAxNjAwMDAwMDAwNjEzNDA4ODAwMDAwMDAwNzAwMDAwMGQxOGMyZTI4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWU3MDA2MGI3MDUxYTQ4MzhlYmU4ZTI5YmNiZTE0MDNkYjliODhjYzNjN2FhMzVkMVwiLFxuICAgICAgXCIweDAwMDAyMWU2NzMxN2NiYzRiZTJhZWIwMDY3N2FkNjQ2Mjc3OGE4ZjUyMjc0YjlkNjA1ZGYyNTkxYjIzMDI3YTg3ZGZmMDAwMDAwMTYwMDAwMDAwMDYxMzQwODgwMDAwMDAwMDcwMDAwMDFkMWE5NGEyMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFlNzAwNjBiNzA1MWE0ODM4ZWJlOGUyOWJjYmUxNDAzZGI5Yjg4Y2MzOGZkMjMyZDhcIlxuICAgIF1cbiAgICBjb25zdCBvYmpzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IHN0YWtlZE91dHB1dHMubWFwKFxuICAgICAgKHN0YWtlZE91dHB1dDogc3RyaW5nKTogVHJhbnNmZXJhYmxlT3V0cHV0ID0+IHtcbiAgICAgICAgY29uc3QgdHJhbnNmZXJhYmxlT3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KClcbiAgICAgICAgbGV0IGJ1ZjogQnVmZmVyID0gQnVmZmVyLmZyb20oc3Rha2VkT3V0cHV0LnJlcGxhY2UoLzB4L2csIFwiXCIpLCBcImhleFwiKVxuICAgICAgICB0cmFuc2ZlcmFibGVPdXRwdXQuZnJvbUJ1ZmZlcihidWYsIDIpXG4gICAgICAgIHJldHVybiB0cmFuc2ZlcmFibGVPdXRwdXRcbiAgICAgIH1cbiAgICApXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPG9iamVjdD4gPSBhcGkuZ2V0U3Rha2UoW2FkZHJBXSwgXCJoZXhcIilcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgc3Rha2VkLFxuICAgICAgICBzdGFrZWRPdXRwdXRzXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogb2JqZWN0ID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChKU09OLnN0cmluZ2lmeShyZXNwb25zZVtcInN0YWtlZFwiXSkpLnRvQmUoSlNPTi5zdHJpbmdpZnkoc3Rha2VkKSlcbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VbXCJzdGFrZWRPdXRwdXRzXCJdKSkudG9CZShKU09OLnN0cmluZ2lmeShvYmpzKSlcbiAgfSlcblxuICB0ZXN0KFwiYWRkU3VibmV0VmFsaWRhdG9yIDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IG5vZGVJRDogc3RyaW5nID0gXCJhYmNkZWZcIlxuICAgIGNvbnN0IHN1Ym5ldElEOiBzdHJpbmcgPSBcIjRSNXAyUlhER0xxYWlmWkU0aEhXSDlvd2UzNHBmb0JVTG4xRHJRVFdpdmpnOG80YUhcIlxuICAgIGNvbnN0IHN0YXJ0VGltZTogRGF0ZSA9IG5ldyBEYXRlKDE5ODUsIDUsIDksIDEyLCA1OSwgNDMsIDkpXG4gICAgY29uc3QgZW5kVGltZTogRGF0ZSA9IG5ldyBEYXRlKDE5ODIsIDMsIDEsIDEyLCA1OCwgMzMsIDcpXG4gICAgY29uc3Qgd2VpZ2h0OiBudW1iZXIgPSAxM1xuICAgIGNvbnN0IHV0eDogc3RyaW5nID0gXCJ2YWxpZFwiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3Q+ID1cbiAgICAgIGFwaS5hZGRTdWJuZXRWYWxpZGF0b3IoXG4gICAgICAgIHVzZXJuYW1lLFxuICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgbm9kZUlELFxuICAgICAgICBzdWJuZXRJRCxcbiAgICAgICAgc3RhcnRUaW1lLFxuICAgICAgICBlbmRUaW1lLFxuICAgICAgICB3ZWlnaHRcbiAgICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdHhJRDogdXR4XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodXR4KVxuICB9KVxuXG4gIHRlc3QoXCJhZGRTdWJuZXRWYWxpZGF0b3JcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IG5vZGVJRDogc3RyaW5nID0gXCJhYmNkZWZcIlxuICAgIGNvbnN0IHN1Ym5ldElEOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcImFiY2RlZlwiLCBcImhleFwiKVxuICAgIGNvbnN0IHN0YXJ0VGltZTogRGF0ZSA9IG5ldyBEYXRlKDE5ODUsIDUsIDksIDEyLCA1OSwgNDMsIDkpXG4gICAgY29uc3QgZW5kVGltZTogRGF0ZSA9IG5ldyBEYXRlKDE5ODIsIDMsIDEsIDEyLCA1OCwgMzMsIDcpXG4gICAgY29uc3Qgd2VpZ2h0OiBudW1iZXIgPSAxM1xuICAgIGNvbnN0IHV0eDogc3RyaW5nID0gXCJ2YWxpZFwiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3Q+ID1cbiAgICAgIGFwaS5hZGRTdWJuZXRWYWxpZGF0b3IoXG4gICAgICAgIHVzZXJuYW1lLFxuICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgbm9kZUlELFxuICAgICAgICBzdWJuZXRJRCxcbiAgICAgICAgc3RhcnRUaW1lLFxuICAgICAgICBlbmRUaW1lLFxuICAgICAgICB3ZWlnaHRcbiAgICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdHhJRDogdXR4XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodXR4KVxuICB9KVxuXG4gIHRlc3QoXCJhZGREZWxlZ2F0b3IgMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgbm9kZUlEOiBzdHJpbmcgPSBcImFiY2RlZlwiXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gbmV3IERhdGUoMTk4NSwgNSwgOSwgMTIsIDU5LCA0MywgOSlcbiAgICBjb25zdCBlbmRUaW1lOiBEYXRlID0gbmV3IERhdGUoMTk4MiwgMywgMSwgMTIsIDU4LCAzMywgNylcbiAgICBjb25zdCBzdGFrZUFtb3VudDogQk4gPSBuZXcgQk4oMTMpXG4gICAgY29uc3QgcmV3YXJkQWRkcmVzczogc3RyaW5nID0gXCJmZWRjYmFcIlxuICAgIGNvbnN0IHV0eDogc3RyaW5nID0gXCJ2YWxpZFwiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuYWRkRGVsZWdhdG9yKFxuICAgICAgdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIG5vZGVJRCxcbiAgICAgIHN0YXJ0VGltZSxcbiAgICAgIGVuZFRpbWUsXG4gICAgICBzdGFrZUFtb3VudCxcbiAgICAgIHJld2FyZEFkZHJlc3NcbiAgICApXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHR4SUQ6IHV0eFxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodXR4KVxuICB9KVxuXG4gIHRlc3QoXCJnZXRCbG9ja2NoYWlucyAxXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCByZXNwOiBvYmplY3RbXSA9IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwibm9kZUlEXCIsXG4gICAgICAgIHN1Ym5ldElEOiBcInN1Ym5ldElEXCIsXG4gICAgICAgIHZtSUQ6IFwidm1JRFwiXG4gICAgICB9XG4gICAgXVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxCbG9ja2NoYWluW10+ID0gYXBpLmdldEJsb2NrY2hhaW5zKClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgYmxvY2tjaGFpbnM6IHJlc3BcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBCbG9ja2NoYWluW10gPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHJlc3ApXG4gIH0pXG5cbiAgdGVzdChcImdldFN1Ym5ldHMgMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgcmVzcDogb2JqZWN0W10gPSBbXG4gICAgICB7XG4gICAgICAgIGlkOiBcImlkXCIsXG4gICAgICAgIGNvbnRyb2xLZXlzOiBbXCJjb250cm9sS2V5c1wiXSxcbiAgICAgICAgdGhyZXNob2xkOiBcInRocmVzaG9sZFwiXG4gICAgICB9XG4gICAgXVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxTdWJuZXRbXT4gPSBhcGkuZ2V0U3VibmV0cygpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHN1Ym5ldHM6IHJlc3BcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBvYmplY3QgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0VxdWFsKHJlc3ApXG4gIH0pXG5cbiAgdGVzdChcImdldEN1cnJlbnRWYWxpZGF0b3JzIDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHZhbGlkYXRvcnM6IHN0cmluZ1tdID0gW1widmFsMVwiLCBcInZhbDJcIl1cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8b2JqZWN0PiA9IGFwaS5nZXRDdXJyZW50VmFsaWRhdG9ycygpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHZhbGlkYXRvcnNcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBvYmplY3QgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b1N0cmljdEVxdWFsKHsgdmFsaWRhdG9ycyB9KVxuICB9KVxuXG4gIHRlc3QoXCJnZXRDdXJyZW50VmFsaWRhdG9ycyAyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBzdWJuZXRJRDogc3RyaW5nID0gXCJhYmNkZWZcIlxuICAgIGNvbnN0IHZhbGlkYXRvcnM6IHN0cmluZ1tdID0gW1widmFsMVwiLCBcInZhbDJcIl1cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8b2JqZWN0PiA9IGFwaS5nZXRDdXJyZW50VmFsaWRhdG9ycyhzdWJuZXRJRClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdmFsaWRhdG9yc1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvU3RyaWN0RXF1YWwoeyB2YWxpZGF0b3JzIH0pXG4gIH0pXG5cbiAgdGVzdChcImdldEN1cnJlbnRWYWxpZGF0b3JzIDNcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHN1Ym5ldElEOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcImFiY2RlZlwiLCBcImhleFwiKVxuICAgIGNvbnN0IHZhbGlkYXRvcnM6IHN0cmluZ1tdID0gW1widmFsMVwiLCBcInZhbDJcIl1cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8b2JqZWN0PiA9IGFwaS5nZXRDdXJyZW50VmFsaWRhdG9ycyhzdWJuZXRJRClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdmFsaWRhdG9yc1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvU3RyaWN0RXF1YWwoeyB2YWxpZGF0b3JzIH0pXG4gIH0pXG5cbiAgdGVzdChcImV4cG9ydEtleVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qga2V5OiBzdHJpbmcgPSBcInNkZmdsdmxqMmgzdjQ1XCJcblxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0PiA9IGFwaS5leHBvcnRLZXkoXG4gICAgICB1c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgYWRkckFcbiAgICApXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHByaXZhdGVLZXk6IGtleVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3QgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKGtleSlcbiAgfSlcblxuICB0ZXN0KFwiZXhwb3J0REpUWFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgYW1vdW50OiBCTiA9IG5ldyBCTigxMDApXG4gICAgY29uc3QgdG86IHN0cmluZyA9IFwiYWJjZGVmXCJcbiAgICBjb25zdCB1c2VybmFtZTogc3RyaW5nID0gXCJSb2JlcnRcIlxuICAgIGNvbnN0IHBhc3N3b3JkOiBzdHJpbmcgPSBcIlBhdWxzb25cIlxuICAgIGNvbnN0IHR4SUQ6IHN0cmluZyA9IFwidmFsaWRcIlxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0PiA9IGFwaS5leHBvcnRESlRYKFxuICAgICAgdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIGFtb3VudCxcbiAgICAgIHRvXG4gICAgKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICB0eElEOiB0eElEXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodHhJRClcbiAgfSlcblxuICB0ZXN0KFwiaW1wb3J0REpUWFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgdG86IHN0cmluZyA9IFwiYWJjZGVmXCJcbiAgICBjb25zdCB1c2VybmFtZTogc3RyaW5nID0gXCJSb2JlcnRcIlxuICAgIGNvbnN0IHBhc3N3b3JkID0gXCJQYXVsc29uXCJcbiAgICBjb25zdCB0eElEID0gXCJ2YWxpZFwiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3Q+ID0gYXBpLmltcG9ydERKVFgoXG4gICAgICB1c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgdG8sXG4gICAgICBibG9ja2NoYWluSURcbiAgICApXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHR4SUQ6IHR4SURcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0ID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0eElEKVxuICB9KVxuXG4gIHRlc3QoXCJjcmVhdGVCbG9ja2NoYWluXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBibG9ja2NoYWluSUQ6IHN0cmluZyA9IFwiN3NpazNQcjZyMUZlTHJ2SzFvV3dFQ0JTOGlKNVZQdVNoXCJcbiAgICBjb25zdCB2bUlEOiBzdHJpbmcgPSBcIjdzaWszUHI2cjFGZUxydksxb1d3RUNCUzhpSjVWUHVTaFwiXG4gICAgY29uc3QgbmFtZTogc3RyaW5nID0gXCJTb21lIEJsb2NrY2hhaW5cIlxuICAgIGNvbnN0IGdlbmVzaXM6IHN0cmluZyA9ICd7cnVoOlwicm9oXCJ9J1xuICAgIGNvbnN0IHN1Ym5ldElEOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcImFiY2RlZlwiLCBcImhleFwiKVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0PiA9IGFwaS5jcmVhdGVCbG9ja2NoYWluKFxuICAgICAgdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIHN1Ym5ldElELFxuICAgICAgdm1JRCxcbiAgICAgIFsxLCAyLCAzXSxcbiAgICAgIG5hbWUsXG4gICAgICBnZW5lc2lzXG4gICAgKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICB0eElEOiBibG9ja2NoYWluSURcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0ID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShibG9ja2NoYWluSUQpXG4gIH0pXG5cbiAgdGVzdChcImdldEJsb2NrY2hhaW5TdGF0dXNcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGJsb2NrY2hhaW5JRDogc3RyaW5nID0gXCI3c2lrM1ByNnIxRmVMcnZLMW9Xd0VDQlM4aUo1VlB1U2hcIlxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmc+ID0gYXBpLmdldEJsb2NrY2hhaW5TdGF0dXMoYmxvY2tjaGFpbklEKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBzdGF0dXM6IFwiQWNjZXB0ZWRcIlxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoXCJBY2NlcHRlZFwiKVxuICB9KVxuXG4gIHRlc3QoXCJjcmVhdGVBZGRyZXNzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBhbGlhczogc3RyaW5nID0gXCJyYW5kb21hbGlhc1wiXG5cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGFwaS5jcmVhdGVBZGRyZXNzKHVzZXJuYW1lLCBwYXNzd29yZClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgYWRkcmVzczogYWxpYXNcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKGFsaWFzKVxuICB9KVxuXG4gIHRlc3QoXCJjcmVhdGVTdWJuZXQgMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgY29udHJvbEtleXM6IHN0cmluZ1tdID0gW1wiYWJjZGVmXCJdXG4gICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAxM1xuICAgIGNvbnN0IHV0eDogc3RyaW5nID0gXCJ2YWxpZFwiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3Q+ID0gYXBpLmNyZWF0ZVN1Ym5ldChcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBjb250cm9sS2V5cyxcbiAgICAgIHRocmVzaG9sZFxuICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdHhJRDogdXR4XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodXR4KVxuICB9KVxuXG4gIHRlc3QoXCJzYW1wbGVWYWxpZGF0b3JzIDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGxldCBzdWJuZXRJRFxuICAgIGNvbnN0IHZhbGlkYXRvcnM6IHN0cmluZ1tdID0gW1widmFsMVwiLCBcInZhbDJcIl1cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nW10+ID0gYXBpLnNhbXBsZVZhbGlkYXRvcnMoMTAsIHN1Ym5ldElEKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICB2YWxpZGF0b3JzXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nW10gPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHZhbGlkYXRvcnMpXG4gIH0pXG5cbiAgdGVzdChcInNhbXBsZVZhbGlkYXRvcnMgMlwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgc3VibmV0SUQ6IHN0cmluZyA9IFwiYWJjZGVmXCJcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBzdHJpbmdbXSA9IFtcInZhbDFcIiwgXCJ2YWwyXCJdXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZ1tdPiA9IGFwaS5zYW1wbGVWYWxpZGF0b3JzKDEwLCBzdWJuZXRJRClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdmFsaWRhdG9yc1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZ1tdID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh2YWxpZGF0b3JzKVxuICB9KVxuXG4gIHRlc3QoXCJzYW1wbGVWYWxpZGF0b3JzIDNcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHN1Ym5ldElEID0gQnVmZmVyLmZyb20oXCJhYmNkZWZcIiwgXCJoZXhcIilcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBzdHJpbmdbXSA9IFtcInZhbDFcIiwgXCJ2YWwyXCJdXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZ1tdPiA9IGFwaS5zYW1wbGVWYWxpZGF0b3JzKDEwLCBzdWJuZXRJRClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdmFsaWRhdG9yc1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZ1tdID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh2YWxpZGF0b3JzKVxuICB9KVxuXG4gIHRlc3QoXCJ2YWxpZGF0ZWRCeSAxXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBibG9ja2NoYWluSUQ6IHN0cmluZyA9IFwiYWJjZGVmXCJcbiAgICBjb25zdCByZXNwOiBzdHJpbmcgPSBcInZhbGlkXCJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGFwaS52YWxpZGF0ZWRCeShibG9ja2NoYWluSUQpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHN1Ym5ldElEOiByZXNwXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShyZXNwKVxuICB9KVxuXG4gIHRlc3QoXCJ2YWxpZGF0ZXMgMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgbGV0IHN1Ym5ldElEXG4gICAgY29uc3QgcmVzcDogc3RyaW5nW10gPSBbXCJ2YWxpZFwiXVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmdbXT4gPSBhcGkudmFsaWRhdGVzKHN1Ym5ldElEKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBibG9ja2NoYWluSURzOiByZXNwXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nW10gPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHJlc3ApXG4gIH0pXG5cbiAgdGVzdChcInZhbGlkYXRlcyAyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBzdWJuZXRJRDogc3RyaW5nID0gXCJkZWFkYmVlZlwiXG4gICAgY29uc3QgcmVzcDogc3RyaW5nW10gPSBbXCJ2YWxpZFwiXVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmdbXT4gPSBhcGkudmFsaWRhdGVzKHN1Ym5ldElEKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBibG9ja2NoYWluSURzOiByZXNwXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nW10gPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHJlc3ApXG4gIH0pXG5cbiAgdGVzdChcInZhbGlkYXRlcyAzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBzdWJuZXRJRCA9IEJ1ZmZlci5mcm9tKFwiYWJjZGVmXCIsIFwiaGV4XCIpXG4gICAgY29uc3QgcmVzcDogc3RyaW5nW10gPSBbXCJ2YWxpZFwiXVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmdbXT4gPSBhcGkudmFsaWRhdGVzKHN1Ym5ldElEKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBibG9ja2NoYWluSURzOiByZXNwXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nW10gPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHJlc3ApXG4gIH0pXG5cbiAgdGVzdChcImdldFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCB0eGlkOiBzdHJpbmcgPVxuICAgICAgXCJmOTY2NzUwZjQzODg2N2MzYzk4MjhkZGNkYmU2NjBlMjFjY2RiYjM2YTkyNzY5NThmMDExYmE0NzJmNzVkNGU3XCJcblxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmcgfCBvYmplY3Q+ID0gYXBpLmdldFR4KHR4aWQpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHR4OiBcInNvbWV0eFwiXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgb2JqZWN0ID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShcInNvbWV0eFwiKVxuICB9KVxuXG4gIHRlc3QoXCJnZXRUeFN0YXR1c1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgdHhpZDogc3RyaW5nID1cbiAgICAgIFwiZjk2Njc1MGY0Mzg4NjdjM2M5ODI4ZGRjZGJlNjYwZTIxY2NkYmIzNmE5Mjc2OTU4ZjAxMWJhNDcyZjc1ZDRlN1wiXG5cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgR2V0VHhTdGF0dXNSZXNwb25zZT4gPSBhcGkuZ2V0VHhTdGF0dXModHhpZClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IFwiYWNjZXB0ZWRcIlxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyB8IEdldFR4U3RhdHVzUmVzcG9uc2UgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKFwiYWNjZXB0ZWRcIilcbiAgfSlcblxuICB0ZXN0KFwiZ2V0VVRYT3NcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIC8vIFBheW1lbnRcbiAgICBjb25zdCBPUFVUWE9zdHIxOiBzdHJpbmcgPSBiaW50b29scy5jYjU4RW5jb2RlKFxuICAgICAgQnVmZmVyLmZyb20oXG4gICAgICAgIFwiMDAwMDM4ZDFiOWYxMTM4NjcyZGE2ZmI2YzM1MTI1NTM5Mjc2YTlhY2MyYTY2OGQ2M2JlYTZiYTNjNzk1ZTJlZGIwZjUwMDAwMDAwMTNlMDdlMzhlMmYyMzEyMWJlODc1NjQxMmMxOGRiNzI0NmExNmQyNmVlOTkzNmYzY2JhMjhiZTE0OWNmZDM1NTgwMDAwMDAwNzAwMDAwMDAwMDAwMDRkZDUwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWEzNmZkMGMyZGJjYWIzMTE3MzFkZGU3ZWYxNTE0YmQyNmZjZGM3NGRcIixcbiAgICAgICAgXCJoZXhcIlxuICAgICAgKVxuICAgIClcbiAgICBjb25zdCBPUFVUWE9zdHIyOiBzdHJpbmcgPSBiaW50b29scy5jYjU4RW5jb2RlKFxuICAgICAgQnVmZmVyLmZyb20oXG4gICAgICAgIFwiMDAwMGMzZTQ4MjM1NzE1ODdmZTJiZGZjNTAyNjg5ZjVhODIzOGI5ZDBlYTdmMzI3NzEyNGQxNmFmOWRlMGQyZDk5MTEwMDAwMDAwMDNlMDdlMzhlMmYyMzEyMWJlODc1NjQxMmMxOGRiNzI0NmExNmQyNmVlOTkzNmYzY2JhMjhiZTE0OWNmZDM1NTgwMDAwMDAwNzAwMDAwMDAwMDAwMDAwMTkwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWUxYjZiNmE0YmFkOTRkMmUzZjIwNzMwMzc5YjliY2Q2ZjE3NjMxOGVcIixcbiAgICAgICAgXCJoZXhcIlxuICAgICAgKVxuICAgIClcbiAgICBjb25zdCBPUFVUWE9zdHIzOiBzdHJpbmcgPSBiaW50b29scy5jYjU4RW5jb2RlKFxuICAgICAgQnVmZmVyLmZyb20oXG4gICAgICAgIFwiMDAwMGYyOWRiYTYxZmRhOGQ1N2E5MTFlN2Y4ODEwZjkzNWJkZTgxMGQzZjhkNDk1NDA0Njg1YmRiOGQ5ZDg1NDVlODYwMDAwMDAwMDNlMDdlMzhlMmYyMzEyMWJlODc1NjQxMmMxOGRiNzI0NmExNmQyNmVlOTkzNmYzY2JhMjhiZTE0OWNmZDM1NTgwMDAwMDAwNzAwMDAwMDAwMDAwMDAwMTkwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWUxYjZiNmE0YmFkOTRkMmUzZjIwNzMwMzc5YjliY2Q2ZjE3NjMxOGVcIixcbiAgICAgICAgXCJoZXhcIlxuICAgICAgKVxuICAgIClcblxuICAgIGNvbnN0IHNldDogVVRYT1NldCA9IG5ldyBVVFhPU2V0KClcbiAgICBzZXQuYWRkKE9QVVRYT3N0cjEpXG4gICAgc2V0LmFkZEFycmF5KFtPUFVUWE9zdHIyLCBPUFVUWE9zdHIzXSlcblxuICAgIGNvbnN0IHBlcnNpc3RPcHRzOiBQZXJzaXN0YW5jZU9wdGlvbnMgPSBuZXcgUGVyc2lzdGFuY2VPcHRpb25zKFxuICAgICAgXCJ0ZXN0XCIsXG4gICAgICB0cnVlLFxuICAgICAgXCJ1bmlvblwiXG4gICAgKVxuICAgIGV4cGVjdChwZXJzaXN0T3B0cy5nZXRNZXJnZVJ1bGUoKSkudG9CZShcInVuaW9uXCIpXG4gICAgbGV0IGFkZHJlc3Nlczogc3RyaW5nW10gPSBzZXRcbiAgICAgIC5nZXRBZGRyZXNzZXMoKVxuICAgICAgLm1hcCgoYSk6IHN0cmluZyA9PiBhcGkuYWRkcmVzc0Zyb21CdWZmZXIoYSkpXG4gICAgbGV0IHJlc3VsdDogUHJvbWlzZTxHZXRVVFhPc1Jlc3BvbnNlPiA9IGFwaS5nZXRVVFhPcyhcbiAgICAgIGFkZHJlc3NlcyxcbiAgICAgIGFwaS5nZXRCbG9ja2NoYWluSUQoKSxcbiAgICAgIDAsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBwZXJzaXN0T3B0c1xuICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgbnVtRmV0Y2hlZDogMyxcbiAgICAgICAgdXR4b3M6IFtPUFVUWE9zdHIxLCBPUFVUWE9zdHIyLCBPUFVUWE9zdHIzXSxcbiAgICAgICAgc3RvcEluZGV4OiB7IGFkZHJlc3M6IFwiYVwiLCB1dHhvOiBcImJcIiB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBsZXQgcmVzcG9uc2U6IFVUWE9TZXQgPSAoYXdhaXQgcmVzdWx0KS51dHhvc1xuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuZ2V0QWxsVVRYT1N0cmluZ3MoKS5zb3J0KCkpKS50b0JlKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoc2V0LmdldEFsbFVUWE9TdHJpbmdzKCkuc29ydCgpKVxuICAgIClcblxuICAgIGFkZHJlc3NlcyA9IHNldC5nZXRBZGRyZXNzZXMoKS5tYXAoKGEpID0+IGFwaS5hZGRyZXNzRnJvbUJ1ZmZlcihhKSlcbiAgICByZXN1bHQgPSBhcGkuZ2V0VVRYT3MoXG4gICAgICBhZGRyZXNzZXMsXG4gICAgICBhcGkuZ2V0QmxvY2tjaGFpbklEKCksXG4gICAgICAwLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgcGVyc2lzdE9wdHNcbiAgICApXG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIHJlc3BvbnNlID0gKGF3YWl0IHJlc3VsdCkudXR4b3NcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpXG4gICAgZXhwZWN0KEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmdldEFsbFVUWE9TdHJpbmdzKCkuc29ydCgpKSkudG9CZShcbiAgICAgIEpTT04uc3RyaW5naWZ5KHNldC5nZXRBbGxVVFhPU3RyaW5ncygpLnNvcnQoKSlcbiAgICApXG4gIH0pXG5cbiAgZGVzY3JpYmUoXCJUcmFuc2FjdGlvbnNcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGxldCBzZXQ6IFVUWE9TZXRcbiAgICBsZXQgbHNldDogVVRYT1NldFxuICAgIGxldCBrZXltZ3IyOiBLZXlDaGFpblxuICAgIGxldCBrZXltZ3IzOiBLZXlDaGFpblxuICAgIGxldCBhZGRyczE6IHN0cmluZ1tdXG4gICAgbGV0IGFkZHJzMjogc3RyaW5nW11cbiAgICBsZXQgYWRkcnMzOiBzdHJpbmdbXVxuICAgIGxldCBhZGRyZXNzYnVmZnM6IEJ1ZmZlcltdID0gW11cbiAgICBsZXQgYWRkcmVzc2VzOiBzdHJpbmdbXSA9IFtdXG4gICAgbGV0IHV0eG9zOiBVVFhPW11cbiAgICBsZXQgbHV0eG9zOiBVVFhPW11cbiAgICBsZXQgaW5wdXRzOiBUcmFuc2ZlcmFibGVJbnB1dFtdXG4gICAgbGV0IG91dHB1dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdXG4gICAgY29uc3QgYW1udDogbnVtYmVyID0gMTAwMDBcbiAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIikudXBkYXRlKFwibWFyeSBoYWQgYSBsaXR0bGUgbGFtYlwiKS5kaWdlc3QoKVxuICAgIClcbiAgICBsZXQgc2VjcGJhc2UxOiBTRUNQVHJhbnNmZXJPdXRwdXRcbiAgICBsZXQgc2VjcGJhc2UyOiBTRUNQVHJhbnNmZXJPdXRwdXRcbiAgICBsZXQgc2VjcGJhc2UzOiBTRUNQVHJhbnNmZXJPdXRwdXRcbiAgICBsZXQgZnVuZ3V0eG9pZHM6IHN0cmluZ1tdID0gW11cbiAgICBsZXQgcGxhdGZvcm12bTogUGxhdGZvcm1WTUFQSVxuICAgIGNvbnN0IGZlZTogbnVtYmVyID0gMTBcbiAgICBjb25zdCBuYW1lOiBzdHJpbmcgPSBcIk1vcnR5Y29pbiBpcyB0aGUgZHVtYiBhcyBhIHNhY2sgb2YgaGFtbWVycy5cIlxuICAgIGNvbnN0IHN5bWJvbDogc3RyaW5nID0gXCJtb3JUXCJcbiAgICBjb25zdCBkZW5vbWluYXRpb246IG51bWJlciA9IDhcblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgcGxhdGZvcm12bSA9IG5ldyBQbGF0Zm9ybVZNQVBJKGF2YWxhbmNoZSwgXCIvZXh0L2JjL1BcIilcbiAgICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxCdWZmZXI+ID0gcGxhdGZvcm12bS5nZXRESlRYQXNzZXRJRCgpXG4gICAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgc3ltYm9sLFxuICAgICAgICAgIGFzc2V0SUQ6IGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRCksXG4gICAgICAgICAgZGVub21pbmF0aW9uOiBgJHtkZW5vbWluYXRpb259YFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiBwYXlsb2FkXG4gICAgICB9XG5cbiAgICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgICBhd2FpdCByZXN1bHRcbiAgICAgIHNldCA9IG5ldyBVVFhPU2V0KClcbiAgICAgIGxzZXQgPSBuZXcgVVRYT1NldCgpXG4gICAgICBwbGF0Zm9ybXZtLm5ld0tleUNoYWluKClcbiAgICAgIGtleW1ncjIgPSBuZXcgS2V5Q2hhaW4oYXZhbGFuY2hlLmdldEhSUCgpLCBhbGlhcylcbiAgICAgIGtleW1ncjMgPSBuZXcgS2V5Q2hhaW4oYXZhbGFuY2hlLmdldEhSUCgpLCBhbGlhcylcbiAgICAgIGFkZHJzMSA9IFtdXG4gICAgICBhZGRyczIgPSBbXVxuICAgICAgYWRkcnMzID0gW11cbiAgICAgIHV0eG9zID0gW11cbiAgICAgIGx1dHhvcyA9IFtdXG4gICAgICBpbnB1dHMgPSBbXVxuICAgICAgb3V0cHV0cyA9IFtdXG4gICAgICBmdW5ndXR4b2lkcyA9IFtdXG4gICAgICBjb25zdCBwbG9hZDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDEwMjQpXG4gICAgICBwbG9hZC53cml0ZShcbiAgICAgICAgXCJBbGwgeW91IFRyZWtraWVzIGFuZCBUViBhZGRpY3RzLCBEb24ndCBtZWFuIHRvIGRpc3MgZG9uJ3QgbWVhbiB0byBicmluZyBzdGF0aWMuXCIsXG4gICAgICAgIDAsXG4gICAgICAgIDEwMjQsXG4gICAgICAgIFwidXRmOFwiXG4gICAgICApXG5cbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgYWRkcnMxLnB1c2goXG4gICAgICAgICAgcGxhdGZvcm12bS5hZGRyZXNzRnJvbUJ1ZmZlcihcbiAgICAgICAgICAgIHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKS5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICAgIGFkZHJzMi5wdXNoKFxuICAgICAgICAgIHBsYXRmb3Jtdm0uYWRkcmVzc0Zyb21CdWZmZXIoa2V5bWdyMi5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpKVxuICAgICAgICApXG4gICAgICAgIGFkZHJzMy5wdXNoKFxuICAgICAgICAgIHBsYXRmb3Jtdm0uYWRkcmVzc0Zyb21CdWZmZXIoa2V5bWdyMy5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpKVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBjb25zdCBhbW91bnQ6IEJOID0gT05FREpUWC5tdWwobmV3IEJOKGFtbnQpKVxuICAgICAgYWRkcmVzc2J1ZmZzID0gcGxhdGZvcm12bS5rZXlDaGFpbigpLmdldEFkZHJlc3NlcygpXG4gICAgICBhZGRyZXNzZXMgPSBhZGRyZXNzYnVmZnMubWFwKChhKSA9PiBwbGF0Zm9ybXZtLmFkZHJlc3NGcm9tQnVmZmVyKGEpKVxuICAgICAgY29uc3QgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDU0MzIxKVxuICAgICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAzXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgIGxldCB0eGlkOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgICAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAgICAgICAudXBkYXRlKGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG5ldyBCTihpKSwgMzIpKVxuICAgICAgICAgICAgLmRpZ2VzdCgpXG4gICAgICAgIClcbiAgICAgICAgbGV0IHR4aWR4OiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcbiAgICAgICAgdHhpZHgud3JpdGVVSW50MzJCRShpLCAwKVxuXG4gICAgICAgIGNvbnN0IG91dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgICAgICBhbW91bnQsXG4gICAgICAgICAgYWRkcmVzc2J1ZmZzLFxuICAgICAgICAgIGxvY2t0aW1lLFxuICAgICAgICAgIHRocmVzaG9sZFxuICAgICAgICApXG4gICAgICAgIGNvbnN0IHhmZXJvdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoYXNzZXRJRCwgb3V0KVxuICAgICAgICBvdXRwdXRzLnB1c2goeGZlcm91dClcblxuICAgICAgICBjb25zdCB1OiBVVFhPID0gbmV3IFVUWE8oKVxuICAgICAgICB1LmZyb21CdWZmZXIoXG4gICAgICAgICAgQnVmZmVyLmNvbmNhdChbdS5nZXRDb2RlY0lEQnVmZmVyKCksIHR4aWQsIHR4aWR4LCB4ZmVyb3V0LnRvQnVmZmVyKCldKVxuICAgICAgICApXG4gICAgICAgIGZ1bmd1dHhvaWRzLnB1c2godS5nZXRVVFhPSUQoKSlcbiAgICAgICAgdXR4b3MucHVzaCh1KVxuXG4gICAgICAgIHR4aWQgPSB1LmdldFR4SUQoKVxuICAgICAgICB0eGlkeCA9IHUuZ2V0T3V0cHV0SWR4KClcbiAgICAgICAgY29uc3QgYXNzZXQgPSB1LmdldEFzc2V0SUQoKVxuXG4gICAgICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChhbW91bnQpXG4gICAgICAgIGNvbnN0IHhmZXJpbnB1dDogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoXG4gICAgICAgICAgdHhpZCxcbiAgICAgICAgICB0eGlkeCxcbiAgICAgICAgICBhc3NldCxcbiAgICAgICAgICBpbnB1dFxuICAgICAgICApXG4gICAgICAgIGlucHV0cy5wdXNoKHhmZXJpbnB1dClcbiAgICAgIH1cbiAgICAgIHNldC5hZGRBcnJheSh1dHhvcylcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgbGV0IHR4aWQ6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAgIC51cGRhdGUoYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKGkpLCAzMikpXG4gICAgICAgICAgICAuZGlnZXN0KClcbiAgICAgICAgKVxuICAgICAgICBsZXQgdHhpZHg6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxuICAgICAgICB0eGlkeC53cml0ZVVJbnQzMkJFKGksIDApXG5cbiAgICAgICAgY29uc3Qgb3V0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICAgIE9ORURKVFgubXVsKG5ldyBCTig1KSksXG4gICAgICAgICAgYWRkcmVzc2J1ZmZzLFxuICAgICAgICAgIGxvY2t0aW1lLFxuICAgICAgICAgIDFcbiAgICAgICAgKVxuICAgICAgICBjb25zdCBwb3V0OiBQYXJzZWFibGVPdXRwdXQgPSBuZXcgUGFyc2VhYmxlT3V0cHV0KG91dClcbiAgICAgICAgY29uc3QgbG9ja291dDogU3Rha2VhYmxlTG9ja091dCA9IG5ldyBTdGFrZWFibGVMb2NrT3V0KFxuICAgICAgICAgIE9ORURKVFgubXVsKG5ldyBCTig1KSksXG4gICAgICAgICAgYWRkcmVzc2J1ZmZzLFxuICAgICAgICAgIGxvY2t0aW1lLFxuICAgICAgICAgIDEsXG4gICAgICAgICAgbG9ja3RpbWUuYWRkKG5ldyBCTig4NjQwMCkpLFxuICAgICAgICAgIHBvdXRcbiAgICAgICAgKVxuICAgICAgICBjb25zdCB4ZmVyb3V0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxuICAgICAgICAgIGFzc2V0SUQsXG4gICAgICAgICAgbG9ja291dFxuICAgICAgICApXG5cbiAgICAgICAgY29uc3QgdTogVVRYTyA9IG5ldyBVVFhPKClcbiAgICAgICAgdS5mcm9tQnVmZmVyKFxuICAgICAgICAgIEJ1ZmZlci5jb25jYXQoW3UuZ2V0Q29kZWNJREJ1ZmZlcigpLCB0eGlkLCB0eGlkeCwgeGZlcm91dC50b0J1ZmZlcigpXSlcbiAgICAgICAgKVxuICAgICAgICBsdXR4b3MucHVzaCh1KVxuICAgICAgfVxuXG4gICAgICBsc2V0LmFkZEFycmF5KGx1dHhvcylcbiAgICAgIGxzZXQuYWRkQXJyYXkoc2V0LmdldEFsbFVUWE9zKCkpXG5cbiAgICAgIHNlY3BiYXNlMSA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICAgIG5ldyBCTig3NzcpLFxuICAgICAgICBhZGRyczMubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIFVuaXhOb3coKSxcbiAgICAgICAgMVxuICAgICAgKVxuICAgICAgc2VjcGJhc2UyID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgICAgbmV3IEJOKDg4OCksXG4gICAgICAgIGFkZHJzMi5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKSxcbiAgICAgICAgVW5peE5vdygpLFxuICAgICAgICAxXG4gICAgICApXG4gICAgICBzZWNwYmFzZTMgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBuZXcgQk4oOTk5KSxcbiAgICAgICAgYWRkcnMyLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBVbml4Tm93KCksXG4gICAgICAgIDFcbiAgICAgIClcbiAgICB9KVxuXG4gICAgdGVzdChcInNpZ25UeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBhd2FpdCBwbGF0Zm9ybXZtLmdldERKVFhBc3NldElEKClcbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRCYXNlVHgoXG4gICAgICAgIG5ldHdvcmtJRCxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxuICAgICAgICBuZXcgQk4oYW1udCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIGFkZHJzMy5tYXAoKGEpOiBCdWZmZXIgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBhZGRyczEubWFwKChhKTogQnVmZmVyID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKSxcbiAgICAgICAgYWRkcnMxLm1hcCgoYSk6IEJ1ZmZlciA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIHBsYXRmb3Jtdm0uZ2V0VHhGZWUoKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICBVbml4Tm93KCksXG4gICAgICAgIG5ldyBCTigwKSxcbiAgICAgICAgMVxuICAgICAgKVxuXG4gICAgICB0eHUyLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxuICAgIH0pXG5cbiAgICB0ZXN0KFwiYnVpbGRJbXBvcnRUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oMClcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMVxuICAgICAgcGxhdGZvcm12bS5zZXRUeEZlZShuZXcgQk4oZmVlKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMSA9IGFkZHJzMS5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYyID0gYWRkcnMyLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhZGRyYnVmZjMgPSBhZGRyczMubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGZ1bmd1dHhvOiBVVFhPID0gc2V0LmdldFVUWE8oZnVuZ3V0eG9pZHNbMV0pXG4gICAgICBjb25zdCBmdW5ndXR4b3N0cjogc3RyaW5nID0gZnVuZ3V0eG8udG9TdHJpbmcoKVxuXG4gICAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8VW5zaWduZWRUeD4gPSBwbGF0Zm9ybXZtLmJ1aWxkSW1wb3J0VHgoXG4gICAgICAgIHNldCxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBQbGF0Zm9ybUNoYWluSUQsXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczIsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLFxuICAgICAgICBVbml4Tm93KCksXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICB0aHJlc2hvbGRcbiAgICAgIClcbiAgICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgdXR4b3M6IFtmdW5ndXR4b3N0cl1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcGF5bG9hZFxuICAgICAgfVxuXG4gICAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkSW1wb3J0VHgoXG4gICAgICAgIG5ldHdvcmtJRCxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxuICAgICAgICBhZGRyYnVmZjMsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgYWRkcmJ1ZmYyLFxuICAgICAgICBbZnVuZ3V0eG9dLFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKFBsYXRmb3JtQ2hhaW5JRCksXG4gICAgICAgIHBsYXRmb3Jtdm0uZ2V0VHhGZWUoKSxcbiAgICAgICAgYXdhaXQgcGxhdGZvcm12bS5nZXRESlRYQXNzZXRJRCgpLFxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICAgIFVuaXhOb3coKSxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZFxuICAgICAgKVxuXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcbiAgICAgIGNvbnN0IGNoZWNrVHg6IHN0cmluZyA9IHR4MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDFvYmo6IG9iamVjdCA9IHR4MS5zZXJpYWxpemUoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxuXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxuXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcblxuICAgICAgY29uc3QgdHgzOiBUeCA9IHR4dTEuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcbiAgICAgIGNvbnN0IHR4M3N0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgzb2JqKVxuXG4gICAgICBjb25zdCB0eDRuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgzc3RyKVxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDQuZGVzZXJpYWxpemUodHg0bmV3b2JqLCBkaXNwbGF5KVxuXG4gICAgICBleHBlY3QodHg0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcblxuICAgICAgc2VyaWFsemVpdCh0eDEsIFwiSW1wb3J0VHhcIilcbiAgICB9KVxuXG4gICAgdGVzdChcImJ1aWxkRXhwb3J0VHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgcGxhdGZvcm12bS5zZXRUeEZlZShuZXcgQk4oZmVlKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMSA9IGFkZHJzMS5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYyID0gYWRkcnMyLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhZGRyYnVmZjMgPSBhZGRyczMubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFtb3VudDogQk4gPSBuZXcgQk4oOTApXG4gICAgICBjb25zdCB0eXBlOiBTZXJpYWxpemVkVHlwZSA9IFwiYmVjaDMyXCJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkRXhwb3J0VHgoXG4gICAgICAgIHNldCxcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgICAgIERlZmF1bHRzLm5ldHdvcmtbYXZhbGFuY2hlLmdldE5ldHdvcmtJRCgpXS5YW1wiYmxvY2tjaGFpbklEXCJdXG4gICAgICAgICksXG4gICAgICAgIGFkZHJidWZmMy5tYXAoKGEpID0+XG4gICAgICAgICAgc2VyaWFsaXplci5idWZmZXJUb1R5cGUoYSwgdHlwZSwgYXZhbGFuY2hlLmdldEhSUCgpLCBcIlBcIilcbiAgICAgICAgKSxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczIsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLFxuICAgICAgICBVbml4Tm93KClcbiAgICAgIClcblxuICAgICAgY29uc3QgdHh1MjogVW5zaWduZWRUeCA9IHNldC5idWlsZEV4cG9ydFR4KFxuICAgICAgICBuZXR3b3JrSUQsXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBhc3NldElELFxuICAgICAgICBhZGRyYnVmZjMsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgYWRkcmJ1ZmYyLFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgICAgIERlZmF1bHRzLm5ldHdvcmtbYXZhbGFuY2hlLmdldE5ldHdvcmtJRCgpXS5YW1wiYmxvY2tjaGFpbklEXCJdXG4gICAgICAgICksXG4gICAgICAgIHBsYXRmb3Jtdm0uZ2V0VHhGZWUoKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxuICAgICAgICBVbml4Tm93KClcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHR4dTIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgICAgdHh1MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICApXG4gICAgICBleHBlY3QodHh1Mi50b1N0cmluZygpKS50b0JlKHR4dTEudG9TdHJpbmcoKSlcblxuICAgICAgY29uc3QgdHh1MzogVW5zaWduZWRUeCA9IGF3YWl0IHBsYXRmb3Jtdm0uYnVpbGRFeHBvcnRUeChcbiAgICAgICAgc2V0LFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICAgICAgRGVmYXVsdHMubmV0d29ya1thdmFsYW5jaGUuZ2V0TmV0d29ya0lEKCldLlhbXCJibG9ja2NoYWluSURcIl1cbiAgICAgICAgKSxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHU0OiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkRXhwb3J0VHgoXG4gICAgICAgIG5ldHdvcmtJRCxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIGFkZHJidWZmMyxcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBhZGRyYnVmZjIsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgcGxhdGZvcm12bS5nZXRUeEZlZSgpLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuXG4gICAgICBleHBlY3QodHh1NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUzLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHU0LnRvU3RyaW5nKCkpLnRvQmUodHh1My50b1N0cmluZygpKVxuXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcbiAgICAgIGNvbnN0IGNoZWNrVHg6IHN0cmluZyA9IHR4MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDFvYmo6IG9iamVjdCA9IHR4MS5zZXJpYWxpemUoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxuXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxuXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcblxuICAgICAgY29uc3QgdHgzOiBUeCA9IHR4dTEuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcbiAgICAgIGNvbnN0IHR4M3N0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgzb2JqKVxuXG4gICAgICBjb25zdCB0eDRuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgzc3RyKVxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDQuZGVzZXJpYWxpemUodHg0bmV3b2JqLCBkaXNwbGF5KVxuXG4gICAgICBleHBlY3QodHg0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcblxuICAgICAgc2VyaWFsemVpdCh0eDEsIFwiRXhwb3J0VHhcIilcbiAgICB9KVxuICAgIC8qXG4gICAgICAgIHRlc3QoJ2J1aWxkQWRkU3VibmV0VmFsaWRhdG9yVHgnLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICAgICAgcGxhdGZvcm12bS5zZXRGZWUobmV3IEJOKGZlZSkpO1xuICAgICAgICAgIGNvbnN0IGFkZHJidWZmMSA9IGFkZHJzMS5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKTtcbiAgICAgICAgICBjb25zdCBhZGRyYnVmZjIgPSBhZGRyczIubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSk7XG4gICAgICAgICAgY29uc3QgYWRkcmJ1ZmYzID0gYWRkcnMzLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpO1xuICAgICAgICAgIGNvbnN0IGFtb3VudDpCTiA9IG5ldyBCTig5MCk7XG5cbiAgICAgICAgICBjb25zdCB0eHUxOlVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkQWRkU3VibmV0VmFsaWRhdG9yVHgoXG4gICAgICAgICAgICBzZXQsXG4gICAgICAgICAgICBhZGRyczEsXG4gICAgICAgICAgICBhZGRyczIsXG4gICAgICAgICAgICBub2RlSUQsXG4gICAgICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgICAgICBlbmRUaW1lLFxuICAgICAgICAgICAgUGxhdGZvcm1WTUNvbnN0YW50cy5NSU5TVEFLRSxcbiAgICAgICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLCBVbml4Tm93KClcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgY29uc3QgdHh1MjpVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQWRkU3VibmV0VmFsaWRhdG9yVHgoXG4gICAgICAgICAgICBuZXR3b3JrSUQsIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcbiAgICAgICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgICAgIGFkZHJidWZmMixcbiAgICAgICAgICAgIE5vZGVJRFN0cmluZ1RvQnVmZmVyKG5vZGVJRCksXG4gICAgICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgICAgICBlbmRUaW1lLFxuICAgICAgICAgICAgUGxhdGZvcm1WTUNvbnN0YW50cy5NSU5TVEFLRSxcbiAgICAgICAgICAgIHBsYXRmb3Jtdm0uZ2V0RmVlKCksXG4gICAgICAgICAgICBhc3NldElELFxuICAgICAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLCBVbml4Tm93KClcbiAgICAgICAgICApO1xuICAgICAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoJ2hleCcpKS50b0JlKHR4dTEudG9CdWZmZXIoKS50b1N0cmluZygnaGV4JykpO1xuICAgICAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKTtcblxuICAgICAgICB9KTtcbiAgICAqL1xuICAgIHRlc3QoXCJidWlsZEFkZERlbGVnYXRvclR4IDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgY29uc3QgYWRkcmJ1ZmYxID0gYWRkcnMxLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhZGRyYnVmZjIgPSBhZGRyczIubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMyA9IGFkZHJzMy5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYW1vdW50OiBCTiA9IERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIlBcIl0ubWluRGVsZWdhdGlvblN0YWtlXG5cbiAgICAgIGNvbnN0IGxvY2t0aW1lOiBCTiA9IG5ldyBCTig1NDMyMSlcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMlxuXG4gICAgICBwbGF0Zm9ybXZtLnNldE1pblN0YWtlKFxuICAgICAgICBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJRF1bXCJQXCJdLm1pblN0YWtlLFxuICAgICAgICBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJRF1bXCJQXCJdLm1pbkRlbGVnYXRpb25TdGFrZVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZEFkZERlbGVnYXRvclR4KFxuICAgICAgICBzZXQsXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczIsXG4gICAgICAgIG5vZGVJRCxcbiAgICAgICAgc3RhcnRUaW1lLFxuICAgICAgICBlbmRUaW1lLFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZCxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQWRkRGVsZWdhdG9yVHgoXG4gICAgICAgIG5ldHdvcmtJRCxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBhZGRyYnVmZjMsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgYWRkcmJ1ZmYyLFxuICAgICAgICBOb2RlSURTdHJpbmdUb0J1ZmZlcihub2RlSUQpLFxuICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgIGVuZFRpbWUsXG4gICAgICAgIGFtb3VudCxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZCxcbiAgICAgICAgYWRkcmJ1ZmYzLFxuICAgICAgICBuZXcgQk4oMCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcbiAgICAgIGNvbnN0IGNoZWNrVHg6IHN0cmluZyA9IHR4MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDFvYmo6IG9iamVjdCA9IHR4MS5zZXJpYWxpemUoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxuXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxuXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcblxuICAgICAgY29uc3QgdHgzOiBUeCA9IHR4dTEuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcbiAgICAgIGNvbnN0IHR4M3N0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgzb2JqKVxuXG4gICAgICBjb25zdCB0eDRuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgzc3RyKVxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDQuZGVzZXJpYWxpemUodHg0bmV3b2JqLCBkaXNwbGF5KVxuXG4gICAgICBleHBlY3QodHg0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcblxuICAgICAgc2VyaWFsemVpdCh0eDEsIFwiQWRkRGVsZWdhdG9yVHhcIilcbiAgICB9KVxuXG4gICAgdGVzdChcImJ1aWxkQWRkVmFsaWRhdG9yVHggc29ydCBTdGFrZWFibGVMb2NrT3V0cyAxXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIC8vIHR3byBVVFhPLiBUaGUgMXN0IGhhcyBhIGxlc3NlciBzdGFrZWFibGVsb2NrdGltZSBhbmQgYSBncmVhdGVyIGFtb3VudCBvZiBESlRYLiBUaGUgMm5kIGhhcyBhIGdyZWF0ZXIgc3Rha2VhYmxlbG9ja3RpbWUgYW5kIGEgbGVzc2VyIGFtb3VudCBvZiBESlRYLlxuICAgICAgLy8gV2UgZXhwZWN0IHRoaXMgdGVzdCB0byBvbmx5IGNvbnN1bWUgdGhlIDJuZCBVVFhPIHNpbmNlIGl0IGhhcyB0aGUgZ3JlYXRlciBsb2NrdGltZS5cbiAgICAgIGNvbnN0IGFkZHJidWZmMTogQnVmZmVyW10gPSBhZGRyczEubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFtb3VudDE6IEJOID0gbmV3IEJOKFwiMjAwMDAwMDAwMDAwMDAwMDBcIilcbiAgICAgIGNvbnN0IGFtb3VudDI6IEJOID0gbmV3IEJOKFwiMTAwMDAwMDAwMDAwMDAwMDBcIilcbiAgICAgIGNvbnN0IGxvY2t0aW1lMTogQk4gPSBuZXcgQk4oMClcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMVxuXG4gICAgICBjb25zdCBzdGFrZWFibGVMb2NrVGltZTE6IEJOID0gbmV3IEJOKDE2MzM4MjQwMDApXG4gICAgICBjb25zdCBzZWNwVHJhbnNmZXJPdXRwdXQxOiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBhbW91bnQxLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGxvY2t0aW1lMSxcbiAgICAgICAgdGhyZXNob2xkXG4gICAgICApXG4gICAgICBjb25zdCBwYXJzZWFibGVPdXRwdXQxOiBQYXJzZWFibGVPdXRwdXQgPSBuZXcgUGFyc2VhYmxlT3V0cHV0KFxuICAgICAgICBzZWNwVHJhbnNmZXJPdXRwdXQxXG4gICAgICApXG4gICAgICBjb25zdCBzdGFrZWFibGVMb2NrT3V0MTogU3Rha2VhYmxlTG9ja091dCA9IG5ldyBTdGFrZWFibGVMb2NrT3V0KFxuICAgICAgICBhbW91bnQxLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGxvY2t0aW1lMSxcbiAgICAgICAgdGhyZXNob2xkLFxuICAgICAgICBzdGFrZWFibGVMb2NrVGltZTEsXG4gICAgICAgIHBhcnNlYWJsZU91dHB1dDFcbiAgICAgIClcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tUaW1lMjogQk4gPSBuZXcgQk4oMTczMzgyNDAwMClcbiAgICAgIGNvbnN0IHNlY3BUcmFuc2Zlck91dHB1dDI6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICAgIGFtb3VudDIsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgbG9ja3RpbWUxLFxuICAgICAgICB0aHJlc2hvbGRcbiAgICAgIClcbiAgICAgIGNvbnN0IHBhcnNlYWJsZU91dHB1dDI6IFBhcnNlYWJsZU91dHB1dCA9IG5ldyBQYXJzZWFibGVPdXRwdXQoXG4gICAgICAgIHNlY3BUcmFuc2Zlck91dHB1dDJcbiAgICAgIClcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tPdXQyOiBTdGFrZWFibGVMb2NrT3V0ID0gbmV3IFN0YWtlYWJsZUxvY2tPdXQoXG4gICAgICAgIGFtb3VudDIsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgbG9ja3RpbWUxLFxuICAgICAgICB0aHJlc2hvbGQsXG4gICAgICAgIHN0YWtlYWJsZUxvY2tUaW1lMixcbiAgICAgICAgcGFyc2VhYmxlT3V0cHV0MlxuICAgICAgKVxuICAgICAgY29uc3Qgbm9kZUlEOiBzdHJpbmcgPSBcIk5vZGVJRC0zNmdpRnllNWVwd0JUcEdxUGs3YjRDQ1llM2hmeW9GcjFcIlxuICAgICAgY29uc3Qgc3Rha2VBbW91bnQ6IEJOID0gRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdW1wiUFwiXS5taW5TdGFrZVxuICAgICAgcGxhdGZvcm12bS5zZXRNaW5TdGFrZShcbiAgICAgICAgc3Rha2VBbW91bnQsXG4gICAgICAgIERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIlBcIl0ubWluRGVsZWdhdGlvblN0YWtlXG4gICAgICApXG4gICAgICBjb25zdCBkZWxlZ2F0aW9uRmVlUmF0ZTogbnVtYmVyID0gbmV3IEJOKDIpLnRvTnVtYmVyKClcbiAgICAgIGNvbnN0IGNvZGVjSUQ6IG51bWJlciA9IDBcbiAgICAgIGNvbnN0IHR4aWQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICAgIFwiYXVoTUZzMjRmZmMyQlJXS3c2aTdRbmdjczhqU1FVUzlFaTJYd0pzVXBFcTRzVFZpYlwiXG4gICAgICApXG4gICAgICBjb25zdCB0eGlkMjogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgICAgXCIySndEZm0zQzdwODhySlExWTF4V0xrV05NQTFucVB6cW5hQzJIaTRQRE5LaVBuWGdHdlwiXG4gICAgICApXG4gICAgICBjb25zdCBvdXRwdXRpZHgwOiBudW1iZXIgPSAwXG4gICAgICBjb25zdCBvdXRwdXRpZHgxOiBudW1iZXIgPSAwXG4gICAgICBjb25zdCBhc3NldElEID0gYXdhaXQgcGxhdGZvcm12bS5nZXRESlRYQXNzZXRJRCgpXG4gICAgICBjb25zdCBhc3NldElEMiA9IGF3YWl0IHBsYXRmb3Jtdm0uZ2V0REpUWEFzc2V0SUQoKVxuICAgICAgY29uc3QgdXR4bzE6IFVUWE8gPSBuZXcgVVRYTyhcbiAgICAgICAgY29kZWNJRCxcbiAgICAgICAgdHhpZCxcbiAgICAgICAgb3V0cHV0aWR4MCxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDFcbiAgICAgIClcbiAgICAgIGNvbnN0IHV0eG8yOiBVVFhPID0gbmV3IFVUWE8oXG4gICAgICAgIGNvZGVjSUQsXG4gICAgICAgIHR4aWQyLFxuICAgICAgICBvdXRwdXRpZHgxLFxuICAgICAgICBhc3NldElEMixcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDJcbiAgICAgIClcbiAgICAgIGNvbnN0IHV0eG9TZXQ6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXG4gICAgICB1dHhvU2V0LmFkZCh1dHhvMSlcbiAgICAgIHV0eG9TZXQuYWRkKHV0eG8yKVxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IHBsYXRmb3Jtdm0uYnVpbGRBZGRWYWxpZGF0b3JUeChcbiAgICAgICAgdXR4b1NldCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgbm9kZUlELFxuICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgIGVuZFRpbWUsXG4gICAgICAgIHN0YWtlQW1vdW50LFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIGRlbGVnYXRpb25GZWVSYXRlXG4gICAgICApXG4gICAgICBjb25zdCB0eCA9IHR4dTEuZ2V0VHJhbnNhY3Rpb24oKSBhcyBBZGRWYWxpZGF0b3JUeFxuICAgICAgY29uc3QgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gdHguZ2V0SW5zKClcbiAgICAgIC8vIHN0YXJ0IHRlc3QgaW5wdXRzXG4gICAgICAvLyBjb25maXJtIG9ubHkgMSBpbnB1dFxuICAgICAgZXhwZWN0KGlucy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGNvbnN0IGlucHV0OiBUcmFuc2ZlcmFibGVJbnB1dCA9IGluc1swXVxuICAgICAgY29uc3QgYWkgPSBpbnB1dC5nZXRJbnB1dCgpIGFzIEFtb3VudElucHV0XG4gICAgICBjb25zdCBhbyA9IHN0YWtlYWJsZUxvY2tPdXQyXG4gICAgICAgIC5nZXRUcmFuc2ZlcmFibGVPdXRwdXQoKVxuICAgICAgICAuZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0XG4gICAgICBjb25zdCBhbzIgPSBzdGFrZWFibGVMb2NrT3V0MVxuICAgICAgICAuZ2V0VHJhbnNmZXJhYmxlT3V0cHV0KClcbiAgICAgICAgLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxuICAgICAgLy8gY29uZmlybSBpbnB1dCBhbW91bnQgbWF0Y2hlcyB0aGUgb3V0cHV0IHcvIHRoZSBncmVhdGVyIHN0YWVrYWJsZWxvY2sgdGltZSBidXQgbGVzc2VyIGFtb3VudFxuICAgICAgZXhwZWN0KGFpLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoYW8uZ2V0QW1vdW50KCkudG9TdHJpbmcoKSlcbiAgICAgIC8vIGNvbmZpcm0gaW5wdXQgYW1vdW50IGRvZXNuJ3QgbWF0Y2ggdGhlIG91dHB1dCB3LyB0aGUgbGVzc2VyIHN0YWVrYWJsZWxvY2sgdGltZSBidXQgZ3JlYXRlciBhbW91bnRcbiAgICAgIGV4cGVjdChhaS5nZXRBbW91bnQoKS50b1N0cmluZygpKS5ub3QudG9FcXVhbChhbzIuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSlcblxuICAgICAgY29uc3Qgc2xpOiBTdGFrZWFibGVMb2NrSW4gPSBpbnB1dC5nZXRJbnB1dCgpIGFzIFN0YWtlYWJsZUxvY2tJblxuICAgICAgLy8gY29uZmlybSBpbnB1dCBzdGFrZWFibGVsb2NrIHRpbWUgbWF0Y2hlcyB0aGUgb3V0cHV0IHcvIHRoZSBncmVhdGVyIHN0YWtlYWJsZWxvY2sgdGltZSBidXQgbGVzc2VyIGFtb3VudFxuICAgICAgZXhwZWN0KHNsaS5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXG4gICAgICAgIHN0YWtlYWJsZUxvY2tPdXQyLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxuICAgICAgKVxuICAgICAgLy8gY29uZmlybSBpbnB1dCBzdGFrZWFibGVsb2NrIHRpbWUgZG9lc24ndCBtYXRjaCB0aGUgb3V0cHV0IHcvIHRoZSBsZXNzZXIgc3Rha2VhYmxlbG9jayB0aW1lIGJ1dCBncmVhdGVyIGFtb3VudFxuICAgICAgZXhwZWN0KHNsaS5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLm5vdC50b0VxdWFsKFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0MS5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcbiAgICAgIClcbiAgICAgIC8vIHN0b3AgdGVzdCBpbnB1dHNcblxuICAgICAgLy8gc3RhcnQgdGVzdCBvdXRwdXRzXG4gICAgICBjb25zdCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IHR4LmdldE91dHMoKVxuICAgICAgLy8gY29uZmlybSBvbmx5IDEgb3V0cHV0XG4gICAgICBleHBlY3Qob3V0cy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGNvbnN0IG91dHB1dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gb3V0c1swXVxuICAgICAgY29uc3QgYW8zID0gb3V0cHV0LmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgYW1vdW50IG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFrZWFibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnQgc2FucyB0aGUgc3Rha2UgYW1vdW50XG4gICAgICBleHBlY3QoYW8zLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXG4gICAgICAgIGFvLmdldEFtb3VudCgpLnN1YihzdGFrZUFtb3VudCkudG9TdHJpbmcoKVxuICAgICAgKVxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgYW1vdW50IGRvZXNuJ3QgbWF0Y2ggdGhlIG91dHB1dCB3LyB0aGUgbGVzc2VyIHN0YWtlYWJsZWxvY2sgdGltZSBidXQgZ3JlYXRlciBhbW91bnRcbiAgICAgIGV4cGVjdChhbzMuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkubm90LnRvRXF1YWwoYW8yLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IHNsbzogU3Rha2VhYmxlTG9ja091dCA9IG91dHB1dC5nZXRPdXRwdXQoKSBhcyBTdGFrZWFibGVMb2NrT3V0XG4gICAgICAvLyBjb25maXJtIG91dHB1dCBzdGFrZWFibGVsb2NrIHRpbWUgbWF0Y2hlcyB0aGUgb3V0cHV0IHcvIHRoZSBncmVhdGVyIHN0YWtlYWJsZWxvY2sgdGltZSBidXQgbGVzc2VyIGFtb3VudFxuICAgICAgZXhwZWN0KHNsby5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXG4gICAgICAgIHN0YWtlYWJsZUxvY2tPdXQyLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxuICAgICAgKVxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgc3Rha2VhYmxlbG9jayB0aW1lIGRvZXNuJ3QgbWF0Y2ggdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFrZWFibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnRcbiAgICAgIGV4cGVjdChzbG8uZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS5ub3QudG9FcXVhbChcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDEuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXG4gICAgICApXG5cbiAgICAgIC8vIGNvbmZpcm0gdHggbm9kZUlEIG1hdGNoZXMgbm9kZUlEXG4gICAgICBleHBlY3QodHguZ2V0Tm9kZUlEU3RyaW5nKCkpLnRvRXF1YWwobm9kZUlEKVxuICAgICAgLy8gY29uZmlybSB0eCBzdGFydHRpbWUgbWF0Y2hlcyBzdGFydHRpbWVcbiAgICAgIGV4cGVjdCh0eC5nZXRTdGFydFRpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKHN0YXJ0VGltZS50b1N0cmluZygpKVxuICAgICAgLy8gY29uZmlybSB0eCBlbmR0aW1lIG1hdGNoZXMgZW5kdGltZVxuICAgICAgZXhwZWN0KHR4LmdldEVuZFRpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKGVuZFRpbWUudG9TdHJpbmcoKSlcbiAgICAgIC8vIGNvbmZpcm0gdHggc3Rha2UgYW1vdW50IG1hdGNoZXMgc3Rha2VBbW91bnRcbiAgICAgIGV4cGVjdCh0eC5nZXRTdGFrZUFtb3VudCgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoc3Rha2VBbW91bnQudG9TdHJpbmcoKSlcblxuICAgICAgY29uc3Qgc3Rha2VPdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IHR4LmdldFN0YWtlT3V0cygpXG4gICAgICAvLyBjb25maXJtIG9ubHkgMSBzdGFrZU91dFxuICAgICAgZXhwZWN0KHN0YWtlT3V0cy5sZW5ndGgpLnRvQmUoMSlcblxuICAgICAgY29uc3Qgc3Rha2VPdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IHN0YWtlT3V0c1swXVxuICAgICAgY29uc3Qgc2xvMiA9IHN0YWtlT3V0LmdldE91dHB1dCgpIGFzIFN0YWtlYWJsZUxvY2tPdXRcbiAgICAgIC8vIGNvbmZpcm0gc3Rha2VPdXQgc3Rha2VhYmxlbG9jayB0aW1lIG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFrZWFibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnRcbiAgICAgIGV4cGVjdChzbG8yLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXG4gICAgICApXG4gICAgICAvLyBjb25maXJtIHN0YWtlT3V0IHN0YWtlYWJsZWxvY2sgdGltZSBkb2Vzbid0IG1hdGNoIHRoZSBvdXRwdXQgdy8gdGhlIGdyZWF0ZXIgc3Rha2VhYmxlbG9jayB0aW1lIGJ1dCBsZXNzZXIgYW1vdW50XG4gICAgICBleHBlY3Qoc2xvMi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLm5vdC50b0VxdWFsKFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0MS5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcbiAgICAgIClcbiAgICAgIHNsbzIuZ2V0QW1vdW50KClcbiAgICAgIC8vIGNvbmZpcm0gc3Rha2VPdXQgc3Rha2UgYW1vdW50IG1hdGNoZXMgc3Rha2VBbW91bnRcbiAgICAgIGV4cGVjdChzbG8yLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoc3Rha2VBbW91bnQudG9TdHJpbmcoKSlcbiAgICB9KVxuXG4gICAgdGVzdChcImJ1aWxkQWRkVmFsaWRhdG9yVHggc29ydCBTdGFrZWFibGVMb2NrT3V0cyAyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIC8vIFRPRE8gLSBkZWJ1ZyB0ZXN0XG4gICAgICAvLyB0d28gVVRYTy4gVGhlIDFzdCBoYXMgYSBsZXNzZXIgc3Rha2VhYmxlbG9ja3RpbWUgYW5kIGEgZ3JlYXRlciBhbW91bnQgb2YgREpUWC4gVGhlIDJuZCBoYXMgYSBncmVhdGVyIHN0YWtlYWJsZWxvY2t0aW1lIGFuZCBhIGxlc3NlciBhbW91bnQgb2YgREpUWC5cbiAgICAgIC8vIHRoaXMgdGltZSB3ZSdyZSBzdGFraW5nIGEgZ3JlYXRlciBhbW91bnQgdGhhbiBpcyBhdmFpbGFibGUgaW4gdGhlIDJuZCBVVFhPLlxuICAgICAgLy8gV2UgZXhwZWN0IHRoaXMgdGVzdCB0byBjb25zdW1lIHRoZSBmdWxsIDJuZCBVVFhPIGFuZCBhIGZyYWN0aW9uIG9mIHRoZSAxc3QgVVRYTy4uXG4gICAgICBjb25zdCBhZGRyYnVmZjE6IEJ1ZmZlcltdID0gYWRkcnMxLm1hcChcbiAgICAgICAgKGEpOiBCdWZmZXIgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSlcbiAgICAgIClcbiAgICAgIGNvbnN0IGFtb3VudDE6IEJOID0gbmV3IEJOKFwiMjAwMDAwMDAwMDAwMDAwMDBcIilcbiAgICAgIGNvbnN0IGFtb3VudDI6IEJOID0gbmV3IEJOKFwiMTAwMDAwMDAwMDAwMDAwMDBcIilcbiAgICAgIGNvbnN0IGxvY2t0aW1lMTogQk4gPSBuZXcgQk4oMClcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMVxuXG4gICAgICBjb25zdCBzdGFrZWFibGVMb2NrVGltZTE6IEJOID0gbmV3IEJOKDE2MzM4MjQwMDApXG4gICAgICBjb25zdCBzZWNwVHJhbnNmZXJPdXRwdXQxOiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBhbW91bnQxLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGxvY2t0aW1lMSxcbiAgICAgICAgdGhyZXNob2xkXG4gICAgICApXG4gICAgICBjb25zdCBwYXJzZWFibGVPdXRwdXQxOiBQYXJzZWFibGVPdXRwdXQgPSBuZXcgUGFyc2VhYmxlT3V0cHV0KFxuICAgICAgICBzZWNwVHJhbnNmZXJPdXRwdXQxXG4gICAgICApXG4gICAgICBjb25zdCBzdGFrZWFibGVMb2NrT3V0MTogU3Rha2VhYmxlTG9ja091dCA9IG5ldyBTdGFrZWFibGVMb2NrT3V0KFxuICAgICAgICBhbW91bnQxLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGxvY2t0aW1lMSxcbiAgICAgICAgdGhyZXNob2xkLFxuICAgICAgICBzdGFrZWFibGVMb2NrVGltZTEsXG4gICAgICAgIHBhcnNlYWJsZU91dHB1dDFcbiAgICAgIClcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tUaW1lMjogQk4gPSBuZXcgQk4oMTczMzgyNDAwMClcbiAgICAgIGNvbnN0IHNlY3BUcmFuc2Zlck91dHB1dDI6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICAgIGFtb3VudDIsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgbG9ja3RpbWUxLFxuICAgICAgICB0aHJlc2hvbGRcbiAgICAgIClcbiAgICAgIGNvbnN0IHBhcnNlYWJsZU91dHB1dDI6IFBhcnNlYWJsZU91dHB1dCA9IG5ldyBQYXJzZWFibGVPdXRwdXQoXG4gICAgICAgIHNlY3BUcmFuc2Zlck91dHB1dDJcbiAgICAgIClcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tPdXQyOiBTdGFrZWFibGVMb2NrT3V0ID0gbmV3IFN0YWtlYWJsZUxvY2tPdXQoXG4gICAgICAgIGFtb3VudDIsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgbG9ja3RpbWUxLFxuICAgICAgICB0aHJlc2hvbGQsXG4gICAgICAgIHN0YWtlYWJsZUxvY2tUaW1lMixcbiAgICAgICAgcGFyc2VhYmxlT3V0cHV0MlxuICAgICAgKVxuICAgICAgY29uc3Qgbm9kZUlEOiBzdHJpbmcgPSBcIk5vZGVJRC0zNmdpRnllNWVwd0JUcEdxUGs3YjRDQ1llM2hmeW9GcjFcIlxuICAgICAgY29uc3Qgc3Rha2VBbW91bnQ6IEJOID0gbmV3IEJOKFwiMTAwMDAwMDMwMDAwMDAwMDBcIilcbiAgICAgIHBsYXRmb3Jtdm0uc2V0TWluU3Rha2UoXG4gICAgICAgIHN0YWtlQW1vdW50LFxuICAgICAgICBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJRF1bXCJQXCJdLm1pbkRlbGVnYXRpb25TdGFrZVxuICAgICAgKVxuICAgICAgY29uc3QgZGVsZWdhdGlvbkZlZVJhdGU6IG51bWJlciA9IG5ldyBCTigyKS50b051bWJlcigpXG4gICAgICBjb25zdCBjb2RlY0lEOiBudW1iZXIgPSAwXG4gICAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgICBcImF1aE1GczI0ZmZjMkJSV0t3Nmk3UW5nY3M4alNRVVM5RWkyWHdKc1VwRXE0c1RWaWJcIlxuICAgICAgKVxuICAgICAgY29uc3QgdHhpZDI6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICAgIFwiMkp3RGZtM0M3cDg4ckpRMVkxeFdMa1dOTUExbnFQenFuYUMySGk0UEROS2lQblhnR3ZcIlxuICAgICAgKVxuICAgICAgY29uc3Qgb3V0cHV0aWR4MDogbnVtYmVyID0gMFxuICAgICAgY29uc3Qgb3V0cHV0aWR4MTogbnVtYmVyID0gMFxuICAgICAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gYXdhaXQgcGxhdGZvcm12bS5nZXRESlRYQXNzZXRJRCgpXG4gICAgICBjb25zdCBhc3NldElEMjogQnVmZmVyID0gYXdhaXQgcGxhdGZvcm12bS5nZXRESlRYQXNzZXRJRCgpXG4gICAgICBjb25zdCB1dHhvMTogVVRYTyA9IG5ldyBVVFhPKFxuICAgICAgICBjb2RlY0lELFxuICAgICAgICB0eGlkLFxuICAgICAgICBvdXRwdXRpZHgwLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0MVxuICAgICAgKVxuICAgICAgY29uc3QgdXR4bzI6IFVUWE8gPSBuZXcgVVRYTyhcbiAgICAgICAgY29kZWNJRCxcbiAgICAgICAgdHhpZDIsXG4gICAgICAgIG91dHB1dGlkeDEsXG4gICAgICAgIGFzc2V0SUQyLFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0MlxuICAgICAgKVxuICAgICAgY29uc3QgdXR4b1NldDogVVRYT1NldCA9IG5ldyBVVFhPU2V0KClcbiAgICAgIHV0eG9TZXQuYWRkKHV0eG8xKVxuICAgICAgdXR4b1NldC5hZGQodXR4bzIpXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZEFkZFZhbGlkYXRvclR4KFxuICAgICAgICB1dHhvU2V0LFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMyLFxuICAgICAgICBub2RlSUQsXG4gICAgICAgIHN0YXJ0VGltZSxcbiAgICAgICAgZW5kVGltZSxcbiAgICAgICAgc3Rha2VBbW91bnQsXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgZGVsZWdhdGlvbkZlZVJhdGVcbiAgICAgIClcbiAgICAgIGNvbnN0IHR4ID0gdHh1MS5nZXRUcmFuc2FjdGlvbigpIGFzIEFkZFZhbGlkYXRvclR4XG4gICAgICBjb25zdCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSB0eC5nZXRJbnMoKVxuICAgICAgLy8gc3RhcnQgdGVzdCBpbnB1dHNcbiAgICAgIC8vIGNvbmZpcm0gb25seSAxIGlucHV0XG4gICAgICBleHBlY3QoaW5zLmxlbmd0aCkudG9CZSgyKVxuICAgICAgY29uc3QgaW5wdXQxOiBUcmFuc2ZlcmFibGVJbnB1dCA9IGluc1swXVxuICAgICAgY29uc3QgaW5wdXQyOiBUcmFuc2ZlcmFibGVJbnB1dCA9IGluc1sxXVxuICAgICAgY29uc3QgYWkxID0gaW5wdXQxLmdldElucHV0KCkgYXMgQW1vdW50SW5wdXRcbiAgICAgIGNvbnN0IGFpMiA9IGlucHV0Mi5nZXRJbnB1dCgpIGFzIEFtb3VudElucHV0XG4gICAgICBjb25zdCBhbzEgPSBzdGFrZWFibGVMb2NrT3V0MlxuICAgICAgICAuZ2V0VHJhbnNmZXJhYmxlT3V0cHV0KClcbiAgICAgICAgLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxuICAgICAgY29uc3QgYW8yID0gc3Rha2VhYmxlTG9ja091dDFcbiAgICAgICAgLmdldFRyYW5zZmVyYWJsZU91dHB1dCgpXG4gICAgICAgIC5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXRcbiAgICAgIC8vIGNvbmZpcm0gZWFjaCBpbnB1dCBhbW91bnQgbWF0Y2hlcyB0aGUgY29ycmVzcG9uZGluZyBvdXRwdXRcbiAgICAgIGV4cGVjdChhaTIuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChhbzEuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSlcbiAgICAgIGV4cGVjdChhaTEuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChhbzIuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSlcblxuICAgICAgY29uc3Qgc2xpMSA9IGlucHV0MS5nZXRJbnB1dCgpIGFzIFN0YWtlYWJsZUxvY2tJblxuICAgICAgY29uc3Qgc2xpMiA9IGlucHV0Mi5nZXRJbnB1dCgpIGFzIFN0YWtlYWJsZUxvY2tJblxuICAgICAgLy8gY29uZmlybSBpbnB1dCBzdHJha2VhYmxlbG9jayB0aW1lIG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFla2FibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnRcbiAgICAgIC8vIGV4cGVjdChzbGkxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChcbiAgICAgIC8vICAgc3Rha2VhYmxlTG9ja091dDEuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXG4gICAgICAvLyApXG4gICAgICBleHBlY3Qoc2xpMi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXG4gICAgICAgIHN0YWtlYWJsZUxvY2tPdXQyLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxuICAgICAgKVxuICAgICAgLy8gc3RvcCB0ZXN0IGlucHV0c1xuXG4gICAgICAvLyBzdGFydCB0ZXN0IG91dHB1dHNcbiAgICAgIGNvbnN0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gdHguZ2V0T3V0cygpXG4gICAgICAvLyBjb25maXJtIG9ubHkgMSBvdXRwdXRcbiAgICAgIGV4cGVjdChvdXRzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgY29uc3Qgb3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBvdXRzWzBdXG4gICAgICBjb25zdCBhbzMgPSBvdXRwdXQuZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0XG4gICAgICAvLyBjb25maXJtIG91dHB1dCBhbW91bnQgbWF0Y2hlcyB0aGUgb3V0cHV0IGFtb3VudCBzYW5zIHRoZSAybmQgdXR4byBhbW91bnQgYW5kIHRoZSBzdGFrZSBhbW91bnRcbiAgICAgIGV4cGVjdChhbzMuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChcbiAgICAgICAgYW8yLmdldEFtb3VudCgpLnN1YihzdGFrZUFtb3VudC5zdWIoYW8xLmdldEFtb3VudCgpKSkudG9TdHJpbmcoKVxuICAgICAgKVxuXG4gICAgICBjb25zdCBzbG8gPSBvdXRwdXQuZ2V0T3V0cHV0KCkgYXMgU3Rha2VhYmxlTG9ja091dFxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgc3Rha2VhYmxlbG9jayB0aW1lIG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgbGVzc2VyIHN0YWtlYWJsZWxvY2sgc2luY2UgdGhlIG90aGVyIHdhcyBjb25zdW1lZFxuICAgICAgLy8gZXhwZWN0KHNsby5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXG4gICAgICAvLyAgIHN0YWtlYWJsZUxvY2tPdXQxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxuICAgICAgLy8gKVxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgc3Rha2VhYmxlbG9jayB0aW1lIGRvZXNuJ3QgbWF0Y2ggdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFrZWFibGVsb2NrIHRpbWVcbiAgICAgIC8vIGV4cGVjdChzbG8uZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS5ub3QudG9FcXVhbChcbiAgICAgIC8vICAgc3Rha2VhYmxlTG9ja091dDIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXG4gICAgICAvLyApXG5cbiAgICAgIC8vIGNvbmZpcm0gdHggbm9kZUlEIG1hdGNoZXMgbm9kZUlEXG4gICAgICBleHBlY3QodHguZ2V0Tm9kZUlEU3RyaW5nKCkpLnRvRXF1YWwobm9kZUlEKVxuICAgICAgLy8gY29uZmlybSB0eCBzdGFydHRpbWUgbWF0Y2hlcyBzdGFydHRpbWVcbiAgICAgIGV4cGVjdCh0eC5nZXRTdGFydFRpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKHN0YXJ0VGltZS50b1N0cmluZygpKVxuICAgICAgLy8gY29uZmlybSB0eCBlbmR0aW1lIG1hdGNoZXMgZW5kdGltZVxuICAgICAgZXhwZWN0KHR4LmdldEVuZFRpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKGVuZFRpbWUudG9TdHJpbmcoKSlcbiAgICAgIC8vIGNvbmZpcm0gdHggc3Rha2UgYW1vdW50IG1hdGNoZXMgc3Rha2VBbW91bnRcbiAgICAgIGV4cGVjdCh0eC5nZXRTdGFrZUFtb3VudCgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoc3Rha2VBbW91bnQudG9TdHJpbmcoKSlcblxuICAgICAgbGV0IHN0YWtlT3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB0eC5nZXRTdGFrZU91dHMoKVxuICAgICAgLy8gY29uZmlybSAyIHN0YWtlT3V0c1xuICAgICAgZXhwZWN0KHN0YWtlT3V0cy5sZW5ndGgpLnRvQmUoMilcblxuICAgICAgbGV0IHN0YWtlT3V0MTogVHJhbnNmZXJhYmxlT3V0cHV0ID0gc3Rha2VPdXRzWzBdXG4gICAgICBsZXQgc3Rha2VPdXQyOiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBzdGFrZU91dHNbMV1cbiAgICAgIGxldCBzbG8yID0gc3Rha2VPdXQxLmdldE91dHB1dCgpIGFzIFN0YWtlYWJsZUxvY2tPdXRcbiAgICAgIGxldCBzbG8zID0gc3Rha2VPdXQyLmdldE91dHB1dCgpIGFzIFN0YWtlYWJsZUxvY2tPdXRcbiAgICAgIC8vIGNvbmZpcm0gYm90aCBzdGFrZU91dCBzdHJha2VhYmxlbG9jayB0aW1lcyBtYXRjaGUgdGhlIGNvcnJlc3BvbmRpbmcgb3V0cHV0XG4gICAgICAvLyBleHBlY3Qoc2xvMy5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXG4gICAgICAvLyAgIHN0YWtlYWJsZUxvY2tPdXQxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxuICAgICAgLy8gKVxuICAgICAgZXhwZWN0KHNsbzIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0Mi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcbiAgICAgIClcbiAgICB9KVxuXG4gICAgdGVzdChcImJ1aWxkQWRkVmFsaWRhdG9yVHggc29ydCBTdGFrZWFibGVMb2NrT3V0cyAzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIC8vIFRPRE8gLSBkZWJ1ZyB0ZXN0XG4gICAgICAvLyB0aHJlZSBVVFhPLlxuICAgICAgLy8gVGhlIDFzdCBpcyBhIFNlY3BUcmFuc2ZlcmFibGVPdXRwdXQuXG4gICAgICAvLyBUaGUgMm5kIGhhcyBhIGxlc3NlciBzdGFrZWFibGVsb2NrdGltZSBhbmQgYSBncmVhdGVyIGFtb3VudCBvZiBESlRYLlxuICAgICAgLy8gVGhlIDNyZCBoYXMgYSBncmVhdGVyIHN0YWtlYWJsZWxvY2t0aW1lIGFuZCBhIGxlc3NlciBhbW91bnQgb2YgREpUWC5cbiAgICAgIC8vXG4gICAgICAvLyB0aGlzIHRpbWUgd2UncmUgc3Rha2luZyBhIGdyZWF0ZXIgYW1vdW50IHRoYW4gaXMgYXZhaWxhYmxlIGluIHRoZSAzcmQgVVRYTy5cbiAgICAgIC8vIFdlIGV4cGVjdCB0aGlzIHRlc3QgdG8gY29uc3VtZSB0aGUgZnVsbCAzcmQgVVRYTyBhbmQgYSBmcmFjdGlvbiBvZiB0aGUgMm5kIFVUWE8gYW5kIG5vdCB0byBjb25zdW1lIHRoZSBTZWNwVHJhbnNmZXJhYmxlT3V0cHV0XG4gICAgICBjb25zdCBhZGRyYnVmZjE6IEJ1ZmZlcltdID0gYWRkcnMxLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhbW91bnQxOiBCTiA9IG5ldyBCTihcIjIwMDAwMDAwMDAwMDAwMDAwXCIpXG4gICAgICBjb25zdCBhbW91bnQyOiBCTiA9IG5ldyBCTihcIjEwMDAwMDAwMDAwMDAwMDAwXCIpXG4gICAgICBjb25zdCBsb2NrdGltZTE6IEJOID0gbmV3IEJOKDApXG4gICAgICBjb25zdCB0aHJlc2hvbGQ6IG51bWJlciA9IDFcblxuICAgICAgY29uc3Qgc3Rha2VhYmxlTG9ja1RpbWUxOiBCTiA9IG5ldyBCTigxNjMzODI0MDAwKVxuICAgICAgY29uc3Qgc2VjcFRyYW5zZmVyT3V0cHV0MDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgICAgYW1vdW50MSxcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBsb2NrdGltZTEsXG4gICAgICAgIHRocmVzaG9sZFxuICAgICAgKVxuICAgICAgY29uc3Qgc2VjcFRyYW5zZmVyT3V0cHV0MTogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgICAgYW1vdW50MSxcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBsb2NrdGltZTEsXG4gICAgICAgIHRocmVzaG9sZFxuICAgICAgKVxuICAgICAgY29uc3QgcGFyc2VhYmxlT3V0cHV0MTogUGFyc2VhYmxlT3V0cHV0ID0gbmV3IFBhcnNlYWJsZU91dHB1dChcbiAgICAgICAgc2VjcFRyYW5zZmVyT3V0cHV0MVxuICAgICAgKVxuICAgICAgY29uc3Qgc3Rha2VhYmxlTG9ja091dDE6IFN0YWtlYWJsZUxvY2tPdXQgPSBuZXcgU3Rha2VhYmxlTG9ja091dChcbiAgICAgICAgYW1vdW50MSxcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBsb2NrdGltZTEsXG4gICAgICAgIHRocmVzaG9sZCxcbiAgICAgICAgc3Rha2VhYmxlTG9ja1RpbWUxLFxuICAgICAgICBwYXJzZWFibGVPdXRwdXQxXG4gICAgICApXG4gICAgICBjb25zdCBzdGFrZWFibGVMb2NrVGltZTI6IEJOID0gbmV3IEJOKDE3MzM4MjQwMDApXG4gICAgICBjb25zdCBzZWNwVHJhbnNmZXJPdXRwdXQyOiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBhbW91bnQyLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGxvY2t0aW1lMSxcbiAgICAgICAgdGhyZXNob2xkXG4gICAgICApXG4gICAgICBjb25zdCBwYXJzZWFibGVPdXRwdXQyOiBQYXJzZWFibGVPdXRwdXQgPSBuZXcgUGFyc2VhYmxlT3V0cHV0KFxuICAgICAgICBzZWNwVHJhbnNmZXJPdXRwdXQyXG4gICAgICApXG4gICAgICBjb25zdCBzdGFrZWFibGVMb2NrT3V0MjogU3Rha2VhYmxlTG9ja091dCA9IG5ldyBTdGFrZWFibGVMb2NrT3V0KFxuICAgICAgICBhbW91bnQyLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGxvY2t0aW1lMSxcbiAgICAgICAgdGhyZXNob2xkLFxuICAgICAgICBzdGFrZWFibGVMb2NrVGltZTIsXG4gICAgICAgIHBhcnNlYWJsZU91dHB1dDJcbiAgICAgIClcbiAgICAgIGNvbnN0IG5vZGVJRDogc3RyaW5nID0gXCJOb2RlSUQtMzZnaUZ5ZTVlcHdCVHBHcVBrN2I0Q0NZZTNoZnlvRnIxXCJcbiAgICAgIGNvbnN0IHN0YWtlQW1vdW50OiBCTiA9IG5ldyBCTihcIjEwMDAwMDAzMDAwMDAwMDAwXCIpXG4gICAgICBwbGF0Zm9ybXZtLnNldE1pblN0YWtlKFxuICAgICAgICBzdGFrZUFtb3VudCxcbiAgICAgICAgRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdW1wiUFwiXS5taW5EZWxlZ2F0aW9uU3Rha2VcbiAgICAgIClcbiAgICAgIGNvbnN0IGRlbGVnYXRpb25GZWVSYXRlOiBudW1iZXIgPSBuZXcgQk4oMikudG9OdW1iZXIoKVxuICAgICAgY29uc3QgY29kZWNJRDogbnVtYmVyID0gMFxuICAgICAgY29uc3QgdHhpZDA6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICAgIFwiYXVoTUZzMjRmZmMyQlJXS3c2aTdRbmdjczhqU1FVUzlFaTJYd0pzVXBFcTRzVFZpYlwiXG4gICAgICApXG4gICAgICBjb25zdCB0eGlkMTogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgICAgXCIyamh5Sml0OGtXQTZTd2tSd0t4WGVwRm5maHM5NzFDRXFhR2tqSm1pQURNOEg0ZzJMUlwiXG4gICAgICApXG4gICAgICBjb25zdCB0eGlkMjogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgICAgXCIySndEZm0zQzdwODhySlExWTF4V0xrV05NQTFucVB6cW5hQzJIaTRQRE5LaVBuWGdHdlwiXG4gICAgICApXG4gICAgICBjb25zdCBvdXRwdXRpZHgwOiBudW1iZXIgPSAwXG4gICAgICBjb25zdCBvdXRwdXRpZHgxOiBudW1iZXIgPSAwXG4gICAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBhd2FpdCBwbGF0Zm9ybXZtLmdldERKVFhBc3NldElEKClcbiAgICAgIGNvbnN0IGFzc2V0SUQyOiBCdWZmZXIgPSBhd2FpdCBwbGF0Zm9ybXZtLmdldERKVFhBc3NldElEKClcbiAgICAgIGNvbnN0IHV0eG8wOiBVVFhPID0gbmV3IFVUWE8oXG4gICAgICAgIGNvZGVjSUQsXG4gICAgICAgIHR4aWQwLFxuICAgICAgICBvdXRwdXRpZHgwLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBzZWNwVHJhbnNmZXJPdXRwdXQwXG4gICAgICApXG4gICAgICBjb25zdCB1dHhvMTogVVRYTyA9IG5ldyBVVFhPKFxuICAgICAgICBjb2RlY0lELFxuICAgICAgICB0eGlkMSxcbiAgICAgICAgb3V0cHV0aWR4MCxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDFcbiAgICAgIClcbiAgICAgIGNvbnN0IHV0eG8yOiBVVFhPID0gbmV3IFVUWE8oXG4gICAgICAgIGNvZGVjSUQsXG4gICAgICAgIHR4aWQyLFxuICAgICAgICBvdXRwdXRpZHgxLFxuICAgICAgICBhc3NldElEMixcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDJcbiAgICAgIClcbiAgICAgIGNvbnN0IHV0eG9TZXQ6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXG4gICAgICB1dHhvU2V0LmFkZCh1dHhvMClcbiAgICAgIHV0eG9TZXQuYWRkKHV0eG8xKVxuICAgICAgdXR4b1NldC5hZGQodXR4bzIpXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZEFkZFZhbGlkYXRvclR4KFxuICAgICAgICB1dHhvU2V0LFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMyLFxuICAgICAgICBub2RlSUQsXG4gICAgICAgIHN0YXJ0VGltZSxcbiAgICAgICAgZW5kVGltZSxcbiAgICAgICAgc3Rha2VBbW91bnQsXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgZGVsZWdhdGlvbkZlZVJhdGVcbiAgICAgIClcbiAgICAgIGNvbnN0IHR4ID0gdHh1MS5nZXRUcmFuc2FjdGlvbigpIGFzIEFkZFZhbGlkYXRvclR4XG4gICAgICBjb25zdCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSB0eC5nZXRJbnMoKVxuICAgICAgLy8gc3RhcnQgdGVzdCBpbnB1dHNcbiAgICAgIC8vIGNvbmZpcm0gb25seSAxIGlucHV0XG4gICAgICBleHBlY3QoaW5zLmxlbmd0aCkudG9CZSgyKVxuICAgICAgY29uc3QgaW5wdXQxOiBUcmFuc2ZlcmFibGVJbnB1dCA9IGluc1swXVxuICAgICAgY29uc3QgaW5wdXQyOiBUcmFuc2ZlcmFibGVJbnB1dCA9IGluc1sxXVxuICAgICAgY29uc3QgYWkxID0gaW5wdXQxLmdldElucHV0KCkgYXMgQW1vdW50SW5wdXRcbiAgICAgIGNvbnN0IGFpMiA9IGlucHV0Mi5nZXRJbnB1dCgpIGFzIEFtb3VudElucHV0XG4gICAgICBjb25zdCBhbzEgPSBzdGFrZWFibGVMb2NrT3V0MlxuICAgICAgICAuZ2V0VHJhbnNmZXJhYmxlT3V0cHV0KClcbiAgICAgICAgLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxuICAgICAgY29uc3QgYW8yID0gc3Rha2VhYmxlTG9ja091dDFcbiAgICAgICAgLmdldFRyYW5zZmVyYWJsZU91dHB1dCgpXG4gICAgICAgIC5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXRcbiAgICAgIC8vIGNvbmZpcm0gZWFjaCBpbnB1dCBhbW91bnQgbWF0Y2hlcyB0aGUgY29ycmVzcG9uZGluZyBvdXRwdXRcbiAgICAgIGV4cGVjdChhaTIuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChhbzIuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSlcbiAgICAgIGV4cGVjdChhaTEuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChhbzEuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSlcblxuICAgICAgY29uc3Qgc2xpMSA9IGlucHV0MS5nZXRJbnB1dCgpIGFzIFN0YWtlYWJsZUxvY2tJblxuICAgICAgY29uc3Qgc2xpMiA9IGlucHV0Mi5nZXRJbnB1dCgpIGFzIFN0YWtlYWJsZUxvY2tJblxuICAgICAgLy8gY29uZmlybSBpbnB1dCBzdHJha2VhYmxlbG9jayB0aW1lIG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFla2FibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnRcbiAgICAgIGV4cGVjdChzbGkxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXG4gICAgICApXG4gICAgICAvLyBleHBlY3Qoc2xpMi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXG4gICAgICAvLyAgIHN0YWtlYWJsZUxvY2tPdXQxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxuICAgICAgLy8gKVxuICAgICAgLy8gc3RvcCB0ZXN0IGlucHV0c1xuXG4gICAgICAvLyBzdGFydCB0ZXN0IG91dHB1dHNcbiAgICAgIGNvbnN0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gdHguZ2V0T3V0cygpXG4gICAgICAvLyBjb25maXJtIG9ubHkgMSBvdXRwdXRcbiAgICAgIGV4cGVjdChvdXRzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgY29uc3Qgb3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBvdXRzWzBdXG4gICAgICBjb25zdCBhbzMgPSBvdXRwdXQuZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0XG4gICAgICAvLyBjb25maXJtIG91dHB1dCBhbW91bnQgbWF0Y2hlcyB0aGUgb3V0cHV0IGFtb3VudCBzYW5zIHRoZSAybmQgdXR4byBhbW91bnQgYW5kIHRoZSBzdGFrZSBhbW91bnRcbiAgICAgIGV4cGVjdChhbzMuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChcbiAgICAgICAgYW8yLmdldEFtb3VudCgpLnN1YihzdGFrZUFtb3VudC5zdWIoYW8xLmdldEFtb3VudCgpKSkudG9TdHJpbmcoKVxuICAgICAgKVxuXG4gICAgICBjb25zdCBzbG8gPSBvdXRwdXQuZ2V0T3V0cHV0KCkgYXMgU3Rha2VhYmxlTG9ja091dFxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgc3Rha2VhYmxlbG9jayB0aW1lIG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgbGVzc2VyIHN0YWtlYWJsZWxvY2sgc2luY2UgdGhlIG90aGVyIHdhcyBjb25zdW1lZFxuICAgICAgLy8gZXhwZWN0KHNsby5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXG4gICAgICAvLyAgIHN0YWtlYWJsZUxvY2tPdXQxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxuICAgICAgLy8gKVxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgc3Rha2VhYmxlbG9jayB0aW1lIGRvZXNuJ3QgbWF0Y2ggdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFrZWFibGVsb2NrIHRpbWVcbiAgICAgIC8vIGV4cGVjdChzbG8uZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS5ub3QudG9FcXVhbChcbiAgICAgIC8vICAgc3Rha2VhYmxlTG9ja091dDIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXG4gICAgICAvLyApXG5cbiAgICAgIC8vIGNvbmZpcm0gdHggbm9kZUlEIG1hdGNoZXMgbm9kZUlEXG4gICAgICBleHBlY3QodHguZ2V0Tm9kZUlEU3RyaW5nKCkpLnRvRXF1YWwobm9kZUlEKVxuICAgICAgLy8gY29uZmlybSB0eCBzdGFydHRpbWUgbWF0Y2hlcyBzdGFydHRpbWVcbiAgICAgIGV4cGVjdCh0eC5nZXRTdGFydFRpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKHN0YXJ0VGltZS50b1N0cmluZygpKVxuICAgICAgLy8gY29uZmlybSB0eCBlbmR0aW1lIG1hdGNoZXMgZW5kdGltZVxuICAgICAgZXhwZWN0KHR4LmdldEVuZFRpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKGVuZFRpbWUudG9TdHJpbmcoKSlcbiAgICAgIC8vIGNvbmZpcm0gdHggc3Rha2UgYW1vdW50IG1hdGNoZXMgc3Rha2VBbW91bnRcbiAgICAgIGV4cGVjdCh0eC5nZXRTdGFrZUFtb3VudCgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoc3Rha2VBbW91bnQudG9TdHJpbmcoKSlcblxuICAgICAgY29uc3Qgc3Rha2VPdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IHR4LmdldFN0YWtlT3V0cygpXG4gICAgICAvLyBjb25maXJtIDIgc3Rha2VPdXRzXG4gICAgICBleHBlY3Qoc3Rha2VPdXRzLmxlbmd0aCkudG9CZSgyKVxuXG4gICAgICBjb25zdCBzdGFrZU91dDE6IFRyYW5zZmVyYWJsZU91dHB1dCA9IHN0YWtlT3V0c1swXVxuICAgICAgY29uc3Qgc3Rha2VPdXQyOiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBzdGFrZU91dHNbMV1cbiAgICAgIGNvbnN0IHNsbzIgPSBzdGFrZU91dDEuZ2V0T3V0cHV0KCkgYXMgU3Rha2VhYmxlTG9ja091dFxuICAgICAgY29uc3Qgc2xvMyA9IHN0YWtlT3V0Mi5nZXRPdXRwdXQoKSBhcyBTdGFrZWFibGVMb2NrT3V0XG4gICAgICAvLyBjb25maXJtIGJvdGggc3Rha2VPdXQgc3RyYWtlYWJsZWxvY2sgdGltZXMgbWF0Y2hlIHRoZSBjb3JyZXNwb25kaW5nIG91dHB1dFxuICAgICAgLy8gZXhwZWN0KHNsbzMuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKFxuICAgICAgLy8gICBzdGFrZWFibGVMb2NrT3V0MS5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcbiAgICAgIC8vIClcbiAgICAgIGV4cGVjdChzbG8yLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXG4gICAgICApXG4gICAgfSlcblxuICAgIHRlc3QoXCJidWlsZEFkZFZhbGlkYXRvclR4IDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgY29uc3QgYWRkcmJ1ZmYxID0gYWRkcnMxLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhZGRyYnVmZjIgPSBhZGRyczIubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMyA9IGFkZHJzMy5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYW1vdW50OiBCTiA9IERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIlBcIl0ubWluU3Rha2UuYWRkKFxuICAgICAgICBuZXcgQk4oZmVlKVxuICAgICAgKVxuXG4gICAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oNTQzMjEpXG4gICAgICBjb25zdCB0aHJlc2hvbGQ6IG51bWJlciA9IDJcblxuICAgICAgcGxhdGZvcm12bS5zZXRNaW5TdGFrZShcbiAgICAgICAgRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdW1wiUFwiXS5taW5TdGFrZSxcbiAgICAgICAgRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdW1wiUFwiXS5taW5EZWxlZ2F0aW9uU3Rha2VcbiAgICAgIClcblxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IHBsYXRmb3Jtdm0uYnVpbGRBZGRWYWxpZGF0b3JUeChcbiAgICAgICAgc2V0LFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMyLFxuICAgICAgICBub2RlSUQsXG4gICAgICAgIHN0YXJ0VGltZSxcbiAgICAgICAgZW5kVGltZSxcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIDAuMTMzNDU1NixcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZCxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQWRkVmFsaWRhdG9yVHgoXG4gICAgICAgIG5ldHdvcmtJRCxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBhZGRyYnVmZjMsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgYWRkcmJ1ZmYyLFxuICAgICAgICBOb2RlSURTdHJpbmdUb0J1ZmZlcihub2RlSUQpLFxuICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgIGVuZFRpbWUsXG4gICAgICAgIGFtb3VudCxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZCxcbiAgICAgICAgYWRkcmJ1ZmYzLFxuICAgICAgICAwLjEzMzUsXG4gICAgICAgIG5ldyBCTigwKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxuICAgICAgICBVbml4Tm93KClcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IHR4MTogVHggPSB0eHUxLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgxc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDFvYmopXG5cbiAgICAgIGNvbnN0IHR4Mm5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDFzdHIpXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXG5cbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcbiAgICAgIGNvbnN0IHR4M29iajogb2JqZWN0ID0gdHgzLnNlcmlhbGl6ZShkaXNwbGF5KVxuICAgICAgY29uc3QgdHgzc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDNvYmopXG5cbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXG5cbiAgICAgIGV4cGVjdCh0eDQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBzZXJpYWx6ZWl0KHR4MSwgXCJBZGRWYWxpZGF0b3JUeFwiKVxuICAgIH0pXG5cbiAgICB0ZXN0KFwiYnVpbGRBZGREZWxlZ2F0b3JUeCAyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIGNvbnN0IGFkZHJidWZmMSA9IGFkZHJzMS5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYyID0gYWRkcnMyLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhZGRyYnVmZjMgPSBhZGRyczMubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFtb3VudDogQk4gPSBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJRF1bXCJQXCJdLm1pbkRlbGVnYXRpb25TdGFrZVxuICAgICAgY29uc3QgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDU0MzIxKVxuICAgICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAyXG5cbiAgICAgIHBsYXRmb3Jtdm0uc2V0TWluU3Rha2UoXG4gICAgICAgIERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIlBcIl0ubWluU3Rha2UsXG4gICAgICAgIERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIlBcIl0ubWluRGVsZWdhdGlvblN0YWtlXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkQWRkRGVsZWdhdG9yVHgoXG4gICAgICAgIGxzZXQsXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczIsXG4gICAgICAgIG5vZGVJRCxcbiAgICAgICAgc3RhcnRUaW1lLFxuICAgICAgICBlbmRUaW1lLFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZCxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gbHNldC5idWlsZEFkZERlbGVnYXRvclR4KFxuICAgICAgICBuZXR3b3JrSUQsXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgYWRkcmJ1ZmYzLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGFkZHJidWZmMixcbiAgICAgICAgTm9kZUlEU3RyaW5nVG9CdWZmZXIobm9kZUlEKSxcbiAgICAgICAgc3RhcnRUaW1lLFxuICAgICAgICBlbmRUaW1lLFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICB0aHJlc2hvbGQsXG4gICAgICAgIGFkZHJidWZmMyxcbiAgICAgICAgbmV3IEJOKDApLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgICAgdHh1MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICApXG4gICAgICBleHBlY3QodHh1Mi50b1N0cmluZygpKS50b0JlKHR4dTEudG9TdHJpbmcoKSlcblxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCBjaGVja1R4OiBzdHJpbmcgPSB0eDEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDFzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4MW9iailcblxuICAgICAgY29uc3QgdHgybmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4MXN0cilcbiAgICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxuICAgICAgdHgyLmRlc2VyaWFsaXplKHR4Mm5ld29iaiwgXCJoZXhcIilcblxuICAgICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG5cbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcblxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcbiAgICAgIGNvbnN0IHR4NDogVHggPSBuZXcgVHgoKVxuICAgICAgdHg0LmRlc2VyaWFsaXplKHR4NG5ld29iaiwgZGlzcGxheSlcblxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG5cbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIkFkZERlbGVnYXRvclR4XCIpXG4gICAgfSlcblxuICAgIHRlc3QoXCJidWlsZEFkZFZhbGlkYXRvclR4IDJcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgY29uc3QgYWRkcmJ1ZmYxID0gYWRkcnMxLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhZGRyYnVmZjIgPSBhZGRyczIubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMyA9IGFkZHJzMy5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYW1vdW50OiBCTiA9IE9ORURKVFgubXVsKG5ldyBCTigyNSkpXG5cbiAgICAgIGNvbnN0IGxvY2t0aW1lOiBCTiA9IG5ldyBCTig1NDMyMSlcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMlxuXG4gICAgICBwbGF0Zm9ybXZtLnNldE1pblN0YWtlKE9ORURKVFgubXVsKG5ldyBCTigyNSkpLCBPTkVESlRYLm11bChuZXcgQk4oMjUpKSlcblxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IHBsYXRmb3Jtdm0uYnVpbGRBZGRWYWxpZGF0b3JUeChcbiAgICAgICAgbHNldCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgbm9kZUlELFxuICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgIGVuZFRpbWUsXG4gICAgICAgIGFtb3VudCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICAwLjEzMzQ1NTYsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICB0aHJlc2hvbGQsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLFxuICAgICAgICBVbml4Tm93KClcbiAgICAgIClcblxuICAgICAgY29uc3QgdHh1MjogVW5zaWduZWRUeCA9IGxzZXQuYnVpbGRBZGRWYWxpZGF0b3JUeChcbiAgICAgICAgbmV0d29ya0lELFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGJsb2NrY2hhaW5JRCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIGFkZHJidWZmMyxcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBhZGRyYnVmZjIsXG4gICAgICAgIE5vZGVJRFN0cmluZ1RvQnVmZmVyKG5vZGVJRCksXG4gICAgICAgIHN0YXJ0VGltZSxcbiAgICAgICAgZW5kVGltZSxcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBsb2NrdGltZSxcbiAgICAgICAgdGhyZXNob2xkLFxuICAgICAgICBhZGRyYnVmZjMsXG4gICAgICAgIDAuMTMzNSxcbiAgICAgICAgbmV3IEJOKDApLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgICAgdHh1MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICApXG4gICAgICBleHBlY3QodHh1Mi50b1N0cmluZygpKS50b0JlKHR4dTEudG9TdHJpbmcoKSlcblxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCBjaGVja1R4OiBzdHJpbmcgPSB0eDEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDFzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4MW9iailcblxuICAgICAgY29uc3QgdHgybmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4MXN0cilcbiAgICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxuICAgICAgdHgyLmRlc2VyaWFsaXplKHR4Mm5ld29iaiwgXCJoZXhcIilcblxuICAgICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG5cbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcblxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcbiAgICAgIGNvbnN0IHR4NDogVHggPSBuZXcgVHgoKVxuICAgICAgdHg0LmRlc2VyaWFsaXplKHR4NG5ld29iaiwgZGlzcGxheSlcblxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG5cbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIkFkZFZhbGlkYXRvclR4XCIpXG4gICAgfSlcblxuICAgIHRlc3QoXCJidWlsZEFkZFZhbGlkYXRvclR4IDNcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgY29uc3QgYWRkcmJ1ZmYxID0gYWRkcnMxLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhZGRyYnVmZjIgPSBhZGRyczIubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMyA9IGFkZHJzMy5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYW1vdW50OiBCTiA9IE9ORURKVFgubXVsKG5ldyBCTigzKSlcblxuICAgICAgY29uc3QgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDU0MzIxKVxuICAgICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAyXG5cbiAgICAgIHBsYXRmb3Jtdm0uc2V0TWluU3Rha2UoT05FREpUWC5tdWwobmV3IEJOKDMpKSwgT05FREpUWC5tdWwobmV3IEJOKDMpKSlcblxuICAgICAgLy8yIHV0eG9zOyBvbmUgbG9ja2Vkc3Rha2VhYmxlOyBvdGhlciB1bmxvY2tlZDsgYm90aCB1dHhvcyBoYXZlIDIgZGp0eDsgc3Rha2UgMyBESlRYXG5cbiAgICAgIGNvbnN0IGR1bW15U2V0OiBVVFhPU2V0ID0gbmV3IFVUWE9TZXQoKVxuXG4gICAgICBjb25zdCBsb2NrZWRCYXNlT3V0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBPTkVESlRYLm11bChuZXcgQk4oMikpLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICAxXG4gICAgICApXG4gICAgICBjb25zdCBsb2NrZWRCYXNlWE91dDogUGFyc2VhYmxlT3V0cHV0ID0gbmV3IFBhcnNlYWJsZU91dHB1dChsb2NrZWRCYXNlT3V0KVxuICAgICAgY29uc3QgbG9ja2VkT3V0OiBTdGFrZWFibGVMb2NrT3V0ID0gbmV3IFN0YWtlYWJsZUxvY2tPdXQoXG4gICAgICAgIE9ORURKVFgubXVsKG5ldyBCTigyKSksXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIDEsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICBsb2NrZWRCYXNlWE91dFxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eGlkTG9ja2VkOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMzIpXG4gICAgICB0eGlkTG9ja2VkLmZpbGwoMSlcbiAgICAgIGNvbnN0IHR4aWR4TG9ja2VkOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcbiAgICAgIHR4aWR4TG9ja2VkLndyaXRlVUludDMyQkUoMSwgMClcbiAgICAgIGNvbnN0IGx1OiBVVFhPID0gbmV3IFVUWE8oMCwgdHhpZExvY2tlZCwgdHhpZHhMb2NrZWQsIGFzc2V0SUQsIGxvY2tlZE91dClcblxuICAgICAgY29uc3QgdHhpZFVubG9ja2VkOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMzIpXG4gICAgICB0eGlkVW5sb2NrZWQuZmlsbCgyKVxuICAgICAgY29uc3QgdHhpZHhVbmxvY2tlZDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXG4gICAgICB0eGlkeFVubG9ja2VkLndyaXRlVUludDMyQkUoMiwgMClcbiAgICAgIGNvbnN0IHVubG9ja2VkT3V0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBPTkVESlRYLm11bChuZXcgQk4oMikpLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICAxXG4gICAgICApXG4gICAgICBjb25zdCB1bHU6IFVUWE8gPSBuZXcgVVRYTyhcbiAgICAgICAgMCxcbiAgICAgICAgdHhpZFVubG9ja2VkLFxuICAgICAgICB0eGlkeFVubG9ja2VkLFxuICAgICAgICBhc3NldElELFxuICAgICAgICB1bmxvY2tlZE91dFxuICAgICAgKVxuXG4gICAgICBkdW1teVNldC5hZGQodWx1KVxuICAgICAgZHVtbXlTZXQuYWRkKGx1KVxuXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZEFkZFZhbGlkYXRvclR4KFxuICAgICAgICBkdW1teVNldCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgbm9kZUlELFxuICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgIGVuZFRpbWUsXG4gICAgICAgIGFtb3VudCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICAwLjEzMzQ1NTYsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICB0aHJlc2hvbGQsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLFxuICAgICAgICBVbml4Tm93KClcbiAgICAgIClcblxuICAgICAgY29uc3QgdHh1MUluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IChcbiAgICAgICAgdHh1MS5nZXRUcmFuc2FjdGlvbigpIGFzIEFkZFZhbGlkYXRvclR4XG4gICAgICApLmdldElucygpXG4gICAgICBjb25zdCB0eHUxT3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSAoXG4gICAgICAgIHR4dTEuZ2V0VHJhbnNhY3Rpb24oKSBhcyBBZGRWYWxpZGF0b3JUeFxuICAgICAgKS5nZXRPdXRzKClcbiAgICAgIGNvbnN0IHR4dTFTdGFrZTogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSAoXG4gICAgICAgIHR4dTEuZ2V0VHJhbnNhY3Rpb24oKSBhcyBBZGRWYWxpZGF0b3JUeFxuICAgICAgKS5nZXRTdGFrZU91dHMoKVxuICAgICAgY29uc3QgdHh1MVRvdGFsOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IChcbiAgICAgICAgdHh1MS5nZXRUcmFuc2FjdGlvbigpIGFzIEFkZFZhbGlkYXRvclR4XG4gICAgICApLmdldFRvdGFsT3V0cygpXG5cbiAgICAgIGxldCBpbnRvdGFsOiBCTiA9IG5ldyBCTigwKVxuXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdHh1MUlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpbnRvdGFsID0gaW50b3RhbC5hZGQoXG4gICAgICAgICAgKHR4dTFJbnNbaV0uZ2V0SW5wdXQoKSBhcyBBbW91bnRJbnB1dCkuZ2V0QW1vdW50KClcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBsZXQgb3V0dG90YWw6IEJOID0gbmV3IEJOKDApXG5cbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0eHUxT3V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBvdXR0b3RhbCA9IG91dHRvdGFsLmFkZChcbiAgICAgICAgICAodHh1MU91dHNbaV0uZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0KS5nZXRBbW91bnQoKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIGxldCBzdGFrZXRvdGFsOiBCTiA9IG5ldyBCTigwKVxuXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdHh1MVN0YWtlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN0YWtldG90YWwgPSBzdGFrZXRvdGFsLmFkZChcbiAgICAgICAgICAodHh1MVN0YWtlW2ldLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dCkuZ2V0QW1vdW50KClcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBsZXQgdG90YWx0b3RhbDogQk4gPSBuZXcgQk4oMClcblxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHR4dTFUb3RhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICB0b3RhbHRvdGFsID0gdG90YWx0b3RhbC5hZGQoXG4gICAgICAgICAgKHR4dTFUb3RhbFtpXS5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXQpLmdldEFtb3VudCgpXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgZXhwZWN0KGludG90YWwudG9TdHJpbmcoMTApKS50b0JlKFwiNDAwMDAwMDAwMFwiKVxuICAgICAgZXhwZWN0KG91dHRvdGFsLnRvU3RyaW5nKDEwKSkudG9CZShcIjEwMDAwMDAwMDBcIilcbiAgICAgIGV4cGVjdChzdGFrZXRvdGFsLnRvU3RyaW5nKDEwKSkudG9CZShcIjMwMDAwMDAwMDBcIilcbiAgICAgIGV4cGVjdCh0b3RhbHRvdGFsLnRvU3RyaW5nKDEwKSkudG9CZShcIjQwMDAwMDAwMDBcIilcbiAgICB9KVxuXG4gICAgdGVzdChcImJ1aWxkQ3JlYXRlU3VibmV0VHgxXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIHBsYXRmb3Jtdm0uc2V0Q3JlYXRpb25UeEZlZShuZXcgQk4oMTApKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYxOiBCdWZmZXJbXSA9IGFkZHJzMS5tYXAoXG4gICAgICAgIChhKTogQnVmZmVyID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpXG4gICAgICApXG4gICAgICBjb25zdCBhZGRyYnVmZjI6IEJ1ZmZlcltdID0gYWRkcnMyLm1hcChcbiAgICAgICAgKGEpOiBCdWZmZXIgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSlcbiAgICAgIClcbiAgICAgIGNvbnN0IGFkZHJidWZmMzogQnVmZmVyW10gPSBhZGRyczMubWFwKFxuICAgICAgICAoYSk6IEJ1ZmZlciA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZENyZWF0ZVN1Ym5ldFR4KFxuICAgICAgICBzZXQsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMyLFxuICAgICAgICBbYWRkcnMxWzBdXSxcbiAgICAgICAgMSxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQ3JlYXRlU3VibmV0VHgoXG4gICAgICAgIG5ldHdvcmtJRCxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGFkZHJidWZmMixcbiAgICAgICAgW2FkZHJidWZmMVswXV0sXG4gICAgICAgIDEsXG4gICAgICAgIHBsYXRmb3Jtdm0uZ2V0Q3JlYXRlU3VibmV0VHhGZWUoKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxuICAgICAgICBVbml4Tm93KClcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IHR4MTogVHggPSB0eHUxLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgxc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDFvYmopXG5cbiAgICAgIGNvbnN0IHR4Mm5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDFzdHIpXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXG5cbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcbiAgICAgIGNvbnN0IHR4M29iajogb2JqZWN0ID0gdHgzLnNlcmlhbGl6ZShkaXNwbGF5KVxuICAgICAgY29uc3QgdHgzc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDNvYmopXG5cbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXG5cbiAgICAgIGV4cGVjdCh0eDQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBzZXJpYWx6ZWl0KHR4MSwgXCJDcmVhdGVTdWJuZXRUeFwiKVxuICAgIH0pXG5cbiAgICB0ZXN0KFwiYnVpbGRDcmVhdGVTdWJuZXRUeDJcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgcGxhdGZvcm12bS5zZXRDcmVhdGlvblR4RmVlKG5ldyBCTigxMCkpXG4gICAgICBjb25zdCBhZGRyYnVmZjE6IEJ1ZmZlcltdID0gYWRkcnMxLm1hcCgoYTogc3RyaW5nKSA9PlxuICAgICAgICBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKVxuICAgICAgKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYyOiBCdWZmZXJbXSA9IGFkZHJzMi5tYXAoKGE6IHN0cmluZykgPT5cbiAgICAgICAgcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSlcbiAgICAgIClcbiAgICAgIGNvbnN0IGFkZHJidWZmMzogQnVmZmVyW10gPSBhZGRyczMubWFwKChhOiBzdHJpbmcpID0+XG4gICAgICAgIHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkQ3JlYXRlU3VibmV0VHgoXG4gICAgICAgIGxzZXQsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMyLFxuICAgICAgICBbYWRkcnMxWzBdXSxcbiAgICAgICAgMSxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gbHNldC5idWlsZENyZWF0ZVN1Ym5ldFR4KFxuICAgICAgICBuZXR3b3JrSUQsXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBhZGRyYnVmZjIsXG4gICAgICAgIFthZGRyYnVmZjFbMF1dLFxuICAgICAgICAxLFxuICAgICAgICBwbGF0Zm9ybXZtLmdldENyZWF0ZVN1Ym5ldFR4RmVlKCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuICAgIH0pXG4gIH0pXG5cbiAgdGVzdChcImdldFJld2FyZFVUWE9zXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCB0eElEOiBzdHJpbmcgPSBcIjdzaWszUHI2cjFGZUxydksxb1d3RUNCUzhpSjVWUHVTaFwiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEdldFJld2FyZFVUWE9zUmVzcG9uc2U+ID0gYXBpLmdldFJld2FyZFVUWE9zKHR4SUQpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7IG51bUZldGNoZWQ6IFwiMFwiLCB1dHhvczogW10sIGVuY29kaW5nOiBcImNiNThcIiB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogR2V0UmV3YXJkVVRYT3NSZXNwb25zZSA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUocGF5bG9hZFtcInJlc3VsdFwiXSlcbiAgfSlcbn0pXG4iXX0=