let array = [];
let delay = 50;
let isSorting = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function disableControls(disabled) {
    document.querySelectorAll("button, select, input").forEach(el => {
        el.disabled = disabled;
    });
}

function generateArray() {
    if (isSorting) return;

    const size = document.getElementById("size").value;
    const container = document.getElementById("array");

    array = [];
    container.innerHTML = "";

    for (let i = 0; i < size; i++) {
        let val = Math.floor(Math.random() * 300) + 20;
        array.push(val);

        let bar = document.createElement("div");
        bar.style.height = `${val}px`;
        bar.classList.add("bar");

        container.appendChild(bar);
    }
}

function updateBars(bars) {
    bars.forEach((bar, i) => {
        bar.style.height = `${array[i]}px`;
    });
}

/* 🔵 Bubble Sort */
async function bubbleSort() {
    let bars = document.querySelectorAll(".bar");

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {

            bars[j].classList.add("active");
            bars[j+1].classList.add("active");

            if (array[j] > array[j+1]) {
                [array[j], array[j+1]] = [array[j+1], array[j]];
                updateBars(bars);
            }

            await sleep(delay);

            bars[j].classList.remove("active");
            bars[j+1].classList.remove("active");
        }
        bars[array.length - i - 1].classList.add("sorted");
    }
}

/* 🟡 Selection Sort */
async function selectionSort() {
    let bars = document.querySelectorAll(".bar");

    for (let i = 0; i < array.length; i++) {
        let min = i;

        for (let j = i + 1; j < array.length; j++) {
            bars[j].classList.add("active");

            if (array[j] < array[min]) {
                min = j;
            }

            await sleep(delay);
            bars[j].classList.remove("active");
        }

        [array[i], array[min]] = [array[min], array[i]];
        updateBars(bars);

        bars[i].classList.add("sorted");
    }
}

/* 🟢 Insertion Sort */
async function insertionSort() {
    let bars = document.querySelectorAll(".bar");

    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        while (j >= 0 && array[j] > key) {
            array[j+1] = array[j];
            updateBars(bars);
            j--;
            await sleep(delay);
        }

        array[j+1] = key;
        updateBars(bars);
    }

    bars.forEach(bar => bar.classList.add("sorted"));
}

/* 🔵 Merge Sort */
async function mergeSort(start, end) {
    if (start >= end) return;

    let mid = Math.floor((start + end) / 2);

    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);

    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    let temp = [];
    let i = start, j = mid + 1;

    while (i <= mid && j <= end) {
        if (array[i] < array[j]) temp.push(array[i++]);
        else temp.push(array[j++]);
    }

    while (i <= mid) temp.push(array[i++]);
    while (j <= end) temp.push(array[j++]);

    for (let k = start; k <= end; k++) {
        array[k] = temp[k - start];
        document.querySelectorAll(".bar")[k].style.height = `${array[k]}px`;
        await sleep(delay);
    }
}

/* 🔴 Quick Sort */
async function quickSort(low, high) {
    if (low < high) {
        let pi = await partition(low, high);

        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    let pivot = array[high];
    let i = low - 1;

    let bars = document.querySelectorAll(".bar");

    for (let j = low; j < high; j++) {
        bars[j].classList.add("active");

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            updateBars(bars);
            await sleep(delay);
        }

        bars[j].classList.remove("active");
    }

    [array[i+1], array[high]] = [array[high], array[i+1]];
    updateBars(bars);
    return i + 1;
}

/* 🚀 Start */
async function startSorting() {
    if (isSorting) return;

    isSorting = true;
    disableControls(true);

    delay = 101 - document.getElementById("speed").value;
    const algo = document.getElementById("algo").value;

    let bars = document.querySelectorAll(".bar");
    bars.forEach(bar => bar.classList.remove("sorted"));

    if (algo === "bubble") await bubbleSort();
    else if (algo === "selection") await selectionSort();
    else if (algo === "insertion") await insertionSort();
    else if (algo === "merge") await mergeSort(0, array.length - 1);
    else if (algo === "quick") await quickSort(0, array.length - 1);

    bars.forEach(bar => bar.classList.add("sorted"));

    disableControls(false);
    isSorting = false;
}

generateArray();