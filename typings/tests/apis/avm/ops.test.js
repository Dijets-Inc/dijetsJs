"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utxos_1 = require("../../../src/apis/avm/utxos");
const create_hash_1 = __importDefault(require("create-hash"));
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer/");
const outputs_1 = require("../../../src/apis/avm/outputs");
const constants_1 = require("../../../src/apis/avm/constants");
const ops_1 = require("../../../src/apis/avm/ops");
const output_1 = require("../../../src/common/output");
const ops_2 = require("../../../src/apis/avm/ops");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
describe("Operations", () => {
    const codecID_zero = 0;
    const codecID_one = 1;
    const assetID = "8a5d2d32e68bc50036e4d086044617fe4a0a0296b274999ba568ea92da46d533";
    const assetIDBuff = buffer_1.Buffer.from(assetID, "hex");
    const addrs = [
        bintools.cb58Decode("B6D4v1VtPYLbiUvYXtW4Px8oE9imC2vGW"),
        bintools.cb58Decode("P5wdRuZeaDt28eHMP5S3w9ZdoBfo7wuzF"),
        bintools.cb58Decode("6Y3kysjF9jnHnYkdS9yGAuoHyae2eNmeV")
    ].sort();
    const locktime = new bn_js_1.default(54321);
    const payload = buffer_1.Buffer.alloc(1024);
    payload.write("All you Trekkies and TV addicts, Don't mean to diss don't mean to bring static.", 0, 1024, "utf8");
    describe("NFTMintOperation", () => {
        test("SelectOperationClass", () => {
            const goodop = new ops_1.NFTMintOperation(0, buffer_1.Buffer.from(""), []);
            const operation = (0, ops_1.SelectOperationClass)(goodop.getOperationID());
            expect(operation).toBeInstanceOf(ops_1.NFTMintOperation);
            expect(() => {
                (0, ops_1.SelectOperationClass)(99);
            }).toThrow("Error - SelectOperationClass: unknown opid");
        });
        test("comparator", () => {
            const outputOwners = [];
            outputOwners.push(new output_1.OutputOwners(addrs, locktime, 1));
            const op1 = new ops_1.NFTMintOperation(1, payload, outputOwners);
            const op2 = new ops_1.NFTMintOperation(2, payload, outputOwners);
            const op3 = new ops_1.NFTMintOperation(0, payload, outputOwners);
            const cmp = ops_1.NFTMintOperation.comparator();
            expect(cmp(op1, op1)).toBe(0);
            expect(cmp(op2, op2)).toBe(0);
            expect(cmp(op3, op3)).toBe(0);
            expect(cmp(op1, op2)).toBe(-1);
            expect(cmp(op1, op3)).toBe(1);
        });
        test("Functionality", () => {
            const outputOwners = [];
            outputOwners.push(new output_1.OutputOwners(addrs, locktime, 1));
            const op = new ops_1.NFTMintOperation(0, payload, outputOwners);
            expect(op.getOperationID()).toBe(constants_1.AVMConstants.NFTMINTOPID);
            expect(op.getOutputOwners().toString()).toBe(outputOwners.toString());
            const opcopy = new ops_1.NFTMintOperation();
            const opb = op.toBuffer();
            opcopy.fromBuffer(opb);
            expect(opcopy.toString()).toBe(op.toString());
        });
        test("NFTMintOperation codecIDs", () => {
            const outputOwners = [];
            outputOwners.push(new output_1.OutputOwners(addrs, locktime, 1));
            const nftMintOperation = new ops_1.NFTMintOperation(0, payload, outputOwners);
            expect(nftMintOperation.getCodecID()).toBe(codecID_zero);
            expect(nftMintOperation.getOperationID()).toBe(constants_1.AVMConstants.NFTMINTOPID);
            nftMintOperation.setCodecID(codecID_one);
            expect(nftMintOperation.getCodecID()).toBe(codecID_one);
            expect(nftMintOperation.getOperationID()).toBe(constants_1.AVMConstants.NFTMINTOPID_CODECONE);
            nftMintOperation.setCodecID(codecID_zero);
            expect(nftMintOperation.getCodecID()).toBe(codecID_zero);
            expect(nftMintOperation.getOperationID()).toBe(constants_1.AVMConstants.NFTMINTOPID);
        });
        test("Invalid NFTMintOperation codecID", () => {
            const outputOwners = [];
            outputOwners.push(new output_1.OutputOwners(addrs, locktime, 1));
            const nftMintOperation = new ops_1.NFTMintOperation(0, payload, outputOwners);
            expect(() => {
                nftMintOperation.setCodecID(2);
            }).toThrow("Error - NFTMintOperation.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        });
    });
    describe("NFTTransferOperation", () => {
        test("SelectOperationClass", () => {
            const nout = new outputs_1.NFTTransferOutput(1000, payload, addrs, locktime, 1);
            const goodop = new ops_1.NFTTransferOperation(nout);
            const operation = (0, ops_1.SelectOperationClass)(goodop.getOperationID());
            expect(operation).toBeInstanceOf(ops_1.NFTTransferOperation);
            expect(() => {
                (0, ops_1.SelectOperationClass)(99);
            }).toThrow("Error - SelectOperationClass: unknown opid");
        });
        test("comparator", () => {
            const op1 = new ops_1.NFTTransferOperation(new outputs_1.NFTTransferOutput(1000, payload, addrs, locktime, 1));
            const op2 = new ops_1.NFTTransferOperation(new outputs_1.NFTTransferOutput(1001, payload, addrs, locktime, 1));
            const op3 = new ops_1.NFTTransferOperation(new outputs_1.NFTTransferOutput(999, payload, addrs, locktime, 1));
            const cmp = ops_1.NFTTransferOperation.comparator();
            expect(cmp(op1, op1)).toBe(0);
            expect(cmp(op2, op2)).toBe(0);
            expect(cmp(op3, op3)).toBe(0);
            expect(cmp(op1, op2)).toBe(-1);
            expect(cmp(op1, op3)).toBe(1);
        });
        test("Functionality", () => {
            const nout = new outputs_1.NFTTransferOutput(1000, payload, addrs, locktime, 1);
            const op = new ops_1.NFTTransferOperation(nout);
            expect(op.getOperationID()).toBe(constants_1.AVMConstants.NFTXFEROPID);
            expect(op.getOutput().toString()).toBe(nout.toString());
            const opcopy = new ops_1.NFTTransferOperation();
            opcopy.fromBuffer(op.toBuffer());
            expect(opcopy.toString()).toBe(op.toString());
            op.addSignatureIdx(0, addrs[0]);
            const sigidx = op.getSigIdxs();
            expect(sigidx[0].getSource().toString("hex")).toBe(addrs[0].toString("hex"));
            opcopy.fromBuffer(op.toBuffer());
            expect(opcopy.toString()).toBe(op.toString());
        });
        test("NFTTransferOperation codecIDs", () => {
            const nftTransferOperation = new ops_1.NFTTransferOperation(new outputs_1.NFTTransferOutput(1000, payload, addrs, locktime, 1));
            expect(nftTransferOperation.getCodecID()).toBe(codecID_zero);
            expect(nftTransferOperation.getOperationID()).toBe(constants_1.AVMConstants.NFTXFEROPID);
            nftTransferOperation.setCodecID(codecID_one);
            expect(nftTransferOperation.getCodecID()).toBe(codecID_one);
            expect(nftTransferOperation.getOperationID()).toBe(constants_1.AVMConstants.NFTXFEROPID_CODECONE);
            nftTransferOperation.setCodecID(codecID_zero);
            expect(nftTransferOperation.getCodecID()).toBe(codecID_zero);
            expect(nftTransferOperation.getOperationID()).toBe(constants_1.AVMConstants.NFTXFEROPID);
        });
        test("Invalid NFTTransferOperation codecID", () => {
            const nftTransferOperation = new ops_1.NFTTransferOperation(new outputs_1.NFTTransferOutput(1000, payload, addrs, locktime, 1));
            expect(() => {
                nftTransferOperation.setCodecID(2);
            }).toThrow("Error - NFTTransferOperation.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
        });
    });
    test("TransferableOperation", () => {
        const nout = new outputs_1.NFTTransferOutput(1000, payload, addrs, locktime, 1);
        const op = new ops_1.NFTTransferOperation(nout);
        const nfttxid = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
            .update(bintools.fromBNToBuffer(new bn_js_1.default(1000), 32))
            .digest());
        const nftoutputidx = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(1000), 4));
        const nftutxo = new utxos_1.UTXO(constants_1.AVMConstants.LATESTCODEC, nfttxid, nftoutputidx, assetIDBuff, nout);
        const xferop = new ops_1.TransferableOperation(assetIDBuff, [nftutxo.getUTXOID()], op);
        const xferop2 = new ops_1.TransferableOperation(assetIDBuff, [buffer_1.Buffer.concat([nfttxid, nftoutputidx])], op);
        const uid = new ops_2.UTXOID();
        uid.fromString(nftutxo.getUTXOID());
        const xferop3 = new ops_1.TransferableOperation(assetIDBuff, [uid], op);
        expect(xferop.getAssetID().toString("hex")).toBe(assetID);
        const utxoiddeserialized = bintools.cb58Decode(xferop.getUTXOIDs()[0].toString());
        expect(bintools.bufferToB58(utxoiddeserialized)).toBe(nftutxo.getUTXOID());
        expect(xferop.getOperation().toString()).toBe(op.toString());
        const opcopy = new ops_1.TransferableOperation();
        opcopy.fromBuffer(xferop.toBuffer());
        expect(opcopy.toString()).toBe(xferop.toString());
        expect(xferop2.toBuffer().toString("hex")).toBe(xferop.toBuffer().toString("hex"));
        expect(xferop3.toBuffer().toString("hex")).toBe(xferop.toBuffer().toString("hex"));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2F2bS9vcHMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHVEQUFrRDtBQUNsRCw4REFBb0M7QUFDcEMsMkVBQWtEO0FBQ2xELGtEQUFzQjtBQUN0QixvQ0FBZ0M7QUFDaEMsMkRBQWlFO0FBQ2pFLCtEQUE4RDtBQUM5RCxtREFNa0M7QUFDbEMsdURBQXlEO0FBRXpELG1EQUFrRDtBQUVsRDs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFakQsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFTLEVBQUU7SUFDaEMsTUFBTSxZQUFZLEdBQVcsQ0FBQyxDQUFBO0lBQzlCLE1BQU0sV0FBVyxHQUFXLENBQUMsQ0FBQTtJQUM3QixNQUFNLE9BQU8sR0FDWCxrRUFBa0UsQ0FBQTtJQUNwRSxNQUFNLFdBQVcsR0FBVyxlQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUN2RCxNQUFNLEtBQUssR0FBYTtRQUN0QixRQUFRLENBQUMsVUFBVSxDQUFDLG1DQUFtQyxDQUFDO1FBQ3hELFFBQVEsQ0FBQyxVQUFVLENBQUMsbUNBQW1DLENBQUM7UUFDeEQsUUFBUSxDQUFDLFVBQVUsQ0FBQyxtQ0FBbUMsQ0FBQztLQUN6RCxDQUFDLElBQUksRUFBRSxDQUFBO0lBRVIsTUFBTSxRQUFRLEdBQU8sSUFBSSxlQUFFLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFbEMsTUFBTSxPQUFPLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxQyxPQUFPLENBQUMsS0FBSyxDQUNYLGlGQUFpRixFQUNqRixDQUFDLEVBQ0QsSUFBSSxFQUNKLE1BQU0sQ0FDUCxDQUFBO0lBRUQsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQVMsRUFBRTtRQUN0QyxJ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QUksQ0FDN0MsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FDbEMsQ0FBQTtRQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUM3QyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUNsQyxDQUFBO0lBQ0gsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVUWE8gfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL3V0eG9zXCJcbmltcG9ydCBjcmVhdGVIYXNoIGZyb20gXCJjcmVhdGUtaGFzaFwiXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9iaW50b29sc1wiXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcbmltcG9ydCB7IE5GVFRyYW5zZmVyT3V0cHV0IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9vdXRwdXRzXCJcbmltcG9ydCB7IEFWTUNvbnN0YW50cyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vY29uc3RhbnRzXCJcbmltcG9ydCB7XG4gIFNlbGVjdE9wZXJhdGlvbkNsYXNzLFxuICBPcGVyYXRpb24sXG4gIFRyYW5zZmVyYWJsZU9wZXJhdGlvbixcbiAgTkZUVHJhbnNmZXJPcGVyYXRpb24sXG4gIE5GVE1pbnRPcGVyYXRpb25cbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9vcHNcIlxuaW1wb3J0IHsgT3V0cHV0T3duZXJzIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9jb21tb24vb3V0cHV0XCJcbmltcG9ydCB7IFNpZ0lkeCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvY29tbW9uL2NyZWRlbnRpYWxzXCJcbmltcG9ydCB7IFVUWE9JRCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vb3BzXCJcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcblxuZGVzY3JpYmUoXCJPcGVyYXRpb25zXCIsICgpOiB2b2lkID0+IHtcbiAgY29uc3QgY29kZWNJRF96ZXJvOiBudW1iZXIgPSAwXG4gIGNvbnN0IGNvZGVjSURfb25lOiBudW1iZXIgPSAxXG4gIGNvbnN0IGFzc2V0SUQ6IHN0cmluZyA9XG4gICAgXCI4YTVkMmQzMmU2OGJjNTAwMzZlNGQwODYwNDQ2MTdmZTRhMGEwMjk2YjI3NDk5OWJhNTY4ZWE5MmRhNDZkNTMzXCJcbiAgY29uc3QgYXNzZXRJREJ1ZmY6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGFzc2V0SUQsIFwiaGV4XCIpXG4gIGNvbnN0IGFkZHJzOiBCdWZmZXJbXSA9IFtcbiAgICBiaW50b29scy5jYjU4RGVjb2RlKFwiQjZENHYxVnRQWUxiaVV2WVh0VzRQeDhvRTlpbUMydkdXXCIpLFxuICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoXCJQNXdkUnVaZWFEdDI4ZUhNUDVTM3c5WmRvQmZvN3d1ekZcIiksXG4gICAgYmludG9vbHMuY2I1OERlY29kZShcIjZZM2t5c2pGOWpuSG5Za2RTOXlHQXVvSHlhZTJlTm1lVlwiKVxuICBdLnNvcnQoKVxuXG4gIGNvbnN0IGxvY2t0aW1lOiBCTiA9IG5ldyBCTig1NDMyMSlcblxuICBjb25zdCBwYXlsb2FkOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMTAyNClcbiAgcGF5bG9hZC53cml0ZShcbiAgICBcIkFsbCB5b3UgVHJla2tpZXMgYW5kIFRWIGFkZGljdHMsIERvbid0IG1lYW4gdG8gZGlzcyBkb24ndCBtZWFuIHRvIGJyaW5nIHN0YXRpYy5cIixcbiAgICAwLFxuICAgIDEwMjQsXG4gICAgXCJ1dGY4XCJcbiAgKVxuXG4gIGRlc2NyaWJlKFwiTkZUTWludE9wZXJhdGlvblwiLCAoKTogdm9pZCA9PiB7XG4gICAgdGVzdChcIlNlbGVjdE9wZXJhdGlvbkNsYXNzXCIsICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGdvb2RvcDogTkZUTWludE9wZXJhdGlvbiA9IG5ldyBORlRNaW50T3BlcmF0aW9uKFxuICAgICAgICAwLFxuICAgICAgICBCdWZmZXIuZnJvbShcIlwiKSxcbiAgICAgICAgW11cbiAgICAgIClcbiAgICAgIGNvbnN0IG9wZXJhdGlvbjogT3BlcmF0aW9uID0gU2VsZWN0T3BlcmF0aW9uQ2xhc3MoZ29vZG9wLmdldE9wZXJhdGlvbklEKCkpXG4gICAgICBleHBlY3Qob3BlcmF0aW9uKS50b0JlSW5zdGFuY2VPZihORlRNaW50T3BlcmF0aW9uKVxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgU2VsZWN0T3BlcmF0aW9uQ2xhc3MoOTkpXG4gICAgICB9KS50b1Rocm93KFwiRXJyb3IgLSBTZWxlY3RPcGVyYXRpb25DbGFzczogdW5rbm93biBvcGlkXCIpXG4gICAgfSlcblxuICAgIHRlc3QoXCJjb21wYXJhdG9yXCIsICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dE93bmVyczogT3V0cHV0T3duZXJzW10gPSBbXVxuICAgICAgb3V0cHV0T3duZXJzLnB1c2gobmV3IE91dHB1dE93bmVycyhhZGRycywgbG9ja3RpbWUsIDEpKVxuICAgICAgY29uc3Qgb3AxOiBORlRNaW50T3BlcmF0aW9uID0gbmV3IE5GVE1pbnRPcGVyYXRpb24oXG4gICAgICAgIDEsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICAgIG91dHB1dE93bmVyc1xuICAgICAgKVxuICAgICAgY29uc3Qgb3AyOiBORlRNaW50T3BlcmF0aW9uID0gbmV3IE5GVE1pbnRPcGVyYXRpb24oXG4gICAgICAgIDIsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICAgIG91dHB1dE93bmVyc1xuICAgICAgKVxuICAgICAgY29uc3Qgb3AzOiBORlRNaW50T3BlcmF0aW9uID0gbmV3IE5GVE1pbnRPcGVyYXRpb24oXG4gICAgICAgIDAsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICAgIG91dHB1dE93bmVyc1xuICAgICAgKVxuICAgICAgY29uc3QgY21wID0gTkZUTWludE9wZXJhdGlvbi5jb21wYXJhdG9yKClcbiAgICAgIGV4cGVjdChjbXAob3AxLCBvcDEpKS50b0JlKDApXG4gICAgICBleHBlY3QoY21wKG9wMiwgb3AyKSkudG9CZSgwKVxuICAgICAgZXhwZWN0KGNtcChvcDMsIG9wMykpLnRvQmUoMClcbiAgICAgIGV4cGVjdChjbXAob3AxLCBvcDIpKS50b0JlKC0xKVxuICAgICAgZXhwZWN0KGNtcChvcDEsIG9wMykpLnRvQmUoMSlcbiAgICB9KVxuXG4gICAgdGVzdChcIkZ1bmN0aW9uYWxpdHlcIiwgKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0T3duZXJzOiBPdXRwdXRPd25lcnNbXSA9IFtdXG4gICAgICBvdXRwdXRPd25lcnMucHVzaChuZXcgT3V0cHV0T3duZXJzKGFkZHJzLCBsb2NrdGltZSwgMSkpXG4gICAgICBjb25zdCBvcDogTkZUTWludE9wZXJhdGlvbiA9IG5ldyBORlRNaW50T3BlcmF0aW9uKFxuICAgICAgICAwLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgICBvdXRwdXRPd25lcnNcbiAgICAgIClcblxuICAgICAgZXhwZWN0KG9wLmdldE9wZXJhdGlvbklEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLk5GVE1JTlRPUElEKVxuICAgICAgZXhwZWN0KG9wLmdldE91dHB1dE93bmVycygpLnRvU3RyaW5nKCkpLnRvQmUob3V0cHV0T3duZXJzLnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IG9wY29weTogTkZUTWludE9wZXJhdGlvbiA9IG5ldyBORlRNaW50T3BlcmF0aW9uKClcbiAgICAgIGNvbnN0IG9wYjogQnVmZmVyID0gb3AudG9CdWZmZXIoKVxuICAgICAgb3Bjb3B5LmZyb21CdWZmZXIob3BiKVxuICAgICAgZXhwZWN0KG9wY29weS50b1N0cmluZygpKS50b0JlKG9wLnRvU3RyaW5nKCkpXG4gICAgfSlcblxuICAgIHRlc3QoXCJORlRNaW50T3BlcmF0aW9uIGNvZGVjSURzXCIsICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dE93bmVyczogT3V0cHV0T3duZXJzW10gPSBbXVxuICAgICAgb3V0cHV0T3duZXJzLnB1c2gobmV3IE91dHB1dE93bmVycyhhZGRycywgbG9ja3RpbWUsIDEpKVxuICAgICAgY29uc3QgbmZ0TWludE9wZXJhdGlvbjogTkZUTWludE9wZXJhdGlvbiA9IG5ldyBORlRNaW50T3BlcmF0aW9uKFxuICAgICAgICAwLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgICBvdXRwdXRPd25lcnNcbiAgICAgIClcbiAgICAgIGV4cGVjdChuZnRNaW50T3BlcmF0aW9uLmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX3plcm8pXG4gICAgICBleHBlY3QobmZ0TWludE9wZXJhdGlvbi5nZXRPcGVyYXRpb25JRCgpKS50b0JlKEFWTUNvbnN0YW50cy5ORlRNSU5UT1BJRClcbiAgICAgIG5mdE1pbnRPcGVyYXRpb24uc2V0Q29kZWNJRChjb2RlY0lEX29uZSlcbiAgICAgIGV4cGVjdChuZnRNaW50T3BlcmF0aW9uLmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX29uZSlcbiAgICAgIGV4cGVjdChuZnRNaW50T3BlcmF0aW9uLmdldE9wZXJhdGlvbklEKCkpLnRvQmUoXG4gICAgICAgIEFWTUNvbnN0YW50cy5ORlRNSU5UT1BJRF9DT0RFQ09ORVxuICAgICAgKVxuICAgICAgbmZ0TWludE9wZXJhdGlvbi5zZXRDb2RlY0lEKGNvZGVjSURfemVybylcbiAgICAgIGV4cGVjdChuZnRNaW50T3BlcmF0aW9uLmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX3plcm8pXG4gICAgICBleHBlY3QobmZ0TWludE9wZXJhdGlvbi5nZXRPcGVyYXRpb25JRCgpKS50b0JlKEFWTUNvbnN0YW50cy5ORlRNSU5UT1BJRClcbiAgICB9KVxuXG4gICAgdGVzdChcIkludmFsaWQgTkZUTWludE9wZXJhdGlvbiBjb2RlY0lEXCIsICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dE93bmVyczogT3V0cHV0T3duZXJzW10gPSBbXVxuICAgICAgb3V0cHV0T3duZXJzLnB1c2gobmV3IE91dHB1dE93bmVycyhhZGRycywgbG9ja3RpbWUsIDEpKVxuICAgICAgY29uc3QgbmZ0TWludE9wZXJhdGlvbjogTkZUTWludE9wZXJhdGlvbiA9IG5ldyBORlRNaW50T3BlcmF0aW9uKFxuICAgICAgICAwLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgICBvdXRwdXRPd25lcnNcbiAgICAgIClcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5mdE1pbnRPcGVyYXRpb24uc2V0Q29kZWNJRCgyKVxuICAgICAgfSkudG9UaHJvdyhcbiAgICAgICAgXCJFcnJvciAtIE5GVE1pbnRPcGVyYXRpb24uc2V0Q29kZWNJRDogaW52YWxpZCBjb2RlY0lELiBWYWxpZCBjb2RlY0lEcyBhcmUgMCBhbmQgMS5cIlxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoXCJORlRUcmFuc2Zlck9wZXJhdGlvblwiLCAoKTogdm9pZCA9PiB7XG4gICAgdGVzdChcIlNlbGVjdE9wZXJhdGlvbkNsYXNzXCIsICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IG5vdXQ6IE5GVFRyYW5zZmVyT3V0cHV0ID0gbmV3IE5GVFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICAxMDAwLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgICBhZGRycyxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIDFcbiAgICAgIClcbiAgICAgIGNvbnN0IGdvb2RvcDogTkZUVHJhbnNmZXJPcGVyYXRpb24gPSBuZXcgTkZUVHJhbnNmZXJPcGVyYXRpb24obm91dClcbiAgICAgIGNvbnN0IG9wZXJhdGlvbjogT3BlcmF0aW9uID0gU2VsZWN0T3BlcmF0aW9uQ2xhc3MoZ29vZG9wLmdldE9wZXJhdGlvbklEKCkpXG4gICAgICBleHBlY3Qob3BlcmF0aW9uKS50b0JlSW5zdGFuY2VPZihORlRUcmFuc2Zlck9wZXJhdGlvbilcbiAgICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XG4gICAgICAgIFNlbGVjdE9wZXJhdGlvbkNsYXNzKDk5KVxuICAgICAgfSkudG9UaHJvdyhcIkVycm9yIC0gU2VsZWN0T3BlcmF0aW9uQ2xhc3M6IHVua25vd24gb3BpZFwiKVxuICAgIH0pXG5cbiAgICB0ZXN0KFwiY29tcGFyYXRvclwiLCAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBvcDE6IE5GVFRyYW5zZmVyT3BlcmF0aW9uID0gbmV3IE5GVFRyYW5zZmVyT3BlcmF0aW9uKFxuICAgICAgICBuZXcgTkZUVHJhbnNmZXJPdXRwdXQoMTAwMCwgcGF5bG9hZCwgYWRkcnMsIGxvY2t0aW1lLCAxKVxuICAgICAgKVxuICAgICAgY29uc3Qgb3AyOiBORlRUcmFuc2Zlck9wZXJhdGlvbiA9IG5ldyBORlRUcmFuc2Zlck9wZXJhdGlvbihcbiAgICAgICAgbmV3IE5GVFRyYW5zZmVyT3V0cHV0KDEwMDEsIHBheWxvYWQsIGFkZHJzLCBsb2NrdGltZSwgMSlcbiAgICAgIClcbiAgICAgIGNvbnN0IG9wMzogTkZUVHJhbnNmZXJPcGVyYXRpb24gPSBuZXcgTkZUVHJhbnNmZXJPcGVyYXRpb24oXG4gICAgICAgIG5ldyBORlRUcmFuc2Zlck91dHB1dCg5OTksIHBheWxvYWQsIGFkZHJzLCBsb2NrdGltZSwgMSlcbiAgICAgIClcbiAgICAgIGNvbnN0IGNtcCA9IE5GVFRyYW5zZmVyT3BlcmF0aW9uLmNvbXBhcmF0b3IoKVxuICAgICAgZXhwZWN0KGNtcChvcDEsIG9wMSkpLnRvQmUoMClcbiAgICAgIGV4cGVjdChjbXAob3AyLCBvcDIpKS50b0JlKDApXG4gICAgICBleHBlY3QoY21wKG9wMywgb3AzKSkudG9CZSgwKVxuICAgICAgZXhwZWN0KGNtcChvcDEsIG9wMikpLnRvQmUoLTEpXG4gICAgICBleHBlY3QoY21wKG9wMSwgb3AzKSkudG9CZSgxKVxuICAgIH0pXG5cbiAgICB0ZXN0KFwiRnVuY3Rpb25hbGl0eVwiLCAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBub3V0OiBORlRUcmFuc2Zlck91dHB1dCA9IG5ldyBORlRUcmFuc2Zlck91dHB1dChcbiAgICAgICAgMTAwMCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgYWRkcnMsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICAxXG4gICAgICApXG4gICAgICBjb25zdCBvcDogTkZUVHJhbnNmZXJPcGVyYXRpb24gPSBuZXcgTkZUVHJhbnNmZXJPcGVyYXRpb24obm91dClcblxuICAgICAgZXhwZWN0KG9wLmdldE9wZXJhdGlvbklEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLk5GVFhGRVJPUElEKVxuICAgICAgZXhwZWN0KG9wLmdldE91dHB1dCgpLnRvU3RyaW5nKCkpLnRvQmUobm91dC50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCBvcGNvcHk6IE5GVFRyYW5zZmVyT3BlcmF0aW9uID0gbmV3IE5GVFRyYW5zZmVyT3BlcmF0aW9uKClcbiAgICAgIG9wY29weS5mcm9tQnVmZmVyKG9wLnRvQnVmZmVyKCkpXG4gICAgICBleHBlY3Qob3Bjb3B5LnRvU3RyaW5nKCkpLnRvQmUob3AudG9TdHJpbmcoKSlcblxuICAgICAgb3AuYWRkU2lnbmF0dXJlSWR4KDAsIGFkZHJzWzBdKVxuICAgICAgY29uc3Qgc2lnaWR4OiBTaWdJZHhbXSA9IG9wLmdldFNpZ0lkeHMoKVxuICAgICAgZXhwZWN0KHNpZ2lkeFswXS5nZXRTb3VyY2UoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgICAgYWRkcnNbMF0udG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIG9wY29weS5mcm9tQnVmZmVyKG9wLnRvQnVmZmVyKCkpXG4gICAgICBleHBlY3Qob3Bjb3B5LnRvU3RyaW5nKCkpLnRvQmUob3AudG9TdHJpbmcoKSlcbiAgICB9KVxuXG4gICAgdGVzdChcIk5GVFRyYW5zZmVyT3BlcmF0aW9uIGNvZGVjSURzXCIsICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IG5mdFRyYW5zZmVyT3BlcmF0aW9uOiBORlRUcmFuc2Zlck9wZXJhdGlvbiA9XG4gICAgICAgIG5ldyBORlRUcmFuc2Zlck9wZXJhdGlvbihcbiAgICAgICAgICBuZXcgTkZUVHJhbnNmZXJPdXRwdXQoMTAwMCwgcGF5bG9hZCwgYWRkcnMsIGxvY2t0aW1lLCAxKVxuICAgICAgICApXG4gICAgICBleHBlY3QobmZ0VHJhbnNmZXJPcGVyYXRpb24uZ2V0Q29kZWNJRCgpKS50b0JlKGNvZGVjSURfemVybylcbiAgICAgIGV4cGVjdChuZnRUcmFuc2Zlck9wZXJhdGlvbi5nZXRPcGVyYXRpb25JRCgpKS50b0JlKFxuICAgICAgICBBVk1Db25zdGFudHMuTkZUWEZFUk9QSURcbiAgICAgIClcbiAgICAgIG5mdFRyYW5zZmVyT3BlcmF0aW9uLnNldENvZGVjSUQoY29kZWNJRF9vbmUpXG4gICAgICBleHBlY3QobmZ0VHJhbnNmZXJPcGVyYXRpb24uZ2V0Q29kZWNJRCgpKS50b0JlKGNvZGVjSURfb25lKVxuICAgICAgZXhwZWN0KG5mdFRyYW5zZmVyT3BlcmF0aW9uLmdldE9wZXJhdGlvbklEKCkpLnRvQmUoXG4gICAgICAgIEFWTUNvbnN0YW50cy5ORlRYRkVST1BJRF9DT0RFQ09ORVxuICAgICAgKVxuICAgICAgbmZ0VHJhbnNmZXJPcGVyYXRpb24uc2V0Q29kZWNJRChjb2RlY0lEX3plcm8pXG4gICAgICBleHBlY3QobmZ0VHJhbnNmZXJPcGVyYXRpb24uZ2V0Q29kZWNJRCgpKS50b0JlKGNvZGVjSURfemVybylcbiAgICAgIGV4cGVjdChuZnRUcmFuc2Zlck9wZXJhdGlvbi5nZXRPcGVyYXRpb25JRCgpKS50b0JlKFxuICAgICAgICBBVk1Db25zdGFudHMuTkZUWEZFUk9QSURcbiAgICAgIClcbiAgICB9KVxuXG4gICAgdGVzdChcIkludmFsaWQgTkZUVHJhbnNmZXJPcGVyYXRpb24gY29kZWNJRFwiLCAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBuZnRUcmFuc2Zlck9wZXJhdGlvbjogTkZUVHJhbnNmZXJPcGVyYXRpb24gPVxuICAgICAgICBuZXcgTkZUVHJhbnNmZXJPcGVyYXRpb24oXG4gICAgICAgICAgbmV3IE5GVFRyYW5zZmVyT3V0cHV0KDEwMDAsIHBheWxvYWQsIGFkZHJzLCBsb2NrdGltZSwgMSlcbiAgICAgICAgKVxuICAgICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcbiAgICAgICAgbmZ0VHJhbnNmZXJPcGVyYXRpb24uc2V0Q29kZWNJRCgyKVxuICAgICAgfSkudG9UaHJvdyhcbiAgICAgICAgXCJFcnJvciAtIE5GVFRyYW5zZmVyT3BlcmF0aW9uLnNldENvZGVjSUQ6IGludmFsaWQgY29kZWNJRC4gVmFsaWQgY29kZWNJRHMgYXJlIDAgYW5kIDEuXCJcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIHRlc3QoXCJUcmFuc2ZlcmFibGVPcGVyYXRpb25cIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG5vdXQ6IE5GVFRyYW5zZmVyT3V0cHV0ID0gbmV3IE5GVFRyYW5zZmVyT3V0cHV0KFxuICAgICAgMTAwMCxcbiAgICAgIHBheWxvYWQsXG4gICAgICBhZGRycyxcbiAgICAgIGxvY2t0aW1lLFxuICAgICAgMVxuICAgIClcbiAgICBjb25zdCBvcDogTkZUVHJhbnNmZXJPcGVyYXRpb24gPSBuZXcgTkZUVHJhbnNmZXJPcGVyYXRpb24obm91dClcbiAgICBjb25zdCBuZnR0eGlkOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgLnVwZGF0ZShiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oMTAwMCksIDMyKSlcbiAgICAgICAgLmRpZ2VzdCgpXG4gICAgKVxuICAgIGNvbnN0IG5mdG91dHB1dGlkeDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICBiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oMTAwMCksIDQpXG4gICAgKVxuICAgIGNvbnN0IG5mdHV0eG86IFVUWE8gPSBuZXcgVVRYTyhcbiAgICAgIEFWTUNvbnN0YW50cy5MQVRFU1RDT0RFQyxcbiAgICAgIG5mdHR4aWQsXG4gICAgICBuZnRvdXRwdXRpZHgsXG4gICAgICBhc3NldElEQnVmZixcbiAgICAgIG5vdXRcbiAgICApXG4gICAgY29uc3QgeGZlcm9wOiBUcmFuc2ZlcmFibGVPcGVyYXRpb24gPSBuZXcgVHJhbnNmZXJhYmxlT3BlcmF0aW9uKFxuICAgICAgYXNzZXRJREJ1ZmYsXG4gICAgICBbbmZ0dXR4by5nZXRVVFhPSUQoKV0sXG4gICAgICBvcFxuICAgIClcblxuICAgIGNvbnN0IHhmZXJvcDI6IFRyYW5zZmVyYWJsZU9wZXJhdGlvbiA9IG5ldyBUcmFuc2ZlcmFibGVPcGVyYXRpb24oXG4gICAgICBhc3NldElEQnVmZixcbiAgICAgIFtCdWZmZXIuY29uY2F0KFtuZnR0eGlkLCBuZnRvdXRwdXRpZHhdKV0sXG4gICAgICBvcFxuICAgIClcbiAgICBjb25zdCB1aWQ6IFVUWE9JRCA9IG5ldyBVVFhPSUQoKVxuICAgIHVpZC5mcm9tU3RyaW5nKG5mdHV0eG8uZ2V0VVRYT0lEKCkpXG4gICAgY29uc3QgeGZlcm9wMzogVHJhbnNmZXJhYmxlT3BlcmF0aW9uID0gbmV3IFRyYW5zZmVyYWJsZU9wZXJhdGlvbihcbiAgICAgIGFzc2V0SURCdWZmLFxuICAgICAgW3VpZF0sXG4gICAgICBvcFxuICAgIClcblxuICAgIGV4cGVjdCh4ZmVyb3AuZ2V0QXNzZXRJRCgpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGFzc2V0SUQpXG4gICAgY29uc3QgdXR4b2lkZGVzZXJpYWxpemVkOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgeGZlcm9wLmdldFVUWE9JRHMoKVswXS50b1N0cmluZygpXG4gICAgKVxuICAgIGV4cGVjdChiaW50b29scy5idWZmZXJUb0I1OCh1dHhvaWRkZXNlcmlhbGl6ZWQpKS50b0JlKG5mdHV0eG8uZ2V0VVRYT0lEKCkpXG4gICAgZXhwZWN0KHhmZXJvcC5nZXRPcGVyYXRpb24oKS50b1N0cmluZygpKS50b0JlKG9wLnRvU3RyaW5nKCkpXG5cbiAgICBjb25zdCBvcGNvcHk6IFRyYW5zZmVyYWJsZU9wZXJhdGlvbiA9IG5ldyBUcmFuc2ZlcmFibGVPcGVyYXRpb24oKVxuICAgIG9wY29weS5mcm9tQnVmZmVyKHhmZXJvcC50b0J1ZmZlcigpKVxuICAgIGV4cGVjdChvcGNvcHkudG9TdHJpbmcoKSkudG9CZSh4ZmVyb3AudG9TdHJpbmcoKSlcblxuICAgIGV4cGVjdCh4ZmVyb3AyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICB4ZmVyb3AudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgIClcbiAgICBleHBlY3QoeGZlcm9wMy50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgeGZlcm9wLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICApXG4gIH0pXG59KVxuIl19