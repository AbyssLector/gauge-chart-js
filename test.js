function convert_ntu(x) {
    return ((x - 0) * (0 - 800)) / (4095 - 0) + 800;
}
const data = convert_ntu(2098);

console.log(data);