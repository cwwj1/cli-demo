// 只处理分, 如果是元的话,一般就是直接展示了,如果实在要元拿来的处理,请提前*100再传值;

const handleZero = (num) => String(Math.floor(num));
const handleOne = (num) => num.toFixed(1);
const handleTwo = (num) => num.toFixed(2);
const handleAuto = (num) => {
    const tempNum = String(num);
    const len = tempNum.length;
    let finalNum = 0;
    const Indx = tempNum.indexOf('.');
    if ((Indx > -1 && (len - Indx) <= 2) || Indx === -1) {
        finalNum = tempNum;
    } else if (Indx > -1 && (len - Indx) > 2) {
        finalNum = tempNum.slice(0, Indx + 3);
    }
    return String(finalNum);
};

const formatPrice = (num = 0, type = 'auto') => {
    num = Number(num) / 100;
    let finalNum = '';
    if (isNaN(num)) { // 判断NaN
        // eslint-disable-next-line no-console
        console.log('请传入数字内容');
        return '';
    }
    switch (type) {
        case 'zero':
            finalNum = handleZero(num);
            break;
        case 'one':
            finalNum = handleOne(num);
            break;
        case 'two':
            finalNum = handleTwo(num);
            break;
        case 'auto':
            finalNum = handleAuto(num);
            break;
        default:
    }
    return finalNum;
};
export default formatPrice;
