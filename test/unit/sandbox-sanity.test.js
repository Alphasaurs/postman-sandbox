describe('sandbox', function () {
    this.timeout(1000 * 60);
    var Sandbox = require('../../lib');

    it('must create context', function (done) {
        Sandbox.createContext(function (err, ctx) {
            if (err) { return done(err); }
            ctx.on('error', done);

            ctx.ping(function (err, ttl, packet) {
                expect(err).to.not.be.ok();
                expect(packet).to.be.ok();
                expect(ttl).be.a('number');
                expect(ttl >= 0).be.ok();
                done();
            });
        });
    });

    it('must execute a piece of code', function (done) {
        Sandbox.createContext(function (err, ctx) {
            if (err) { return done(err); }
            ctx.on('error', done);

            ctx.execute('throw new Error("this will regurgitate!")', function (err) {
                expect(err).be.ok();
                expect(err).have.property('message', 'this will regurgitate!');
                done();
            });
        });
    });

    it('must have (and not have) a few important globals', function (done) {
        Sandbox.createContext(function (err, ctx) {
            if (err) { return done(err); }
            ctx.on('error', done);

            ctx.execute(`
                var assert = require('assert');
                assert.equal(typeof _, 'function');
                assert.equal(typeof window, 'undefined');
                assert.equal(typeof Error, 'function');
                assert.equal(typeof console, 'object');
            `, done);
        });
    });
});