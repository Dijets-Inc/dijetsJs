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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module Utils-BinTools
 */
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer/");
const create_hash_1 = __importDefault(require("create-hash"));
const bech32 = __importStar(require("bech32"));
const base58_1 = require("./base58");
const errors_1 = require("../utils/errors");
const ethers_1 = require("ethers");
/**
 * A class containing tools useful in interacting with binary data cross-platform using
 * nodejs & javascript.
 *
 * This class should never be instantiated directly. Instead,
 * invoke the "BinTools.getInstance()" static * function to grab the singleton
 * instance of the tools.
 *
 * Everything in this library uses
 * the {@link https://github.com/feross/buffer|feross's Buffer class}.
 *
 * ```js
 * const bintools: BinTools = BinTools.getInstance();
 * const b58str:  = bintools.bufferToB58(Buffer.from("Wubalubadubdub!"));
 * ```
 */
class BinTools {
    constructor() {
        /**
         * Returns true if meets requirements to parse as an address as Bech32 on X-Chain or P-Chain, otherwise false
         * @param address the string to verify is address
         */
        this.isPrimaryBechAddress = (address) => {
            const parts = address.trim().split("-");
            if (parts.length !== 2) {
                return false;
            }
            try {
                bech32.bech32.fromWords(bech32.bech32.decode(parts[1]).words);
            }
            catch (err) {
                return false;
            }
            return true;
        };
        /**
         * Produces a string from a {@link https://github.com/feross/buffer|Buffer}
         * representing a string. ONLY USED IN TRANSACTION FORMATTING, ASSUMED LENGTH IS PREPENDED.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to convert to a string
         */
        this.bufferToString = (buff) => this.copyFrom(buff, 2).toString("utf8");
        /**
         * Produces a {@link https://github.com/feross/buffer|Buffer} from a string. ONLY USED IN TRANSACTION FORMATTING, LENGTH IS PREPENDED.
         *
         * @param str The string to convert to a {@link https://github.com/feross/buffer|Buffer}
         */
        this.stringToBuffer = (str) => {
            const buff = buffer_1.Buffer.alloc(2 + str.length);
            buff.writeUInt16BE(str.length, 0);
            buff.write(str, 2, str.length, "utf8");
            return buff;
        };
        /**
         * Makes a copy (no reference) of a {@link https://github.com/feross/buffer|Buffer}
         * over provided indecies.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to copy
         * @param start The index to start the copy
         * @param end The index to end the copy
         */
        this.copyFrom = (buff, start = 0, end = undefined) => {
            if (end === undefined) {
                end = buff.length;
            }
            return buffer_1.Buffer.from(Uint8Array.prototype.slice.call(buff.slice(start, end)));
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and returns a base-58 string of
         * the {@link https://github.com/feross/buffer|Buffer}.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to convert to base-58
         */
        this.bufferToB58 = (buff) => this.b58.encode(buff);
        /**
         * Takes a base-58 string and returns a {@link https://github.com/feross/buffer|Buffer}.
         *
         * @param b58str The base-58 string to convert
         * to a {@link https://github.com/feross/buffer|Buffer}
         */
        this.b58ToBuffer = (b58str) => this.b58.decode(b58str);
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and returns an ArrayBuffer.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to
         * convert to an ArrayBuffer
         */
        this.fromBufferToArrayBuffer = (buff) => {
            const ab = new ArrayBuffer(buff.length);
            const view = new Uint8Array(ab);
            for (let i = 0; i < buff.length; ++i) {
                view[`${i}`] = buff[`${i}`];
            }
            return view;
        };
        /**
         * Takes an ArrayBuffer and converts it to a {@link https://github.com/feross/buffer|Buffer}.
         *
         * @param ab The ArrayBuffer to convert to a {@link https://github.com/feross/buffer|Buffer}
         */
        this.fromArrayBufferToBuffer = (ab) => {
            const buf = buffer_1.Buffer.alloc(ab.byteLength);
            for (let i = 0; i < ab.byteLength; ++i) {
                buf[`${i}`] = ab[`${i}`];
            }
            return buf;
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and converts it
         * to a {@link https://github.com/indutny/bn.js/|BN}.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to convert
         * to a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.fromBufferToBN = (buff) => {
            if (typeof buff === "undefined") {
                return undefined;
            }
            return new bn_js_1.default(buff.toString("hex"), 16, "be");
        };
        /**
         * Takes a {@link https://github.com/indutny/bn.js/|BN} and converts it
         * to a {@link https://github.com/feross/buffer|Buffer}.
         *
         * @param bn The {@link https://github.com/indutny/bn.js/|BN} to convert
         * to a {@link https://github.com/feross/buffer|Buffer}
         * @param length The zero-padded length of the {@link https://github.com/feross/buffer|Buffer}
         */
        this.fromBNToBuffer = (bn, length) => {
            if (typeof bn === "undefined") {
                return undefined;
            }
            const newarr = bn.toArray("be");
            /**
             * CKC: Still unsure why bn.toArray with a "be" and a length do not work right. Bug?
             */
            if (length) {
                // bn toArray with the length parameter doesn't work correctly, need this.
                const x = length - newarr.length;
                for (let i = 0; i < x; i++) {
                    newarr.unshift(0);
                }
            }
            return buffer_1.Buffer.from(newarr);
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and adds a checksum, returning
         * a {@link https://github.com/feross/buffer|Buffer} with the 4-byte checksum appended.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to append a checksum
         */
        this.addChecksum = (buff) => {
            const hashslice = buffer_1.Buffer.from((0, create_hash_1.default)("sha256").update(buff).digest().slice(28));
            return buffer_1.Buffer.concat([buff, hashslice]);
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} with an appended 4-byte checksum
         * and returns true if the checksum is valid, otherwise false.
         *
         * @param b The {@link https://github.com/feross/buffer|Buffer} to validate the checksum
         */
        this.validateChecksum = (buff) => {
            const checkslice = buff.slice(buff.length - 4);
            const hashslice = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
                .update(buff.slice(0, buff.length - 4))
                .digest()
                .slice(28));
            return checkslice.toString("hex") === hashslice.toString("hex");
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and returns a base-58 string with
         * checksum as per the cb58 standard.
         *
         * @param bytes A {@link https://github.com/feross/buffer|Buffer} to serialize
         *
         * @returns A serialized base-58 string of the Buffer.
         */
        this.cb58Encode = (bytes) => {
            const x = this.addChecksum(bytes);
            return this.bufferToB58(x);
        };
        /**
         * Takes a cb58 serialized {@link https://github.com/feross/buffer|Buffer} or base-58 string
         * and returns a {@link https://github.com/feross/buffer|Buffer} of the original data. Throws on error.
         *
         * @param bytes A cb58 serialized {@link https://github.com/feross/buffer|Buffer} or base-58 string
         */
        this.cb58Decode = (bytes) => {
            if (typeof bytes === "string") {
                bytes = this.b58ToBuffer(bytes);
            }
            if (this.validateChecksum(bytes)) {
                return this.copyFrom(bytes, 0, bytes.length - 4);
            }
            throw new errors_1.ChecksumError("Error - BinTools.cb58Decode: invalid checksum");
        };
        this.addressToString = (hrp, chainid, bytes) => `${chainid}-${bech32.bech32.encode(hrp, bech32.bech32.toWords(bytes))}`;
        this.stringToAddress = (address, hrp) => {
            if (address.substring(0, 2) === "0x") {
                // ETH-style address
                if (ethers_1.utils.isAddress(address)) {
                    return buffer_1.Buffer.from(address.substring(2), "hex");
                }
                else {
                    throw new errors_1.HexError("Error - Invalid address");
                }
            }
            // Bech32 addresses
            const parts = address.trim().split("-");
            if (parts.length < 2) {
                throw new errors_1.Bech32Error("Error - Valid address should include -");
            }
            if (parts[0].length < 1) {
                throw new errors_1.Bech32Error("Error - Valid address must have prefix before -");
            }
            const split = parts[1].lastIndexOf("1");
            if (split < 0) {
                throw new errors_1.Bech32Error("Error - Valid address must include separator (1)");
            }
            const humanReadablePart = parts[1].slice(0, split);
            if (humanReadablePart.length < 1) {
                throw new errors_1.Bech32Error("Error - HRP should be at least 1 character");
            }
            if (humanReadablePart !== "dijets" &&
                humanReadablePart !== "fuji" &&
                humanReadablePart != "local" &&
                humanReadablePart != "custom" &&
                humanReadablePart != hrp) {
                throw new errors_1.Bech32Error("Error - Invalid HRP");
            }
            return buffer_1.Buffer.from(bech32.bech32.fromWords(bech32.bech32.decode(parts[1]).words));
        };
        /**
         * Takes an address and returns its {@link https://github.com/feross/buffer|Buffer}
         * representation if valid. A more strict version of stringToAddress.
         *
         * @param addr A string representation of the address
         * @param blockchainID A cb58 encoded string representation of the blockchainID
         * @param alias A chainID alias, if any, that the address can also parse from.
         * @param addrlen VMs can use any addressing scheme that they like, so this is the appropriate number of address bytes. Default 20.
         *
         * @returns A {@link https://github.com/feross/buffer|Buffer} for the address if valid,
         * undefined if not valid.
         */
        this.parseAddress = (addr, blockchainID, alias = undefined, addrlen = 20) => {
            const abc = addr.split("-");
            if (abc.length === 2 &&
                ((alias && abc[0] === alias) || (blockchainID && abc[0] === blockchainID))) {
                const addrbuff = this.stringToAddress(addr);
                if ((addrlen && addrbuff.length === addrlen) || !addrlen) {
                    return addrbuff;
                }
            }
            return undefined;
        };
        this.b58 = base58_1.Base58.getInstance();
    }
    /**
     * Retrieves the BinTools singleton.
     */
    static getInstance() {
        if (!BinTools.instance) {
            BinTools.instance = new BinTools();
        }
        return BinTools.instance;
    }
    /**
     * Returns true if base64, otherwise false
     * @param str the string to verify is Base64
     */
    isBase64(str) {
        if (str === "" || str.trim() === "") {
            return false;
        }
        try {
            let b64 = buffer_1.Buffer.from(str, "base64");
            return b64.toString("base64") === str;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Returns true if cb58, otherwise false
     * @param cb58 the string to verify is cb58
     */
    isCB58(cb58) {
        return this.isBase58(cb58);
    }
    /**
     * Returns true if base58, otherwise false
     * @param base58 the string to verify is base58
     */
    isBase58(base58) {
        if (base58 === "" || base58.trim() === "") {
            return false;
        }
        try {
            return this.b58.encode(this.b58.decode(base58)) === base58;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Returns true if hexidecimal, otherwise false
     * @param hex the string to verify is hexidecimal
     */
    isHex(hex) {
        if (hex === "" || hex.trim() === "") {
            return false;
        }
        if ((hex.startsWith("0x") && hex.slice(2).match(/^[0-9A-Fa-f]/g)) ||
            hex.match(/^[0-9A-Fa-f]/g)) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Returns true if decimal, otherwise false
     * @param str the string to verify is hexidecimal
     */
    isDecimal(str) {
        if (str === "" || str.trim() === "") {
            return false;
        }
        try {
            return new bn_js_1.default(str, 10).toString(10) === str.trim();
        }
        catch (err) {
            return false;
        }
    }
}
exports.default = BinTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmludG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvYmludG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7R0FHRztBQUNILGtEQUFzQjtBQUN0QixvQ0FBZ0M7QUFDaEMsOERBQW9DO0FBQ3BDLCtDQUFnQztBQUNoQyxxQ0FBaUM7QUFDakMsNENBQXNFO0FBQ3RFLG1DQUE4QjtBQUU5Qjs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxNQUFxQixRQUFRO0lBRzNCO1FBd0ZBOzs7V0FHRztRQUNILHlCQUFvQixHQUFHLENBQUMsT0FBZSxFQUFXLEVBQUU7WUFDbEQsTUFBTSxLQUFLLEdBQWEsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNqRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN0QixPQUFPLEtBQUssQ0FBQTthQUNiO1lBQ0QsSUFBSTtnQkFDRixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUM5RDtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLE9BQU8sS0FBSyxDQUFBO2FBQ2I7WUFDRCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUMsQ0FBQTtRQUVEOzs7OztXQUtHO1FBQ0gsbUJBQWMsR0FBRyxDQUFDLElBQVksRUFBVSxFQUFFLENBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUV6Qzs7OztXQUlHO1FBQ0gsbUJBQWMsR0FBRyxDQUFDLEdBQVcsRUFBVSxFQUFFO1lBQ3ZDLE1BQU0sSUFBSSxHQUFXLGVBQU0sQ0FBQyxL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O1FBQ0QsSUFDRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFDMUI7WUFDQSxPQUFPLElBQUksQ0FBQTtTQUNaO2FBQU07WUFDTCxPQUFPLEtBQUssQ0FBQTtTQUNiO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsQ0FBQyxHQUFXO1FBQ25CLElBQUksR0FBRyxLQUFLLEVBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ25DLE9BQU8sS0FBSyxDQUFBO1NBQ2I7UUFDRCxJQUFJO1lBQ0YsT0FBTyxJQUFJLGVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtTQUNuRDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxLQUFLLENBQUE7U0FDYjtJQUNILENBQUM7Q0F1UkY7QUFoWEQsMkJBZ1hDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqIEBtb2R1bGUgVXRpbHMtQmluVG9vbHNcbiAqL1xuaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXG5pbXBvcnQgY3JlYXRlSGFzaCBmcm9tIFwiY3JlYXRlLWhhc2hcIlxuaW1wb3J0ICogYXMgYmVjaDMyIGZyb20gXCJiZWNoMzJcIlxuaW1wb3J0IHsgQmFzZTU4IH0gZnJvbSBcIi4vYmFzZTU4XCJcbmltcG9ydCB7IEJlY2gzMkVycm9yLCBDaGVja3N1bUVycm9yLCBIZXhFcnJvciB9IGZyb20gXCIuLi91dGlscy9lcnJvcnNcIlxuaW1wb3J0IHsgdXRpbHMgfSBmcm9tIFwiZXRoZXJzXCJcblxuLyoqXG4gKiBBIGNsYXNzIGNvbnRhaW5pbmcgdG9vbHMgdXNlZnVsIGluIGludGVyYWN0aW5nIHdpdGggYmluYXJ5IGRhdGEgY3Jvc3MtcGxhdGZvcm0gdXNpbmdcbiAqIG5vZGVqcyAmIGphdmFzY3JpcHQuXG4gKlxuICogVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFudGlhdGVkIGRpcmVjdGx5LiBJbnN0ZWFkLFxuICogaW52b2tlIHRoZSBcIkJpblRvb2xzLmdldEluc3RhbmNlKClcIiBzdGF0aWMgKiBmdW5jdGlvbiB0byBncmFiIHRoZSBzaW5nbGV0b25cbiAqIGluc3RhbmNlIG9mIHRoZSB0b29scy5cbiAqXG4gKiBFdmVyeXRoaW5nIGluIHRoaXMgbGlicmFyeSB1c2VzXG4gKiB0aGUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfGZlcm9zcydzIEJ1ZmZlciBjbGFzc30uXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKCk7XG4gKiBjb25zdCBiNThzdHI6ICA9IGJpbnRvb2xzLmJ1ZmZlclRvQjU4KEJ1ZmZlci5mcm9tKFwiV3ViYWx1YmFkdWJkdWIhXCIpKTtcbiAqIGBgYFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaW5Ub29scyB7XG4gIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBCaW5Ub29sc1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5iNTggPSBCYXNlNTguZ2V0SW5zdGFuY2UoKVxuICB9XG5cbiAgcHJpdmF0ZSBiNTg6IEJhc2U1OFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIEJpblRvb2xzIHNpbmdsZXRvbi5cbiAgICovXG4gIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBCaW5Ub29scyB7XG4gICAgaWYgKCFCaW5Ub29scy5pbnN0YW5jZSkge1xuICAgICAgQmluVG9vbHMuaW5zdGFuY2UgPSBuZXcgQmluVG9vbHMoKVxuICAgIH1cbiAgICByZXR1cm4gQmluVG9vbHMuaW5zdGFuY2VcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgYmFzZTY0LCBvdGhlcndpc2UgZmFsc2VcbiAgICogQHBhcmFtIHN0ciB0aGUgc3RyaW5nIHRvIHZlcmlmeSBpcyBCYXNlNjRcbiAgICovXG4gIGlzQmFzZTY0KHN0cjogc3RyaW5nKSB7XG4gICAgaWYgKHN0ciA9PT0gXCJcIiB8fCBzdHIudHJpbSgpID09PSBcIlwiKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGxldCBiNjQ6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHN0ciwgXCJiYXNlNjRcIilcbiAgICAgIHJldHVybiBiNjQudG9TdHJpbmcoXCJiYXNlNjRcIikgPT09IHN0clxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBjYjU4LCBvdGhlcndpc2UgZmFsc2VcbiAgICogQHBhcmFtIGNiNTggdGhlIHN0cmluZyB0byB2ZXJpZnkgaXMgY2I1OFxuICAgKi9cbiAgaXNDQjU4KGNiNTg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzQmFzZTU4KGNiNTgpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGJhc2U1OCwgb3RoZXJ3aXNlIGZhbHNlXG4gICAqIEBwYXJhbSBiYXNlNTggdGhlIHN0cmluZyB0byB2ZXJpZnkgaXMgYmFzZTU4XG4gICAqL1xuICBpc0Jhc2U1OChiYXNlNTg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmIChiYXNlNTggPT09IFwiXCIgfHwgYmFzZTU4LnRyaW0oKSA9PT0gXCJcIikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5iNTguZW5jb2RlKHRoaXMuYjU4LmRlY29kZShiYXNlNTgpKSA9PT0gYmFzZTU4XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGhleGlkZWNpbWFsLCBvdGhlcndpc2UgZmFsc2VcbiAgICogQHBhcmFtIGhleCB0aGUgc3RyaW5nIHRvIHZlcmlmeSBpcyBoZXhpZGVjaW1hbFxuICAgKi9cbiAgaXNIZXgoaGV4OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoaGV4ID09PSBcIlwiIHx8IGhleC50cmltKCkgPT09IFwiXCIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBpZiAoXG4gICAgICAoaGV4LnN0YXJ0c1dpdGgoXCIweFwiKSAmJiBoZXguc2xpY2UoMikubWF0Y2goL15bMC05QS1GYS1mXS9nKSkgfHxcbiAgICAgIGhleC5tYXRjaCgvXlswLTlBLUZhLWZdL2cpXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGRlY2ltYWwsIG90aGVyd2lzZSBmYWxzZVxuICAgKiBAcGFyYW0gc3RyIHRoZSBzdHJpbmcgdG8gdmVyaWZ5IGlzIGhleGlkZWNpbWFsXG4gICAqL1xuICBpc0RlY2ltYWwoc3RyOiBzdHJpbmcpIHtcbiAgICBpZiAoc3RyID09PSBcIlwiIHx8IHN0ci50cmltKCkgPT09IFwiXCIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIG5ldyBCTihzdHIsIDEwKS50b1N0cmluZygxMCkgPT09IHN0ci50cmltKClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgbWVldHMgcmVxdWlyZW1lbnRzIHRvIHBhcnNlIGFzIGFuIGFkZHJlc3MgYXMgQmVjaDMyIG9uIFgtQ2hhaW4gb3IgUC1DaGFpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAqIEBwYXJhbSBhZGRyZXNzIHRoZSBzdHJpbmcgdG8gdmVyaWZ5IGlzIGFkZHJlc3NcbiAgICovXG4gIGlzUHJpbWFyeUJlY2hBZGRyZXNzID0gKGFkZHJlc3M6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IGFkZHJlc3MudHJpbSgpLnNwbGl0KFwiLVwiKVxuICAgIGlmIChwYXJ0cy5sZW5ndGggIT09IDIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgYmVjaDMyLmJlY2gzMi5mcm9tV29yZHMoYmVjaDMyLmJlY2gzMi5kZWNvZGUocGFydHNbMV0pLndvcmRzKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKipcbiAgICogUHJvZHVjZXMgYSBzdHJpbmcgZnJvbSBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XG4gICAqIHJlcHJlc2VudGluZyBhIHN0cmluZy4gT05MWSBVU0VEIElOIFRSQU5TQUNUSU9OIEZPUk1BVFRJTkcsIEFTU1VNRUQgTEVOR1RIIElTIFBSRVBFTkRFRC5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmYgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHRvIGNvbnZlcnQgdG8gYSBzdHJpbmdcbiAgICovXG4gIGJ1ZmZlclRvU3RyaW5nID0gKGJ1ZmY6IEJ1ZmZlcik6IHN0cmluZyA9PlxuICAgIHRoaXMuY29weUZyb20oYnVmZiwgMikudG9TdHJpbmcoXCJ1dGY4XCIpXG5cbiAgLyoqXG4gICAqIFByb2R1Y2VzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gZnJvbSBhIHN0cmluZy4gT05MWSBVU0VEIElOIFRSQU5TQUNUSU9OIEZPUk1BVFRJTkcsIExFTkdUSCBJUyBQUkVQRU5ERUQuXG4gICAqXG4gICAqIEBwYXJhbSBzdHIgVGhlIHN0cmluZyB0byBjb252ZXJ0IHRvIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1cbiAgICovXG4gIHN0cmluZ1RvQnVmZmVyID0gKHN0cjogc3RyaW5nKTogQnVmZmVyID0+IHtcbiAgICBjb25zdCBidWZmOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMiArIHN0ci5sZW5ndGgpXG4gICAgYnVmZi53cml0ZVVJbnQxNkJFKHN0ci5sZW5ndGgsIDApXG4gICAgYnVmZi53cml0ZShzdHIsIDIsIHN0ci5sZW5ndGgsIFwidXRmOFwiKVxuICAgIHJldHVybiBidWZmXG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBjb3B5IChubyByZWZlcmVuY2UpIG9mIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1cbiAgICogb3ZlciBwcm92aWRlZCBpbmRlY2llcy5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmYgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHRvIGNvcHlcbiAgICogQHBhcmFtIHN0YXJ0IFRoZSBpbmRleCB0byBzdGFydCB0aGUgY29weVxuICAgKiBAcGFyYW0gZW5kIFRoZSBpbmRleCB0byBlbmQgdGhlIGNvcHlcbiAgICovXG4gIGNvcHlGcm9tID0gKFxuICAgIGJ1ZmY6IEJ1ZmZlcixcbiAgICBzdGFydDogbnVtYmVyID0gMCxcbiAgICBlbmQ6IG51bWJlciA9IHVuZGVmaW5lZFxuICApOiBCdWZmZXIgPT4ge1xuICAgIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZW5kID0gYnVmZi5sZW5ndGhcbiAgICB9XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKFVpbnQ4QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYnVmZi5zbGljZShzdGFydCwgZW5kKSkpXG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBhbmQgcmV0dXJucyBhIGJhc2UtNTggc3RyaW5nIG9mXG4gICAqIHRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfS5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmYgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHRvIGNvbnZlcnQgdG8gYmFzZS01OFxuICAgKi9cbiAgYnVmZmVyVG9CNTggPSAoYnVmZjogQnVmZmVyKTogc3RyaW5nID0+IHRoaXMuYjU4LmVuY29kZShidWZmKVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhIGJhc2UtNTggc3RyaW5nIGFuZCByZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0uXG4gICAqXG4gICAqIEBwYXJhbSBiNThzdHIgVGhlIGJhc2UtNTggc3RyaW5nIHRvIGNvbnZlcnRcbiAgICogdG8gYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfVxuICAgKi9cbiAgYjU4VG9CdWZmZXIgPSAoYjU4c3RyOiBzdHJpbmcpOiBCdWZmZXIgPT4gdGhpcy5iNTguZGVjb2RlKGI1OHN0cilcblxuICAvKipcbiAgICogVGFrZXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBhbmQgcmV0dXJucyBhbiBBcnJheUJ1ZmZlci5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmYgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHRvXG4gICAqIGNvbnZlcnQgdG8gYW4gQXJyYXlCdWZmZXJcbiAgICovXG4gIGZyb21CdWZmZXJUb0FycmF5QnVmZmVyID0gKGJ1ZmY6IEJ1ZmZlcik6IEFycmF5QnVmZmVyID0+IHtcbiAgICBjb25zdCBhYiA9IG5ldyBBcnJheUJ1ZmZlcihidWZmLmxlbmd0aClcbiAgICBjb25zdCB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYWIpXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGJ1ZmYubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZpZXdbYCR7aX1gXSA9IGJ1ZmZbYCR7aX1gXVxuICAgIH1cbiAgICByZXR1cm4gdmlld1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGFuIEFycmF5QnVmZmVyIGFuZCBjb252ZXJ0cyBpdCB0byBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9LlxuICAgKlxuICAgKiBAcGFyYW0gYWIgVGhlIEFycmF5QnVmZmVyIHRvIGNvbnZlcnQgdG8gYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfVxuICAgKi9cbiAgZnJvbUFycmF5QnVmZmVyVG9CdWZmZXIgPSAoYWI6IEFycmF5QnVmZmVyKTogQnVmZmVyID0+IHtcbiAgICBjb25zdCBidWYgPSBCdWZmZXIuYWxsb2MoYWIuYnl0ZUxlbmd0aClcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgYWIuYnl0ZUxlbmd0aDsgKytpKSB7XG4gICAgICBidWZbYCR7aX1gXSA9IGFiW2Ake2l9YF1cbiAgICB9XG4gICAgcmV0dXJuIGJ1ZlxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gYW5kIGNvbnZlcnRzIGl0XG4gICAqIHRvIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn0uXG4gICAqXG4gICAqIEBwYXJhbSBidWZmIFRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB0byBjb252ZXJ0XG4gICAqIHRvIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cbiAgICovXG4gIGZyb21CdWZmZXJUb0JOID0gKGJ1ZmY6IEJ1ZmZlcik6IEJOID0+IHtcbiAgICBpZiAodHlwZW9mIGJ1ZmYgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCTihidWZmLnRvU3RyaW5nKFwiaGV4XCIpLCAxNiwgXCJiZVwiKVxuICB9XG4gIC8qKlxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IGFuZCBjb252ZXJ0cyBpdFxuICAgKiB0byBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9LlxuICAgKlxuICAgKiBAcGFyYW0gYm4gVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IHRvIGNvbnZlcnRcbiAgICogdG8gYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfVxuICAgKiBAcGFyYW0gbGVuZ3RoIFRoZSB6ZXJvLXBhZGRlZCBsZW5ndGggb2YgdGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XG4gICAqL1xuICBmcm9tQk5Ub0J1ZmZlciA9IChibjogQk4sIGxlbmd0aD86IG51bWJlcik6IEJ1ZmZlciA9PiB7XG4gICAgaWYgKHR5cGVvZiBibiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cbiAgICBjb25zdCBuZXdhcnIgPSBibi50b0FycmF5KFwiYmVcIilcbiAgICAvKipcbiAgICAgKiBDS0M6IFN0aWxsIHVuc3VyZSB3aHkgYm4udG9BcnJheSB3aXRoIGEgXCJiZVwiIGFuZCBhIGxlbmd0aCBkbyBub3Qgd29yayByaWdodC4gQnVnP1xuICAgICAqL1xuICAgIGlmIChsZW5ndGgpIHtcbiAgICAgIC8vIGJuIHRvQXJyYXkgd2l0aCB0aGUgbGVuZ3RoIHBhcmFtZXRlciBkb2Vzbid0IHdvcmsgY29ycmVjdGx5LCBuZWVkIHRoaXMuXG4gICAgICBjb25zdCB4ID0gbGVuZ3RoIC0gbmV3YXJyLmxlbmd0aFxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHg7IGkrKykge1xuICAgICAgICBuZXdhcnIudW5zaGlmdCgwKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gQnVmZmVyLmZyb20obmV3YXJyKVxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gYW5kIGFkZHMgYSBjaGVja3N1bSwgcmV0dXJuaW5nXG4gICAqIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gd2l0aCB0aGUgNC1ieXRlIGNoZWNrc3VtIGFwcGVuZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gYnVmZiBUaGUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gdG8gYXBwZW5kIGEgY2hlY2tzdW1cbiAgICovXG4gIGFkZENoZWNrc3VtID0gKGJ1ZmY6IEJ1ZmZlcik6IEJ1ZmZlciA9PiB7XG4gICAgY29uc3QgaGFzaHNsaWNlOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIikudXBkYXRlKGJ1ZmYpLmRpZ2VzdCgpLnNsaWNlKDI4KVxuICAgIClcbiAgICByZXR1cm4gQnVmZmVyLmNvbmNhdChbYnVmZiwgaGFzaHNsaWNlXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHdpdGggYW4gYXBwZW5kZWQgNC1ieXRlIGNoZWNrc3VtXG4gICAqIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGNoZWNrc3VtIGlzIHZhbGlkLCBvdGhlcndpc2UgZmFsc2UuXG4gICAqXG4gICAqIEBwYXJhbSBiIFRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB0byB2YWxpZGF0ZSB0aGUgY2hlY2tzdW1cbiAgICovXG4gIHZhbGlkYXRlQ2hlY2tzdW0gPSAoYnVmZjogQnVmZmVyKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgY2hlY2tzbGljZTogQnVmZmVyID0gYnVmZi5zbGljZShidWZmLmxlbmd0aCAtIDQpXG4gICAgY29uc3QgaGFzaHNsaWNlOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgLnVwZGF0ZShidWZmLnNsaWNlKDAsIGJ1ZmYubGVuZ3RoIC0gNCkpXG4gICAgICAgIC5kaWdlc3QoKVxuICAgICAgICAuc2xpY2UoMjgpXG4gICAgKVxuICAgIHJldHVybiBjaGVja3NsaWNlLnRvU3RyaW5nKFwiaGV4XCIpID09PSBoYXNoc2xpY2UudG9TdHJpbmcoXCJoZXhcIilcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGFuZCByZXR1cm5zIGEgYmFzZS01OCBzdHJpbmcgd2l0aFxuICAgKiBjaGVja3N1bSBhcyBwZXIgdGhlIGNiNTggc3RhbmRhcmQuXG4gICAqXG4gICAqIEBwYXJhbSBieXRlcyBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHRvIHNlcmlhbGl6ZVxuICAgKlxuICAgKiBAcmV0dXJucyBBIHNlcmlhbGl6ZWQgYmFzZS01OCBzdHJpbmcgb2YgdGhlIEJ1ZmZlci5cbiAgICovXG4gIGNiNThFbmNvZGUgPSAoYnl0ZXM6IEJ1ZmZlcik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgeDogQnVmZmVyID0gdGhpcy5hZGRDaGVja3N1bShieXRlcylcbiAgICByZXR1cm4gdGhpcy5idWZmZXJUb0I1OCh4KVxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGEgY2I1OCBzZXJpYWxpemVkIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IG9yIGJhc2UtNTggc3RyaW5nXG4gICAqIGFuZCByZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gb2YgdGhlIG9yaWdpbmFsIGRhdGEuIFRocm93cyBvbiBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIGJ5dGVzIEEgY2I1OCBzZXJpYWxpemVkIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IG9yIGJhc2UtNTggc3RyaW5nXG4gICAqL1xuICBjYjU4RGVjb2RlID0gKGJ5dGVzOiBCdWZmZXIgfCBzdHJpbmcpOiBCdWZmZXIgPT4ge1xuICAgIGlmICh0eXBlb2YgYnl0ZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGJ5dGVzID0gdGhpcy5iNThUb0J1ZmZlcihieXRlcylcbiAgICB9XG4gICAgaWYgKHRoaXMudmFsaWRhdGVDaGVja3N1bShieXRlcykpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvcHlGcm9tKGJ5dGVzLCAwLCBieXRlcy5sZW5ndGggLSA0KVxuICAgIH1cbiAgICB0aHJvdyBuZXcgQ2hlY2tzdW1FcnJvcihcIkVycm9yIC0gQmluVG9vbHMuY2I1OERlY29kZTogaW52YWxpZCBjaGVja3N1bVwiKVxuICB9XG5cbiAgYWRkcmVzc1RvU3RyaW5nID0gKGhycDogc3RyaW5nLCBjaGFpbmlkOiBzdHJpbmcsIGJ5dGVzOiBCdWZmZXIpOiBzdHJpbmcgPT5cbiAgICBgJHtjaGFpbmlkfS0ke2JlY2gzMi5iZWNoMzIuZW5jb2RlKGhycCwgYmVjaDMyLmJlY2gzMi50b1dvcmRzKGJ5dGVzKSl9YFxuXG4gIHN0cmluZ1RvQWRkcmVzcyA9IChhZGRyZXNzOiBzdHJpbmcsIGhycD86IHN0cmluZyk6IEJ1ZmZlciA9PiB7XG4gICAgaWYgKGFkZHJlc3Muc3Vic3RyaW5nKDAsIDIpID09PSBcIjB4XCIpIHtcbiAgICAgIC8vIEVUSC1zdHlsZSBhZGRyZXNzXG4gICAgICBpZiAodXRpbHMuaXNBZGRyZXNzKGFkZHJlc3MpKSB7XG4gICAgICAgIHJldHVybiBCdWZmZXIuZnJvbShhZGRyZXNzLnN1YnN0cmluZygyKSwgXCJoZXhcIilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBIZXhFcnJvcihcIkVycm9yIC0gSW52YWxpZCBhZGRyZXNzXCIpXG4gICAgICB9XG4gICAgfVxuICAgIC8vIEJlY2gzMiBhZGRyZXNzZXNcbiAgICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBhZGRyZXNzLnRyaW0oKS5zcGxpdChcIi1cIilcblxuICAgIGlmIChwYXJ0cy5sZW5ndGggPCAyKSB7XG4gICAgICB0aHJvdyBuZXcgQmVjaDMyRXJyb3IoXCJFcnJvciAtIFZhbGlkIGFkZHJlc3Mgc2hvdWxkIGluY2x1ZGUgLVwiKVxuICAgIH1cblxuICAgIGlmIChwYXJ0c1swXS5sZW5ndGggPCAxKSB7XG4gICAgICB0aHJvdyBuZXcgQmVjaDMyRXJyb3IoXCJFcnJvciAtIFZhbGlkIGFkZHJlc3MgbXVzdCBoYXZlIHByZWZpeCBiZWZvcmUgLVwiKVxuICAgIH1cblxuICAgIGNvbnN0IHNwbGl0OiBudW1iZXIgPSBwYXJ0c1sxXS5sYXN0SW5kZXhPZihcIjFcIilcbiAgICBpZiAoc3BsaXQgPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgQmVjaDMyRXJyb3IoXCJFcnJvciAtIFZhbGlkIGFkZHJlc3MgbXVzdCBpbmNsdWRlIHNlcGFyYXRvciAoMSlcIilcbiAgICB9XG5cbiAgICBjb25zdCBodW1hblJlYWRhYmxlUGFydDogc3RyaW5nID0gcGFydHNbMV0uc2xpY2UoMCwgc3BsaXQpXG4gICAgaWYgKGh1bWFuUmVhZGFibGVQYXJ0Lmxlbmd0aCA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBCZWNoMzJFcnJvcihcIkVycm9yIC0gSFJQIHNob3VsZCBiZSBhdCBsZWFzdCAxIGNoYXJhY3RlclwiKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGh1bWFuUmVhZGFibGVQYXJ0ICE9PSBcImRpamV0c1wiICYmXG4gICAgICBodW1hblJlYWRhYmxlUGFydCAhPT0gXCJmdWppXCIgJiZcbiAgICAgIGh1bWFuUmVhZGFibGVQYXJ0ICE9IFwibG9jYWxcIiAmJlxuICAgICAgaHVtYW5SZWFkYWJsZVBhcnQgIT0gXCJjdXN0b21cIiAmJlxuICAgICAgaHVtYW5SZWFkYWJsZVBhcnQgIT0gaHJwXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgQmVjaDMyRXJyb3IoXCJFcnJvciAtIEludmFsaWQgSFJQXCIpXG4gICAgfVxuXG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKFxuICAgICAgYmVjaDMyLmJlY2gzMi5mcm9tV29yZHMoYmVjaDMyLmJlY2gzMi5kZWNvZGUocGFydHNbMV0pLndvcmRzKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhbiBhZGRyZXNzIGFuZCByZXR1cm5zIGl0cyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfVxuICAgKiByZXByZXNlbnRhdGlvbiBpZiB2YWxpZC4gQSBtb3JlIHN0cmljdCB2ZXJzaW9uIG9mIHN0cmluZ1RvQWRkcmVzcy5cbiAgICpcbiAgICogQHBhcmFtIGFkZHIgQSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFkZHJlc3NcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBBIGNiNTggZW5jb2RlZCBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGJsb2NrY2hhaW5JRFxuICAgKiBAcGFyYW0gYWxpYXMgQSBjaGFpbklEIGFsaWFzLCBpZiBhbnksIHRoYXQgdGhlIGFkZHJlc3MgY2FuIGFsc28gcGFyc2UgZnJvbS5cbiAgICogQHBhcmFtIGFkZHJsZW4gVk1zIGNhbiB1c2UgYW55IGFkZHJlc3Npbmcgc2NoZW1lIHRoYXQgdGhleSBsaWtlLCBzbyB0aGlzIGlzIHRoZSBhcHByb3ByaWF0ZSBudW1iZXIgb2YgYWRkcmVzcyBieXRlcy4gRGVmYXVsdCAyMC5cbiAgICpcbiAgICogQHJldHVybnMgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIGFkZHJlc3MgaWYgdmFsaWQsXG4gICAqIHVuZGVmaW5lZCBpZiBub3QgdmFsaWQuXG4gICAqL1xuICBwYXJzZUFkZHJlc3MgPSAoXG4gICAgYWRkcjogc3RyaW5nLFxuICAgIGJsb2NrY2hhaW5JRDogc3RyaW5nLFxuICAgIGFsaWFzOiBzdHJpbmcgPSB1bmRlZmluZWQsXG4gICAgYWRkcmxlbjogbnVtYmVyID0gMjBcbiAgKTogQnVmZmVyID0+IHtcbiAgICBjb25zdCBhYmM6IHN0cmluZ1tdID0gYWRkci5zcGxpdChcIi1cIilcbiAgICBpZiAoXG4gICAgICBhYmMubGVuZ3RoID09PSAyICYmXG4gICAgICAoKGFsaWFzICYmIGFiY1swXSA9PT0gYWxpYXMpIHx8IChibG9ja2NoYWluSUQgJiYgYWJjWzBdID09PSBibG9ja2NoYWluSUQpKVxuICAgICkge1xuICAgICAgY29uc3QgYWRkcmJ1ZmYgPSB0aGlzLnN0cmluZ1RvQWRkcmVzcyhhZGRyKVxuICAgICAgaWYgKChhZGRybGVuICYmIGFkZHJidWZmLmxlbmd0aCA9PT0gYWRkcmxlbikgfHwgIWFkZHJsZW4pIHtcbiAgICAgICAgcmV0dXJuIGFkZHJidWZmXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxufVxuIl19