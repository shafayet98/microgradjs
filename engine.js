class Value{

    constructor(data, children = [], op=''){
        this.data = data;
        this.prev = new Set(children);
        this.grad = 0.0;
        this._backward = () => {};
        this.op = op;
    }

    toString(){
        return `Value(data=${this.data})`
    }

    add(other){
        if (other instanceof(Value) == false){
            other = new Value(other);
        }
        const out = new Value(this.data + other.data, [this, other], '+');

        out._backward = () =>{
            this.grad += 1 * out.grad;
            other.grad += 1 * out.grad;
            
        }
        return out;
    }

    pow(other){
        if (other instanceof(Value) == false){
            other = new Value(other);
        }

        const out = new Value(this.data ** other.data, [this], `**${other}`);
        

        out._backward = () =>{
            this.grad += (other * this.data ** (other - 1)) * out.grad;
        }
        
        return out;
    }

    

    mul(other){
        if (other instanceof(Value) == false){
            other = new Value(other);
        }
        const out = new Value(this.data * other.data, [this, other], '*');

        out._backward = () =>{
            this.grad += other.data * out.grad;
            other.grad += this.data * out.grad;
        }
        return out;
    }

    div(other){
        if (other instanceof(Value) == false){
            other = new Value(other);
        }
        return this.mul(other.pow(-1));
    }

    neg(){
        const out = this.mul(-1);
        return out;
    }

    sub(other){
        if (other instanceof(Value) == false){
            other = new Value(other);
        }

        const out = this.add(other.neg());
        return out;
    }

    exp(){
        const x = this.data;
        const out = new Value(Math.exp(x), [this], 'exp');

        out._backward = () =>{
            this.grad += out.data * out.grad;
        }

        return out;

    }


    tanh(){
        const x = this.data;
        const t = (Math.exp(2*x) -1 ) / (Math.exp(2*x) +1);
        const out = new Value(t, [this], 'tanh');

        out._backward = () =>{
            this.grad += (1-t**2) * out.grad;
        }

        return out;
    }


    backward(){
        const topo = [];
        const visited = new Set();
    
        function build_topo(v){
            if (!visited.has(v)){
                visited.add(v);
                for (let child of v.prev){
                    build_topo(child);
                }
                topo.push(v);
            }
        }
    
        build_topo(this);
    
        this.grad = 1.0;  
        for (let v of topo.reverse()){
            v._backward();
            console.log("Node: " + v.data + " grad: " + v.grad);
        }
    }
}

// to handle situation like (2).mul(a) ## handle reverse-multiplication
Number.prototype.mul = function (value) {
    if (value instanceof Value) {
        return new Value(this * value.data);
    }
}

// to handle situation like (2).div(a) ## handle reverse-division
Number.prototype.div = function (value) {
    if (value instanceof Value) {
        return new Value(this).div(value);
    }
}

let x1 = new Value(2.0);
let x2 = new Value(0.0);

let w1 = new Value(-3.0);
let w2 = new Value(1.0);

let b = new Value(6.88);

let x1w1 = x1.mul(w1);
let x2w2 = x2.mul(w2);

let x1w1x2w2 = x1w1.add(x2w2);
let n = x1w1x2w2.add(b);

let o = n.tanh();

o.grad = 1.0;
// o.backward();


p = new Value(4);
q = new Value(10);

console.log(p.sub(q));