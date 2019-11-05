export function categoryChange(data, setData, event) {
    let d = {...data};
    d.category = event.target.value;
    setData(d);
}

export function budgetChange(data, SetData, event) {
    let d = {...data};
    d.budget = event.target.value;
    SetData(d);
}

export function update(callback, data) {
    callback(data)
}