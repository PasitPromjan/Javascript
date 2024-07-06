const currency_one = document.getElementById('currency-from')
const currency_two = document.getElementById('currency-to')

const amount_one = document.getElementById('amount-from')
const amount_two = document.getElementById('amount-to')

const ratetext = document.getElementById('rate')
const swap = document.getElementById('btn')

currency_one.addEventListener('change',calculate);
currency_two.addEventListener('change',calculate);
amount_one.addEventListener('input',calculate);
amount_two.addEventListener('input',calculate);

function calculate(){
    const from = currency_one.value;
    const to = currency_two.value;
    let url=`https://v6.exchangerate-api.com/v6/901227b3fc92a11f0dc385e6/latest/${from}`
    fetch(url).then(res=>res.json()).then(data=>{
        const rate=data.conversion_rates[to];
        ratetext.innerText=`1 ${from} = ${rate} ${to}`;
        amount_two.value=(amount_one.value*rate).toFixed(2);
    })
}

swap.addEventListener('click',()=>{
    const temp =currency_one.value;
    currency_one.value=currency_two.value;
    currency_two.value = temp;
    calculate();
})

calculate()