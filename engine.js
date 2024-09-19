class Value {

    constructor(data, children = [], op = '') {
        this.data = data;
        this.prev = new Set(children);
        this.grad = 0.0;
        this._backward = () => { };
        this.op = op;
        this.label = '';
    }

    toString() {
        return `Value(data=${this.data})`
    }

    add(other) {
        if (!(other instanceof Value)) {
            other = new Value(other);
        }
        const out = new Value(this.data + other.data, [this, other], '+');
        out.label = `(${this.label} + ${other.label})`;

        out._backward = () => {
            this.grad += 1 * out.grad;
            other.grad += 1 * out.grad;
        }
        return out;
    }

    pow(other) {
        if (!(other instanceof Value)) {
            other = new Value(other);
        }

        const out = new Value(this.data ** other.data, [this, other], `**`);
        out.label = `(${this.label} ** ${other.label})`;

        out._backward = () => {
            this.grad += (other.data * this.data ** (other.data - 1)) * out.grad;
        }

        return out;
    }

    mul(other) {
        if (!(other instanceof Value)) {
            other = new Value(other);
        }
        const out = new Value(this.data * other.data, [this, other], '*');
        out.label = `(${this.label} * ${other.label})`;

        out._backward = () => {
            this.grad += other.data * out.grad;
            other.grad += this.data * out.grad;
        }
        return out;
    }

    div(other) {
        if (!(other instanceof Value)) {
            other = new Value(other);
        }
        return this.mul(other.pow(-1));
    }

    neg() {
        const out = this.mul(-1);
        out.label = `-(${this.label})`;
        return out;
    }

    sub(other) {
        if (!(other instanceof Value)) {
            other = new Value(other);
        }
        const out = this.add(other.neg());
        return out;
    }

    exp() {
        const x = this.data;
        const out = new Value(Math.exp(x), [this], 'exp');
        out.label = `exp(${this.label})`;

        out._backward = () => {
            this.grad += out.data * out.grad;
        }

        return out;
    }

    tanh() {
        const x = this.data;
        const t = (Math.exp(2 * x) - 1) / (Math.exp(2 * x) + 1);
        const out = new Value(t, [this], 'tanh');

        out._backward = () => {
            this.grad += (1 - t ** 2) * out.grad;
        }

        return out;
    }

    backward() {
        const topo = [];
        const visited = new Set();

        function build_topo(v) {
            if (!visited.has(v)) {
                visited.add(v);
                for (let child of v.prev) {
                    build_topo(child);
                }
                topo.push(v);
            }
        }

        build_topo(this);

        this.grad = 1.0;
        // console.log("Topological order:", topo.map(v => v.data));
        for (let v of topo.reverse()) {
            v._backward();
            console.log("node: " + v.data + " grad: " + v.grad);
        }
    }
}

// to handle situation like (2).mul(a) ## handle reverse-multiplication
Number.prototype.mul = function (value) {
    if (value instanceof Value) {
        const out = new Value(this * value.data, [new Value(this), value], '*');

        out._backward = () => {
            value.grad += this * out.grad;
        };

        return out;
    }
}

// to handle situation like (2).div(a) ## handle reverse-division
Number.prototype.div = function (value) {
    if (value instanceof Value) {
        return new Value(this).div(value);
    }
}

// Example case
let x1 = new Value(2.0); x1.label = 'x1';
let x2 = new Value(0.0); x2.label = 'x2';

let w1 = new Value(-3.0); w1.label = 'w1';
let w2 = new Value(1.0); w2.label = 'w2';

let b = new Value(6.88); b.label = 'b';

let x1w1 = x1.mul(w1); x1w1.label = 'x1w1';
let x2w2 = x2.mul(w2); x2w2.label = 'x2w2';

let x1w1x2w2 = x1w1.add(x2w2); x1w1x2w2.label='x1w1x2w2';
let n = x1w1x2w2.add(b); n.label = 'n';

let e = ((2).mul(n)).exp(); e.label = 'e';
let o = (e.sub(1)).div(e.add(1)); o.label = 'o';

o.backward();


