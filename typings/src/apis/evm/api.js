"use strict";
/**
 * @packageDocumentation
 * @module API-EVM
 */
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
exports.EVMAPI = void 0;
const buffer_1 = require("buffer/");
const bn_js_1 = __importDefault(require("bn.js"));
const jrpcapi_1 = require("../../common/jrpcapi");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const utxos_1 = require("./utxos");
const keychain_1 = require("./keychain");
const constants_1 = require("../../utils/constants");
const tx_1 = require("./tx");
const constants_2 = require("./constants");
const inputs_1 = require("./inputs");
const outputs_1 = require("./outputs");
const exporttx_1 = require("./exporttx");
const errors_1 = require("../../utils/errors");
const utils_1 = require("../../utils");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = utils_1.Serialization.getInstance();
/**
 * Class for interacting with a node's EVMAPI
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called. Instead, use the [[Avalanche.addAPI]] function to register this interface with Avalanche.
 */
class EVMAPI extends jrpcapi_1.JRPCAPI {
    /**
     * This class should not be instantiated directly.
     * Instead use the [[Avalanche.addAPI]] method.
     *
     * @param core A reference to the Avalanche class
     * @param baseURL Defaults to the string "/ext/bc/C/djtx" as the path to blockchain's baseURL
     * @param blockchainID The Blockchain's ID. Defaults to an empty string: ""
     */
    constructor(core, baseURL = "/ext/bc/C/djtx", blockchainID = "") {
        super(core, baseURL);
        /**
         * @ignore
         */
        this.keychain = new keychain_1.KeyChain("", "");
        this.blockchainID = "";
        this.blockchainAlias = undefined;
        this.DJTXAssetID = undefined;
        this.txFee = undefined;
        /**
         * Gets the alias for the blockchainID if it exists, otherwise returns `undefined`.
         *
         * @returns The alias for the blockchainID
         */
        this.getBlockchainAlias = () => {
            if (typeof this.blockchainAlias === "undefined") {
                const netID = this.core.getNetworkID();
                if (netID in constants_1.Defaults.network &&
                    this.blockchainID in constants_1.Defaults.network[`${netID}`]) {
                    this.blockchainAlias =
                        constants_1.Defaults.network[`${netID}`][this.blockchainID].alias;
                    return this.blockchainAlias;
                }
                else {
                    /* istanbul ignore next */
                    return undefined;
                }
            }
            return this.blockchainAlias;
        };
        /**
         * Sets the alias for the blockchainID.
         *
         * @param alias The alias for the blockchainID.
         *
         */
        this.setBlockchainAlias = (alias) => {
            this.blockchainAlias = alias;
            /* istanbul ignore next */
            return undefined;
        };
        /**
         * Gets the blockchainID and returns it.
         *
         * @returns The blockchainID
         */
        this.getBlockchainID = () => this.blockchainID;
        /**
         * Refresh blockchainID, and if a blockchainID is passed in, use that.
         *
         * @param Optional. BlockchainID to assign, if none, uses the default based on networkID.
         *
         * @returns A boolean if the blockchainID was successfully refreshed.
         */
        this.refreshBlockchainID = (blockchainID = undefined) => {
            const netID = this.core.getNetworkID();
            if (typeof blockchainID === "undefined" &&
                typeof constants_1.Defaults.network[`${netID}`] !== "undefined") {
                this.blockchainID = constants_1.Defaults.network[`${netID}`].C.blockchainID; //default to C-Chain
                return true;
            }
            if (typeof blockchainID === "string") {
                this.blockchainID = blockchainID;
                return true;
            }
            return false;
        };
        /**
         * Takes an address string and returns its {@link https://github.com/feross/buffer|Buffer} representation if valid.
         *
         * @returns A {@link https://github.com/feross/buffer|Buffer} for the address if valid, undefined if not valid.
         */
        this.parseAddress = (addr) => {
            const alias = this.getBlockchainAlias();
            const blockchainID = this.getBlockchainID();
            return bintools.parseAddress(addr, blockchainID, alias, constants_2.EVMConstants.ADDRESSLENGTH);
        };
        this.addressFromBuffer = (address) => {
            const chainID = this.getBlockchainAlias()
                ? this.getBlockchainAlias()
                : this.getBlockchainID();
            const type = "bech32";
            return serialization.bufferToType(address, type, this.core.getHRP(), chainID);
        };
        /**
         * Retrieves an assets name and symbol.
         *
         * @param assetID Either a {@link https://github.com/feross/buffer|Buffer} or an b58 serialized string for the AssetID or its alias.
         *
         * @returns Returns a Promise Asset with keys "name", "symbol", "assetID" and "denomination".
         */
        this.getAssetDescription = (assetID) => __awaiter(this, void 0, void 0, function* () {
            let asset;
            if (typeof assetID !== "string") {
                asset = bintools.cb58Encode(assetID);
            }
            else {
                asset = assetID;
            }
            const params = {
                assetID: asset
            };
            const tmpBaseURL = this.getBaseURL();
            // set base url to get asset description
            this.setBaseURL("/ext/bc/X");
            const response = yield this.callMethod("avm.getAssetDescription", params);
            // set base url back what it originally was
            this.setBaseURL(tmpBaseURL);
            return {
                name: response.data.result.name,
                symbol: response.data.result.symbol,
                assetID: bintools.cb58Decode(response.data.result.assetID),
                denomination: parseInt(response.data.result.denomination, 10)
            };
        });
        /**
         * Fetches the DJTX AssetID and returns it in a Promise.
         *
         * @param refresh This function caches the response. Refresh = true will bust the cache.
         *
         * @returns The the provided string representing the DJTX AssetID
         */
        this.getDJTXAssetID = (refresh = false) => __awaiter(this, void 0, void 0, function* () {
            if (typeof this.DJTXAssetID === "undefined" || refresh) {
                const asset = yield this.getAssetDescription(constants_1.PrimaryAssetAlias);
                this.DJTXAssetID = asset.assetID;
            }
            return this.DJTXAssetID;
        });
        /**
         * Overrides the defaults and sets the cache to a specific DJTX AssetID
         *
         * @param djtxAssetID A cb58 string or Buffer representing the DJTX AssetID
         *
         * @returns The the provided string representing the DJTX AssetID
         */
        this.setDJTXAssetID = (djtxAssetID) => {
            if (typeof djtxAssetID === "string") {
                djtxAssetID = bintools.cb58Decode(djtxAssetID);
            }
            this.DJTXAssetID = djtxAssetID;
        };
        /**
         * Gets the default tx fee for this chain.
         *
         * @returns The default tx fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.getDefaultTxFee = () => {
            return this.core.getNetworkID() in constants_1.Defaults.network
                ? new bn_js_1.default(constants_1.Defaults.network[this.core.getNetworkID()]["C"]["txFee"])
                : new bn_js_1.default(0);
        };
        /**
         * returns the amount of [assetID] for the given address in the state of the given block number.
         * "latest", "pending", and "accepted" meta block numbers are also allowed.
         *
         * @param hexAddress The hex representation of the address
         * @param blockHeight The block height
         * @param assetID The asset ID
         *
         * @returns Returns a Promise object containing the balance
         */
        this.getAssetBalance = (hexAddress, blockHeight, assetID) => __awaiter(this, void 0, void 0, function* () {
            const params = [hexAddress, blockHeight, assetID];
            const method = "eth_getAssetBalance";
            const path = "ext/bc/C/rpc";
            const response = yield this.callMethod(method, params, path);
            return response.data;
        });
        /**
         * Returns the status of a provided atomic transaction ID by calling the node's `getAtomicTxStatus` method.
         *
         * @param txID The string representation of the transaction ID
         *
         * @returns Returns a Promise string containing the status retrieved from the node
         */
        this.getAtomicTxStatus = (txID) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                txID
            };
            const response = yield this.callMethod("djtx.getAtomicTxStatus", params);
            return response.data.result.status
                ? response.data.result.status
                : response.data.result;
        });
        /**
         * Returns the transaction data of a provided transaction ID by calling the node's `getAtomicTx` method.
         *
         * @param txID The string representation of the transaction ID
         *
         * @returns Returns a Promise string containing the bytes retrieved from the node
         */
        this.getAtomicTx = (txID) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                txID
            };
            const response = yield this.callMethod("djtx.getAtomicTx", params);
            return response.data.result.tx;
        });
        /**
         * Gets the tx fee for this chain.
         *
         * @returns The tx fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.getTxFee = () => {
            if (typeof this.txFee === "undefined") {
                this.txFee = this.getDefaultTxFee();
            }
            return this.txFee;
        };
        /**
         * Send ANT (Avalanche Native Token) assets including DJTX from the C-Chain to an account on the X-Chain.
         *
         * After calling this method, you must call the X-Chain’s import method to complete the transfer.
         *
         * @param username The Keystore user that controls the X-Chain account specified in `to`
         * @param password The password of the Keystore user
         * @param to The account on the X-Chain to send the DJTX to.
         * @param amount Amount of asset to export as a {@link https://github.com/indutny/bn.js/|BN}
         * @param assetID The asset id which is being sent
         *
         * @returns String representing the transaction id
         */
        this.export = (username, password, to, amount, assetID) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                to,
                amount: amount.toString(10),
                username,
                password,
                assetID
            };
            const response = yield this.callMethod("djtx.export", params);
            return response.data.result.txID
                ? response.data.result.txID
                : response.data.result;
        });
        /**
         * Send DJTX from the C-Chain to an account on the X-Chain.
         *
         * After calling this method, you must call the X-Chain’s importDJTX method to complete the transfer.
         *
         * @param username The Keystore user that controls the X-Chain account specified in `to`
         * @param password The password of the Keystore user
         * @param to The account on the X-Chain to send the DJTX to.
         * @param amount Amount of DJTX to export as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns String representing the transaction id
         */
        this.exportDJTX = (username, password, to, amount) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                to,
                amount: amount.toString(10),
                username,
                password
            };
            const response = yield this.callMethod("djtx.exportDJTX", params);
            return response.data.result.txID
                ? response.data.result.txID
                : response.data.result;
        });
        /**
         * Retrieves the UTXOs related to the addresses provided from the node's `getUTXOs` method.
         *
         * @param addresses An array of addresses as cb58 strings or addresses as {@link https://github.com/feross/buffer|Buffer}s
         * @param sourceChain A string for the chain to look for the UTXO's. Default is to use this chain, but if exported UTXOs exist
         * from other chains, this can used to pull them instead.
         * @param limit Optional. Returns at most [limit] addresses. If [limit] == 0 or > [maxUTXOsToFetch], fetches up to [maxUTXOsToFetch].
         * @param startIndex Optional. [StartIndex] defines where to start fetching UTXOs (for pagination.)
         * UTXOs fetched are from addresses equal to or greater than [StartIndex.Address]
         * For address [StartIndex.Address], only UTXOs with IDs greater than [StartIndex.Utxo] will be returned.
         */
        this.getUTXOs = (addresses, sourceChain = undefined, limit = 0, startIndex = undefined) => __awaiter(this, void 0, void 0, function* () {
            if (typeof addresses === "string") {
                addresses = [addresses];
            }
            const params = {
                addresses: addresses,
                limit
            };
            if (typeof startIndex !== "undefined" && startIndex) {
                params.startIndex = startIndex;
            }
            if (typeof sourceChain !== "undefined") {
                params.sourceChain = sourceChain;
            }
            const response = yield this.callMethod("djtx.getUTXOs", params);
            const utxos = new utxos_1.UTXOSet();
            const data = response.data.result.utxos;
            utxos.addArray(data, false);
            response.data.result.utxos = utxos;
            return response.data.result;
        });
        /**
         * Send ANT (Avalanche Native Token) assets including DJTX from an account on the X-Chain to an address on the C-Chain. This transaction
         * must be signed with the key of the account that the asset is sent from and which pays
         * the transaction fee.
         *
         * @param username The Keystore user that controls the account specified in `to`
         * @param password The password of the Keystore user
         * @param to The address of the account the asset is sent to.
         * @param sourceChain The chainID where the funds are coming from. Ex: "X"
         *
         * @returns Promise for a string for the transaction, which should be sent to the network
         * by calling issueTx.
         */
        this.import = (username, password, to, sourceChain) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                to,
                sourceChain,
                username,
                password
            };
            const response = yield this.callMethod("djtx.import", params);
            return response.data.result.txID
                ? response.data.result.txID
                : response.data.result;
        });
        /**
         * Send DJTX from an account on the X-Chain to an address on the C-Chain. This transaction
         * must be signed with the key of the account that the DJTX is sent from and which pays
         * the transaction fee.
         *
         * @param username The Keystore user that controls the account specified in `to`
         * @param password The password of the Keystore user
         * @param to The address of the account the DJTX is sent to. This must be the same as the to
         * argument in the corresponding call to the X-Chain’s exportDJTX
         * @param sourceChain The chainID where the funds are coming from.
         *
         * @returns Promise for a string for the transaction, which should be sent to the network
         * by calling issueTx.
         */
        this.importDJTX = (username, password, to, sourceChain) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                to,
                sourceChain,
                username,
                password
            };
            const response = yield this.callMethod("djtx.importDJTX", params);
            return response.data.result.txID
                ? response.data.result.txID
                : response.data.result;
        });
        /**
         * Give a user control over an address by providing the private key that controls the address.
         *
         * @param username The name of the user to store the private key
         * @param password The password that unlocks the user
         * @param privateKey A string representing the private key in the vm"s format
         *
         * @returns The address for the imported private key.
         */
        this.importKey = (username, password, privateKey) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                privateKey
            };
            const response = yield this.callMethod("djtx.importKey", params);
            return response.data.result.address
                ? response.data.result.address
                : response.data.result;
        });
        /**
         * Calls the node's issueTx method from the API and returns the resulting transaction ID as a string.
         *
         * @param tx A string, {@link https://github.com/feross/buffer|Buffer}, or [[Tx]] representing a transaction
         *
         * @returns A Promise string representing the transaction ID of the posted transaction.
         */
        this.issueTx = (tx) => __awaiter(this, void 0, void 0, function* () {
            let Transaction = "";
            if (typeof tx === "string") {
                Transaction = tx;
            }
            else if (tx instanceof buffer_1.Buffer) {
                const txobj = new tx_1.Tx();
                txobj.fromBuffer(tx);
                Transaction = txobj.toString();
            }
            else if (tx instanceof tx_1.Tx) {
                Transaction = tx.toString();
            }
            else {
                /* istanbul ignore next */
                throw new errors_1.TransactionError("Error - djtx.issueTx: provided tx is not expected type of string, Buffer, or Tx");
            }
            const params = {
                tx: Transaction.toString()
            };
            const response = yield this.callMethod("djtx.issueTx", params);
            return response.data.result.txID
                ? response.data.result.txID
                : response.data.result;
        });
        /**
         * Exports the private key for an address.
         *
         * @param username The name of the user with the private key
         * @param password The password used to decrypt the private key
         * @param address The address whose private key should be exported
         *
         * @returns Promise with the decrypted private key and private key hex as store in the database
         */
        this.exportKey = (username, password, address) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                address
            };
            const response = yield this.callMethod("djtx.exportKey", params);
            return response.data.result;
        });
        /**
         * Helper function which creates an unsigned Import Tx. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s).
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param toAddress The address to send the funds
         * @param ownerAddresses The addresses being used to import
         * @param sourceChain The chainid for where the import is coming from
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains a [[ImportTx]].
         *
         * @remarks
         * This helper exists because the endpoint API should be the primary point of entry for most functionality.
         */
        this.buildImportTx = (utxoset, toAddress, ownerAddresses, sourceChain, fromAddresses, fee = new bn_js_1.default(0)) => __awaiter(this, void 0, void 0, function* () {
            const from = this._cleanAddressArray(fromAddresses, "buildImportTx").map((a) => bintools.stringToAddress(a));
            let srcChain = undefined;
            if (typeof sourceChain === "string") {
                // if there is a sourceChain passed in and it's a string then save the string value and cast the original
                // variable from a string to a Buffer
                srcChain = sourceChain;
                sourceChain = bintools.cb58Decode(sourceChain);
            }
            else if (typeof sourceChain === "undefined" ||
                !(sourceChain instanceof buffer_1.Buffer)) {
                // if there is no sourceChain passed in or the sourceChain is any data type other than a Buffer then throw an error
                throw new errors_1.ChainIdError("Error - EVMAPI.buildImportTx: sourceChain is undefined or invalid sourceChain type.");
            }
            const utxoResponse = yield this.getUTXOs(ownerAddresses, srcChain, 0, undefined);
            const atomicUTXOs = utxoResponse.utxos;
            const networkID = this.core.getNetworkID();
            const djtxAssetID = constants_1.Defaults.network[`${networkID}`].X.djtxAssetID;
            const djtxAssetIDBuf = bintools.cb58Decode(djtxAssetID);
            const atomics = atomicUTXOs.getAllUTXOs();
            if (atomics.length === 0) {
                throw new errors_1.NoAtomicUTXOsError("Error - EVMAPI.buildImportTx: no atomic utxos to import");
            }
            const builtUnsignedTx = utxoset.buildImportTx(networkID, bintools.cb58Decode(this.blockchainID), toAddress, atomics, sourceChain, fee, djtxAssetIDBuf);
            return builtUnsignedTx;
        });
        /**
         * Helper function which creates an unsigned Export Tx. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s).
         *
         * @param amount The amount being exported as a {@link https://github.com/indutny/bn.js/|BN}
         * @param assetID The asset id which is being sent
         * @param destinationChain The chainid for where the assets will be sent.
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains an [[ExportTx]].
         */
        this.buildExportTx = (amount, assetID, destinationChain, fromAddressHex, fromAddressBech, toAddresses, nonce = 0, locktime = new bn_js_1.default(0), threshold = 1, fee = new bn_js_1.default(0)) => __awaiter(this, void 0, void 0, function* () {
            const prefixes = {};
            toAddresses.map((address) => {
                prefixes[address.split("-")[0]] = true;
            });
            if (Object.keys(prefixes).length !== 1) {
                throw new errors_1.AddressError("Error - EVMAPI.buildExportTx: To addresses must have the same chainID prefix.");
            }
            if (typeof destinationChain === "undefined") {
                throw new errors_1.ChainIdError("Error - EVMAPI.buildExportTx: Destination ChainID is undefined.");
            }
            else if (typeof destinationChain === "string") {
                destinationChain = bintools.cb58Decode(destinationChain);
            }
            else if (!(destinationChain instanceof buffer_1.Buffer)) {
                throw new errors_1.ChainIdError("Error - EVMAPI.buildExportTx: Invalid destinationChain type");
            }
            if (destinationChain.length !== 32) {
                throw new errors_1.ChainIdError("Error - EVMAPI.buildExportTx: Destination ChainID must be 32 bytes in length.");
            }
            const assetDescription = yield this.getAssetDescription("DJTX");
            let evmInputs = [];
            if (bintools.cb58Encode(assetDescription.assetID) === assetID) {
                const evmInput = new inputs_1.EVMInput(fromAddressHex, amount.add(fee), assetID, nonce);
                evmInput.addSignatureIdx(0, bintools.stringToAddress(fromAddressBech));
                evmInputs.push(evmInput);
            }
            else {
                // if asset id isn't DJTX asset id then create 2 inputs
                // first input will be DJTX and will be for the amount of the fee
                // second input will be the ANT
                const evmDJTXInput = new inputs_1.EVMInput(fromAddressHex, fee, assetDescription.assetID, nonce);
                evmDJTXInput.addSignatureIdx(0, bintools.stringToAddress(fromAddressBech));
                evmInputs.push(evmDJTXInput);
                const evmANTInput = new inputs_1.EVMInput(fromAddressHex, amount, assetID, nonce);
                evmANTInput.addSignatureIdx(0, bintools.stringToAddress(fromAddressBech));
                evmInputs.push(evmANTInput);
            }
            const to = [];
            toAddresses.map((address) => {
                to.push(bintools.stringToAddress(address));
            });
            let exportedOuts = [];
            const secpTransferOutput = new outputs_1.SECPTransferOutput(amount, to, locktime, threshold);
            const transferableOutput = new outputs_1.TransferableOutput(bintools.cb58Decode(assetID), secpTransferOutput);
            exportedOuts.push(transferableOutput);
            // lexicographically sort ins and outs
            evmInputs = evmInputs.sort(inputs_1.EVMInput.comparator());
            exportedOuts = exportedOuts.sort(outputs_1.TransferableOutput.comparator());
            const exportTx = new exporttx_1.ExportTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), destinationChain, evmInputs, exportedOuts);
            const unsignedTx = new tx_1.UnsignedTx(exportTx);
            return unsignedTx;
        });
        /**
         * Gets a reference to the keychain for this class.
         *
         * @returns The instance of [[KeyChain]] for this class
         */
        this.keyChain = () => this.keychain;
        /**
         *
         * @returns new instance of [[KeyChain]]
         */
        this.newKeyChain = () => {
            // warning, overwrites the old keychain
            const alias = this.getBlockchainAlias();
            if (alias) {
                this.keychain = new keychain_1.KeyChain(this.core.getHRP(), alias);
            }
            else {
                this.keychain = new keychain_1.KeyChain(this.core.getHRP(), this.blockchainID);
            }
            return this.keychain;
        };
        /**
         * @returns a Promise string containing the base fee for the next block.
         */
        this.getBaseFee = () => __awaiter(this, void 0, void 0, function* () {
            const params = [];
            const method = "eth_baseFee";
            const path = "ext/bc/C/rpc";
            const response = yield this.callMethod(method, params, path);
            return response.data.result;
        });
        /**
         * returns the priority fee needed to be included in a block.
         *
         * @returns Returns a Promise string containing the priority fee needed to be included in a block.
         */
        this.getMaxPriorityFeePerGas = () => __awaiter(this, void 0, void 0, function* () {
            const params = [];
            const method = "eth_maxPriorityFeePerGas";
            const path = "ext/bc/C/rpc";
            const response = yield this.callMethod(method, params, path);
            return response.data.result;
        });
        this.blockchainID = blockchainID;
        const netID = core.getNetworkID();
        if (netID in constants_1.Defaults.network &&
            blockchainID in constants_1.Defaults.network[`${netID}`]) {
            const { alias } = constants_1.Defaults.network[`${netID}`][`${blockchainID}`];
            this.keychain = new keychain_1.KeyChain(this.core.getHRP(), alias);
        }
        else {
            this.keychain = new keychain_1.KeyChain(this.core.getHRP(), blockchainID);
        }
    }
    /**
     * @ignore
     */
    _cleanAddressArray(addresses, caller) {
        const addrs = [];
        const chainid = this.getBlockchainAlias()
            ? this.getBlockchainAlias()
            : this.getBlockchainID();
        if (addresses && addresses.length > 0) {
            addresses.forEach((address) => {
                if (typeof address === "string") {
                    if (typeof this.parseAddress(address) === "undefined") {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - Invalid address format");
                    }
                    addrs.push(address);
                }
                else {
                    const type = "bech32";
                    addrs.push(serialization.bufferToType(address, type, this.core.getHRP(), chainid));
                }
            });
        }
        return addrs;
    }
}
exports.EVMAPI = EVMAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvZXZtL2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOzs7Ozs7Ozs7Ozs7Ozs7QUFFSCxvQ0FBZ0M7QUFDaEMsa0RBQXNCO0FBRXRCLGtEQUE4QztBQUU5QyxvRUFBMkM7QUFDM0MsbUNBQXVDO0FBQ3ZDLHlDQUFxQztBQUNyQyxxREFBbUU7QUFDbkUsNkJBQXFDO0FBQ3JDLDJDQUEwQztBQU8xQyxxQ0FBbUM7QUFDbkMsdUNBQWtFO0FBQ2xFLHlDQUFxQztBQUNyQywrQ0FLMkI7QUFDM0IsdUNBQTJEO0FBYzNEOztHQUVHO0FBQ0gsTUFBTSxRQUFRLEdBQWEsa0JBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNqRCxNQUFNLGFBQWEsR0FBa0IscUJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUVoRTs7Ozs7O0dBTUc7QUFDSCxNQUFhLE1BQU8sU0FBUSxpQkFBTztJQXV4QmpDOzs7Ozs7O09BT0c7SUFDSCxZQUNFLElBQW1CLEVBQ25CLFVBQWtCLGdCQUFnQixFQUNsQyxlQUF1QixFQUFFO1FBRXpCLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFueUJ0Qjs7V0FFRztRQUNPLGFBQVEsR0FBYSxJQUFJLG1CQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ3pDLGlCQUFZLEdBQVcsRUFBRSxDQUFBO1FBQ3pCLG9CQUFlLEdBQVcsU0FBUyxDQUFBO1FBQ25DLGdCQUFXLEdBQVcsU0FBUyxDQUFBO1FBQy9CLFVBQUssR0FBTyxTQUFTLENBQUE7UUFFL0I7Ozs7V0FJRztRQUNILHVCQUFrQixHQUFHLEdBQVcsRUFBRTtZQUNoQyxJQUFJLE9BQU8sSUFBSSxDQUFDLGVBQWUsS0FBSyxXQUFXLEVBQUU7Z0JBQy9DLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENB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QUE7U0FDL0Q7SUFDSCxDQUFDO0lBNUREOztPQUVHO0lBQ08sa0JBQWtCLENBQzFCLFNBQThCLEVBQzlCLE1BQWM7UUFFZCxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUE7UUFDMUIsTUFBTSxPQUFPLEdBQVcsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQy9DLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQTtRQUMxQixJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBd0IsRUFBRSxFQUFFO2dCQUM3QyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtvQkFDL0IsSUFBSSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBaUIsQ0FBQyxLQUFLLFdBQVcsRUFBRTt3QkFDL0QsMEJBQTBCO3dCQUMxQixNQUFNLElBQUkscUJBQVksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO3FCQUN6RDtvQkFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQWlCLENBQUMsQ0FBQTtpQkFDOUI7cUJBQU07b0JBQ0wsTUFBTSxJQUFJLEdBQW1CLFFBQVEsQ0FBQTtvQkFDckMsS0FBSyxDQUFDLElBQUksQ0FDUixhQUFhLENBQUMsWUFBWSxDQUN4QixPQUFpQixFQUNqQixJQUFJLEVBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFDbEIsT0FBTyxDQUNSLENBQ0YsQ0FBQTtpQkFDRjtZQUNILENBQUMsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7Q0E2REY7QUFsMUJELHdCQWsxQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICogQG1vZHVsZSBBUEktRVZNXG4gKi9cblxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxuaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiXG5pbXBvcnQgQXZhbGFuY2hlQ29yZSBmcm9tIFwiLi4vLi4vYXZhbGFuY2hlXCJcbmltcG9ydCB7IEpSUENBUEkgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pycGNhcGlcIlxuaW1wb3J0IHsgUmVxdWVzdFJlc3BvbnNlRGF0YSB9IGZyb20gXCIuLi8uLi9jb21tb24vYXBpYmFzZVwiXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uLy4uL3V0aWxzL2JpbnRvb2xzXCJcbmltcG9ydCB7IFVUWE9TZXQsIFVUWE8gfSBmcm9tIFwiLi91dHhvc1wiXG5pbXBvcnQgeyBLZXlDaGFpbiB9IGZyb20gXCIuL2tleWNoYWluXCJcbmltcG9ydCB7IERlZmF1bHRzLCBQcmltYXJ5QXNzZXRBbGlhcyB9IGZyb20gXCIuLi8uLi91dGlscy9jb25zdGFudHNcIlxuaW1wb3J0IHsgVHgsIFVuc2lnbmVkVHggfSBmcm9tIFwiLi90eFwiXG5pbXBvcnQgeyBFVk1Db25zdGFudHMgfSBmcm9tIFwiLi9jb25zdGFudHNcIlxuaW1wb3J0IHtcbiAgQXNzZXQsXG4gIEluZGV4LFxuICBJc3N1ZVR4UGFyYW1zLFxuICBVVFhPUmVzcG9uc2Vcbn0gZnJvbSBcIi4vLi4vLi4vY29tbW9uL2ludGVyZmFjZXNcIlxuaW1wb3J0IHsgRVZNSW5wdXQgfSBmcm9tIFwiLi9pbnB1dHNcIlxuaW1wb3J0IHsgU0VDUFRyYW5zZmVyT3V0cHV0LCBUcmFuc2ZlcmFibGVPdXRwdXQgfSBmcm9tIFwiLi9vdXRwdXRzXCJcbmltcG9ydCB7IEV4cG9ydFR4IH0gZnJvbSBcIi4vZXhwb3J0dHhcIlxuaW1wb3J0IHtcbiAgVHJhbnNhY3Rpb25FcnJvcixcbiAgQ2hhaW5JZEVycm9yLFxuICBOb0F0b21pY1VUWE9zRXJyb3IsXG4gIEFkZHJlc3NFcnJvclxufSBmcm9tIFwiLi4vLi4vdXRpbHMvZXJyb3JzXCJcbmltcG9ydCB7IFNlcmlhbGl6YXRpb24sIFNlcmlhbGl6ZWRUeXBlIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCJcbmltcG9ydCB7XG4gIEV4cG9ydERKVFhQYXJhbXMsXG4gIEV4cG9ydEtleVBhcmFtcyxcbiAgRXhwb3J0UGFyYW1zLFxuICBHZXRBdG9taWNUeFBhcmFtcyxcbiAgR2V0QXNzZXREZXNjcmlwdGlvblBhcmFtcyxcbiAgR2V0QXRvbWljVHhTdGF0dXNQYXJhbXMsXG4gIEdldFVUWE9zUGFyYW1zLFxuICBJbXBvcnRESlRYUGFyYW1zLFxuICBJbXBvcnRLZXlQYXJhbXMsXG4gIEltcG9ydFBhcmFtc1xufSBmcm9tIFwiLi9pbnRlcmZhY2VzXCJcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcbmNvbnN0IHNlcmlhbGl6YXRpb246IFNlcmlhbGl6YXRpb24gPSBTZXJpYWxpemF0aW9uLmdldEluc3RhbmNlKClcblxuLyoqXG4gKiBDbGFzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIG5vZGUncyBFVk1BUElcbiAqXG4gKiBAY2F0ZWdvcnkgUlBDQVBJc1xuICpcbiAqIEByZW1hcmtzIFRoaXMgZXh0ZW5kcyB0aGUgW1tKUlBDQVBJXV0gY2xhc3MuIFRoaXMgY2xhc3Mgc2hvdWxkIG5vdCBiZSBkaXJlY3RseSBjYWxsZWQuIEluc3RlYWQsIHVzZSB0aGUgW1tBdmFsYW5jaGUuYWRkQVBJXV0gZnVuY3Rpb24gdG8gcmVnaXN0ZXIgdGhpcyBpbnRlcmZhY2Ugd2l0aCBBdmFsYW5jaGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBFVk1BUEkgZXh0ZW5kcyBKUlBDQVBJIHtcbiAgLyoqXG4gICAqIEBpZ25vcmVcbiAgICovXG4gIHByb3RlY3RlZCBrZXljaGFpbjogS2V5Q2hhaW4gPSBuZXcgS2V5Q2hhaW4oXCJcIiwgXCJcIilcbiAgcHJvdGVjdGVkIGJsb2NrY2hhaW5JRDogc3RyaW5nID0gXCJcIlxuICBwcm90ZWN0ZWQgYmxvY2tjaGFpbkFsaWFzOiBzdHJpbmcgPSB1bmRlZmluZWRcbiAgcHJvdGVjdGVkIERKVFhBc3NldElEOiBCdWZmZXIgPSB1bmRlZmluZWRcbiAgcHJvdGVjdGVkIHR4RmVlOiBCTiA9IHVuZGVmaW5lZFxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBhbGlhcyBmb3IgdGhlIGJsb2NrY2hhaW5JRCBpZiBpdCBleGlzdHMsIG90aGVyd2lzZSByZXR1cm5zIGB1bmRlZmluZWRgLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgYWxpYXMgZm9yIHRoZSBibG9ja2NoYWluSURcbiAgICovXG4gIGdldEJsb2NrY2hhaW5BbGlhcyA9ICgpOiBzdHJpbmcgPT4ge1xuICAgIGlmICh0eXBlb2YgdGhpcy5ibG9ja2NoYWluQWxpYXMgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGNvbnN0IG5ldElEOiBudW1iZXIgPSB0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKClcbiAgICAgIGlmIChcbiAgICAgICAgbmV0SUQgaW4gRGVmYXVsdHMubmV0d29yayAmJlxuICAgICAgICB0aGlzLmJsb2NrY2hhaW5JRCBpbiBEZWZhdWx0cy5uZXR3b3JrW2Ake25ldElEfWBdXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5ibG9ja2NoYWluQWxpYXMgPVxuICAgICAgICAgIERlZmF1bHRzLm5ldHdvcmtbYCR7bmV0SUR9YF1bdGhpcy5ibG9ja2NoYWluSURdLmFsaWFzXG4gICAgICAgIHJldHVybiB0aGlzLmJsb2NrY2hhaW5BbGlhc1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ibG9ja2NoYWluQWxpYXNcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBhbGlhcyBmb3IgdGhlIGJsb2NrY2hhaW5JRC5cbiAgICpcbiAgICogQHBhcmFtIGFsaWFzIFRoZSBhbGlhcyBmb3IgdGhlIGJsb2NrY2hhaW5JRC5cbiAgICpcbiAgICovXG4gIHNldEJsb2NrY2hhaW5BbGlhcyA9IChhbGlhczogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICB0aGlzLmJsb2NrY2hhaW5BbGlhcyA9IGFsaWFzXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgYmxvY2tjaGFpbklEIGFuZCByZXR1cm5zIGl0LlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgYmxvY2tjaGFpbklEXG4gICAqL1xuICBnZXRCbG9ja2NoYWluSUQgPSAoKTogc3RyaW5nID0+IHRoaXMuYmxvY2tjaGFpbklEXG5cbiAgLyoqXG4gICAqIFJlZnJlc2ggYmxvY2tjaGFpbklELCBhbmQgaWYgYSBibG9ja2NoYWluSUQgaXMgcGFzc2VkIGluLCB1c2UgdGhhdC5cbiAgICpcbiAgICogQHBhcmFtIE9wdGlvbmFsLiBCbG9ja2NoYWluSUQgdG8gYXNzaWduLCBpZiBub25lLCB1c2VzIHRoZSBkZWZhdWx0IGJhc2VkIG9uIG5ldHdvcmtJRC5cbiAgICpcbiAgICogQHJldHVybnMgQSBib29sZWFuIGlmIHRoZSBibG9ja2NoYWluSUQgd2FzIHN1Y2Nlc3NmdWxseSByZWZyZXNoZWQuXG4gICAqL1xuICByZWZyZXNoQmxvY2tjaGFpbklEID0gKGJsb2NrY2hhaW5JRDogc3RyaW5nID0gdW5kZWZpbmVkKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgbmV0SUQ6IG51bWJlciA9IHRoaXMuY29yZS5nZXROZXR3b3JrSUQoKVxuICAgIGlmIChcbiAgICAgIHR5cGVvZiBibG9ja2NoYWluSUQgPT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgIHR5cGVvZiBEZWZhdWx0cy5uZXR3b3JrW2Ake25ldElEfWBdICE9PSBcInVuZGVmaW5lZFwiXG4gICAgKSB7XG4gICAgICB0aGlzLmJsb2NrY2hhaW5JRCA9IERlZmF1bHRzLm5ldHdvcmtbYCR7bmV0SUR9YF0uQy5ibG9ja2NoYWluSUQgLy9kZWZhdWx0IHRvIEMtQ2hhaW5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBibG9ja2NoYWluSUQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHRoaXMuYmxvY2tjaGFpbklEID0gYmxvY2tjaGFpbklEXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGFuIGFkZHJlc3Mgc3RyaW5nIGFuZCByZXR1cm5zIGl0cyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRhdGlvbiBpZiB2YWxpZC5cbiAgICpcbiAgICogQHJldHVybnMgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIGFkZHJlc3MgaWYgdmFsaWQsIHVuZGVmaW5lZCBpZiBub3QgdmFsaWQuXG4gICAqL1xuICBwYXJzZUFkZHJlc3MgPSAoYWRkcjogc3RyaW5nKTogQnVmZmVyID0+IHtcbiAgICBjb25zdCBhbGlhczogc3RyaW5nID0gdGhpcy5nZXRCbG9ja2NoYWluQWxpYXMoKVxuICAgIGNvbnN0IGJsb2NrY2hhaW5JRDogc3RyaW5nID0gdGhpcy5nZXRCbG9ja2NoYWluSUQoKVxuICAgIHJldHVybiBiaW50b29scy5wYXJzZUFkZHJlc3MoXG4gICAgICBhZGRyLFxuICAgICAgYmxvY2tjaGFpbklELFxuICAgICAgYWxpYXMsXG4gICAgICBFVk1Db25zdGFudHMuQUREUkVTU0xFTkdUSFxuICAgIClcbiAgfVxuXG4gIGFkZHJlc3NGcm9tQnVmZmVyID0gKGFkZHJlc3M6IEJ1ZmZlcik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgY2hhaW5JRDogc3RyaW5nID0gdGhpcy5nZXRCbG9ja2NoYWluQWxpYXMoKVxuICAgICAgPyB0aGlzLmdldEJsb2NrY2hhaW5BbGlhcygpXG4gICAgICA6IHRoaXMuZ2V0QmxvY2tjaGFpbklEKClcbiAgICBjb25zdCB0eXBlOiBTZXJpYWxpemVkVHlwZSA9IFwiYmVjaDMyXCJcbiAgICByZXR1cm4gc2VyaWFsaXphdGlvbi5idWZmZXJUb1R5cGUoXG4gICAgICBhZGRyZXNzLFxuICAgICAgdHlwZSxcbiAgICAgIHRoaXMuY29yZS5nZXRIUlAoKSxcbiAgICAgIGNoYWluSURcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGFuIGFzc2V0cyBuYW1lIGFuZCBzeW1ib2wuXG4gICAqXG4gICAqIEBwYXJhbSBhc3NldElEIEVpdGhlciBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IG9yIGFuIGI1OCBzZXJpYWxpemVkIHN0cmluZyBmb3IgdGhlIEFzc2V0SUQgb3IgaXRzIGFsaWFzLlxuICAgKlxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBBc3NldCB3aXRoIGtleXMgXCJuYW1lXCIsIFwic3ltYm9sXCIsIFwiYXNzZXRJRFwiIGFuZCBcImRlbm9taW5hdGlvblwiLlxuICAgKi9cbiAgZ2V0QXNzZXREZXNjcmlwdGlvbiA9IGFzeW5jIChhc3NldElEOiBCdWZmZXIgfCBzdHJpbmcpOiBQcm9taXNlPGFueT4gPT4ge1xuICAgIGxldCBhc3NldDogc3RyaW5nXG4gICAgaWYgKHR5cGVvZiBhc3NldElEICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICBhc3NldCA9IGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRClcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzZXQgPSBhc3NldElEXG4gICAgfVxuXG4gICAgY29uc3QgcGFyYW1zOiBHZXRBc3NldERlc2NyaXB0aW9uUGFyYW1zID0ge1xuICAgICAgYXNzZXRJRDogYXNzZXRcbiAgICB9XG5cbiAgICBjb25zdCB0bXBCYXNlVVJMOiBzdHJpbmcgPSB0aGlzLmdldEJhc2VVUkwoKVxuXG4gICAgLy8gc2V0IGJhc2UgdXJsIHRvIGdldCBhc3NldCBkZXNjcmlwdGlvblxuICAgIHRoaXMuc2V0QmFzZVVSTChcIi9leHQvYmMvWFwiKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxuICAgICAgXCJhdm0uZ2V0QXNzZXREZXNjcmlwdGlvblwiLFxuICAgICAgcGFyYW1zXG4gICAgKVxuXG4gICAgLy8gc2V0IGJhc2UgdXJsIGJhY2sgd2hhdCBpdCBvcmlnaW5hbGx5IHdhc1xuICAgIHRoaXMuc2V0QmFzZVVSTCh0bXBCYXNlVVJMKVxuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiByZXNwb25zZS5kYXRhLnJlc3VsdC5uYW1lLFxuICAgICAgc3ltYm9sOiByZXNwb25zZS5kYXRhLnJlc3VsdC5zeW1ib2wsXG4gICAgICBhc3NldElEOiBiaW50b29scy5jYjU4RGVjb2RlKHJlc3BvbnNlLmRhdGEucmVzdWx0LmFzc2V0SUQpLFxuICAgICAgZGVub21pbmF0aW9uOiBwYXJzZUludChyZXNwb25zZS5kYXRhLnJlc3VsdC5kZW5vbWluYXRpb24sIDEwKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaGVzIHRoZSBESlRYIEFzc2V0SUQgYW5kIHJldHVybnMgaXQgaW4gYSBQcm9taXNlLlxuICAgKlxuICAgKiBAcGFyYW0gcmVmcmVzaCBUaGlzIGZ1bmN0aW9uIGNhY2hlcyB0aGUgcmVzcG9uc2UuIFJlZnJlc2ggPSB0cnVlIHdpbGwgYnVzdCB0aGUgY2FjaGUuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSB0aGUgcHJvdmlkZWQgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgREpUWCBBc3NldElEXG4gICAqL1xuICBnZXRESlRYQXNzZXRJRCA9IGFzeW5jIChyZWZyZXNoOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPEJ1ZmZlcj4gPT4ge1xuICAgIGlmICh0eXBlb2YgdGhpcy5ESlRYQXNzZXRJRCA9PT0gXCJ1bmRlZmluZWRcIiB8fCByZWZyZXNoKSB7XG4gICAgICBjb25zdCBhc3NldDogQXNzZXQgPSBhd2FpdCB0aGlzLmdldEFzc2V0RGVzY3JpcHRpb24oUHJpbWFyeUFzc2V0QWxpYXMpXG4gICAgICB0aGlzLkRKVFhBc3NldElEID0gYXNzZXQuYXNzZXRJRFxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ESlRYQXNzZXRJRFxuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyB0aGUgZGVmYXVsdHMgYW5kIHNldHMgdGhlIGNhY2hlIHRvIGEgc3BlY2lmaWMgREpUWCBBc3NldElEXG4gICAqXG4gICAqIEBwYXJhbSBkanR4QXNzZXRJRCBBIGNiNTggc3RyaW5nIG9yIEJ1ZmZlciByZXByZXNlbnRpbmcgdGhlIERKVFggQXNzZXRJRFxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgdGhlIHByb3ZpZGVkIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIERKVFggQXNzZXRJRFxuICAgKi9cbiAgc2V0REpUWEFzc2V0SUQgPSAoZGp0eEFzc2V0SUQ6IHN0cmluZyB8IEJ1ZmZlcikgPT4ge1xuICAgIGlmICh0eXBlb2YgZGp0eEFzc2V0SUQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGRqdHhBc3NldElEID0gYmludG9vbHMuY2I1OERlY29kZShkanR4QXNzZXRJRClcbiAgICB9XG4gICAgdGhpcy5ESlRYQXNzZXRJRCA9IGRqdHhBc3NldElEXG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGVmYXVsdCB0eCBmZWUgZm9yIHRoaXMgY2hhaW4uXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBkZWZhdWx0IHR4IGZlZSBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XG4gICAqL1xuICBnZXREZWZhdWx0VHhGZWUgPSAoKTogQk4gPT4ge1xuICAgIHJldHVybiB0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKCkgaW4gRGVmYXVsdHMubmV0d29ya1xuICAgICAgPyBuZXcgQk4oRGVmYXVsdHMubmV0d29ya1t0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKCldW1wiQ1wiXVtcInR4RmVlXCJdKVxuICAgICAgOiBuZXcgQk4oMClcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIHRoZSBhbW91bnQgb2YgW2Fzc2V0SURdIGZvciB0aGUgZ2l2ZW4gYWRkcmVzcyBpbiB0aGUgc3RhdGUgb2YgdGhlIGdpdmVuIGJsb2NrIG51bWJlci5cbiAgICogXCJsYXRlc3RcIiwgXCJwZW5kaW5nXCIsIGFuZCBcImFjY2VwdGVkXCIgbWV0YSBibG9jayBudW1iZXJzIGFyZSBhbHNvIGFsbG93ZWQuXG4gICAqXG4gICAqIEBwYXJhbSBoZXhBZGRyZXNzIFRoZSBoZXggcmVwcmVzZW50YXRpb24gb2YgdGhlIGFkZHJlc3NcbiAgICogQHBhcmFtIGJsb2NrSGVpZ2h0IFRoZSBibG9jayBoZWlnaHRcbiAgICogQHBhcmFtIGFzc2V0SUQgVGhlIGFzc2V0IElEXG4gICAqXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIG9iamVjdCBjb250YWluaW5nIHRoZSBiYWxhbmNlXG4gICAqL1xuICBnZXRBc3NldEJhbGFuY2UgPSBhc3luYyAoXG4gICAgaGV4QWRkcmVzczogc3RyaW5nLFxuICAgIGJsb2NrSGVpZ2h0OiBzdHJpbmcsXG4gICAgYXNzZXRJRDogc3RyaW5nXG4gICk6IFByb21pc2U8b2JqZWN0PiA9PiB7XG4gICAgY29uc3QgcGFyYW1zOiBzdHJpbmdbXSA9IFtoZXhBZGRyZXNzLCBibG9ja0hlaWdodCwgYXNzZXRJRF1cblxuICAgIGNvbnN0IG1ldGhvZDogc3RyaW5nID0gXCJldGhfZ2V0QXNzZXRCYWxhbmNlXCJcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSBcImV4dC9iYy9DL3JwY1wiXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXG4gICAgICBtZXRob2QsXG4gICAgICBwYXJhbXMsXG4gICAgICBwYXRoXG4gICAgKVxuICAgIHJldHVybiByZXNwb25zZS5kYXRhXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RhdHVzIG9mIGEgcHJvdmlkZWQgYXRvbWljIHRyYW5zYWN0aW9uIElEIGJ5IGNhbGxpbmcgdGhlIG5vZGUncyBgZ2V0QXRvbWljVHhTdGF0dXNgIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHR4SUQgVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJhbnNhY3Rpb24gSURcbiAgICpcbiAgICogQHJldHVybnMgUmV0dXJucyBhIFByb21pc2Ugc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHN0YXR1cyByZXRyaWV2ZWQgZnJvbSB0aGUgbm9kZVxuICAgKi9cbiAgZ2V0QXRvbWljVHhTdGF0dXMgPSBhc3luYyAodHhJRDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBjb25zdCBwYXJhbXM6IEdldEF0b21pY1R4U3RhdHVzUGFyYW1zID0ge1xuICAgICAgdHhJRFxuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxuICAgICAgXCJkanR4LmdldEF0b21pY1R4U3RhdHVzXCIsXG4gICAgICBwYXJhbXNcbiAgICApXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnN0YXR1c1xuICAgICAgPyByZXNwb25zZS5kYXRhLnJlc3VsdC5zdGF0dXNcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0cmFuc2FjdGlvbiBkYXRhIG9mIGEgcHJvdmlkZWQgdHJhbnNhY3Rpb24gSUQgYnkgY2FsbGluZyB0aGUgbm9kZSdzIGBnZXRBdG9taWNUeGAgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0gdHhJRCBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0cmFuc2FjdGlvbiBJRFxuICAgKlxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBzdHJpbmcgY29udGFpbmluZyB0aGUgYnl0ZXMgcmV0cmlldmVkIGZyb20gdGhlIG5vZGVcbiAgICovXG4gIGdldEF0b21pY1R4ID0gYXN5bmMgKHR4SUQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgY29uc3QgcGFyYW1zOiBHZXRBdG9taWNUeFBhcmFtcyA9IHtcbiAgICAgIHR4SURcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcbiAgICAgIFwiZGp0eC5nZXRBdG9taWNUeFwiLFxuICAgICAgcGFyYW1zXG4gICAgKVxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC50eFxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHR4IGZlZSBmb3IgdGhpcyBjaGFpbi5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIHR4IGZlZSBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XG4gICAqL1xuICBnZXRUeEZlZSA9ICgpOiBCTiA9PiB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnR4RmVlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLnR4RmVlID0gdGhpcy5nZXREZWZhdWx0VHhGZWUoKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy50eEZlZVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgQU5UIChBdmFsYW5jaGUgTmF0aXZlIFRva2VuKSBhc3NldHMgaW5jbHVkaW5nIERKVFggZnJvbSB0aGUgQy1DaGFpbiB0byBhbiBhY2NvdW50IG9uIHRoZSBYLUNoYWluLlxuICAgKlxuICAgKiBBZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbXVzdCBjYWxsIHRoZSBYLUNoYWlu4oCZcyBpbXBvcnQgbWV0aG9kIHRvIGNvbXBsZXRlIHRoZSB0cmFuc2Zlci5cbiAgICpcbiAgICogQHBhcmFtIHVzZXJuYW1lIFRoZSBLZXlzdG9yZSB1c2VyIHRoYXQgY29udHJvbHMgdGhlIFgtQ2hhaW4gYWNjb3VudCBzcGVjaWZpZWQgaW4gYHRvYFxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIG9mIHRoZSBLZXlzdG9yZSB1c2VyXG4gICAqIEBwYXJhbSB0byBUaGUgYWNjb3VudCBvbiB0aGUgWC1DaGFpbiB0byBzZW5kIHRoZSBESlRYIHRvLlxuICAgKiBAcGFyYW0gYW1vdW50IEFtb3VudCBvZiBhc3NldCB0byBleHBvcnQgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxuICAgKiBAcGFyYW0gYXNzZXRJRCBUaGUgYXNzZXQgaWQgd2hpY2ggaXMgYmVpbmcgc2VudFxuICAgKlxuICAgKiBAcmV0dXJucyBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB0cmFuc2FjdGlvbiBpZFxuICAgKi9cbiAgZXhwb3J0ID0gYXN5bmMgKFxuICAgIHVzZXJuYW1lOiBzdHJpbmcsXG4gICAgcGFzc3dvcmQ6IHN0cmluZyxcbiAgICB0bzogc3RyaW5nLFxuICAgIGFtb3VudDogQk4sXG4gICAgYXNzZXRJRDogc3RyaW5nXG4gICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgY29uc3QgcGFyYW1zOiBFeHBvcnRQYXJhbXMgPSB7XG4gICAgICB0byxcbiAgICAgIGFtb3VudDogYW1vdW50LnRvU3RyaW5nKDEwKSxcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBhc3NldElEXG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxuICAgICAgXCJkanR4LmV4cG9ydFwiLFxuICAgICAgcGFyYW1zXG4gICAgKVxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXG4gICAgICA/IHJlc3BvbnNlLmRhdGEucmVzdWx0LnR4SURcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIERKVFggZnJvbSB0aGUgQy1DaGFpbiB0byBhbiBhY2NvdW50IG9uIHRoZSBYLUNoYWluLlxuICAgKlxuICAgKiBBZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbXVzdCBjYWxsIHRoZSBYLUNoYWlu4oCZcyBpbXBvcnRESlRYIG1ldGhvZCB0byBjb21wbGV0ZSB0aGUgdHJhbnNmZXIuXG4gICAqXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgS2V5c3RvcmUgdXNlciB0aGF0IGNvbnRyb2xzIHRoZSBYLUNoYWluIGFjY291bnQgc3BlY2lmaWVkIGluIGB0b2BcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCBvZiB0aGUgS2V5c3RvcmUgdXNlclxuICAgKiBAcGFyYW0gdG8gVGhlIGFjY291bnQgb24gdGhlIFgtQ2hhaW4gdG8gc2VuZCB0aGUgREpUWCB0by5cbiAgICogQHBhcmFtIGFtb3VudCBBbW91bnQgb2YgREpUWCB0byBleHBvcnQgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxuICAgKlxuICAgKiBAcmV0dXJucyBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB0cmFuc2FjdGlvbiBpZFxuICAgKi9cbiAgZXhwb3J0REpUWCA9IGFzeW5jIChcbiAgICB1c2VybmFtZTogc3RyaW5nLFxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXG4gICAgdG86IHN0cmluZyxcbiAgICBhbW91bnQ6IEJOXG4gICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgY29uc3QgcGFyYW1zOiBFeHBvcnRESlRYUGFyYW1zID0ge1xuICAgICAgdG8sXG4gICAgICBhbW91bnQ6IGFtb3VudC50b1N0cmluZygxMCksXG4gICAgICB1c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkXG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxuICAgICAgXCJkanR4LmV4cG9ydERKVFhcIixcbiAgICAgIHBhcmFtc1xuICAgIClcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQudHhJRFxuICAgICAgPyByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXG4gICAgICA6IHJlc3BvbnNlLmRhdGEucmVzdWx0XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBVVFhPcyByZWxhdGVkIHRvIHRoZSBhZGRyZXNzZXMgcHJvdmlkZWQgZnJvbSB0aGUgbm9kZSdzIGBnZXRVVFhPc2AgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0gYWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyBjYjU4IHN0cmluZ3Mgb3IgYWRkcmVzc2VzIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9c1xuICAgKiBAcGFyYW0gc291cmNlQ2hhaW4gQSBzdHJpbmcgZm9yIHRoZSBjaGFpbiB0byBsb29rIGZvciB0aGUgVVRYTydzLiBEZWZhdWx0IGlzIHRvIHVzZSB0aGlzIGNoYWluLCBidXQgaWYgZXhwb3J0ZWQgVVRYT3MgZXhpc3RcbiAgICogZnJvbSBvdGhlciBjaGFpbnMsIHRoaXMgY2FuIHVzZWQgdG8gcHVsbCB0aGVtIGluc3RlYWQuXG4gICAqIEBwYXJhbSBsaW1pdCBPcHRpb25hbC4gUmV0dXJucyBhdCBtb3N0IFtsaW1pdF0gYWRkcmVzc2VzLiBJZiBbbGltaXRdID09IDAgb3IgPiBbbWF4VVRYT3NUb0ZldGNoXSwgZmV0Y2hlcyB1cCB0byBbbWF4VVRYT3NUb0ZldGNoXS5cbiAgICogQHBhcmFtIHN0YXJ0SW5kZXggT3B0aW9uYWwuIFtTdGFydEluZGV4XSBkZWZpbmVzIHdoZXJlIHRvIHN0YXJ0IGZldGNoaW5nIFVUWE9zIChmb3IgcGFnaW5hdGlvbi4pXG4gICAqIFVUWE9zIGZldGNoZWQgYXJlIGZyb20gYWRkcmVzc2VzIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiBbU3RhcnRJbmRleC5BZGRyZXNzXVxuICAgKiBGb3IgYWRkcmVzcyBbU3RhcnRJbmRleC5BZGRyZXNzXSwgb25seSBVVFhPcyB3aXRoIElEcyBncmVhdGVyIHRoYW4gW1N0YXJ0SW5kZXguVXR4b10gd2lsbCBiZSByZXR1cm5lZC5cbiAgICovXG4gIGdldFVUWE9zID0gYXN5bmMgKFxuICAgIGFkZHJlc3Nlczogc3RyaW5nW10gfCBzdHJpbmcsXG4gICAgc291cmNlQ2hhaW46IHN0cmluZyA9IHVuZGVmaW5lZCxcbiAgICBsaW1pdDogbnVtYmVyID0gMCxcbiAgICBzdGFydEluZGV4OiBJbmRleCA9IHVuZGVmaW5lZFxuICApOiBQcm9taXNlPHtcbiAgICBudW1GZXRjaGVkOiBudW1iZXJcbiAgICB1dHhvc1xuICAgIGVuZEluZGV4OiBJbmRleFxuICB9PiA9PiB7XG4gICAgaWYgKHR5cGVvZiBhZGRyZXNzZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGFkZHJlc3NlcyA9IFthZGRyZXNzZXNdXG4gICAgfVxuXG4gICAgY29uc3QgcGFyYW1zOiBHZXRVVFhPc1BhcmFtcyA9IHtcbiAgICAgIGFkZHJlc3NlczogYWRkcmVzc2VzLFxuICAgICAgbGltaXRcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzdGFydEluZGV4ICE9PSBcInVuZGVmaW5lZFwiICYmIHN0YXJ0SW5kZXgpIHtcbiAgICAgIHBhcmFtcy5zdGFydEluZGV4ID0gc3RhcnRJbmRleFxuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygc291cmNlQ2hhaW4gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHBhcmFtcy5zb3VyY2VDaGFpbiA9IHNvdXJjZUNoYWluXG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXG4gICAgICBcImRqdHguZ2V0VVRYT3NcIixcbiAgICAgIHBhcmFtc1xuICAgIClcbiAgICBjb25zdCB1dHhvczogVVRYT1NldCA9IG5ldyBVVFhPU2V0KClcbiAgICBjb25zdCBkYXRhOiBhbnkgPSByZXNwb25zZS5kYXRhLnJlc3VsdC51dHhvc1xuICAgIHV0eG9zLmFkZEFycmF5KGRhdGEsIGZhbHNlKVxuICAgIHJlc3BvbnNlLmRhdGEucmVzdWx0LnV0eG9zID0gdXR4b3NcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIEFOVCAoQXZhbGFuY2hlIE5hdGl2ZSBUb2tlbikgYXNzZXRzIGluY2x1ZGluZyBESlRYIGZyb20gYW4gYWNjb3VudCBvbiB0aGUgWC1DaGFpbiB0byBhbiBhZGRyZXNzIG9uIHRoZSBDLUNoYWluLiBUaGlzIHRyYW5zYWN0aW9uXG4gICAqIG11c3QgYmUgc2lnbmVkIHdpdGggdGhlIGtleSBvZiB0aGUgYWNjb3VudCB0aGF0IHRoZSBhc3NldCBpcyBzZW50IGZyb20gYW5kIHdoaWNoIHBheXNcbiAgICogdGhlIHRyYW5zYWN0aW9uIGZlZS5cbiAgICpcbiAgICogQHBhcmFtIHVzZXJuYW1lIFRoZSBLZXlzdG9yZSB1c2VyIHRoYXQgY29udHJvbHMgdGhlIGFjY291bnQgc3BlY2lmaWVkIGluIGB0b2BcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCBvZiB0aGUgS2V5c3RvcmUgdXNlclxuICAgKiBAcGFyYW0gdG8gVGhlIGFkZHJlc3Mgb2YgdGhlIGFjY291bnQgdGhlIGFzc2V0IGlzIHNlbnQgdG8uXG4gICAqIEBwYXJhbSBzb3VyY2VDaGFpbiBUaGUgY2hhaW5JRCB3aGVyZSB0aGUgZnVuZHMgYXJlIGNvbWluZyBmcm9tLiBFeDogXCJYXCJcbiAgICpcbiAgICogQHJldHVybnMgUHJvbWlzZSBmb3IgYSBzdHJpbmcgZm9yIHRoZSB0cmFuc2FjdGlvbiwgd2hpY2ggc2hvdWxkIGJlIHNlbnQgdG8gdGhlIG5ldHdvcmtcbiAgICogYnkgY2FsbGluZyBpc3N1ZVR4LlxuICAgKi9cbiAgaW1wb3J0ID0gYXN5bmMgKFxuICAgIHVzZXJuYW1lOiBzdHJpbmcsXG4gICAgcGFzc3dvcmQ6IHN0cmluZyxcbiAgICB0bzogc3RyaW5nLFxuICAgIHNvdXJjZUNoYWluOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBjb25zdCBwYXJhbXM6IEltcG9ydFBhcmFtcyA9IHtcbiAgICAgIHRvLFxuICAgICAgc291cmNlQ2hhaW4sXG4gICAgICB1c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkXG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxuICAgICAgXCJkanR4LmltcG9ydFwiLFxuICAgICAgcGFyYW1zXG4gICAgKVxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXG4gICAgICA/IHJlc3BvbnNlLmRhdGEucmVzdWx0LnR4SURcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIERKVFggZnJvbSBhbiBhY2NvdW50IG9uIHRoZSBYLUNoYWluIHRvIGFuIGFkZHJlc3Mgb24gdGhlIEMtQ2hhaW4uIFRoaXMgdHJhbnNhY3Rpb25cbiAgICogbXVzdCBiZSBzaWduZWQgd2l0aCB0aGUga2V5IG9mIHRoZSBhY2NvdW50IHRoYXQgdGhlIERKVFggaXMgc2VudCBmcm9tIGFuZCB3aGljaCBwYXlzXG4gICAqIHRoZSB0cmFuc2FjdGlvbiBmZWUuXG4gICAqXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgS2V5c3RvcmUgdXNlciB0aGF0IGNvbnRyb2xzIHRoZSBhY2NvdW50IHNwZWNpZmllZCBpbiBgdG9gXG4gICAqIEBwYXJhbSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgb2YgdGhlIEtleXN0b3JlIHVzZXJcbiAgICogQHBhcmFtIHRvIFRoZSBhZGRyZXNzIG9mIHRoZSBhY2NvdW50IHRoZSBESlRYIGlzIHNlbnQgdG8uIFRoaXMgbXVzdCBiZSB0aGUgc2FtZSBhcyB0aGUgdG9cbiAgICogYXJndW1lbnQgaW4gdGhlIGNvcnJlc3BvbmRpbmcgY2FsbCB0byB0aGUgWC1DaGFpbuKAmXMgZXhwb3J0REpUWFxuICAgKiBAcGFyYW0gc291cmNlQ2hhaW4gVGhlIGNoYWluSUQgd2hlcmUgdGhlIGZ1bmRzIGFyZSBjb21pbmcgZnJvbS5cbiAgICpcbiAgICogQHJldHVybnMgUHJvbWlzZSBmb3IgYSBzdHJpbmcgZm9yIHRoZSB0cmFuc2FjdGlvbiwgd2hpY2ggc2hvdWxkIGJlIHNlbnQgdG8gdGhlIG5ldHdvcmtcbiAgICogYnkgY2FsbGluZyBpc3N1ZVR4LlxuICAgKi9cbiAgaW1wb3J0REpUWCA9IGFzeW5jIChcbiAgICB1c2VybmFtZTogc3RyaW5nLFxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXG4gICAgdG86IHN0cmluZyxcbiAgICBzb3VyY2VDaGFpbjogc3RyaW5nXG4gICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgY29uc3QgcGFyYW1zOiBJbXBvcnRESlRYUGFyYW1zID0ge1xuICAgICAgdG8sXG4gICAgICBzb3VyY2VDaGFpbixcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmRcbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXG4gICAgICBcImRqdHguaW1wb3J0REpUWFwiLFxuICAgICAgcGFyYW1zXG4gICAgKVxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXG4gICAgICA/IHJlc3BvbnNlLmRhdGEucmVzdWx0LnR4SURcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlIGEgdXNlciBjb250cm9sIG92ZXIgYW4gYWRkcmVzcyBieSBwcm92aWRpbmcgdGhlIHByaXZhdGUga2V5IHRoYXQgY29udHJvbHMgdGhlIGFkZHJlc3MuXG4gICAqXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgbmFtZSBvZiB0aGUgdXNlciB0byBzdG9yZSB0aGUgcHJpdmF0ZSBrZXlcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0aGF0IHVubG9ja3MgdGhlIHVzZXJcbiAgICogQHBhcmFtIHByaXZhdGVLZXkgQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBwcml2YXRlIGtleSBpbiB0aGUgdm1cInMgZm9ybWF0XG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBhZGRyZXNzIGZvciB0aGUgaW1wb3J0ZWQgcHJpdmF0ZSBrZXkuXG4gICAqL1xuICBpbXBvcnRLZXkgPSBhc3luYyAoXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcbiAgICBwYXNzd29yZDogc3RyaW5nLFxuICAgIHByaXZhdGVLZXk6IHN0cmluZ1xuICApOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGNvbnN0IHBhcmFtczogSW1wb3J0S2V5UGFyYW1zID0ge1xuICAgICAgdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIHByaXZhdGVLZXlcbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXG4gICAgICBcImRqdHguaW1wb3J0S2V5XCIsXG4gICAgICBwYXJhbXNcbiAgICApXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LmFkZHJlc3NcbiAgICAgID8gcmVzcG9uc2UuZGF0YS5yZXN1bHQuYWRkcmVzc1xuICAgICAgOiByZXNwb25zZS5kYXRhLnJlc3VsdFxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIHRoZSBub2RlJ3MgaXNzdWVUeCBtZXRob2QgZnJvbSB0aGUgQVBJIGFuZCByZXR1cm5zIHRoZSByZXN1bHRpbmcgdHJhbnNhY3Rpb24gSUQgYXMgYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB0eCBBIHN0cmluZywge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0sIG9yIFtbVHhdXSByZXByZXNlbnRpbmcgYSB0cmFuc2FjdGlvblxuICAgKlxuICAgKiBAcmV0dXJucyBBIFByb21pc2Ugc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdHJhbnNhY3Rpb24gSUQgb2YgdGhlIHBvc3RlZCB0cmFuc2FjdGlvbi5cbiAgICovXG4gIGlzc3VlVHggPSBhc3luYyAodHg6IHN0cmluZyB8IEJ1ZmZlciB8IFR4KTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICBsZXQgVHJhbnNhY3Rpb246IHN0cmluZyA9IFwiXCJcbiAgICBpZiAodHlwZW9mIHR4ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBUcmFuc2FjdGlvbiA9IHR4XG4gICAgfSBlbHNlIGlmICh0eCBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgY29uc3QgdHhvYmo6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4b2JqLmZyb21CdWZmZXIodHgpXG4gICAgICBUcmFuc2FjdGlvbiA9IHR4b2JqLnRvU3RyaW5nKClcbiAgICB9IGVsc2UgaWYgKHR4IGluc3RhbmNlb2YgVHgpIHtcbiAgICAgIFRyYW5zYWN0aW9uID0gdHgudG9TdHJpbmcoKVxuICAgIH0gZWxzZSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgdGhyb3cgbmV3IFRyYW5zYWN0aW9uRXJyb3IoXG4gICAgICAgIFwiRXJyb3IgLSBkanR4Lmlzc3VlVHg6IHByb3ZpZGVkIHR4IGlzIG5vdCBleHBlY3RlZCB0eXBlIG9mIHN0cmluZywgQnVmZmVyLCBvciBUeFwiXG4gICAgICApXG4gICAgfVxuICAgIGNvbnN0IHBhcmFtczogSXNzdWVUeFBhcmFtcyA9IHtcbiAgICAgIHR4OiBUcmFuc2FjdGlvbi50b1N0cmluZygpXG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxuICAgICAgXCJkanR4Lmlzc3VlVHhcIixcbiAgICAgIHBhcmFtc1xuICAgIClcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQudHhJRFxuICAgICAgPyByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXG4gICAgICA6IHJlc3BvbnNlLmRhdGEucmVzdWx0XG4gIH1cblxuICAvKipcbiAgICogRXhwb3J0cyB0aGUgcHJpdmF0ZSBrZXkgZm9yIGFuIGFkZHJlc3MuXG4gICAqXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgbmFtZSBvZiB0aGUgdXNlciB3aXRoIHRoZSBwcml2YXRlIGtleVxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHVzZWQgdG8gZGVjcnlwdCB0aGUgcHJpdmF0ZSBrZXlcbiAgICogQHBhcmFtIGFkZHJlc3MgVGhlIGFkZHJlc3Mgd2hvc2UgcHJpdmF0ZSBrZXkgc2hvdWxkIGJlIGV4cG9ydGVkXG4gICAqXG4gICAqIEByZXR1cm5zIFByb21pc2Ugd2l0aCB0aGUgZGVjcnlwdGVkIHByaXZhdGUga2V5IGFuZCBwcml2YXRlIGtleSBoZXggYXMgc3RvcmUgaW4gdGhlIGRhdGFiYXNlXG4gICAqL1xuICBleHBvcnRLZXkgPSBhc3luYyAoXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcbiAgICBwYXNzd29yZDogc3RyaW5nLFxuICAgIGFkZHJlc3M6IHN0cmluZ1xuICApOiBQcm9taXNlPG9iamVjdD4gPT4ge1xuICAgIGNvbnN0IHBhcmFtczogRXhwb3J0S2V5UGFyYW1zID0ge1xuICAgICAgdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIGFkZHJlc3NcbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXG4gICAgICBcImRqdHguZXhwb3J0S2V5XCIsXG4gICAgICBwYXJhbXNcbiAgICApXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIGZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYW4gdW5zaWduZWQgSW1wb3J0IFR4LiBGb3IgbW9yZSBncmFudWxhciBjb250cm9sLCB5b3UgbWF5IGNyZWF0ZSB5b3VyIG93blxuICAgKiBbW1Vuc2lnbmVkVHhdXSBtYW51YWxseSAod2l0aCB0aGVpciBjb3JyZXNwb25kaW5nIFtbVHJhbnNmZXJhYmxlSW5wdXRdXXMsIFtbVHJhbnNmZXJhYmxlT3V0cHV0XV1zKS5cbiAgICpcbiAgICogQHBhcmFtIHV0eG9zZXQgQSBzZXQgb2YgVVRYT3MgdGhhdCB0aGUgdHJhbnNhY3Rpb24gaXMgYnVpbHQgb25cbiAgICogQHBhcmFtIHRvQWRkcmVzcyBUaGUgYWRkcmVzcyB0byBzZW5kIHRoZSBmdW5kc1xuICAgKiBAcGFyYW0gb3duZXJBZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyBiZWluZyB1c2VkIHRvIGltcG9ydFxuICAgKiBAcGFyYW0gc291cmNlQ2hhaW4gVGhlIGNoYWluaWQgZm9yIHdoZXJlIHRoZSBpbXBvcnQgaXMgY29taW5nIGZyb21cbiAgICogQHBhcmFtIGZyb21BZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyBiZWluZyB1c2VkIHRvIHNlbmQgdGhlIGZ1bmRzIGZyb20gdGhlIFVUWE9zIHByb3ZpZGVkXG4gICAqXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIChbW1Vuc2lnbmVkVHhdXSkgd2hpY2ggY29udGFpbnMgYSBbW0ltcG9ydFR4XV0uXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqIFRoaXMgaGVscGVyIGV4aXN0cyBiZWNhdXNlIHRoZSBlbmRwb2ludCBBUEkgc2hvdWxkIGJlIHRoZSBwcmltYXJ5IHBvaW50IG9mIGVudHJ5IGZvciBtb3N0IGZ1bmN0aW9uYWxpdHkuXG4gICAqL1xuICBidWlsZEltcG9ydFR4ID0gYXN5bmMgKFxuICAgIHV0eG9zZXQ6IFVUWE9TZXQsXG4gICAgdG9BZGRyZXNzOiBzdHJpbmcsXG4gICAgb3duZXJBZGRyZXNzZXM6IHN0cmluZ1tdLFxuICAgIHNvdXJjZUNoYWluOiBCdWZmZXIgfCBzdHJpbmcsXG4gICAgZnJvbUFkZHJlc3Nlczogc3RyaW5nW10sXG4gICAgZmVlOiBCTiA9IG5ldyBCTigwKVxuICApOiBQcm9taXNlPFVuc2lnbmVkVHg+ID0+IHtcbiAgICBjb25zdCBmcm9tOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxuICAgICAgZnJvbUFkZHJlc3NlcyxcbiAgICAgIFwiYnVpbGRJbXBvcnRUeFwiXG4gICAgKS5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSkpXG4gICAgbGV0IHNyY0NoYWluOiBzdHJpbmcgPSB1bmRlZmluZWRcblxuICAgIGlmICh0eXBlb2Ygc291cmNlQ2hhaW4gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIC8vIGlmIHRoZXJlIGlzIGEgc291cmNlQ2hhaW4gcGFzc2VkIGluIGFuZCBpdCdzIGEgc3RyaW5nIHRoZW4gc2F2ZSB0aGUgc3RyaW5nIHZhbHVlIGFuZCBjYXN0IHRoZSBvcmlnaW5hbFxuICAgICAgLy8gdmFyaWFibGUgZnJvbSBhIHN0cmluZyB0byBhIEJ1ZmZlclxuICAgICAgc3JjQ2hhaW4gPSBzb3VyY2VDaGFpblxuICAgICAgc291cmNlQ2hhaW4gPSBiaW50b29scy5jYjU4RGVjb2RlKHNvdXJjZUNoYWluKVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0eXBlb2Ygc291cmNlQ2hhaW4gPT09IFwidW5kZWZpbmVkXCIgfHxcbiAgICAgICEoc291cmNlQ2hhaW4gaW5zdGFuY2VvZiBCdWZmZXIpXG4gICAgKSB7XG4gICAgICAvLyBpZiB0aGVyZSBpcyBubyBzb3VyY2VDaGFpbiBwYXNzZWQgaW4gb3IgdGhlIHNvdXJjZUNoYWluIGlzIGFueSBkYXRhIHR5cGUgb3RoZXIgdGhhbiBhIEJ1ZmZlciB0aGVuIHRocm93IGFuIGVycm9yXG4gICAgICB0aHJvdyBuZXcgQ2hhaW5JZEVycm9yKFxuICAgICAgICBcIkVycm9yIC0gRVZNQVBJLmJ1aWxkSW1wb3J0VHg6IHNvdXJjZUNoYWluIGlzIHVuZGVmaW5lZCBvciBpbnZhbGlkIHNvdXJjZUNoYWluIHR5cGUuXCJcbiAgICAgIClcbiAgICB9XG4gICAgY29uc3QgdXR4b1Jlc3BvbnNlOiBVVFhPUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmdldFVUWE9zKFxuICAgICAgb3duZXJBZGRyZXNzZXMsXG4gICAgICBzcmNDaGFpbixcbiAgICAgIDAsXG4gICAgICB1bmRlZmluZWRcbiAgICApXG4gICAgY29uc3QgYXRvbWljVVRYT3M6IFVUWE9TZXQgPSB1dHhvUmVzcG9uc2UudXR4b3NcbiAgICBjb25zdCBuZXR3b3JrSUQ6IG51bWJlciA9IHRoaXMuY29yZS5nZXROZXR3b3JrSUQoKVxuICAgIGNvbnN0IGRqdHhBc3NldElEOiBzdHJpbmcgPSBEZWZhdWx0cy5uZXR3b3JrW2Ake25ldHdvcmtJRH1gXS5YLmRqdHhBc3NldElEXG4gICAgY29uc3QgZGp0eEFzc2V0SURCdWY6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoZGp0eEFzc2V0SUQpXG4gICAgY29uc3QgYXRvbWljczogVVRYT1tdID0gYXRvbWljVVRYT3MuZ2V0QWxsVVRYT3MoKVxuXG4gICAgaWYgKGF0b21pY3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgTm9BdG9taWNVVFhPc0Vycm9yKFxuICAgICAgICBcIkVycm9yIC0gRVZNQVBJLmJ1aWxkSW1wb3J0VHg6IG5vIGF0b21pYyB1dHhvcyB0byBpbXBvcnRcIlxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IGJ1aWx0VW5zaWduZWRUeDogVW5zaWduZWRUeCA9IHV0eG9zZXQuYnVpbGRJbXBvcnRUeChcbiAgICAgIG5ldHdvcmtJRCxcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUodGhpcy5ibG9ja2NoYWluSUQpLFxuICAgICAgdG9BZGRyZXNzLFxuICAgICAgYXRvbWljcyxcbiAgICAgIHNvdXJjZUNoYWluLFxuICAgICAgZmVlLFxuICAgICAgZGp0eEFzc2V0SURCdWZcbiAgICApXG5cbiAgICByZXR1cm4gYnVpbHRVbnNpZ25lZFR4XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIGZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYW4gdW5zaWduZWQgRXhwb3J0IFR4LiBGb3IgbW9yZSBncmFudWxhciBjb250cm9sLCB5b3UgbWF5IGNyZWF0ZSB5b3VyIG93blxuICAgKiBbW1Vuc2lnbmVkVHhdXSBtYW51YWxseSAod2l0aCB0aGVpciBjb3JyZXNwb25kaW5nIFtbVHJhbnNmZXJhYmxlSW5wdXRdXXMsIFtbVHJhbnNmZXJhYmxlT3V0cHV0XV1zKS5cbiAgICpcbiAgICogQHBhcmFtIGFtb3VudCBUaGUgYW1vdW50IGJlaW5nIGV4cG9ydGVkIGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cbiAgICogQHBhcmFtIGFzc2V0SUQgVGhlIGFzc2V0IGlkIHdoaWNoIGlzIGJlaW5nIHNlbnRcbiAgICogQHBhcmFtIGRlc3RpbmF0aW9uQ2hhaW4gVGhlIGNoYWluaWQgZm9yIHdoZXJlIHRoZSBhc3NldHMgd2lsbCBiZSBzZW50LlxuICAgKiBAcGFyYW0gdG9BZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyB0byBzZW5kIHRoZSBmdW5kc1xuICAgKiBAcGFyYW0gZnJvbUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIGJlaW5nIHVzZWQgdG8gc2VuZCB0aGUgZnVuZHMgZnJvbSB0aGUgVVRYT3MgcHJvdmlkZWRcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIHRoYXQgY2FuIHNwZW5kIHRoZSBjaGFuZ2UgcmVtYWluaW5nIGZyb20gdGhlIHNwZW50IFVUWE9zXG4gICAqIEBwYXJhbSBhc09mIE9wdGlvbmFsLiBUaGUgdGltZXN0YW1wIHRvIHZlcmlmeSB0aGUgdHJhbnNhY3Rpb24gYWdhaW5zdCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XG4gICAqIEBwYXJhbSBsb2NrdGltZSBPcHRpb25hbC4gVGhlIGxvY2t0aW1lIGZpZWxkIGNyZWF0ZWQgaW4gdGhlIHJlc3VsdGluZyBvdXRwdXRzXG4gICAqIEBwYXJhbSB0aHJlc2hvbGQgT3B0aW9uYWwuIFRoZSBudW1iZXIgb2Ygc2lnbmF0dXJlcyByZXF1aXJlZCB0byBzcGVuZCB0aGUgZnVuZHMgaW4gdGhlIHJlc3VsdGFudCBVVFhPXG4gICAqXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIChbW1Vuc2lnbmVkVHhdXSkgd2hpY2ggY29udGFpbnMgYW4gW1tFeHBvcnRUeF1dLlxuICAgKi9cbiAgYnVpbGRFeHBvcnRUeCA9IGFzeW5jIChcbiAgICBhbW91bnQ6IEJOLFxuICAgIGFzc2V0SUQ6IEJ1ZmZlciB8IHN0cmluZyxcbiAgICBkZXN0aW5hdGlvbkNoYWluOiBCdWZmZXIgfCBzdHJpbmcsXG4gICAgZnJvbUFkZHJlc3NIZXg6IHN0cmluZyxcbiAgICBmcm9tQWRkcmVzc0JlY2g6IHN0cmluZyxcbiAgICB0b0FkZHJlc3Nlczogc3RyaW5nW10sXG4gICAgbm9uY2U6IG51bWJlciA9IDAsXG4gICAgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDApLFxuICAgIHRocmVzaG9sZDogbnVtYmVyID0gMSxcbiAgICBmZWU6IEJOID0gbmV3IEJOKDApXG4gICk6IFByb21pc2U8VW5zaWduZWRUeD4gPT4ge1xuICAgIGNvbnN0IHByZWZpeGVzOiBvYmplY3QgPSB7fVxuICAgIHRvQWRkcmVzc2VzLm1hcCgoYWRkcmVzczogc3RyaW5nKSA9PiB7XG4gICAgICBwcmVmaXhlc1thZGRyZXNzLnNwbGl0KFwiLVwiKVswXV0gPSB0cnVlXG4gICAgfSlcbiAgICBpZiAoT2JqZWN0LmtleXMocHJlZml4ZXMpLmxlbmd0aCAhPT0gMSkge1xuICAgICAgdGhyb3cgbmV3IEFkZHJlc3NFcnJvcihcbiAgICAgICAgXCJFcnJvciAtIEVWTUFQSS5idWlsZEV4cG9ydFR4OiBUbyBhZGRyZXNzZXMgbXVzdCBoYXZlIHRoZSBzYW1lIGNoYWluSUQgcHJlZml4LlwiXG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkZXN0aW5hdGlvbkNoYWluID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgQ2hhaW5JZEVycm9yKFxuICAgICAgICBcIkVycm9yIC0gRVZNQVBJLmJ1aWxkRXhwb3J0VHg6IERlc3RpbmF0aW9uIENoYWluSUQgaXMgdW5kZWZpbmVkLlwiXG4gICAgICApXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVzdGluYXRpb25DaGFpbiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgZGVzdGluYXRpb25DaGFpbiA9IGJpbnRvb2xzLmNiNThEZWNvZGUoZGVzdGluYXRpb25DaGFpbilcbiAgICB9IGVsc2UgaWYgKCEoZGVzdGluYXRpb25DaGFpbiBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICAgIHRocm93IG5ldyBDaGFpbklkRXJyb3IoXG4gICAgICAgIFwiRXJyb3IgLSBFVk1BUEkuYnVpbGRFeHBvcnRUeDogSW52YWxpZCBkZXN0aW5hdGlvbkNoYWluIHR5cGVcIlxuICAgICAgKVxuICAgIH1cbiAgICBpZiAoZGVzdGluYXRpb25DaGFpbi5sZW5ndGggIT09IDMyKSB7XG4gICAgICB0aHJvdyBuZXcgQ2hhaW5JZEVycm9yKFxuICAgICAgICBcIkVycm9yIC0gRVZNQVBJLmJ1aWxkRXhwb3J0VHg6IERlc3RpbmF0aW9uIENoYWluSUQgbXVzdCBiZSAzMiBieXRlcyBpbiBsZW5ndGguXCJcbiAgICAgIClcbiAgICB9XG4gICAgY29uc3QgYXNzZXREZXNjcmlwdGlvbjogYW55ID0gYXdhaXQgdGhpcy5nZXRBc3NldERlc2NyaXB0aW9uKFwiREpUWFwiKVxuICAgIGxldCBldm1JbnB1dHM6IEVWTUlucHV0W10gPSBbXVxuICAgIGlmIChiaW50b29scy5jYjU4RW5jb2RlKGFzc2V0RGVzY3JpcHRpb24uYXNzZXRJRCkgPT09IGFzc2V0SUQpIHtcbiAgICAgIGNvbnN0IGV2bUlucHV0OiBFVk1JbnB1dCA9IG5ldyBFVk1JbnB1dChcbiAgICAgICAgZnJvbUFkZHJlc3NIZXgsXG4gICAgICAgIGFtb3VudC5hZGQoZmVlKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgbm9uY2VcbiAgICAgIClcbiAgICAgIGV2bUlucHV0LmFkZFNpZ25hdHVyZUlkeCgwLCBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoZnJvbUFkZHJlc3NCZWNoKSlcbiAgICAgIGV2bUlucHV0cy5wdXNoKGV2bUlucHV0KVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiBhc3NldCBpZCBpc24ndCBESlRYIGFzc2V0IGlkIHRoZW4gY3JlYXRlIDIgaW5wdXRzXG4gICAgICAvLyBmaXJzdCBpbnB1dCB3aWxsIGJlIERKVFggYW5kIHdpbGwgYmUgZm9yIHRoZSBhbW91bnQgb2YgdGhlIGZlZVxuICAgICAgLy8gc2Vjb25kIGlucHV0IHdpbGwgYmUgdGhlIEFOVFxuICAgICAgY29uc3QgZXZtREpUWElucHV0OiBFVk1JbnB1dCA9IG5ldyBFVk1JbnB1dChcbiAgICAgICAgZnJvbUFkZHJlc3NIZXgsXG4gICAgICAgIGZlZSxcbiAgICAgICAgYXNzZXREZXNjcmlwdGlvbi5hc3NldElELFxuICAgICAgICBub25jZVxuICAgICAgKVxuICAgICAgZXZtREpUWElucHV0LmFkZFNpZ25hdHVyZUlkeCgwLCBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoZnJvbUFkZHJlc3NCZWNoKSlcbiAgICAgIGV2bUlucHV0cy5wdXNoKGV2bURKVFhJbnB1dClcblxuICAgICAgY29uc3QgZXZtQU5USW5wdXQ6IEVWTUlucHV0ID0gbmV3IEVWTUlucHV0KFxuICAgICAgICBmcm9tQWRkcmVzc0hleCxcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBhc3NldElELFxuICAgICAgICBub25jZVxuICAgICAgKVxuICAgICAgZXZtQU5USW5wdXQuYWRkU2lnbmF0dXJlSWR4KDAsIGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhmcm9tQWRkcmVzc0JlY2gpKVxuICAgICAgZXZtSW5wdXRzLnB1c2goZXZtQU5USW5wdXQpXG4gICAgfVxuXG4gICAgY29uc3QgdG86IEJ1ZmZlcltdID0gW11cbiAgICB0b0FkZHJlc3Nlcy5tYXAoKGFkZHJlc3M6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgICAgdG8ucHVzaChiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYWRkcmVzcykpXG4gICAgfSlcblxuICAgIGxldCBleHBvcnRlZE91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cbiAgICBjb25zdCBzZWNwVHJhbnNmZXJPdXRwdXQ6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICBhbW91bnQsXG4gICAgICB0byxcbiAgICAgIGxvY2t0aW1lLFxuICAgICAgdGhyZXNob2xkXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZU91dHB1dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYXNzZXRJRCksXG4gICAgICBzZWNwVHJhbnNmZXJPdXRwdXRcbiAgICApXG4gICAgZXhwb3J0ZWRPdXRzLnB1c2godHJhbnNmZXJhYmxlT3V0cHV0KVxuXG4gICAgLy8gbGV4aWNvZ3JhcGhpY2FsbHkgc29ydCBpbnMgYW5kIG91dHNcbiAgICBldm1JbnB1dHMgPSBldm1JbnB1dHMuc29ydChFVk1JbnB1dC5jb21wYXJhdG9yKCkpXG4gICAgZXhwb3J0ZWRPdXRzID0gZXhwb3J0ZWRPdXRzLnNvcnQoVHJhbnNmZXJhYmxlT3V0cHV0LmNvbXBhcmF0b3IoKSlcblxuICAgIGNvbnN0IGV4cG9ydFR4OiBFeHBvcnRUeCA9IG5ldyBFeHBvcnRUeChcbiAgICAgIHRoaXMuY29yZS5nZXROZXR3b3JrSUQoKSxcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUodGhpcy5ibG9ja2NoYWluSUQpLFxuICAgICAgZGVzdGluYXRpb25DaGFpbixcbiAgICAgIGV2bUlucHV0cyxcbiAgICAgIGV4cG9ydGVkT3V0c1xuICAgIClcblxuICAgIGNvbnN0IHVuc2lnbmVkVHg6IFVuc2lnbmVkVHggPSBuZXcgVW5zaWduZWRUeChleHBvcnRUeClcbiAgICByZXR1cm4gdW5zaWduZWRUeFxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSByZWZlcmVuY2UgdG8gdGhlIGtleWNoYWluIGZvciB0aGlzIGNsYXNzLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgaW5zdGFuY2Ugb2YgW1tLZXlDaGFpbl1dIGZvciB0aGlzIGNsYXNzXG4gICAqL1xuICBrZXlDaGFpbiA9ICgpOiBLZXlDaGFpbiA9PiB0aGlzLmtleWNoYWluXG5cbiAgLyoqXG4gICAqXG4gICAqIEByZXR1cm5zIG5ldyBpbnN0YW5jZSBvZiBbW0tleUNoYWluXV1cbiAgICovXG4gIG5ld0tleUNoYWluID0gKCk6IEtleUNoYWluID0+IHtcbiAgICAvLyB3YXJuaW5nLCBvdmVyd3JpdGVzIHRoZSBvbGQga2V5Y2hhaW5cbiAgICBjb25zdCBhbGlhcyA9IHRoaXMuZ2V0QmxvY2tjaGFpbkFsaWFzKClcbiAgICBpZiAoYWxpYXMpIHtcbiAgICAgIHRoaXMua2V5Y2hhaW4gPSBuZXcgS2V5Q2hhaW4odGhpcy5jb3JlLmdldEhSUCgpLCBhbGlhcylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5rZXljaGFpbiA9IG5ldyBLZXlDaGFpbih0aGlzLmNvcmUuZ2V0SFJQKCksIHRoaXMuYmxvY2tjaGFpbklEKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5rZXljaGFpblxuICB9XG5cbiAgLyoqXG4gICAqIEBpZ25vcmVcbiAgICovXG4gIHByb3RlY3RlZCBfY2xlYW5BZGRyZXNzQXJyYXkoXG4gICAgYWRkcmVzc2VzOiBzdHJpbmdbXSB8IEJ1ZmZlcltdLFxuICAgIGNhbGxlcjogc3RyaW5nXG4gICk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBhZGRyczogc3RyaW5nW10gPSBbXVxuICAgIGNvbnN0IGNoYWluaWQ6IHN0cmluZyA9IHRoaXMuZ2V0QmxvY2tjaGFpbkFsaWFzKClcbiAgICAgID8gdGhpcy5nZXRCbG9ja2NoYWluQWxpYXMoKVxuICAgICAgOiB0aGlzLmdldEJsb2NrY2hhaW5JRCgpXG4gICAgaWYgKGFkZHJlc3NlcyAmJiBhZGRyZXNzZXMubGVuZ3RoID4gMCkge1xuICAgICAgYWRkcmVzc2VzLmZvckVhY2goKGFkZHJlc3M6IHN0cmluZyB8IEJ1ZmZlcikgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGFkZHJlc3MgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucGFyc2VBZGRyZXNzKGFkZHJlc3MgYXMgc3RyaW5nKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICAgIHRocm93IG5ldyBBZGRyZXNzRXJyb3IoXCJFcnJvciAtIEludmFsaWQgYWRkcmVzcyBmb3JtYXRcIilcbiAgICAgICAgICB9XG4gICAgICAgICAgYWRkcnMucHVzaChhZGRyZXNzIGFzIHN0cmluZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCB0eXBlOiBTZXJpYWxpemVkVHlwZSA9IFwiYmVjaDMyXCJcbiAgICAgICAgICBhZGRycy5wdXNoKFxuICAgICAgICAgICAgc2VyaWFsaXphdGlvbi5idWZmZXJUb1R5cGUoXG4gICAgICAgICAgICAgIGFkZHJlc3MgYXMgQnVmZmVyLFxuICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICB0aGlzLmNvcmUuZ2V0SFJQKCksXG4gICAgICAgICAgICAgIGNoYWluaWRcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBhZGRyc1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgY2xhc3Mgc2hvdWxkIG5vdCBiZSBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuXG4gICAqIEluc3RlYWQgdXNlIHRoZSBbW0F2YWxhbmNoZS5hZGRBUEldXSBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSBjb3JlIEEgcmVmZXJlbmNlIHRvIHRoZSBBdmFsYW5jaGUgY2xhc3NcbiAgICogQHBhcmFtIGJhc2VVUkwgRGVmYXVsdHMgdG8gdGhlIHN0cmluZyBcIi9leHQvYmMvQy9kanR4XCIgYXMgdGhlIHBhdGggdG8gYmxvY2tjaGFpbidzIGJhc2VVUkxcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBUaGUgQmxvY2tjaGFpbidzIElELiBEZWZhdWx0cyB0byBhbiBlbXB0eSBzdHJpbmc6IFwiXCJcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNvcmU6IEF2YWxhbmNoZUNvcmUsXG4gICAgYmFzZVVSTDogc3RyaW5nID0gXCIvZXh0L2JjL0MvZGp0eFwiLFxuICAgIGJsb2NrY2hhaW5JRDogc3RyaW5nID0gXCJcIlxuICApIHtcbiAgICBzdXBlcihjb3JlLCBiYXNlVVJMKVxuICAgIHRoaXMuYmxvY2tjaGFpbklEID0gYmxvY2tjaGFpbklEXG4gICAgY29uc3QgbmV0SUQ6IG51bWJlciA9IGNvcmUuZ2V0TmV0d29ya0lEKClcbiAgICBpZiAoXG4gICAgICBuZXRJRCBpbiBEZWZhdWx0cy5uZXR3b3JrICYmXG4gICAgICBibG9ja2NoYWluSUQgaW4gRGVmYXVsdHMubmV0d29ya1tgJHtuZXRJRH1gXVxuICAgICkge1xuICAgICAgY29uc3QgeyBhbGlhcyB9ID0gRGVmYXVsdHMubmV0d29ya1tgJHtuZXRJRH1gXVtgJHtibG9ja2NoYWluSUR9YF1cbiAgICAgIHRoaXMua2V5Y2hhaW4gPSBuZXcgS2V5Q2hhaW4odGhpcy5jb3JlLmdldEhSUCgpLCBhbGlhcylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5rZXljaGFpbiA9IG5ldyBLZXlDaGFpbih0aGlzLmNvcmUuZ2V0SFJQKCksIGJsb2NrY2hhaW5JRClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgYSBQcm9taXNlIHN0cmluZyBjb250YWluaW5nIHRoZSBiYXNlIGZlZSBmb3IgdGhlIG5leHQgYmxvY2suXG4gICAqL1xuICBnZXRCYXNlRmVlID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgY29uc3QgcGFyYW1zOiBzdHJpbmdbXSA9IFtdXG4gICAgY29uc3QgbWV0aG9kOiBzdHJpbmcgPSBcImV0aF9iYXNlRmVlXCJcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSBcImV4dC9iYy9DL3JwY1wiXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXG4gICAgICBtZXRob2QsXG4gICAgICBwYXJhbXMsXG4gICAgICBwYXRoXG4gICAgKVxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdFxuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgdGhlIHByaW9yaXR5IGZlZSBuZWVkZWQgdG8gYmUgaW5jbHVkZWQgaW4gYSBibG9jay5cbiAgICpcbiAgICogQHJldHVybnMgUmV0dXJucyBhIFByb21pc2Ugc3RyaW5nIGNvbnRhaW5pbmcgdGhlIHByaW9yaXR5IGZlZSBuZWVkZWQgdG8gYmUgaW5jbHVkZWQgaW4gYSBibG9jay5cbiAgICovXG4gIGdldE1heFByaW9yaXR5RmVlUGVyR2FzID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgY29uc3QgcGFyYW1zOiBzdHJpbmdbXSA9IFtdXG5cbiAgICBjb25zdCBtZXRob2Q6IHN0cmluZyA9IFwiZXRoX21heFByaW9yaXR5RmVlUGVyR2FzXCJcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSBcImV4dC9iYy9DL3JwY1wiXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXG4gICAgICBtZXRob2QsXG4gICAgICBwYXJhbXMsXG4gICAgICBwYXRoXG4gICAgKVxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdFxuICB9XG59XG4iXX0=