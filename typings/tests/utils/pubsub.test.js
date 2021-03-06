"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("src");
const pubsub = new src_1.PubSub();
describe("PubSub", () => {
    test("newSet", () => {
        const data = '{"newSet":{}}';
        const newSet = pubsub.newSet();
        expect(newSet).toEqual(data);
    });
    test("newBloom", () => {
        const data = '{"newBloom":{"maxElements":1000,"collisionProb":0.01}}';
        const newBloom = pubsub.newBloom();
        expect(newBloom).toEqual(data);
    });
    test("addAddresses", () => {
        const data = '{"addAddresses":{"addresses":["X-djtx1wst8jt3z3fm9ce0z6akj3266zmgccdp03hjlaj"]}}';
        const addresses = [
            "X-djtx1wst8jt3z3fm9ce0z6akj3266zmgccdp03hjlaj"
        ];
        const addAddresses = pubsub.addAddresses(addresses);
        expect(addAddresses).toEqual(data);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVic3ViLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0cy91dGlscy9wdWJzdWIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixNQUFNLE1BQU0sR0FBVyxJQUFJLFlBQU0sRUFBRSxDQUFBO0FBRW5DLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBUyxFQUFFO0lBQzVCLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBUyxFQUFFO1FBQ3hCLE1BQU0sSUFBSSxHQUFXLGVBQWUsQ0FBQTtRQUNwQyxNQUFNLE1BQU0sR0FBVyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUE7UUFDdEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM5QixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBUyxFQUFFO1FBQzFCLE1BQU0sSUFBSSxHQUNSLHdEQUF3RCxDQUFBO1FBQzFELE1BQU0sUUFBUSxHQUFXLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUMxQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ2hDLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFTLEVBQUU7UUFDOUIsTUFBTSxJQUFJLEdBQ1Isa0ZBQWtGLENBQUE7UUFDcEYsTUFBTSxTQUFTLEdBQWE7WUFDMUIsK0NBQStDO1NBQ2hELENBQUE7UUFDRCxNQUFNLFlBQVksR0FBVyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQzNELE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDcEMsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFB1YlN1YiB9IGZyb20gXCJzcmNcIlxuXG5jb25zdCBwdWJzdWI6IFB1YlN1YiA9IG5ldyBQdWJTdWIoKVxuXG5kZXNjcmliZShcIlB1YlN1YlwiLCAoKTogdm9pZCA9PiB7XG4gIHRlc3QoXCJuZXdTZXRcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGRhdGE6IHN0cmluZyA9ICd7XCJuZXdTZXRcIjp7fX0nXG4gICAgY29uc3QgbmV3U2V0OiBzdHJpbmcgPSBwdWJzdWIubmV3U2V0KClcbiAgICBleHBlY3QobmV3U2V0KS50b0VxdWFsKGRhdGEpXG4gIH0pXG5cbiAgdGVzdChcIm5ld0Jsb29tXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBkYXRhOiBzdHJpbmcgPVxuICAgICAgJ3tcIm5ld0Jsb29tXCI6e1wibWF4RWxlbWVudHNcIjoxMDAwLFwiY29sbGlzaW9uUHJvYlwiOjAuMDF9fSdcbiAgICBjb25zdCBuZXdCbG9vbTogc3RyaW5nID0gcHVic3ViLm5ld0Jsb29tKClcbiAgICBleHBlY3QobmV3Qmxvb20pLnRvRXF1YWwoZGF0YSlcbiAgfSlcblxuICB0ZXN0KFwiYWRkQWRkcmVzc2VzXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBkYXRhOiBzdHJpbmcgPVxuICAgICAgJ3tcImFkZEFkZHJlc3Nlc1wiOntcImFkZHJlc3Nlc1wiOltcIlgtZGp0eDF3c3Q4anQzejNmbTljZTB6NmFrajMyNjZ6bWdjY2RwMDNoamxhalwiXX19J1xuICAgIGNvbnN0IGFkZHJlc3Nlczogc3RyaW5nW10gPSBbXG4gICAgICBcIlgtZGp0eDF3c3Q4anQzejNmbTljZTB6NmFrajMyNjZ6bWdjY2RwMDNoamxhalwiXG4gICAgXVxuICAgIGNvbnN0IGFkZEFkZHJlc3Nlczogc3RyaW5nID0gcHVic3ViLmFkZEFkZHJlc3NlcyhhZGRyZXNzZXMpXG4gICAgZXhwZWN0KGFkZEFkZHJlc3NlcykudG9FcXVhbChkYXRhKVxuICB9KVxufSlcbiJdfQ==