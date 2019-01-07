// 去除数组空位string类型
export function trimSpace(arr: any[]) {
    arr.filter((item: string) => {
        return item && item.trim();
    });
}
// 去除数组空位任意类型
export function trimSpace2(arr: any[]) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === '' || arr[i] === null || typeof (arr[i]) === 'undefined') {
            arr.splice(i, 1);
            i = i - 1;

        }
    }
    return arr;
}