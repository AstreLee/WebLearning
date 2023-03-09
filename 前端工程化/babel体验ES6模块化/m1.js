let a = 1;
let b = 2;
let c = 3;
function show() {
    console.log("默认导出!");
}

export default {
    a,
    b,
    show
}

export let s1 = 10;
export let s2 = 20;
export function say() {
    console.log("这是按需导出!");
}

