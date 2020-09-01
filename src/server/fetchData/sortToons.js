// Techincally insertion would be faster on small lists than merge, but at the expense of
// 0.01ms, I'm not bothered

module.exports = (data) => {
    if(data.length <= 1) return data;
    let dataCp = {...data};
    mergeSort(data, 0, data.length - 1, dataCp);
    return data.reverse();
}

function mergeSort (main, start, end, copy) {
    if(start === end) return;
    const mid = Math.floor((start + end) / 2);
    mergeSort(copy, start, mid, main);
    mergeSort(copy, mid + 1, end, main);
    merge(main, start, mid, end, copy);
}

function merge(main, start, mid, end, copy) {
    let k = start;
    let i = start;
    let j = mid + 1;
    while (i <= mid && j <= end){
        if (copy[i].power <= copy[j].power) main[k++] = copy[i++];
        else main[k++] = copy[j++];
    }
    while (i <= mid) main[k++] = copy[i++];
    while(j <= end) main[k++] = copy[j++];
}