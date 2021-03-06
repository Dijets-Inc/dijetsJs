"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubnetTx = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-CreateSubnetTx
 */
const buffer_1 = require("buffer/");
const basetx_1 = require("./basetx");
const constants_1 = require("./constants");
const constants_2 = require("../../utils/constants");
const outputs_1 = require("./outputs");
const errors_1 = require("../../utils/errors");
class CreateSubnetTx extends basetx_1.BaseTx {
    /**
     * Class representing an unsigned Create Subnet transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param subnetOwners Optional [[SECPOwnerOutput]] class for specifying who owns the subnet.
     */
    constructor(networkID = constants_2.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16), outs = undefined, ins = undefined, memo = undefined, subnetOwners = undefined) {
        super(networkID, blockchainID, outs, ins, memo);
        this._typeName = "SECPCredential";
        this._typeID = constants_1.PlatformVMConstants.CREATESUBNETTX;
        this.subnetOwners = undefined;
        this.subnetOwners = subnetOwners;
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { subnetOwners: this.subnetOwners.serialize(encoding) });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.subnetOwners = new outputs_1.SECPOwnerOutput();
        this.subnetOwners.deserialize(fields["subnetOwners"], encoding);
    }
    /**
     * Returns the id of the [[CreateSubnetTx]]
     */
    getTxType() {
        return this._typeID;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the reward address.
     */
    getSubnetOwners() {
        return this.subnetOwners;
    }
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[CreateSubnetTx]], parses it, populates the class, and returns the length of the [[CreateSubnetTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[CreateSubnetTx]]
     * @param offset A number for the starting position in the bytes.
     *
     * @returns The length of the raw [[CreateSubnetTx]]
     *
     * @remarks assume not-checksummed
     */
    fromBuffer(bytes, offset = 0) {
        offset = super.fromBuffer(bytes, offset);
        this.subnetOwners = new outputs_1.SECPOwnerOutput();
        offset = this.subnetOwners.fromBuffer(bytes, offset);
        return offset;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[CreateSubnetTx]].
     */
    toBuffer() {
        if (typeof this.subnetOwners === "undefined" ||
            !(this.subnetOwners instanceof outputs_1.SECPOwnerOutput)) {
            throw new errors_1.SubnetOwnerError("CreateSubnetTx.toBuffer -- this.subnetOwners is not a SECPOwnerOutput");
        }
        let typeID = buffer_1.Buffer.alloc(4);
        typeID.writeUInt32BE(this.subnetOwners.getOutputID(), 0);
        let barr = [
            super.toBuffer(),
            typeID,
            this.subnetOwners.toBuffer()
        ];
        return buffer_1.Buffer.concat(barr);
    }
}
exports.CreateSubnetTx = CreateSubnetTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlc3VibmV0dHguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL2NyZWF0ZXN1Ym5ldHR4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7R0FHRztBQUNILG9DQUFnQztBQUNoQyxxQ0FBaUM7QUFDakMsMkNBQWlEO0FBQ2pELHFEQUF3RDtBQUN4RCx1Q0FBK0Q7QUFHL0QsK0NBQXFEO0FBRXJELE1BQWEsY0FBZSxTQUFRLGVBQU07SUF3RXhDOzs7Ozs7Ozs7T0FTRztJQUNILFlBQ0UsWUFBb0IsNEJBQWdCLEVBQ3BDLGVBQXVCLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUMzQyxPQUE2QixTQUFTLEVBQ3RDLE1BQTJCLFNBQVMsRUFDcEMsT0FBZSxTQUFTLEVBQ3hCLGVBQWdDLFNBQVM7UUFFekMsS0FBSyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQXpGdkMsY0FBUyxHQUFHLGdCQUFnQixDQUFBO1FBQzVCLFlBQU8sR0FBRywrQkFBbUIsQ0FBQyxjQUFjLENBQUE7UUFlNUMsaUJBQVksR0FBb0IsU0FBUyxDQUFBO1FBMEVqRCxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQTtJQUNsQyxDQUFDO0lBeEZELFNBQVMsQ0FBQyxXQUErQixLQUFLO1FBQzVDLElBQUksTUFBTSxHQUFXLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDOUMsdUNBQ0ssTUFBTSxLQUNULFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFDcEQ7SUFDSCxDQUFDO0lBQ0QsV0FBVyxDQUFDLE1BQWMsRUFBRSxXQUErQixLQUFLO1FBQzlELEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUE7UUFDekMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ2pFLENBQUM7SUFJRDs7T0FFRztJQUNILFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7SUFDckIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsZUFBZTtRQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQTtJQUMxQixDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsVUFBVSxDQUFDLEtBQWEsRUFBRSxTQUFpQixDQUFDO1FBQzFDLE1BQU0sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUN4QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFBO1FBQ3pDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDcEQsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDO0lBRUQ7O09BRUc7SUFDSCxRQUFRO1FBQ04sSUFDRSxPQUFPLElBQUksQ0FBQyxZQUFZLEtBQUssV0FBVztZQUN4QyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksWUFBWSx5QkFBZSxDQUFDLEVBQy9DO1lBQ0EsTUFBTSxJQUFJLHlCQUFnQixDQUN4Qix1RUFBdUUsQ0FDeEUsQ0FBQTtTQUNGO1FBQ0QsSUFBSSxNQUFNLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNwQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDeEQsSUFBSSxJQUFJLEdBQWE7WUFDbkIsS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNoQixNQUFNO1lBQ04sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUU7U0FDN0IsQ0FBQTtRQUNELE9BQU8sZUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM1QixDQUFDO0NBdUJGO0FBN0ZELHdDQTZGQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKiBAbW9kdWxlIEFQSS1QbGF0Zm9ybVZNLUNyZWF0ZVN1Ym5ldFR4XG4gKi9cbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcbmltcG9ydCB7IEJhc2VUeCB9IGZyb20gXCIuL2Jhc2V0eFwiXG5pbXBvcnQgeyBQbGF0Zm9ybVZNQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29uc3RhbnRzXCJcbmltcG9ydCB7IERlZmF1bHROZXR3b3JrSUQgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY29uc3RhbnRzXCJcbmltcG9ydCB7IFRyYW5zZmVyYWJsZU91dHB1dCwgU0VDUE93bmVyT3V0cHV0IH0gZnJvbSBcIi4vb3V0cHV0c1wiXG5pbXBvcnQgeyBUcmFuc2ZlcmFibGVJbnB1dCB9IGZyb20gXCIuL2lucHV0c1wiXG5pbXBvcnQgeyBTZXJpYWxpemVkRW5jb2RpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvc2VyaWFsaXphdGlvblwiXG5pbXBvcnQgeyBTdWJuZXRPd25lckVycm9yIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2Vycm9yc1wiXG5cbmV4cG9ydCBjbGFzcyBDcmVhdGVTdWJuZXRUeCBleHRlbmRzIEJhc2VUeCB7XG4gIHByb3RlY3RlZCBfdHlwZU5hbWUgPSBcIlNFQ1BDcmVkZW50aWFsXCJcbiAgcHJvdGVjdGVkIF90eXBlSUQgPSBQbGF0Zm9ybVZNQ29uc3RhbnRzLkNSRUFURVNVQk5FVFRYXG5cbiAgc2VyaWFsaXplKGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKTogb2JqZWN0IHtcbiAgICBsZXQgZmllbGRzOiBvYmplY3QgPSBzdXBlci5zZXJpYWxpemUoZW5jb2RpbmcpXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmZpZWxkcyxcbiAgICAgIHN1Ym5ldE93bmVyczogdGhpcy5zdWJuZXRPd25lcnMuc2VyaWFsaXplKGVuY29kaW5nKVxuICAgIH1cbiAgfVxuICBkZXNlcmlhbGl6ZShmaWVsZHM6IG9iamVjdCwgZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpIHtcbiAgICBzdXBlci5kZXNlcmlhbGl6ZShmaWVsZHMsIGVuY29kaW5nKVxuICAgIHRoaXMuc3VibmV0T3duZXJzID0gbmV3IFNFQ1BPd25lck91dHB1dCgpXG4gICAgdGhpcy5zdWJuZXRPd25lcnMuZGVzZXJpYWxpemUoZmllbGRzW1wic3VibmV0T3duZXJzXCJdLCBlbmNvZGluZylcbiAgfVxuXG4gIHByb3RlY3RlZCBzdWJuZXRPd25lcnM6IFNFQ1BPd25lck91dHB1dCA9IHVuZGVmaW5lZFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpZCBvZiB0aGUgW1tDcmVhdGVTdWJuZXRUeF1dXG4gICAqL1xuICBnZXRUeFR5cGUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZUlEXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGZvciB0aGUgcmV3YXJkIGFkZHJlc3MuXG4gICAqL1xuICBnZXRTdWJuZXRPd25lcnMoKTogU0VDUE93bmVyT3V0cHV0IHtcbiAgICByZXR1cm4gdGhpcy5zdWJuZXRPd25lcnNcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGNvbnRhaW5pbmcgYW4gW1tDcmVhdGVTdWJuZXRUeF1dLCBwYXJzZXMgaXQsIHBvcHVsYXRlcyB0aGUgY2xhc3MsIGFuZCByZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhlIFtbQ3JlYXRlU3VibmV0VHhdXSBpbiBieXRlcy5cbiAgICpcbiAgICogQHBhcmFtIGJ5dGVzIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gY29udGFpbmluZyBhIHJhdyBbW0NyZWF0ZVN1Ym5ldFR4XV1cbiAgICogQHBhcmFtIG9mZnNldCBBIG51bWJlciBmb3IgdGhlIHN0YXJ0aW5nIHBvc2l0aW9uIGluIHRoZSBieXRlcy5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIGxlbmd0aCBvZiB0aGUgcmF3IFtbQ3JlYXRlU3VibmV0VHhdXVxuICAgKlxuICAgKiBAcmVtYXJrcyBhc3N1bWUgbm90LWNoZWNrc3VtbWVkXG4gICAqL1xuICBmcm9tQnVmZmVyKGJ5dGVzOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyID0gMCk6IG51bWJlciB7XG4gICAgb2Zmc2V0ID0gc3VwZXIuZnJvbUJ1ZmZlcihieXRlcywgb2Zmc2V0KVxuICAgIHRoaXMuc3VibmV0T3duZXJzID0gbmV3IFNFQ1BPd25lck91dHB1dCgpXG4gICAgb2Zmc2V0ID0gdGhpcy5zdWJuZXRPd25lcnMuZnJvbUJ1ZmZlcihieXRlcywgb2Zmc2V0KVxuICAgIHJldHVybiBvZmZzZXRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50YXRpb24gb2YgdGhlIFtbQ3JlYXRlU3VibmV0VHhdXS5cbiAgICovXG4gIHRvQnVmZmVyKCk6IEJ1ZmZlciB7XG4gICAgaWYgKFxuICAgICAgdHlwZW9mIHRoaXMuc3VibmV0T3duZXJzID09PSBcInVuZGVmaW5lZFwiIHx8XG4gICAgICAhKHRoaXMuc3VibmV0T3duZXJzIGluc3RhbmNlb2YgU0VDUE93bmVyT3V0cHV0KVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IFN1Ym5ldE93bmVyRXJyb3IoXG4gICAgICAgIFwiQ3JlYXRlU3VibmV0VHgudG9CdWZmZXIgLS0gdGhpcy5zdWJuZXRPd25lcnMgaXMgbm90IGEgU0VDUE93bmVyT3V0cHV0XCJcbiAgICAgIClcbiAgICB9XG4gICAgbGV0IHR5cGVJRDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXG4gICAgdHlwZUlELndyaXRlVUludDMyQkUodGhpcy5zdWJuZXRPd25lcnMuZ2V0T3V0cHV0SUQoKSwgMClcbiAgICBsZXQgYmFycjogQnVmZmVyW10gPSBbXG4gICAgICBzdXBlci50b0J1ZmZlcigpLFxuICAgICAgdHlwZUlELFxuICAgICAgdGhpcy5zdWJuZXRPd25lcnMudG9CdWZmZXIoKVxuICAgIF1cbiAgICByZXR1cm4gQnVmZmVyLmNvbmNhdChiYXJyKVxuICB9XG5cbiAgLyoqXG4gICAqIENsYXNzIHJlcHJlc2VudGluZyBhbiB1bnNpZ25lZCBDcmVhdGUgU3VibmV0IHRyYW5zYWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gbmV0d29ya0lEIE9wdGlvbmFsIG5ldHdvcmtJRCwgW1tEZWZhdWx0TmV0d29ya0lEXV1cbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBPcHRpb25hbCBibG9ja2NoYWluSUQsIGRlZmF1bHQgQnVmZmVyLmFsbG9jKDMyLCAxNilcbiAgICogQHBhcmFtIG91dHMgT3B0aW9uYWwgYXJyYXkgb2YgdGhlIFtbVHJhbnNmZXJhYmxlT3V0cHV0XV1zXG4gICAqIEBwYXJhbSBpbnMgT3B0aW9uYWwgYXJyYXkgb2YgdGhlIFtbVHJhbnNmZXJhYmxlSW5wdXRdXXNcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gZm9yIHRoZSBtZW1vIGZpZWxkXG4gICAqIEBwYXJhbSBzdWJuZXRPd25lcnMgT3B0aW9uYWwgW1tTRUNQT3duZXJPdXRwdXRdXSBjbGFzcyBmb3Igc3BlY2lmeWluZyB3aG8gb3ducyB0aGUgc3VibmV0LlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgbmV0d29ya0lEOiBudW1iZXIgPSBEZWZhdWx0TmV0d29ya0lELFxuICAgIGJsb2NrY2hhaW5JRDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDMyLCAxNiksXG4gICAgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB1bmRlZmluZWQsXG4gICAgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gdW5kZWZpbmVkLFxuICAgIG1lbW86IEJ1ZmZlciA9IHVuZGVmaW5lZCxcbiAgICBzdWJuZXRPd25lcnM6IFNFQ1BPd25lck91dHB1dCA9IHVuZGVmaW5lZFxuICApIHtcbiAgICBzdXBlcihuZXR3b3JrSUQsIGJsb2NrY2hhaW5JRCwgb3V0cywgaW5zLCBtZW1vKVxuICAgIHRoaXMuc3VibmV0T3duZXJzID0gc3VibmV0T3duZXJzXG4gIH1cbn1cbiJdfQ==