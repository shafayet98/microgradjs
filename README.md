a nn building block in js. this is completely for learning purpose. I am forllowing Andrej Karpathy's tutorials for learning and converting the code base in JS. 

example:

```
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
o.backward();

```

output: backpropagation

```
Node: 0.7064193203972352 grad: 1
Node: 0.8799999999999999 grad: 0.5009717437695084
Node: 6.88 grad: 0.5009717437695084
Node: -6 grad: 0.5009717437695084
Node: 0 grad: 0.5009717437695084
Node: 1 grad: 0
Node: 0 grad: 0.5009717437695084
Node: -6 grad: 0.5009717437695084
Node: -3 grad: 1.0019434875390167
Node: 2 grad: -1.502915231308525
```

how to run:
```
node engine.js
```