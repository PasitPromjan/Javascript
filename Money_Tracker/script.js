const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const dataTransaction= [
    {
        id:1,
        text:"ค่าขนม",
        amount: -100
    },
    {
        id:2,
        text:"ค่าห้อง",
        amount: -3000
    },
    {
        id:3,
        text:"เงินเดือน",
        amount: +18000
    }
]

let transaction = dataTransaction;

function init(){
    list.innerHTML='';
    transaction.forEach(addDataTolist);
    calculate();
}

function addDataTolist(transaction){
    const sign = transaction.amount < 0 ?'-':'+';
    const stat = transaction.amount < 0 ?'minus':'plus';
    const item = document.createElement('li');
    item.classList.add(stat);
    item.innerHTML=`${transaction.text}<span>${sign}${Math.abs(transaction.amount)}</span><button onclick="removeData(${transaction.id})" class="delete-btn">x</button>`;
    list.appendChild(item);
}

function autoID(){
    return Math.floor(Math.random()*1000000);
}

function calculate(){
    const amounts = transaction.map(transaction=>transaction.amount);
    const total= amounts.reduce((result,item)=>(result+=item),0).toFixed(2);
    //console.log(total)
    const income = amounts.filter(item=>item>0).reduce((result,item)=>(result+=item),0).toFixed(2);
    const outcome = Math.abs(amounts.filter(item=>item<0).reduce((result,item)=>(result+=item),0)).toFixed(2);

    balance.innerText=`${total}`;
    money_plus.innerText=`${income}`;
    money_minus.innerText=`${outcome}`;
}

function removeData(id){
    transaction=transaction.filter(transaction=>transaction.id !== id)
    init();
}

function addTranscantion(e){
    e.preventDefault();
    if(text.value.trim() === '' | amount.value.trim() === ''){
        alert("กรุณาป้อนข้อมูล")
    }else{
        const data ={
            id:autoID(),
            text:text.value,
            amount:+amount.value
        }
        transaction.push(data);
        addDataTolist(data);
        calculate();
        text.value=''
        amount.value=''
    }
}

form.addEventListener('submit',addTranscantion)
init();
