class Value {

    constructor(data, children = [], op = '') {
        this.data = data;
        this.prev = new Set(children);
        this.grad = 0.0;
        this._backward = () => { };
        this.op = op;
    }

    toString() {
        return `Value(data=${this.data})`
    }

    add(other) {
        if (!(other instanceof Value)) {
            other = new Value(other);
        }
        const out = new Value(this.data + other.data, [this, other], '+');

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
let x1 = new Value(2.0);
let x2 = new Value(0.0);

let w1 = new Value(-3.0);
let w2 = new Value(1.0);

let b = new Value(6.88);

let x1w1 = x1.mul(w1);
let x2w2 = x2.mul(w2);

let x1w1x2w2 = x1w1.add(x2w2);
let n = x1w1x2w2.add(b);

let e = ((2).mul(n)).exp();
let o = (e.sub(1)).div(e.add(1));

o.backward();

console.log("------sep--------")
console.log(x1.grad);
console.log(x2.grad);
console.log(w1.grad);
console.log(w2.grad);