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

let e = ((2).mul(n)).exp();
let o = (e.sub(1)).div(e.add(1));

o.backward();

```

output: backpropagation

```
node: 0.7064193203972352 grad: 1
node: 0.1467903398013824 grad: 4.812437394402588
node: -1 grad: 0
node: 6.812437394402588 grad: -0.10369553208337179
node: 1 grad: -0.10369553208337179
node: 4.812437394402588 grad: 0.1467903398013824
node: -1 grad: 0.1467903398013824
node: -1 grad: 0.1467903398013824
node: 1 grad: -0.1467903398013824
node: 5.812437394402588 grad: 0.04309480771801061
node: 1.7599999999999998 grad: 0.25048587188475413
node: 0.8799999999999999 grad: 0.5009717437695083
node: 6.88 grad: 0.5009717437695083
node: -6 grad: 0.5009717437695083
node: 0 grad: 0.5009717437695083
node: 1 grad: 0
node: 0 grad: 0.5009717437695083
node: -6 grad: 0.5009717437695083
node: -3 grad: 1.0019434875390165
node: 2 grad: -1.5029152313085248
node: 2 grad: 0
```

how to run:
```
node engine.js
```